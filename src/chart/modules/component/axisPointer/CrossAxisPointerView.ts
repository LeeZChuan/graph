import { LinearScaler } from "@/modules/scaler/LinearScaler";
import { TEXTSTYLE } from "@/modules/static/style";
import { Group, Line, Rect, Text } from "zrender";
import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import { Scaler } from "../../scaler/Scaler";
import { EventOption } from "../../util/types";
import { SCALER } from "../../util/value";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";


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


export default class CrossAxisPointerView extends ComponentView {
    xTextGroup: Group;
    yTextGroup: Group;
    pointerAt: number;
    height: number;
    width: number;
    rect: RectInfo | undefined;
    points: Point[];
    activeIndex: number;

    constructor(model: ComponentMobel) {
        super(model);
        if (model.option.xLine) {
            model.option.xLine.attr({
                silent: true
            });
            this.group.add(model.option.xLine);
        }
        if (model.option.yLine) {
            model.option.yLine.attr({
                silent: true
            });
            this.group.add(model.option.yLine);
        }
        if (model.option.xText) {
            this.xTextGroup = new Group();
            model.option.xText.text.attr({
                silent: true,
            });
            model.option.xText.textBox.attr({
                silent: true
            });
            this.xTextGroup.add(model.option.xText.text);
            this.xTextGroup.add(model.option.xText.textBox);
            this.group.add(this.xTextGroup);
        }
        if (model.option.yText) {
            this.yTextGroup = new Group();
            model.option.yText.text.attr({
                silent: true,
            });
            model.option.yText.textBox.attr({
                silent: true
            });
            this.yTextGroup.add(model.option.xText.text);
            this.yTextGroup.add(model.option.xText.textBox);
            this.group.add(this.yTextGroup);
        }
    }

    update(chart: Chart, position: LayoutPosition): void {
        if (!chart || !position) {
            return;
        }
        this.rect = chart.getRect(position);
        this.updatePoints();
        const { x, y, width, height } = chart.getRect(position);
        this.height = height;
        this.width = width;
        this.group.attr({
            x,
            y
        });
        if (this.model.option.xLine) {
            this.model.option.xLine.attr({
                shape: {
                    // x轴提示框线段长度
                    y2: height
                }
            });
        }
        if (this.model.option.yLine) {
            this.model.option.yLine.attr({
                shape: {
                    // x轴提示框线段长度
                    x2: width
                }
            });
        }
        if (this.xTextGroup) {
            this.xTextGroup.attr({
                //x轴提示文字距离0轴的距离
                y: this.model.option.xText.height || height
            });
        }
        if (this.yTextGroup) {
            this.yTextGroup.attr({
                x: this.model.option.yText.width || 0,
                y: 0
            });
        }
        this.group.hide();
    }

    // 绘制label
    drawAxisPointer(): void {
        if (this.points.length && this.height) {
            const x = this.chart!.event.mousePosition[0] - this.group.x;
            // 激活数据的索引限制在可视区域内
            let index = this.getPointIndex(x);
            const min = this.model.option.nomalizedX.findIndex(v => v === 0);
            const max = this.model.option.nomalizedX.findIndex(v => v === 1);
            isNaN(index) ?? (index = 0);
            index = Math.max(min, index);
            index = Math.min(max, index);

            this.activeIndex = index;
            const point = this.points[index];
            if (this.model.option.xLine) {
                this.model.option.xLine.attr({
                    x: point.x
                });
            }
            if (this.model.option.yLine) {
                this.model.option.yLine.attr({
                    y: point.y
                });
            }

            if (this.xTextGroup) {
                this.xTextGroup.attr({
                    x: point.x
                });
                const xtext = this.xTextGroup.childAt(0) as Text;
                const xtextRect = this.xTextGroup.childAt(1) as Rect;
                xtext.attr({
                    style: {
                        text: point.label
                    }
                });
                const textWidth = xtext.getPaintRect().width;
                const nomalizedXValue = this.model.option.nomalizedX[index];
                const dataWidth = !isNaN(this.model.option.dataWidth) ? this.model.option.dataWidth : this.model.option.dataWidth();
                const adjustX = this.getInRangeX(textWidth, nomalizedXValue, dataWidth, this.model.option.xTextInRange);
                this.xTextGroup.attr({
                    x: point.x + adjustX
                });
                // 底部颜色rect布局
                xtextRect.attr({
                    shape: {
                        x: -textWidth / 2,
                        y: -1,
                        width: textWidth,
                        height: xtext.getPaintRect().height
                    }
                });
            }

            if (this.yTextGroup) {
                this.yTextGroup.attr({
                    y: point.y
                });
                const ytext = this.yTextGroup.childAt(0) as Text;
                const ytextRect = this.yTextGroup.childAt(1) as Rect;
                ytext.attr({
                    style: {
                        text: point.label
                    }
                });
                ytext.attr({
                    x: -ytext.getPaintRect().width,
                    y: -ytext.getPaintRect().height / 2
                });
                // 底部颜色rect布局
                ytextRect.attr({
                    shape: {
                        x: ytext.x - ytext.getPaintRect().width / 2,
                        y: ytext.y,
                        width: ytext.getPaintRect().width,
                        height: ytext.getPaintRect().height
                    }
                });
            }
            this.group.show();
        }
    }




    // 根据current确定直线在那个点的位置
    private getPointIndex(val: number): number {
        const data = this.points;
        if (val >= data[data.length - 1].x) {
            return data.length - 1l
        }
        if (val <= 0) {
            return 0;
        }
        let left = 0;
        let right = data.length - 1;
        let middle: number;
        while (left <= right) {
            middle = Math.floor((left + right) / 2);
            if (data[middle].x === val) {
                return middle;
            } else if (data[middle].x < val && data[middle + 1].x > val) {
                break;
            } else if (data[middle].x < val) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }

        if (data[middle].x !== val) {
            const space = (data[middle + 1].x + data[middle].x) / 2;
            return val >= space ? middle + 1 : middle;
        }
        return NaN;

    }

    private updatePoints() {
        // 标记线核心算法
        let { width, height } = this.rect;
        this.points = [];
        const { xDatas, yDatas, nomalizedX, yScaler } = this.model.option;
        const dataWidth = !isNaN(this.model.option.dataWidth) ? this.model.option.dataWidth : this.model.option.dataWidth();
        width = width - dataWidth;
        xDatas.forEach((v: string, i: number) => {
            this.points.push({
                label: v,
                x: width * nomalizedX[i] + dataWidth / 2,
                y: height * yScaler.denomalize(yDatas[i] ?? 0)
            });
        });
    }


    private getInRangeX(textWidth: number, nomalizedXValue: number, dataWidth: number, inRange: boolean) {
        if (nomalizedXValue === 0 && inRange) {
            return textWidth / 2 - dataWidth / 2;
        }
        if (nomalizedXValue === 1 && inRange) {
            return -textWidth / 2 + dataWidth / 2;
        }

        return 0;

    }


    get scaler(): Scaler {
        return this.model.option.scaler || SCALER;
    }

    get textProps() {
        return this.model.option.textProps || TEXTSTYLE;
    }

    get viewModel() {
        return this.group;
    }
}