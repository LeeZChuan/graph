// 

import { ParallelLinesOption } from "@/modules/element/ParallelLines";
import { merge } from "zrender/lib/core/util";
import { Component } from "../Component";
import ParallelLineModel from "./ParallelLineModel";
import ParallelLineView from "./ParallelLineView";


export default class ParallelLine extends Component {

    constructor(name: string, option: ParallelLinesOption) {
        super();
        this.name = name;
        this._model = new ParallelLineModel(option);
        this._model.update();
        this._view = new ParallelLineView(this._model);
        this._view.setGroupName(name);
        // TODO:添加一个脏数据判断
        // this._model.option = new Proxy(this._model.option, {
        //     get: (target, key: string) => target[key],
        //     set: (target, key: string, value) => {
        //         target[key] = merge(target[key], value, true);
        //         // 这里添加一个脏数据判断
        //         this._model.update();
        //         this._view.update(this.chart, this.position);
        //         return true;
        //     }
        // });
    }
}