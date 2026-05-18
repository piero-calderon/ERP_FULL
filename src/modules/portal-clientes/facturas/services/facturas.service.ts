import { facturasAdapter } from '../adapters/facturas.adapter';
import type { DocumentoFinanciero } from '../types/facturas.types';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const facturasService = {
  async getDocumentos(): Promise<DocumentoFinanciero[]> {
    await delay();
    return facturasAdapter.getDocumentos();
  },

  async descargarDocumento(docId: string): Promise<void> {
    await delay(800);
    facturasAdapter.marcarDescargado(docId);
    // Simula descarga generando un contenido fake
    const doc = facturasAdapter.getDocumentos().find(d => d.id === docId);
    if (doc) {
      const content = `DOCUMENTO: ${doc.numero}\nTipo: ${doc.tipo}\nTotal: ${doc.total.toFixed(2)}€\n[Simulación PDF]`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${doc.numero}.txt`; a.click();
      URL.revokeObjectURL(url);
    }
  },
};
