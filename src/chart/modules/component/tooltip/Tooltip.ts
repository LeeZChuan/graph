

import { Chart } from '../../lib/Chart';
import { LayoutPosition } from '../../layout/Layout';
import { Element } from '../Element';

// 提示框

export interface TooltipOption {
    flowMouse?: boolean;
    hideMouseAfter?: number;
    zIndex?: string;
    yIsLock?: boolean;
}

export class Tooltip extends Element {
    rect: { x: number; y: number; width: number; height: number } | undefined;
    hideMouseAfter: number | undefined;
    dom = document.createElement('div');
    // 延迟激活拦截的操作id
    toIntercept = 0;
    firstMousex: number | undefined;
}

