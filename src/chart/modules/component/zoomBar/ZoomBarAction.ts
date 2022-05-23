import ComponentAction from "../ComponentAction";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";
import ZoomBarModel from "./ZoomBarModel";



class ZoomBarAction extends ComponentAction {
    declare _model: ZoomBarModel;
    declare _view: ZoomBarView;

    constructor(model: ComponentMobel, view: ComponentView) {
        super(model, view);
    }

    onMousedown(): void {
        this._view.onMouseDown(this.mouseEvent);
    }

    onMousemove(): void {
        this._view.onMouseMove(this.mouseEvent);
    }

    onCancelMousePointer(): void {
        this._view.onMouseUp();
    }
}