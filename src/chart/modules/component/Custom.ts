// over

import { Element } from './Element';
import { Element as ZRElement, ElementProps } from 'zrender';

interface CustomOption {
    shape: ZRElement<ElementProps>;
    update?: (shape: ZRElement<ElementProps>, w: number, h: number) => void;
}

export class Custom extends Element {
    constructor(name: string, option: CustomOption) {
        super(name);
        this.option = option;
        this.shape = this.position.shape;
    }

    option: CustomOption;

    update(): void {
        if (this.chart && this.position) {
            // todo:这里的shape是不是需要修改
            const rect = this.chart.getRect(this.position);
            this.shape.attr({
                x: rect.x,
                y: rect.y
            });
            if (this.option.update) {
                this.option.update(this.shape, rect.width, rect.height);
            }
        }
    }
}