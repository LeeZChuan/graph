import CrossAxisPointer from ".";
import ComponentAction from "../ComponentAction";


export default class CrossAxisPointerAction extends ComponentAction{
    declare _model:CrossAxisPointerModel;
    declare _view:CrossAxisPointerView;
    constructor(model:CrossAxisPointerModel,view:CrossAxisPointerView){
        super(model,view);
    }

    onMousedown(){
        this._view.
    }
}