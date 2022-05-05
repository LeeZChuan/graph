export abstract class Scaler {
  abstract normalize(val: number): number;
  abstract denormalize(val: number): number;
}
