import { LinearScaler } from './LinearScaler';

export type EaseType = 'linear';

export function initScaler(min: number, max: number, type: EaseType = 'linear') {
  switch (type) {
    default:
      return new LinearScaler(min, max);
  }
}
