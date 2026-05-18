const PREVIEW_VALUES: Record<string, string> = {
  customer_name: 'Mariana Torres',
  order_id: 'B2B-1042',
  invoice_id: 'F-908',
  eta: 'hoy 15:30',
  eta_from: '14:00',
  eta_to: '16:00',
  amount: 'S/ 4,820.00',
  code: '482913',
  module: 'Logistica',
};

export const renderTemplatePreview = (content: string) =>
  content.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key: string) => PREVIEW_VALUES[key] ?? 'dato demo');
