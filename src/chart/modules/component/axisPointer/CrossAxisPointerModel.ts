import { LinearScaler } from "@/modules/scaler/LinearScaler";
import { Line, Rect } from "zrender";
import { EventOption } from "../../util/types";
import { SCALER } from "../../util/value";
import ComponentMobel from "../ComponentModel";


interface TextOption {
    text: Text;
    textBox: Rect;
    height?: number;
    widht?: number;
}


export interface Point {
    // x轴或者y轴标签
    label: string,
    // 点x的坐标只有xLine存在时有用
    x?: number,
    y?: number
}

export interface CrossAxisPointerOption {
    xLine?: Line;
    yLine?: Line;
    xText?: TextOption;
    yText?: TextOption;
    xTextInRange?: boolean;
    dataWidth?: (() => number) | number;
    xDatas: string[];
    nomalizedX: number[];
    yDatas?: number[];
    yScaler?: LinearScaler;
    eventOption?: EventOption;
}


export default class CrossAxisPointerModel extends ComponentMobel {
    declare data: Point[];
    defaultOption: CrossAxisPointerOption = {
        xDatas: [],
        dataWidth: 0,
        yScaler: SCALER,
        nomalizedX: [],
        xTextInRange: false,
        yDatas: []
    }
    constructor(option: CrossAxisPointerOption) {
        super(option);
    }

    update(): void {
        this.Scaler = this.option.scaler || SCALER;
        this.mergeOption(this.defaultOption);
    }
}