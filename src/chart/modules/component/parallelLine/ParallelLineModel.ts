import { PathStyleProps } from "zrender";
import { Scaler } from "../../scaler/Scaler";
import { ComponentOption } from "../../util/types";
import { SCALER } from "../../util/value";
import ComponentMobel from "../ComponentModel";


export interface ParallelLinesOption {
    direction?: 'Horizontal' | 'Vertical';
    reverse?: boolean;
    style?: PathStyleProps | ((i: number) => PathStyleProps);
    data?: number[];
    scaler?: Scaler;
    z?: number;
}


class ParallelLineModel extends ComponentMobel {
    // style: ComponentOption;

    defaultOption: ParallelLinesOption = {
        direction: 'Horizontal',
        reverse: false,
        style: {
            stroke: '#000',
            lineDash: [5, 4],
            lineWidth: 0.5
        },
        z: -1
    }

    constructor(option: ParallelLinesOption) {
        super(option);
    }

    update(): void {
        this.data = this.option.data;
        this.Scaler = this.option.scaler || SCALER;
        this.mergeOption(this.defaultOption);
    }
}

export default ParallelLineModel;