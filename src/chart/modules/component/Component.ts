//over

// 可视化组件基础元素的基础类型属性定义

import { Group } from "zrender";
import { isArray, merge } from "zrender/lib/core/util";
import { LayoutPosition } from "../layout/Layout";
import { Chart } from "../lib/Chart";
import { ModelOption } from "../util/types";
import ComponentAction from "./ComponentAction";
import ComponentMobel from './ComponentModel';
import ComponentView from './ComponentView';



export abstract class Component {
    public name: string;
    protected _model: ComponentMobel;
    protected _view: ComponentView;
    protected _action: ComponentAction;
    //所属图表
    chart: Chart;
    //组件位置，行号列号
    position: LayoutPosition | undefined;
    //鼠标按下的执行方法
    onMousedown: (() => void) | ((e: Element) => void) | undefined;
    onMousemove: (() => void) | ((e: Element) => void) | undefined;
    onCancelMousePointer: (() => void) | ((e: Element) => void) | undefined;
    removeMousePointer: (() => void) | ((e: Element) => void) | undefined;
    //当组件添加到图表后触发
    onAdd(chart: Chart, position: LayoutPosition): void {
        this.chart = chart;
        this.position = position;
        this.update();
        //响应代理
        this.setProxy();
        //事件绑定钩子函数
        this.setEvent();
    }

    //get  set回调
    // todo:使用帧渲染去控制绘制
    setProxy() {
        this._model.option = new Proxy(this._model.option, {
            get: (target, key: string) => target[key],
            set: (target, key: string, value: any) => {
                //merge在合并数组时，逐个元素比对，不是直接覆盖
                if (isArray(target[key])) {
                    target[key] = value;
                } else {
                    target[key] = merge(target[key], value, true);
                }
                // TODO:这里需要做个脏数据判断
                this._model.update();
                this.update();
                return true;
            }
        })
    }

    mergeOption(source: ModelOption, overwrite = false): void {
        this._model.mergeOption(source, overwrite);
        this._model.update();
        this.update();
    }

    //当组件从图表移除后触发
    onRemove(): void {
        this.chart = undefined;
    }

    //更新组件
    update(): void {
        this._view.chart = this.chart;
        this._view.update(this.chart, this.position);
    }

    //设置事件触发对应的函数
    setEvent() {
        this?._action?.onMousedown && (this.onMousedown = this.setEventHook('Mousedown'));
        this?._action?.onMousemove && (this.onMousemove = this.setEventHook('Mousemove'));
        this?._action?.onCancelMousePointer && (this.onCancelMousePointer = this.setEventHook('onCancelMousePointer'));

    }

    // 组件时间对应函数，使其包含对应的函数执行前和执行后的钩子

    private setEventHook(eventName: string) {
        const { _action, _model, _view } = this;
        return function () {
            _action?.[`before${eventName}`](_model, _view);
            if (_action.lock) {
                return;
            }
            _action?.[`on${eventName}`].bind(_action)();
            _action?.[`after${eventName}`](_model, _view);
        }
    }

    get data() {
        return this._model.data;
    }

    get option() {
        return this._model.option;
    }

    get viewModel(): Group {
        return this._view.group;
    }

    get height() {
        return this.viewModel.getBoundingRect().height;
    }


    get width() {
        return this.viewModel.getBoundingRect().width;
    }
}