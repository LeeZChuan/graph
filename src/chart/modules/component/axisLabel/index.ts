//over


import { Component } from "../Component";
import AxisLabelAction from "./AxisLabelAction";
import AxisLabelModel, { AxisLabelOption } from "./AxisLabelModel";
import AxisLabelView from "./AxisLabelView";


export default class AxisLabel extends Component {
    constructor(name: string, option: AxisLabelOption) {

        super();
        this.name = name;
        this._model = new AxisLabelModel(option);
        this._model.update();
        this._view = new AxisLabelView(this._model);
        this._view.setGroupName(name);
        this._action = new AxisLabelAction(this._model, this._view);
    }
}