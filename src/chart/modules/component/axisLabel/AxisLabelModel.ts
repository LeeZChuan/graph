import { TextProps } from "zrender";


export interface AxisLabelOption {
    // 位置
    position: 'left' | 'right' | 'bottom' | 'top';
    // label文字样式
    textProps?: TextProps | ((i: number) => TextProps);
    //x轴每个点对应的归一化数字组成的数组
    data: number[];
    //x轴label组成的数组
    xData: string[];
}