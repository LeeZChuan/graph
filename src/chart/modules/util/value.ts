import { LinearScaler } from "@/modules/scaler/LinearScaler";

export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const XINDEX = 0;
export const YINDEX = 1;

export const ORIGIN: [number, number] = [ZERO, ZERO];
export const SCALER = new LinearScaler(ZERO, ONE);
export const LOCATION: ['value', 'value'] = ['value', 'value'];
export const START: ['value', number] = ['value', ZERO];
export const END: ['value', number] = ['value', ONE];
