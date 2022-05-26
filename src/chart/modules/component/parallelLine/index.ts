// 

import { ParallelLinesOption } from "@/modules/element/ParallelLines";
import { extend } from "zrender/lib/core/util";
import { Component } from "../Component";


export default class ParallelLine extends Component {

    constructor(name: string, option: ParallelLinesOption) {
        super();
        this.name = name;
        this._model = new ParallelLineModel(option);
        this._model.update();
        this._view = new ParallelLineView(this._model);
        this._view.setGroupName(name);
    }
}