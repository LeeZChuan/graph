//over

// 事件管理机制
import Eventful from "zrender/lib/core/Eventful";
import ComponentModel from "./ComponentModel";
import ComponentView from "./ComponentView";


abstract class ComponentAction extends Eventful {
    lock: boolean;

    protected _model: ComponentModel;
    protected _view: ComponentView;

    constructor(model: ComponentModel, view: ComponentView) {
        super();
        this.lock = false;
        this._model = model;
        this._view = view;
    }

    //生命周期函数

    beforeMousemove() {
        this.eventOption?.beforeMousemove && this.eventOption?.beforeMousemove(this._model, this._view);

    }

    afterMousemove() {
        this.eventOption?.afterMousemove && this.eventOption?.afterMousemove(this._model, this._view);

    }


    beforeMousedown() {
        this.eventOption?.beforeMousedown && this.eventOption?.beforeMousedown(this._model, this._view);

    }

    afterMousedown() {
        this.eventOption?.afterMousedown && this.eventOption?.afterMousedown(this._model, this._view);

    }

    beforeCancelMousePointer() {
        this.eventOption?.beforeCancelMousePointer && this.eventOption?.beforeCancelMousePointer(this._model, this._view);

    }

    afterCancelMousePointer() {
        this.eventOption?.afterCancelMousePointer && this.eventOption?.afterCancelMousePointer(this._model, this._view);

    }

    get mousePosition() {
        return this._view?.chart?.event?.mousePosition;
    }

    get eventOption() {
        return this._model.option.eventOption ?? undefined;
    }

    get mouseEvent() {
        return this._view?.chart?.event?.mouseEvent;
    }
}

export default ComponentAction;