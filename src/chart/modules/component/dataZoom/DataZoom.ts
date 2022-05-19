//over

import { LinearScaler } from "@/modules/scaler/LinearScaler";
import { ElementEvent } from "zrender";
import Eventful from "zrender/lib/core/Eventful";
import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import { Scaler } from "../../scaler/Scaler";




interface EventType {
    beforeMove?: (name: string | number) => void;
    beforeDown?: (name: string | number) => void;
    beforeCancel?: (name: string | number) => void;
}


export class DataZoom extends Eventful<{ change: (scaler: LinearScaler) => void }>{
    chart: Chart;
    position: LayoutPosition;
    mousePosition: [number, number] | undefined;
    scaler: LinearScaler | undefined;
    // 总数据长度
    total: number;
    //图表当前缩放范围内的步长
    _step: number | undefined;
    // 用于判断平移交互与tooltip之间的冲突问题
    lock = false;
    openSlide = false;
    once = true;
    get step() {
        if (this.scaler) {
            const rect = this.chart.getRect(this.position);
            // 当前视窗的数据步长
            const number = (this.scaler.denormalize(1) = this.scaler.denormalize(0) + 1);
            this._step = rect.width / number;
        }

        return this._step;
    }

    event: EventType | undefined;

    // 绑定对应图表

    constructor(chart: Chart, position: LayoutPosition, zoomable = true, moveable = true, event: EventType | undefined = undefined) {
        super();
        this.chart = chart;
        this.event = event;
        this.position = position;

        // 让鼠标事件绑定在this对象上，而不至于后面执行onMouse的相关方法，this对象为未定义
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        if (moveable) {
            chart.zr.on('mousedown', this.onMouseDown);
            chart.zr.on('mousemove', this.onMouseMove);
            chart.zr.on('mouseup', this.onMouseUp);
        }
        if (zoomable) {
            chart.zr.on('mousewheel', this.onMouseWheel);
        }
    }


    // 图表按下操作
    onMouseDown(e: ElementEvent) {
        this?.event?.beforeDown('dataZoom');
        this.mousePosition = [e.offsetX, e.offsetY];
    }

    // 图表移动操作
    onMouseMove(e: ElementEvent) {
        this.event?.beforeMove('dataZoom');
        if (this.mousePosition && this.once) {
            const xInterval = e.offsetX - this.mousePosition[0];
            const yInterval = e.offsetY - this.mousePosition[1];
            // 只能直接使用偏移量进行比较不能加偏移距离
            (Math.abs(xInterval) > Math.abs(yInterval)) ? this.openSlide = true : this.openSlide = false;
            this.once = false;
        }

        // 图表平移距离
        if (this.mousePosition && this.scaler && !this.lock && this.openSlide) {
            const xInterval = e.offsetX - this.mousePosition[0];
            //根据偏移量的数值确定整体图表的滑动速率
            const moveSpeed = Math.round(Math.abs(xInterval) / 5);
            if (xInterval > this.step && this.scaler.denormalize(0) > 0) {
                this.scaler.min--;
                this.mousePosition = [e.offsetX, e.offsetY];
                e.event.preventDefault();
            } else if (xInterval < -this.step && this.scaler.denormalize(1) < this.total - 1) {
                this.scaler.min++;
                this.mousePosition = [e.offsetX, e.offsetY];
                e.event.preventDefault();
            } else {
                return;
            }
            this.trigger('change', this.scaler);
        }
    }

    onMouseUp() {
        this?.event?.beforeCancel('dataZoom');
        this.mousePosition = undefined;
        this.openSlide = false;
        this.once = true;
    }

    reset(scaler: LinearScaler, total: number) {
        this.scaler = scaler;
        this.total = total;
    }
    sigleTriggle = 0;

    setRange(min: number, max: number) {
        //如果当前最新的展示范围与之前的范围不一样，重新trigger进行变化
        if (this.scaler) {
            const i0 = Math.round(min * (this.total - 1));
            const i1 = Math.round(max * (this.total - 1));
            if (this.scaler.denormalize(0) != i0 || this.scaler.denormalize(1) != i1) {
                this.scaler = new LinearScaler(i0, i1);
                this.trigger('change', this.scaler);
            } else if (this.sigleTriggle === 0) {
                this.sigleTriggle = 1;
                this.scaler = new LinearScaler(i0, i1);
                this.trigger('change', this.scaler);
            }
        }
    }

    //滚轮缩放图表
    onMouseWheel(e: ElementEvent) {
        if (this.scaler) {
            const rect = this.chart.getRect(this.position);
            // 这里是对鼠标放置区域的鼠标滚轮拖动效果的判定，因为这里添加了x轴的区间判定所以，在y轴的左右两侧无法实现滚轮效果
            if (e.offsetX < rect.x || e.offsetX > rect.x + rect.width) {
                return;
            }

            const i = this.scaler.denormalize((e.offsetX - rect.x) / rect.width);
            const k = i - Math.floor(i);
            const min = this.scaler.denormalize(0);
            const max = this.scaler.denormalize(1);

            if (e.wheelDelta > 0) {
                this.zoomIn(k, min, max);
            } else {
                this.zoomOut(k, min, max);
            }
            e.event.preventDefault();
        }
    }

    zoomIn(k: number, min: number, max: number) {
        if (max - min < 5) {
            return;
        }
        if (k < 0.5) {
            max--;
        } else {
            min++;
        }

        this.scaler = new LinearScaler(min, max);
        this._step = 0;
        this.trigger('change', this.scaler);
    }

    zoomOut(k: number, min: number, max: number) {
        // 添加数据
        if (k < 0.5) {
            if (min > 0) {
                //左侧有数据
                min--;
            } else if (max < this.total - 1) {
                //左侧没数据添加右侧数据
                max++;
            } else {
                return;
            }
        } else {
            if (max < this.total - 1) {
                max++;
            } else if (min > 0) {
                min--;
            } else {
                return;
            }
        }

        this.scaler=new LinearScaler(min,max);
        this._step=0;
        this.trigger('change',this.scaler);
    }



}