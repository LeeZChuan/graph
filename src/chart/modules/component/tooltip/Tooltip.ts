


//over 
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
    firstMousey: number | undefined;
    onChart: boolean | undefined;
    yIsLock: boolean;
    constructor(name: string, option: TooltipOption = {}) {
        super(name);
        this.dom.style.position = 'absolute';
        this.dom.style.zIndex = option.zIndex || 'auto';
        this.hideMouseAfter = option.hideMouseAfter || 0;
        this.yIsLock = option.yIsLock === undefined ? false : option.yIsLock;

        this.onMousedown = () => {
            this.firstMousex = this.chart!.event?.mousePosition[0];
            this.firstMousey = this.chart!.event?.mousePosition[1];
            if (this.chart && this.position) {
                const { x, y, width, height } = this.chart.getRect(this.position);
                if (this.firstMousex && this.firstMousey) {
                    if (this.firstMousex < x || this.firstMousex > x + width || this.firstMousey < y || this.firstMousey > y + height) {
                        this.onChart = false;
                        this.dom.style.display = 'none';
                    } else if (this.firstMousex > x || this.firstMousex < x + width || this.firstMousey > y || this.firstMousey < y + height) {
                        this.onChart = true;
                        if (option.flowMouse) {
                            this.setTooltipPosition(this.dom.offsetWidth, this.dom.offsetHeight, this.firstMousex, this.firstMousey);
                        } else {
                            this.dom.style.display = '';
                            this.showTooltip();
                        }
                    }
                }
            }
        };

        if (option.flowMouse) {
            this.onMousemove = () => {
                if (this.rect && this.chart && this.position) {
                    this.dom.style.display = '';
                    const [mousex, mousey] = this.chart.event.mousePosition;
                    const { x, y, width, height } = this.chart.getRect(this.position);
                    if (mousex > width + x || mousex < x || mousey < y || mousey > y + height) {
                        // 鼠标移出图表交互区域
                        this.dom.style.display = 'none';
                    } else {
                        this.dom.style.display = '';
                        this.setTooltipPosition(this.dom.offsetWidth, this.dom.offsetHeight, mousex, mousey);
                    }
                }
            }
        } else {
            // 固定位置变动-移动端
            this.onMousemove = () => {
                this.showTooltip();
            }
        }


        this.onCancelMousePointer = () => {
            this.toIntercept = 0;
            this.dom.style.display = 'none';
        }
    }

    setTooltipPosition(tooltipwidth: number, tooltipheight: number, mousex: number, mousey: number): void {

        if (!this.chart || !this.position) {
            return;
        }
        //获取数据渲染区域的xy和高度宽度
        const { x, y, width, height } = this.chart.getRect(this.position);
        const tipWidth = tooltipwidth ? tooltipwidth : width;
        const tipHeight = tooltipheight ? tooltipheight : height;
        // 设置鼠标和tooltip的距离
        const pointX = 10;
        const pointY = 10;
        // 获取绘图区域的中心
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        // 先设置x方向
        let left = 0;
        if (mousex > centerX) {
            left = Math.min(mousex - pointX - tipWidth, width - tipWidth + x);
        } else {
            left = Math.min(mousex + pointX, width - tipWidth + x);
        }
        left = left > x ? left : x;
        // 先设置y方向
        let top = 0;
        if (mousey > centerY) {
            top = Math.min(mousey - pointY - tipHeight, height - tipHeight + y);
        } else {
            top = Math.min(mousey + pointY, height - tipHeight + y);
        }

        top = top > y ? top : y;

        if (this.yIsLock === false) {
            top = mousey > centerY ? mousey - pointY - tipHeight : mousey + pointY;
        }

        this.dom.style.left = `${left}px`;
        this.dom.style.top = `${top}px`;
        this.dom.style.right = '';
        this.dom.style.bottom = '';
    }

    onAdd(chart: Chart, position: LayoutPosition) {
        super.onAdd(chart, position);
        if (!chart.zr.dom?.style.position) {
            chart.zr.dom!.style.position = 'relative';
        }
        chart.zr.dom?.appendChild(this.dom);
    }

    onRemove(): void {
        super.onRemove();
        this.dom.remove();
    }

    update(): void {
        if (this.chart && this.position) {
            this.rect = this.chart.getRect(this.position);
        }
    }

    showTooltip() {
        if (this.chart && this.position) {
            this.dom.style.display = '';
            const { x, y, width, height } = this.chart.getRect(this.position);
            const [mousex, mousey] = this.chart.event.mousePosition;
            if (this.onChart) {
                if (this.rect && this.chart) {
                    const center = this.rect.x + this.rect.width / 2;
                    const width = this.chart.zr.dom!.offsetWidth;
                    this.dom.style.top = `${this.rect.y}px`;
                    if (this.chart.event.mousePosition[x] > center) {
                        this.dom.style.left = `${this.rect.x}px`;
                        this.dom.style.right = '';
                    } else {
                        this.dom.style.left = '';
                        this.dom.style.right = `${width - this.rect.x - this.rect.width}px`;
                    }
                } else {
                    this.dom.style.display = 'none';
                }
            } else {
                // 图表的非交互态
                if (mousex > x && mousex < x + width && mousey > y && mousey < y + height) {
                    // 监听用户实时滑动，又滑动到了图表内侧
                    this.onChart = true;
                    this.dom.style.display = '';
                } else {
                    this.dom.style.display = 'none';
                }
            }
        }
    }

}

