//over

import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import { Component } from "../Component";
import ZoomBarModel, { ZoomBarOption } from "./ZoomBarModel";
import ZoomBarView from "./ZoomBarView";


export default class ZoomBar extends Component {
    declare protected _view: ZoomBarView;
    constructor(name: string, option: ZoomBarOption) {
        super();
        this.name = name;
        this._model = new ZoomBarModel(option);
        this._model.update();
        this._view = new ZoomBarView(this._model);
        this._view.setGroupName(name);
    }

    update(): void {
        this._view.update(this.chart, this.position);
    }


    setData(data: number[]) {
        this._model.data = data;
    }

    // 覆盖父类onadd方法
    onAdd(chart: Chart, position: LayoutPosition) {
        super.onAdd(chart, position);
        chart.zr.on('mousemove', this._view.onMouseMove);
        chart.zr.on('mouseup', this._view.onMouseUp);
    }

    //覆盖父类的onRemove方法，在图表删除后的回调
    onRemove(): void {
        super.onRemove();
        this.chart.zr.off('mousemove', this._view.onMouseMove);
        this.chart.zr.off('mouseup', this._view.onMouseUp);
    }

    get left() {
        return this._view.left || 0;
    }

    set left(val) {
        this._view.left = val < 0 ? 0 : val;
    }

    get right() {
        return this._view.right || 0;
    }

    set right(val) {
        this._view.right = val > 1 ? 1 : val;
    }
}