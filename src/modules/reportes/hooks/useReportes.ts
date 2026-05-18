// Módulo 10 — Reportes — hooks por submodulo
import { useMemo, useEffect, useCallback } from 'react';
import { useReportesStore } from '../store/reportes.store';
import {
  mockVentasMensuales, mockProductosABC, mockVendedores, mockPipeline,
  mockStock, mockMovimientos,
  mockConductores, mockRutas, mockIncidencias,
  mockAging, mockCashflow,
  mockNPS, mockReclamos, mockDevoluciones,
  mockOperadores, mockEtapasTiempo,
} from '../mocks/reportes.mocks';
import { programadosService, historialService, exportService } from '../services/reportes.service';
import type {
  FiltrosComercial, FiltrosInventario, FiltrosLogistica,
  FiltrosFinanciero, FiltrosCalidad, FiltrosOperativo,
  ReporteProgramado, FormatoExport, TabReportes,
} from '../types/reportes.types';

const periodoMeses = (p: string): number => {
  if (p === '7d' || p === '30d') return 1;
  if (p === '90d') return 3;
  return 12;
};

// ─── Comercial ─────────────────────────────────────────────────────────────

export function useComercialData(filtros: FiltrosComercial) {
  const meses = periodoMeses(filtros.periodo);

  const ventasMensuales = useMemo(
    () => mockVentasMensuales.slice(-Math.max(meses * 2, 6)),
    [meses],
  );

  const vendedoresFiltrados = useMemo(
    () => filtros.vendedor === 'todos'
      ? mockVendedores
      : mockVendedores.filter(v => v.nombre === filtros.vendedor),
    [filtros.vendedor],
  );

  const kpis = useMemo(() => {
    const slice = mockVentasMensuales.slice(-meses);
    const prev  = mockVentasMensuales.slice(-meses * 2, -meses);
    const totalVentas   = slice.reduce((s, v) => s + v.ventas, 0);
    const totalObjetivo = slice.reduce((s, v) => s + v.objetivo, 0);
    const margen        = slice.reduce((s, v) => s + v.margen, 0);
    const pedidos       = slice.reduce((s, v) => s + v.pedidos, 0);
    const prevVentas    = prev.reduce((s, v) => s + v.ventas, 0);
    const varVentas     = prevVentas > 0
      ? Math.round(((totalVentas - prevVentas) / prevVentas) * 1000) / 10
      : 0;
    const cumplimiento  = totalObjetivo > 0
      ? Math.round((totalVentas / totalObjetivo) * 1000) / 10
      : 0;
    return { totalVentas, cumplimiento, margen, pedidos, varVentas };
  }, [meses]);

  return { ventasMensuales, vendedores: vendedoresFiltrados, productosABC: mockProductosABC, pipeline: mockPipeline, kpis };
}

// ─── Inventario ────────────────────────────────────────────────────────────

export function useInventarioData(filtros: FiltrosInventario) {
  const stockFiltrado = useMemo(() => {
    let s = mockStock;
    if (filtros.categoria !== 'todos')   s = s.filter(x => x.categoria === filtros.categoria);
    if (filtros.estadoStock !== 'todos') s = s.filter(x => x.estado === filtros.estadoStock);
    return s;
  }, [filtros.categoria, filtros.estadoStock]);

  const kpis = useMemo(() => {
    const valorTotal = stockFiltrado.reduce((s, x) => s + x.valorTotal, 0);
    const criticos   = stockFiltrado.filter(x => x.estado === 'critico').length;
    const enExceso   = stockFiltrado.filter(x => x.estado === 'exceso').length;
    const rotMedian  = stockFiltrado.length
      ? Math.round(stockFiltrado.reduce((s, x) => s + x.rotacion, 0) / stockFiltrado.length * 10) / 10
      : 0;
    return { valorTotal, criticos, enExceso, rotMedian };
  }, [stockFiltrado]);

  const categorias = useMemo(() => [...new Set(mockStock.map(x => x.categoria))], []);

  return { stock: stockFiltrado, movimientos: mockMovimientos, kpis, categorias };
}

// ─── Logistica ─────────────────────────────────────────────────────────────

export function useLogisticaData(filtros: FiltrosLogistica) {
  const conductoresFiltrados = useMemo(
    () => filtros.conductor === 'todos'
      ? mockConductores
      : mockConductores.filter(c => c.nombre === filtros.conductor),
    [filtros.conductor],
  );

  const kpis = useMemo(() => {
    const otifGlobal = conductoresFiltrados.length
      ? Math.round(conductoresFiltrados.reduce((s, c) => s + c.otif, 0) / conductoresFiltrados.length * 10) / 10
      : 0;
    const entregas           = conductoresFiltrados.reduce((s, c) => s + c.entregas, 0);
    const incidenciasAbiertas = mockIncidencias.filter(i => i.estado !== 'cerrada').length;
    const kmTotal            = conductoresFiltrados.reduce((s, c) => s + c.km, 0);
    return { otifGlobal, entregas, incidenciasAbiertas, kmTotal };
  }, [conductoresFiltrados]);

  return { conductores: conductoresFiltrados, rutas: mockRutas, incidencias: mockIncidencias, kpis };
}

// ─── Financiero ────────────────────────────────────────────────────────────

export function useFinancieroData(filtros: FiltrosFinanciero) {
  const meses = periodoMeses(filtros.periodo);

  const cashflowSlice = useMemo(() => mockCashflow.slice(-meses), [meses]);

  const agingFiltrado = useMemo(
    () => filtros.cliente === 'todos'
      ? mockAging
      : mockAging.filter(a => a.cliente === filtros.cliente),
    [filtros.cliente],
  );

  const kpis = useMemo(() => {
    const totalCobros = cashflowSlice.reduce((s, x) => s + x.cobros, 0);
    const totalPagos  = cashflowSlice.reduce((s, x) => s + x.pagos, 0);
    const casoNeto    = totalCobros - totalPagos;
    const dsoMedio    = agingFiltrado.length
      ? Math.round(agingFiltrado.reduce((s, a) => s + a.dso, 0) / agingFiltrado.length)
      : 0;
    const vencido     = agingFiltrado.reduce((s, a) => s + a.d61_90 + a.d90plus, 0);
    return { totalCobros, totalPagos, casoNeto, dsoMedio, vencido };
  }, [cashflowSlice, agingFiltrado]);

  const clientes = useMemo(() => mockAging.map(a => a.cliente), []);

  return { aging: agingFiltrado, cashflow: cashflowSlice, kpis, clientes };
}

// ─── Calidad ───────────────────────────────────────────────────────────────

export function useCalidadData(filtros: FiltrosCalidad) {
  const meses = periodoMeses(filtros.periodo);
  const npsSlice = useMemo(() => mockNPS.slice(-Math.max(meses * 2, 6)), [meses]);

  const reclamosFiltrados = useMemo(
    () => filtros.tipo === 'todos'
      ? mockReclamos
      : mockReclamos.filter(r => r.tipo === filtros.tipo),
    [filtros.tipo],
  );

  const devolucionesSlice = useMemo(() => mockDevoluciones.slice(-Math.max(meses * 2, 6)), [meses]);

  const kpis = useMemo(() => {
    const last = mockNPS.at(-1)!;
    const prev = mockNPS.at(-2)!;
    const reclamosPendientes = reclamosFiltrados.reduce((s, r) => s + r.pendientes, 0);
    const tasaDevolucion     = mockDevoluciones.at(-1)?.tasa ?? 0;
    return {
      npsActual:         last.nps,
      promotoresPct:     last.promotores,
      reclamosPendientes,
      tasaDevolucion,
      varNps:            last.nps - prev.nps,
    };
  }, [reclamosFiltrados]);

  const tiposReclamo = useMemo(() => mockReclamos.map(r => r.tipo), []);

  return { nps: npsSlice, reclamos: reclamosFiltrados, devoluciones: devolucionesSlice, kpis, tiposReclamo };
}

// ─── Operativo ─────────────────────────────────────────────────────────────

export function useOperativoData(filtros: FiltrosOperativo) {
  const operadoresFiltrados = useMemo(
    () => filtros.rol === 'todos'
      ? mockOperadores
      : mockOperadores.filter(o => o.rol === filtros.rol),
    [filtros.rol],
  );

  const kpis = useMemo(() => {
    const eficienciaMedia = operadoresFiltrados.length
      ? Math.round(operadoresFiltrados.reduce((s, o) => s + o.eficiencia, 0) / operadoresFiltrados.length * 10) / 10
      : 0;
    const unidadesTotales = operadoresFiltrados.reduce((s, o) => s + o.unidades, 0);
    const etapasAlerta    = mockEtapasTiempo.filter(e => e.estado !== 'ok').length;
    const erroresTotal    = operadoresFiltrados.reduce((s, o) => s + o.errores, 0);
    return { eficienciaMedia, unidadesTotales, etapasAlerta, erroresTotal };
  }, [operadoresFiltrados]);

  return { operadores: operadoresFiltrados, etapas: mockEtapasTiempo, kpis };
}

// ─── Programacion ──────────────────────────────────────────────────────────

export function useProgramacion() {
  const {
    programados, setProgramados,
    upsertProgramado, removeProgramado,
    historial, setHistorial,
    jobs, setJobs,
    loading, setLoading,
    programadoEnEdicion, setProgramadoEnEdicion,
  } = useReportesStore();

  useEffect(() => {
    setLoading(true);
    Promise.all([programadosService.getAll(), historialService.getAll()])
      .then(([progs, hist]) => {
        setProgramados(progs);
        setHistorial(hist);
        setJobs(exportService.getJobs());
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardar = useCallback(async (r: ReporteProgramado) => {
    await programadosService.save(r);
    upsertProgramado(r);
    setProgramadoEnEdicion(undefined);
  }, [upsertProgramado, setProgramadoEnEdicion]);

  const eliminar = useCallback(async (id: string) => {
    await programadosService.delete(id);
    removeProgramado(id);
  }, [removeProgramado]);

  const toggleActivo = useCallback(async (id: string) => {
    await programadosService.toggleActivo(id);
    const found = programados.find(p => p.id === id);
    if (found) upsertProgramado({ ...found, activo: !found.activo });
  }, [programados, upsertProgramado]);

  const ejecutarAhora = useCallback(async (reporte: ReporteProgramado) => {
    await exportService.ejecutarProgramado(reporte);
    const [progs, hist] = await Promise.all([programadosService.getAll(), historialService.getAll()]);
    setProgramados(progs);
    setHistorial(hist);
  }, [setProgramados, setHistorial]);

  const limpiarJobs = useCallback(() => {
    exportService.clearJobs();
    setJobs([]);
  }, [setJobs]);

  return {
    programados, historial, jobs, loading,
    programadoEnEdicion, setProgramadoEnEdicion,
    guardar, eliminar, toggleActivo, ejecutarAhora, limpiarJobs,
  };
}

// ─── Export ────────────────────────────────────────────────────────────────

export function useExportReport() {
  const { setExportando, setExportProgreso, setJobs } = useReportesStore();

  const exportar = useCallback(async (
    nombre: string,
    tipo: TabReportes,
    formato: FormatoExport,
    datos: Record<string, unknown>[],
    filtrosLabel: string,
  ) => {
    setExportando(true);
    setExportProgreso(0);
    try {
      await exportService.lanzarExport(nombre, tipo, formato, datos, filtrosLabel, p => {
        setExportProgreso(p);
      });
      setJobs(exportService.getJobs());
    } finally {
      setExportando(false);
      setExportProgreso(0);
    }
  }, [setExportando, setExportProgreso, setJobs]);

  return { exportar };
}
