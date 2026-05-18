import { evaluacionesAdapter } from '../adapters/evaluaciones.adapter';
import type { EvaluacionPortal, MetricasEvaluacion } from '../types/evaluaciones.types';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const evaluacionesService = {
  async getEvaluaciones(): Promise<EvaluacionPortal[]> {
    await delay();
    return evaluacionesAdapter.getEvaluaciones();
  },

  async responderEvaluacion(
    id: string,
    nps: number,
    servicioRating: number,
    conductorRating: number | null,
    comentario: string
  ): Promise<EvaluacionPortal> {
    await delay(600);
    const all = evaluacionesAdapter.getEvaluaciones();
    const eval_ = all.find(e => e.id === id);
    if (!eval_) throw new Error('Evaluación no encontrada.');
    if (eval_.estado !== 'pendiente') throw new Error('Esta evaluación ya fue respondida.');
    const updated: EvaluacionPortal = {
      ...eval_,
      nps, servicioRating, conductorRating, comentario,
      estado: 'respondida',
      respondidaEn: new Date().toISOString(),
    };
    evaluacionesAdapter.updateEvaluacion(updated);
    return updated;
  },

  calcularMetricas(evaluaciones: EvaluacionPortal[]): MetricasEvaluacion {
    const respondidas = evaluaciones.filter(e => e.estado === 'respondida');
    if (!respondidas.length) {
      return { npsPromedio: 0, servicioPromedio: 0, conductorPromedio: 0, totalRespondidas: 0, totalPendientes: evaluaciones.filter(e => e.estado === 'pendiente').length, npsPromoters: 0, npsDetractors: 0, npsPassives: 0, npsScore: 0 };
    }

    const npsVals = respondidas.filter(e => e.nps !== null).map(e => e.nps!);
    const srvVals = respondidas.filter(e => e.servicioRating !== null).map(e => e.servicioRating!);
    const cndVals = respondidas.filter(e => e.conductorRating !== null).map(e => e.conductorRating!);

    const npsPromoters = npsVals.filter(n => n >= 9).length;
    const npsDetractors = npsVals.filter(n => n <= 6).length;
    const npsPassives = npsVals.filter(n => n === 7 || n === 8).length;
    const npsScore = npsVals.length ? Math.round(((npsPromoters - npsDetractors) / npsVals.length) * 100) : 0;

    return {
      npsPromedio: npsVals.length ? +(npsVals.reduce((a, b) => a + b, 0) / npsVals.length).toFixed(1) : 0,
      servicioPromedio: srvVals.length ? +(srvVals.reduce((a, b) => a + b, 0) / srvVals.length).toFixed(1) : 0,
      conductorPromedio: cndVals.length ? +(cndVals.reduce((a, b) => a + b, 0) / cndVals.length).toFixed(1) : 0,
      totalRespondidas: respondidas.length,
      totalPendientes: evaluaciones.filter(e => e.estado === 'pendiente').length,
      npsPromoters, npsDetractors, npsPassives, npsScore,
    };
  },
};
