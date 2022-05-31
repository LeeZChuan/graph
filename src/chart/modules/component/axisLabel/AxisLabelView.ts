//over


import { TEXTSTYLE } from "@/modules/static/style";
import { Element, ElementProps, Text, TextProps } from "zrender";
import { merge } from "zrender/lib/core/util";
import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import { Scaler } from "../../scaler/Scaler";
import { SCALER } from "../../util/value";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";


interface RectInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CoordinateInfo {
    x: number;
    y: number;
}

export default class AxisLabelView extends ComponentView {
    shape: Text[];
    rect: RectInfo | undefined;

    constructor(model: ComponentMobel) {
        super(model);
    }

    update(chart: Chart, position: LayoutPosition): void {
        if (!chart || !position) {
            return;
        }
        this.rect = chart.getRect(position);
        this.group.attr(this.getGroupCoordinate());
        this.group.removeAll();
        this.group.dirty();
        this.drawLabel();
    }


    // 绘制label
    private drawLabel() {
        this.model.data.forEach((v, i) => {
            const text = new Text(this.getTextProps(i));
            this.group.add(text);
        });
        if (this.model.option.position === 'top' || this.model.option.position === 'bottom') {
            // 控制首尾的label位置
            this.controlTextPosition();
            // 控制label的显示隐藏
            this.controlTextVisable();
        }
        // 根据索引号隐藏文字
        this.hideByIndex();
    }


    // 控制首尾label的位置
    private controlTextPosition() {
        // 如果设置了首尾在区域内，则移动首尾的x，y
        if (this.model.option.inRange) {
            const firstIndex = this.model.data.findIndex(v => v === 0);
            const lastIndex = this.model.data.findIndex(v => v === 1);
            if (firstIndex !== -1 && firstIndex !== lastIndex) {
                const firstText = this.viewModel.childAt(firstIndex);
                const rect = firstText.getBoundingRect();
                switch (this.model.option.position) {
                    case 'bottom':

                    case 'top':
                        firstText.x = -rect.x;
                        break;
                    default:
                }
            }

            if (lastIndex !== -1 && firstIndex !== lastIndex) {
                const lastText = this.viewModel.childAt(lastIndex);
                const rect = lastText.getBoundingRect();
                switch (this.model.option.position) {
                    case 'bottom':

                    case 'top':
                        lastText.x = this.rect!.width + rect.x;
                        break;
                    default:
                }
            }
        }
    }


    // 控制label的显示隐藏
    private controlTextVisable() {
        const data = this.model.data.filter(value => {
            value >= 0 && value <= 1
        });
        const midIndex = Math.ceil((data.length + 1) / 2) - 1;
        const midVal = data[midIndex];
        this.group.eachChild((e: Text, i: number) => {
            // 超出范围的不显示
            if (this.model.data[i] > 1 || this.model.data[i] < 0) {
                e.hide();
            }
            // 如果是首尾式只显示第一个和最后一个
            if (this.model.data[i] !== 0 && this.model.data[i] !== 1 && this.model.option.type === 'edge') {
                e.hide();
            }
            if (this.model.data[i] !== 0 && this.model.data[i] !== 1 && this.model.data[i] !== midVal && this.model.option.type === 'three') {
                e.hide();
            }
        });
        const { minDistance } = this.model.option;
        if (this.model.option.type === 'all' && minDistance) {
            this.sampleHide();
        }
    }


    // 根据索引号来隐藏文字
    hideByIndex() {
        this.model.option.hideIndexArr.forEach((index: number) => {
            this.group.childAt(index)?.hide();
        })
    }

    // 抽样显示、
    private sampleHide() {
        const { minDistance } = this.model.option;
        let rightX = 0;
        let lastText: Element<ElementProps>;
        // 如果是全量显示并且设置了间距，则抽样显示
        this.group.eachChild((e: Text, i: number) => {
            if (this.model.data[i] >= 0 && this.model.data[i] <= 1) {
                if (this.model.data[i] === 0) {
                    lastText = this.viewModel.childAt(i);
                    const lastRect = lastText.getBoundingRect();
                    rightX = lastRect.x + lastText.x + lastRect.width + minDistance;
                    return;
                }

                const text = this.viewModel.childAt(i);
                const rect = text.getBoundingRect();
                const left = text.x + rect.x;
                // 最后一个也一定显示，排除掉最后一个
                if (left < rightX && this.model.data[i] !== 1) {
                    text.hide();
                    return;
                }
                // 如果倒数第二个显示的文字遮挡住了最后一个，则倒数第二个的文字隐藏
                if (left < rightX && this.model.data[i] === 1) {
                    lastText.hide();
                }
                rightX = text.x + rect.x + rect.width + minDistance;
                lastText = text;
            }
        });
    }


    // 获取某个文字的属性

    private getTextProps(i: number): TextProps {
        let textProps: TextProps;
        if (typeof this.model.option.textProps === 'function') {
            textProps = this.getTextProps(i);
        } else {
            textProps = this.textProps;
        }

        textProps.style?.text = textProps.style?.text ?? String(this.model.option.xData[i]);
        merge(textProps, this.getTextCoordinate(i), false);
        return textProps;
    }

    // 获取某个文字的坐标

    private getTextCoordinate(i: number): CoordinateInfo {
        const { rect } = this;
        if (!rect) {
            return {
                x: 0, y: 0
            }
        }
        let { width, height } = rect;
        const dataWidth = this.getDataWidth();
        switch (this.model.option.position) {
            case 'left':

            case 'right':
                height = height - dataWidth;
                return {
                    x: 0,
                    y: this.model.data[i] * height + dataWidth / 2,
                };
            default:
                width = width - dataWidth;
                return {
                    x: this.model.data[i] * width + dataWidth / 2,
                    y: 0,
                }
        }
    }

    // 获取数据的宽度，当是折线图应该是0，柱状图时是柱子或者柱子组宽度
    private getDataWidth() {
        return typeof this.model.option.dataWidth === 'function' ? this.model.option.dataWidth() : this.model.option.dataWidth;
    }

    // 获取绘图区域所在的坐标，todo 后期可以和水平布局其，垂直布局器合并
    private getGroupCoordinate(): CoordinateInfo {
        const { rect } = this;
        if (!rect) {
            return {
                x: 0,
                y: 0
            }
        }
        switch (this.model.option.position) {
            case 'right':
                return {
                    x: rect.x + rect.width,
                    y: rect.y
                };
            case 'bottom':
                return {
                    x: rect.x,
                    y: rect.y + rect.height / 2
                };
            default:
                return {
                    x: rect.x,
                    y: rect.y
                };
        }
    }

    // #region 事件需要用到的方法
    cancelHandler() {
        console.log('%c调用取消的绘图方法', 'color:blue');

    }
    mousemoveHandler() {
        console.log('%c调用取消的绘图方法', 'color:blue');

    }
    mousedownHandler() {
        console.log('%c调用取消的绘图方法', 'color:blue');
    }
    // #endregion


    get viewModel() {
        return this.group;
    }

    get scaler(): Scaler {
        return this.model.option.scaler || SCALER;
    }

    get textProps() {
        return this.model.option.textProps || TEXTSTYLE;
    }

}