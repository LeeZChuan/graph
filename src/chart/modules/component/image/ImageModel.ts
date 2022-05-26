
//over

import ComponentMobel from "../ComponentModel"

export interface ImageOption {
    position?: [number, number],
    scale?: [number, number],
    style?: {
        x?: number,
        y?: number,
        image?: string,
        width?: number,
        height?: number
    },
    draggable?: boolean
}

class ImageModel extends ComponentMobel {
    defaultOption: ImageOption = {
        position: [0, 0],
        scale: [1, 1],
        style: {
            x: 0,
            y: 0,
            image: '',
            width: 100,
            height: 100
        }
    }

    constructor(option: ImageOption) {
        super(option);
    }

    update(): void {
        this.mergeOption(this.defaultOption);
    }
}

export default ImageModel;