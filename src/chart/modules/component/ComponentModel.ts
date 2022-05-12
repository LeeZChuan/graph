

// 组件的model层面：组件模型（数据）处理层面
//模型对外提供标准接口处理数据，不关心数据如何展示

import { ModelOption } from "../util/types";
import Model from './Model';

abstract class ComponentMobel<Opt extends ModelOption = ModelOption> extends Model {

    option: any;
    data: any[];
    Scaler: any;
    defaultOption: ModelOption;
    constructor(option: Opt) {
        super();
        this.option = option;
    }

    abstract update():void;
    getDefaultOption()

}