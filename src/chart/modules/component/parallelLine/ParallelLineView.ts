
//over
import { LINESTYLE } from "@/modules/static/style";
import { adjustLine } from "@/modules/util/geometry";
import { Line } from "zrender";
import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import { SCALER } from "../../util/value";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";


class ParallelLineView extends ComponentView {
    constructor(model: ComponentMobel) {
        super(model);
    }

    update(chart: Chart, position: LayoutPosition) {
        if (chart && position) {
            const rect = chart.getRect(position);
            this.group.attr({
                x: rect.x,
                y: rect.y
            });
            // 为什么加removeall呢，因为zoombar在滑动的时候会新建很多group放置有多个元素那么需要提前清除一下
            if (this.group) {
                this.group.removeAll();
            }
            if (this.model.option.direction === 'Horizontal') {
                this.setHorizontalParallelLine(this.model.option.reverse, rect.width, rect.height);
            } else {
                this.setVerticalParallelLine(this.model.option.reverse, rect.width, rect.height);
            }
        }
    }


    /**
     * 绘制横向分割线
     * @param reverse 绘制顺序是否逆序
     * @param width 分割线布局宽度
     * @param height 分割线布局高度
     */
    private setHorizontalParallelLine(reverse: boolean, width: number, height: number): void {
        this.model.data.forEach((val, i) => {
            let y: number;
            reverse ? y = this.scaler.normalize(val) * height : y = (1 - this.scaler.normalize(val)) * height;
            this.group.add(
                adjustLine(
                    new Line({
                        silent: true,
                        style: this.getStyle(i),
                        z: this.model.option.z,
                        shape: {
                            x1: 0,
                            y1: y,
                            x2: width,
                            y2: y
                        },
                    })
                )
            )
        });
    }

    /**
     * 绘制纵向分割线
    * @param reverse 绘制顺序是否逆序
     * @param width 分割线布局宽度
     * @param height 分割线布局高度
     */
    private setVerticalParallelLine(reverse: boolean, width: number, height: number): void {
        this.model.data.forEach((val, i) => {
            let x: number;
            reverse ? x = this.scaler.normalize(val) * width : x = (1 - this.scaler.normalize(val)) * width;
            this.group.add(
                adjustLine(
                    new Line({
                        silent: true,
                        style: this.getStyle(i),
                        z: this.model.option.z,
                        shape: {
                            x1: x,
                            y1: 0,
                            x2: x,
                            y2: height
                        },
                    })
                )
            )
        });
    }

    private getStyle(i: number) {
        if (typeof this.model.option.style === 'function') {
            return this.style(i);
        } else {
            return this.style;
        }
    }




    public get scaler() {
        return this.model.option.scaler || SCALER;
    }


    public get style() {
        return this.model.option.style || LINESTYLE;
    }


}


export default ParallelLineView;