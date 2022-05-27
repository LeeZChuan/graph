import { Scaler } from "../../scaler/Scaler";


export class LinearScaler extends Scaler {
    delta: number;
    min: number;
    /**
     * 
     * @param min 线性归一化最小值
     * @param max 线性归一化最大值
     */
    constructor(min: number, max: number) {
        super();
        this.delta = max - min;
        this.min = min;
    }

    normalize(val: number): number {
        if (val === undefined || String(val) === '' || val === null) {
            return NaN;
        }

        if (this.delta) {
            return (val - this.min) / this.delta;
        } else {
            return 0.5;
        }
    }


    denormalize(val: number): number {
        if (this.delta) {
            return this.delta * val + this.min;
        } else {
            return this.min;
        }
    }
}