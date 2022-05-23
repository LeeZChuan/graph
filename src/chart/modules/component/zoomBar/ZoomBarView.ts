import { LinearScaler } from "@/modules/scaler/LinearScaler";
import { Polygon, Rect, Image, ElementEvent } from "zrender";
import { LayoutPosition } from "../../layout/Layout";
import { Chart } from "../../lib/Chart";
import Debounced from "../../util/Debounced";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";



class ZoomBarView extends ComponentView {
    filter: Rect;
    handlerLeft: Image;
    handlerRight: Image;
    series: Polygon;
    zoomBarRectWidth: number;
    mousePosition: [number, number] | undefined;
    data: number[] = [];
    background: Rect;
    mode: 'left' | 'right' | 'center' = 'center';
    left: number;
    right: number;
    debounce: Function | undefined;

    constructor(model: ComponentMobel) {
        super(model);
        const { option } = this.model;
        this.background = new Rect({
            silent: true,
            style: {
                fill: option.bgColor || '#F7F3F7'
            }
        });

        //筛选的选中区域，为一个矩形图形
        this.filter = new Rect({
            style: {
                fill: option.filterColor || '#165DFF',
                opacity: 0.5
            },
            cursor: 'e-resize',
        })
        // 左侧滑块
        this.handlerLeft = new Image({
            style: {
                image: option.icon
            },
            cursor: 'e-resize',
        });
        // 右侧滑块
        this.handlerRight = new Image({
            style: {
                image: option.icon
            },
            cursor: 'e-resize',
        });

        // 数据缩放条的缩略图背景
        this.series = new Polygon({
            silent: true,
            style: {
                fill: option.dataColor || '#E7E3E7',
                opacity: 0.5
            }
        });

        //向元素事件属性赋处理函数
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        // 数据筛选：左右滑块分别绑定mouse事件
        this.filter.on('mousedown', this.onMouseDown.bind(this));
        this.handlerLeft.on('mousedown', this.onMouseDown.bind(this));
        this.handlerRight.on('mousedown', this.onMouseDown.bind(this));

        // 向元素图形合计中添加缩放条的矩形，函数图形背景的多边形，数据筛选的矩形，左右滑块的图形等实例
        if (option.show == undefined || option.show) {
            this.group.add(this.background);
            this.group.add(this.series);
            this.group.add(this.filter);
            this.group.add(this.handlerLeft);
            this.group.add(this.handlerRight);
        }

        // 如果存在初始数据缩放的配置，为数据缩放组件绑定本组件变化的处理函数
        if (option.datazoom) {
            option.datazoom.on('change', this.onZoomChange.bind(this));
        }

        if (option.zoomBarBuriedpoint) {
            this.zoomBarBuriedpoint = option.zoomBarBuriedpoint;
            this.debounce = new Debounced().use(this.zoomBarBuriedpoint, 1000, false);
        }
    }

    update(chart: Chart, position: LayoutPosition): void {
        const { option } = this.model;
        if (chart && position) {
            const { x, y, width, height } = chart.getRect(position);
            this.zoomBarRectWidth = width;
            const iconWidth = option.pc ? 5 : height;
            this.group.attr({
                x, y
            });
            this.background.attr({
                shape: {
                    width: height,
                    r: 2.5
                }
            });
            this.filter.attr({
                shape: {
                    x: this.left * width + height / 2,
                    width: (this.right - this.left) * width - height,
                    height
                }
            });
            // 左右两侧按钮的样式修改
            this.handlerLeft.attr({
                x: this.left * width,
                style: {
                    x: 0,
                    width: iconWidth,
                    height
                }
            });

            this.handlerRight.attr({
                x: this.right * width,
                style: {
                    x: this.right - iconWidth,
                    y: 0,
                    width: iconWidth,
                    height
                }
            });

            // 当数据多于一个时，为函数图象北京的点属性赋值，重回缩略背景
            if (this.data.length > 1) {
                const dx = width / (this.data.length - 1);
                const points = this.data.map((e, i) => [i * dx, height - e * height]);
                points.push([width, height], [0, height]);
                this.series.attr({
                    shape: {
                        points
                    }
                });
            }
        }
    }

    // 展示筛选左右滑块的事件绑定，如果缩放条的配置对象提供了图表绑定的datazoom，那么当本元素的左右滑块和数据筛选区域有鼠标按下事件时，
    //将图表对应的datazoom的鼠标移动时间沉默，避免引起冲突

    onMouseDown(e: ElementEvent | undefined) {
        const { option } = this.model;
        if (option.datazoom) {
            option.datazoom.lock = true;
        }
        this.mousePosition = [e.offsetX, e.offsetY];

        // 判定事件目标，并绑定相应的处理模式
        switch (e?.target) {
            case this.handlerLeft:
                this.mode = 'left';
                break;
            case this.handlerRight:
                this.mode = 'right';
                break;
            default:
                this.mode = 'center';
                break;
        }
        // 冒泡事件阻止
        e?.event.preventDefault();
    }

    // 元素的鼠标位置未被赋值，即鼠标按下时间未触发，则沉默移动事件
    onMouseMove(e: ElementEvent | undefined) {
        const { option } = this.model;
        if (this.mousePosition) {
            /* min:当前最小数量级展示长度
            mx：鼠标实施横坐标和拖动条最左侧x轴位置之间的差值
            left：当前展示的拖动条最左侧位置信息
            right：当前展示的拖动条最右侧位置信息
            */
            const left = this.handlerLeft.x;
            const right = this.handlerRight.x;
            let min = 0;
            if (option.minCount && this.handlerLeft.style.width) {
                if ((option.minCount - 1) / (this.data.length - 1) * this.zoomBarRectWidth < 2 * this.handlerLeft.style.width) {
                    min = 2 * this.handlerLeft.style.width;
                } else {
                    min = (option.minCount - 1) / (this.data.length - 1) * this.zoomBarRectWidth;
                }
            }

            // mx:鼠标按压位置与zoombar组件的相对x偏移的距离
            let mx = e.offsetX - this.group.x;
            if (this.mode === 'center') {
                const dx = e.offsetX - this.mousePosition[0];
                if (left + dx < 0 || right + dx > this.zoomBarRectWidth) {
                    return;
                }
                this.left = (left + dx) / this.zoomBarRectWidth;
                this.right = (right + dx) / this.zoomBarRectWidth;
                this.mousePosition = [e.offsetX, e.offsetY];
            } else {
                if (mx > right && mx <= this.zoomBarRectWidth) {
                    this.mode = 'right';
                    this.right = mx / this.zoomBarRectWidth;
                } else if (mx < left && mx >= 0) {
                    this.mode = 'left';
                    this.left = mx / this.zoomBarRectWidth;
                } else {
                    if (this.mode == 'left') {
                        if (mx > right - min) {
                            mx = right - min;
                        }
                        this.left = Math.max(mx / this.zoomBarRectWidth, 0);
                    } else {
                        if (mx < left + min) {
                            mx = left + min;
                        }
                        this.right = Math.min(mx / this.zoomBarRectWidth, 1);
                    }
                }
            }

            if (this.debounce) {
                this.debounce();
            }
            this.onChange();
        }
    }
    zoomBarBuriedpoint() {
        // 这是拖动条埋点
    }

    onMouseUp() {
        const { option } = this.model;
        if (option.datazoom) {
            option.datazoom.lock = false;
        }
        this.mousePosition = undefined;
    }

    onZoomChange(scaler: LinearScaler) {
        const { option } = this.model;
        if (!this.mousePosition && option.datazoom) {
            this.left = scaler.denormalize(0) / (option.datazoom.total - 1);
            this.right = scaler.denormalize(1) / (option.datazoom.total - 1);
            this.onChange();
        }
    }


    onChange() {
        const { option } = this.model;
        const { zoomBarRectWidth } = this;
        const w = this.filter.shape.width / 2;
        this.filter.attr({
            shape: {
                x: this.left * zoomBarRectWidth + w,
                width: (this.right - this.left) * zoomBarRectWidth - 2 * w,

            }
        });

        this.handlerLeft.attr({
            x: this.left * zoomBarRectWidth,
        });

        this.handlerRight.attr({
            x: this.right * zoomBarRectWidth,
        })

        // 这个方法用于让拖动条进行滑动
        if (option.datazoom) {
            option.datazoom.setRange(this.left, this.right);
        }
        // 这个方法用于后来编写的新的zoombar方法，确实了就无法使用了
        if (option.onChange) {
            option.onChange(this.left, this.right);
        }
    }


    get viewModel() {
        return this.group;
    }

}


export default ZoomBarView;