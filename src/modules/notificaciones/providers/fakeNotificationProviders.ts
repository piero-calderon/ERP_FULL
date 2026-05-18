import type { Channel, DeliveryJob, ProviderName } from '../types/notificaciones.types';

const channelProvider: Record<Channel, ProviderName> = {
  'in-app': 'simulado',
  email: 'sendgrid-fake',
  sms: 'twilio-fake',
  whatsapp: 'messagebird-fake',
  webhook: 'webhook-local',
};

export const fakeNotificationProviders = {
  resolveProvider(channel: Channel) {
    return channelProvider[channel];
  },
  async send(job: DeliveryJob): Promise<'entregado' | 'abierto' | 'fallido' | 'exitoso'> {
    await new Promise((resolve) => window.setTimeout(resolve, 280));
    const shouldFail = (job.attempts + job.recipient.length + job.subject.length) % 7 === 0;
    if (shouldFail) return 'fallido';
    if (job.channel === 'email') return 'abierto';
    if (job.channel === 'webhook') return 'exitoso';
    return 'entregado';
  },
};
