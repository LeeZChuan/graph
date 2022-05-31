
// over

import { Component } from "../Component";
import BarSeriesModel, { BarSeriesOption } from './BarSeriesModel';
import BarSeriesView from './BarSeriesView';
export default class BarSeries extends Component {
    constructor(name: string, option: BarSeriesOption) {
        super();
        this.name = name;
        this._model = new BarSeriesModel(option);
        this._model.update();
        this._view = new BarSeriesView(this._model);
        this._view.setGroupName(name);
    }

    set values(val: any) {
        this._view = val;
    }
}