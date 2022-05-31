//over

import ComponentAction from "../ComponentAction";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";
import AxisLabelModel from "./AxisLabelModel";
import AxisLabelView from "./AxisLabelView";

export default class AxisLabelAction extends ComponentAction {

    declare _model: AxisLabelModel;
    declare _view: AxisLabelView;
    constructor(model: ComponentMobel, view: ComponentView) {
        super(model, view);
    }

    onCancelMousePointer(): void {
        // todo 做一些逻辑计算，决定需要调用哪个绘图方法
        this._view.cancelHandler();
    }

    onMousemove(): void {
        this._view.mousemoveHandler();
    }

    onMousedown(): void {
        this._view.mousedownHandler();
    }
}