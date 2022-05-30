import { TEXTSTYLE } from "@/modules/static/style";
import { TextProps } from "zrender";
import { SCALER } from "../../util/value";
import ComponentMobel from "../ComponentModel";


export interface AxisLabelOption {
    // 位置
    position: 'left' | 'right' | 'bottom' | 'top';
    // label文字样式
    textProps?: TextProps | ((i: number) => TextProps);
    //x轴每个点对应的归一化数字组成的数组
    data: number[];
    //x轴label组成的数组
    xData: string[];
    // 数据宽度，如果是折线图则是0，如果含有柱状图，则是柱子或者一组柱子的宽度
    dataWidth?: number | (() => number);
    //间隔取样时的最小距离，0表示无需间隔取样
    minDistance?: number;
    // 显示模式edge只显示首位，three：三段式，all取样展示
    type: 'edge' | 'three' | 'all';
    // 文字是否在轴线范围内
    inRange?: boolean;
    //需要隐藏的项目
    hideIndexArr?: number[];
    //z
    z?: number;
}

export default class AxisLabelModel extends ComponentMobel {
    defaultOption: AxisLabelOption = {
        position: 'bottom',
        textProps: {
            silent: true,
            style: TEXTSTYLE,
        },
        data: [],
        xData: [],
        z: 1,
        dataWidth: 0,
        minDistance: 0,
        type: 'all',
        inRange: true,
        hideIndexArr: []
    };

    constructor(option:AxisLabelOption){
        super(option);
    }

    update(): void {
        this.data=this.option.data;
        this.Scaler=this.option.scaler||SCALER;
        this.mergeOption(this.defaultOption);
    }
}