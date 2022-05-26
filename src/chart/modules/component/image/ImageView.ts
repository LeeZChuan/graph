
//over

import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import ComponentView from "../ComponentView";
import { Image } from 'zrender';
import ImageModel from "./ImageModel";



class ImageView extends ComponentView {

    constructor(option: ImageModel) {
        super(option);
    }

    update(chart: Chart, position: LayoutPosition): void {
        if (!chart || !position) {
            return;
        }
        this.group.removeAll();
        this.group.add(new Image(this.model.option));
    }
}

export default ImageView;