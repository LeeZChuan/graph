import { Group } from "zrender";
import { LayoutPosition } from "../layout/Layout";
import { Chart } from "../lib/Chart";
import ComponentModel from './ComponentModel';
import { View } from './View';

/* 组件view层面 */

abstract class ComponentView extends View {
    readonly group: Group;
    chart: Chart | undefined;
    model: ComponentModel;
    constructor(model: ComponentModel) {
        super();
        this.group = new Group();
        this.model = model;
    }

    abstract update(chart: Chart, position: LayoutPosition): void;

    setGroupName(name: string): void {
        this.group.name = `${name}_view`;
    }
}

export default ComponentView;