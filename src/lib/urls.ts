// Central place for outbound URLs used by CTAs.
export const APP_URL = 'https://www.eluvie.app/';

const WHATSAPP_PHONE = '5554991411584';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

export const whatsappUrlWith = (message: string) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

export const DEMO_MESSAGE_PT =
  'Olá, quero saber mais sobre a plataforma e desejo uma demonstração ao vivo.';
export const DEMO_MESSAGE_EN =
  'Hi, I would like to know more about the platform and request a live demo.';
