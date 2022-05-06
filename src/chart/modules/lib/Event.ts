//over

import { ElementEvent } from "zrender";
import { Chart, ChartOption } from "./Chart";

export default class Event {
    chart: Chart;
    // 延迟拦截鼠标事件时间
    delayIntercept = 0;
    //长按多久捕获鼠标
    catchMouseAfter?: number;
    //松开多久捕获鼠标抬起事件
    hideMouseAfter?: number;
    //是否启用图表短按事件
    openshortMouseAction?: boolean | undefined;
    // 当前短按的光标显示状态是否触发
    shortMouseState?: boolean;
    //记录鼠标位置
    mousePosition: [number, number] = [0, 0];
    //事件对象
    mouseEvent: ElementEvent;
    //标记当前是否拦截鼠标事件
    inintercept = false;
    //延时激活拦截的操作id
    toIntercept = 0;

    constructor(chart: Chart, option: ChartOption) {
        this.chart = chart;
        this.openshortMouseAction = option.openshortMouseAction ?? false;
        if (typeof option.catchMouseAfter === 'number' && option.catchMouseAfter >= 0) {
            this.delayIntercept = option.catchMouseAfter;
            this.hideMouseAfter = option.hideMouseAfter || 0;
            this.chart.zr.on('mousedown', this.onMouseDown.bind(this));
            this.chart.zr.on('mousmove', this.onMouseMove.bind(this));
            this.chart.zr.on('mouseup', this.onMouseUp.bind(this));
        }
    }




    onMouseDown(e: ElementEvent) {
        this.mousePosition = [e.offsetX, e.offsetY];
        this.mouseEvent = e;
        if (this.openshortMouseAction) {
            // 短按onMouseDown
            if (!this.openshortMouseAction) {
                this.onMousedown();
                this.shortMouseState = true;
            } else {
                if (this.toIntercept) {
                    clearTimeout(this.toIntercept);
                    this.toIntercept = 0;
                }
                this.onMouseup();
                this.shortMouseState = false;
            }
        } else {
            //长按onMouseDown
            if (this.delayIntercept >= 0) {
                this.toIntercept = setTimeout(() => {
                    this.toIntercept = 0;
                    this.inintercept = true;
                    this.onMousedown();
                }, this.delayIntercept);
            }
        }
    }

    onMouseMove(e: ElementEvent) {
        this.mousePosition = [e.offsetX, e.offsetY];
        this.mouseEvent = e;
        if (this.openshortMouseAction && this.shortMouseState) {
            // 短按onMouseMove
            e.event.preventDefault();
            this.onMousemove();
        } else {
            // 长按onMouseMove
            if (!this.inintercept && this.delayIntercept > 0) {
                clearTimeout(this.toIntercept);
                this.toIntercept = 0;
                return;
            }

            // 事件拦截
            e.event.preventDefault();
            this.onMousemove();
        }

    }

    onMouseUp() {
        if (this.openshortMouseAction && this.shortMouseState) {
            this.inintercept = false;
            if (this.hideMouseAfter > 0) {
                this.toIntercept = setTimeout(() => {
                    if (!this.inintercept) {
                        this.onMouseup();
                    }
                    this.shortMouseState = false;
                }, this.hideMouseAfter);
            } else {
                this.onMouseup();
                this.shortMouseState = false;
            }
        } else {
            // 长按onMouseUP
            if (this.toIntercept) {
                clearTimeout(this.toIntercept);
                this.toIntercept = 0;
            }
            this.inintercept = false;
            if (this.hideMouseAfter > 0) {
                this.toIntercept = setTimeout(() => {
                    if (!this.inintercept) {
                        this.onMouseup();
                    }
                    // this.shortMouseState = false;
                }, this.hideMouseAfter);
            } else {
                this.onMouseUp();
            }
        }
    }

    //调用组件的down方法
    private onMousedown() {
        this.chart.elements.forEach(e => {
            if (e.onMousedown) {
                e.onMousedown();
            }
        });
    }

    //调用组件的move方法
    private onMousemove() {
        this.chart.elements.forEach(e => {
            if (e.onMousemove) {
                e.onMousemove();
            }
        });
    }

    //调用组件的up方法
    private onMouseup() {
        this.chart.elements.forEach(e => {
            if (e.onCancelMousePointer) {
                e.onCancelMousePointer();
            }
        });
    }
}


