// over

import { ElementProps, Group } from "zrender";
import { LayoutPosition } from "../layout/Layout";
import { Chart } from "../lib/Chart";

// 可视化组件基础元素的基础类型、属性定义

export abstract class Element {
    // 图表组件 name组件名
    constructor(name: string) {
        this.name = name;
    }
    // 组件名
    name?: string
    // 重构后的group绘制元素
    group?: ZRElement<ElementProps> = new Group();
    // TODO重构前的组件图元
    shape?: ZRElement<ElementProps> = new Group();
    // 所属图表
    chart?: Chart | undefined;
    // 依赖的组件名称和类型
    depElements?: { name: string, type: Element }[];
    // TODO被依赖的组件名字
    supElements?: string[];
    //组件位置，行号，列号
    position?: LayoutPosition | undefined;
    // 鼠标按下-todo按压会打印两次
    onMousedown?: (() => void) | undefined;
    // 鼠标移动
    onMousemove?: (() => void) | undefined;
    // 鼠标抬起
    onCancelMousePointer?: (() => void) | undefined;
    //鼠标移除
    removeMousePointer?: (() => void) | undefined;
    // 组件添加到图表后触发
    onAdd(chart: Chart, position: LayoutPosition): void {
        this.chart = chart;
        this.position = position;
    }
    // 组件移除图表后触发
    onRemove(): void {
        this.chart = undefined;
    }
    // 更新组件
    abstract update(): void;
}