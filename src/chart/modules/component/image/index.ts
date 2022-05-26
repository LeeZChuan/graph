// over
import { Component } from "../Component";
import ImageModel ,{ ImageOption }from "./ImageModel";
import ImageView from "./ImageView";


export default class Image extends Component {

    constructor(name: string, option: ImageOption) {
        super();
        this.name = name;
        this._model = new ImageModel(option);
        this._model.update();
        this._view = new ImageView(this._model);
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