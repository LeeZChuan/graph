// over
import ComponentAction from "../ComponentAction";
import CrossAxisPointerModel from "./CrossAxisPointerModel";
import CrossAxisPointerView from "./CrossAxisPointerView";


export default class CrossAxisPointerAction extends ComponentAction {
    declare _model: CrossAxisPointerModel;
    declare _view: CrossAxisPointerView;
    constructor(model: CrossAxisPointerModel, view: CrossAxisPointerView) {
        super(model, view);
    }

    onMousedown() {
        this._view.drawAxisPointer();
    }

    onMousemove() {
        this._view.drawAxisPointer();
    }

    onCancelMousePointer() {
        this._view.group.hide();
        if (this._model.option.onPointerChange) {
            this._model.option.onPointerChange(-1);
        }
        this._view.pointerAt = -1;
    }
}