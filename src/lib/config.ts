import weddingConfig from '@/config/wedding.json';

export type WeddingConfig = typeof weddingConfig;

export function getWeddingConfig(): WeddingConfig {
  return weddingConfig;
}

export function getCoupleNames(): string {
  const { partner1, partner2 } = weddingConfig.wedding.couple;
  return `${partner1.firstName} & ${partner2.firstName}`;
}

export function getFullCoupleNames(): string {
  const { partner1, partner2 } = weddingConfig.wedding.couple;
  return `${partner1.firstName} ${partner1.lastName} & ${partner2.firstName} ${partner2.lastName}`;
}

export function getWeddingDate(): Date {
  return new Date(weddingConfig.wedding.date);
}

export function formatWeddingDate(): string {
  const date = getWeddingDate();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default weddingConfig;
