// Módulo 9 — Documentos — custom hooks
import { useState, useCallback } from 'react';
import { useDocumentosStore } from '../store/documentos.store';
import { plantillasService, repositorioService, seriesService, firmasService } from '../services/documentos.service';
import type { Plantilla, Documento, Serie, SolicitudFirma } from '../types/documentos.types';

export function usePlantillas() {
  const { plantillas, setPlantillas, upsertPlantilla, removePlantilla, setLoading } = useDocumentosStore();
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await plantillasService.getAll();
    setPlantillas(data);
    setLoading(false);
  }, [setPlantillas, setLoading]);

  const save = useCallback(async (p: Plantilla) => {
    setSaving(true);
    await plantillasService.save(p);
    upsertPlantilla({ ...p, actualizadoEn: new Date().toISOString() });
    setSaving(false);
  }, [upsertPlantilla]);

  const remove = useCallback(async (id: string) => {
    await plantillasService.delete(id);
    removePlantilla(id);
  }, [removePlantilla]);

  const toggleActiva = useCallback(async (id: string) => {
    await plantillasService.toggleActiva(id);
    const updated = plantillas.map(p => p.id === id ? { ...p, activa: !p.activa } : p);
    setPlantillas(updated);
  }, [plantillas, setPlantillas]);

  return { plantillas, reload, save, remove, toggleActiva, saving };
}

export function useRepositorio() {
  const { documentos, upsertDocumento, busquedaRepo, filtroEntidad, filtroFormato } = useDocumentosStore();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtrados = documentos.filter(d => {
    if (d.estado === 'archivado') return false;
    const q = busquedaRepo.toLowerCase();
    const matchSearch = !q || d.nombre.toLowerCase().includes(q) || d.entidadNombre.toLowerCase().includes(q);
    const matchEntidad = filtroEntidad === 'todos' || d.entidadTipo === filtroEntidad;
    const matchFormato = filtroFormato === 'todos' || d.formato === filtroFormato;
    return matchSearch && matchEntidad && matchFormato;
  });

  const upload = useCallback(async (file: File, meta: Partial<Documento>) => {
    setUploading(true);
    const doc = await repositorioService.upload(file, meta);
    upsertDocumento(doc);
    setUploading(false);
    return doc;
  }, [upsertDocumento]);

  const remove = useCallback(async (id: string) => {
    setDeleting(id);
    await repositorioService.delete(id);
    const all = documentos.map(d => d.id === id ? { ...d, estado: 'archivado' as const } : d);
    useDocumentosStore.getState().setDocumentos(all);
    setDeleting(null);
  }, [documentos]);

  return { documentos: filtrados, upload, remove, uploading, deleting };
}

export function useSeriesNumeracion() {
  const { series, setSeries, upsertSerie, setUltimoNumeroGenerado } = useDocumentosStore();
  const [generando, setGenerando] = useState(false);

  const generarNumero = useCallback(async (serieId: string) => {
    setGenerando(true);
    const numero = await seriesService.generarNumero(serieId);
    const seriesData = await seriesService.getAll();
    setSeries(seriesData);
    setUltimoNumeroGenerado(numero);
    setGenerando(false);
    return numero;
  }, [setSeries, setUltimoNumeroGenerado]);

  const toggleActiva = useCallback(async (id: string) => {
    await seriesService.toggleActiva(id);
    const updated = series.map(s => s.id === id ? { ...s, activa: !s.activa } : s);
    setSeries(updated);
  }, [series, setSeries]);

  const save = useCallback(async (s: Serie) => {
    await seriesService.save(s);
    upsertSerie(s);
  }, [upsertSerie]);

  const getPreview = (serie: Serie): string => {
    const next = serie.contadorActual + 1;
    return `${serie.prefijo}${String(next).padStart(serie.padZeros, '0')}${serie.sufijo ?? ''}`;
  };

  return { series, generarNumero, toggleActiva, save, generando, getPreview };
}

export function useFirmas() {
  const { firmas, setFirmas, upsertFirma, filtroFirmaEstado } = useDocumentosStore();
  const [procesando, setProcesando] = useState<string | null>(null);

  const filtradas = firmas.filter(f =>
    filtroFirmaEstado === 'todos' || f.estado === filtroFirmaEstado
  );

  const enviar = useCallback(async (id: string) => {
    setProcesando(id);
    await firmasService.enviar(id);
    const data = await firmasService.getAll();
    setFirmas(data);
    setProcesando(null);
  }, [setFirmas]);

  const simularFirma = useCallback(async (id: string) => {
    setProcesando(id);
    await firmasService.simularFirma(id);
    const data = await firmasService.getAll();
    setFirmas(data);
    setProcesando(null);
  }, [setFirmas]);

  const rechazar = useCallback(async (id: string) => {
    setProcesando(id);
    await firmasService.rechazar(id);
    const data = await firmasService.getAll();
    setFirmas(data);
    setProcesando(null);
  }, [setFirmas]);

  const save = useCallback(async (f: SolicitudFirma) => {
    await firmasService.save(f);
    upsertFirma(f);
  }, [upsertFirma]);

  return { firmas: filtradas, enviar, simularFirma, rechazar, save, procesando };
}
