import { storage } from '@/utils/storage';
import { FACTURAS_STORAGE_KEYS } from '../constants/facturas.constants';
import { mockDocumentos } from '../mocks/facturas.mocks';
import type { DocumentoFinanciero } from '../types/facturas.types';

function seed<T>(key: string, defaults: T[]): T[] {
  const existing = storage.get<T[]>(key);
  if (!existing) { storage.set(key, defaults); return defaults; }
  return existing;
}

export const facturasAdapter = {
  getDocumentos: (): DocumentoFinanciero[] => seed(FACTURAS_STORAGE_KEYS.DOCUMENTOS, mockDocumentos),
  saveDocumentos: (docs: DocumentoFinanciero[]): void => storage.set(FACTURAS_STORAGE_KEYS.DOCUMENTOS, docs),

  marcarDescargado: (docId: string): void => {
    const docs = storage.get<DocumentoFinanciero[]>(FACTURAS_STORAGE_KEYS.DOCUMENTOS) ?? mockDocumentos;
    const updated = docs.map(d => d.id === docId ? { ...d, descargado: true } : d);
    storage.set(FACTURAS_STORAGE_KEYS.DOCUMENTOS, updated);
  },
};
