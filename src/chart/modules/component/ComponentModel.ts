
//over

// 组件的model层面：组件模型（数据）处理层面
//模型对外提供标准接口处理数据，不关心数据如何展示

import { merge } from "zrender/lib/core/util";
import { ModelOption } from "../util/types";
import { Model } from './Model';

abstract class ComponentMobel<Opt extends ModelOption = ModelOption> extends Model {

    option: any;
    data: any[];
    Scaler: any;
    defaultOption: ModelOption;
    constructor(option: Opt) {
        super();
        this.option = option;
    }

    abstract update(): void;
    getDefaultOption(): ModelOption {
        return this.defaultOption;
    }

    mergeOption(option: ModelOption, overwrite = false): void {
        merge(this.option, option, overwrite);
    }

    get(key: string): any {
        return key !== undefined ? this.option[key] : this.option;
    }

    set(key: string, value: any): void {
        this.option[key] = merge(this.option[key], value, true);
    }

}

export default ComponentMobel;