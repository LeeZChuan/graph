import { TextProps } from "zrender";
import { Chart, ChartOption } from "../modules/lib/Chart";


interface DataSeriesOption {
    key: string;
    label: string;
    color: string;
    relay: 'left' | 'right';
    // 是否启用交汇点
    intersect?: boolean;
    // 是否启用阴影渐变
    principal?: boolean;
    // 阴影方向
    areaDirection?: 'down' | 'up';
    // 起始位置的颜色透明度
    beginOpacity?: number;
    // 结束位置的颜色透明度
    endOpacity?: number;
    // 是否光滑（范围是0-1）
    smooth?: number;
    // 是否启用动效
    animation?: boolean;
    // 动效时间
    anmiatedTime?: number;
    // 图形的先后顺序
    z?: number;
}

interface AreaTextOption {
    seriesKey: string | string[];
    xPosition: 'left' | 'center' | 'right';
    yPosition: 'down' | 'up';
    textProps: TextProps;
}

interface referenceOption {
    type: 'number' | 'scaler';
    relay: 'left' | 'right';
    data: number;
    color?: string;
}

interface LineChartOption extends ChartOption {
    // x轴的键名
    xKey: string;
    // 数据配置信息
    serieses: DataSeriesOption[];
    // 图表的上下左右边距
    padding?: [number, number, number, number];
    // s栅格水槽
    flume?: number;
    // 图表高度
    chartHight?: number;
    // 0轴必定显现
    coverZero?: 'left' | 'right' | 'both';
    // 是否需要凑整
    roundUp?: boolean;
    // 数据缩放范围
    expamdRate?: number;
    // 分割线数量
    splitCount?: number;
    // 是否显示zoombar
    showZoomBar?: boolean;
    // 主题颜色
    theme?: Partial<ChartThemeConfig>;
    // 提示框
    tooltip?: (i: number, data: any, mouse: [number, number], visible: Set<string>) => string;
    // 左侧y轴标签格式化
    leftyLabelFormatter?: (val: number) => string;
    // 右侧y轴标签格式化
    rightyLabelFormatter?: (val: number) => string;
    // 是否启用零轴虚线效果
    openZeroAxis?: boolean;
    // 是否开启主线实时呼吸点效果
    openPointAction?: boolean;
    // 高低密度分界值
    highOrLowValue?: number;
    // 区域标记
    areaText?: Array<AreaTextOption>;
    // 自动区分切割成四份还是五份
    splitLineCountAuto?: boolean;
    // 不论是高低密度情况下，折线图都绘制点
    showPoint?: boolean;
    // 是否开启竖向网格线
    openVertialSplitLine?: boolean;
    // 需要隐藏的y轴标签的索引编号
    hideYlabelIndex?: number[];
    // 需要隐藏的y轴的分割线索引编号
    hidesplitLineIndex?: number[];
    // 是否启用参考线
    referenceLine: Array<referenceOption>;
    // 是否启用高亮标签x轴
    axisPointer?: {
        color: string;
    }
}



export class LineChart extends Chart{
    
}