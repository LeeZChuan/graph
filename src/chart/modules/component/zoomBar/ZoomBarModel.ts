import { ICON, PCICON } from "../../util/style";
import ComponentMobel from "../ComponentModel";
import { DataZoom } from "../dataZoom/DataZoom";



export interface ZoomBarOption {
    bgColor?: string;
    dataColor?: string;
    filterColor?: string;
    icon?: string;
    left?: string;
    right?: string;
    datazoom?: DataZoom
    minCount?: number;
    pc?: boolean;
    show?: boolean;
    zoomBarBuriedpoint?: () => void;
    onChange?: (start: number, end: number) => void;
}


class ZoomBarModel extends ComponentMobel {
    defaultOption: ZoomBarOption = {
        bgColor: '#F7F3F7',
        dataColor: '#E7E3E7',
        filterColor: 'rgba(22,93,255,0.2)'
    }

    constructor(option: ZoomBarOption) {
        super(option);
    }

    update(): void {
        this.data = this.option.data;
        this.option.icon = this.icon;
        this.mergeOption(this.defaultOption);
    }

    get icon() {
        return this.option.icon || (this.option.pc ? PCICON : ICON);
    }
}


export default ZoomBarModel;