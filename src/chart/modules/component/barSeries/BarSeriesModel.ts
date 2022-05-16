// over
import { Path, PathStyleProps, Element as ZRElement, ElementProps } from "zrender";
import BarSeries from "./index";
import ComponentMobel from "../ComponentModel";

export interface BarSeriesOption {
    // 绘制类型stack堆叠图，normal普通柱状图
    seriesType: 'stack' | 'normal';
    // 值，y方向的高度百分比数组，有可能是堆叠图或者多柱图
    values?: (() => number[][]);
    // 显示范围
    range?: (() => [number][number]);
    //零轴点位
    zero?: (() => number);
    // 柱子样式
    style?: (() => PathStylePropsProps[]);
    // 点，x坐标数组，如果没有则根据总宽度计算内部点位
    sites?: ((width) => number[]);
    // 整体定位
    location?: 'left' | 'bottom';
    //组内柱子间距
    spaceInGroup?: (() => number);
    //组外间距，目前用于计算水平位置点
    spaceOutGroup?: (() => number);
    //回调
    adjust?: (shape: ZRElement<ElementProps>, width: number, height: number) => void;
    //是否启动动画
    animation?: (() => boolean);
    // 柱子的最低高度
    barMinHeight?: number;
    //所有柱子的层级z值
    z?: number;

}

export default class BarSeriesModel extends ComponentMobel {
    defaultOption: BarSeriesOption = {
        seriesType: 'normal',
    };
    bar: BarSeries;

    constructor(option: BarSeriesOption) {
        super(option);
    }

    update(): void {
        this.mergeOption(this.defaultOption);
    }
}