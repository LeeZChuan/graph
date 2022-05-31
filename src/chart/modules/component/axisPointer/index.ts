//over
import { Component } from "../Component";
import CrossAxisPointerAction from "./CrossAxisPointerAction";
import CrossAxisPointerModel, { CrossAxisPointerOption } from "./CrossAxisPointerModel";
import CrossAxisPointerView from "./CrossAxisPointerView";


export default class CrossAxisPointer extends Component {
    declare protected _view: CrossAxisPointerView;

    constructor(name: string, option: CrossAxisPointerOption) {
        super();
        this.name = name;
        this._model = new CrossAxisPointerModel(option);
        this._model.update();
        this._view = new CrossAxisPointerView(this._model);
        this._view.setGroupName(name);
        this._action=new CrossAxisPointerAction(this._model,this._view);
    }
}