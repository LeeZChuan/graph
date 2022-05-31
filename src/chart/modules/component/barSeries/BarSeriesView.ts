
// over
import { Path, PathStyleProps, Element as ZRElement, ElementProps, Group, RectShape, Rect } from "zrender";
import ComponentMobel from "../ComponentModel";
import ComponentView from "../ComponentView";
import { BarSeriesOption } from "./BarSeriesModel";
import { Chart } from "../../lib/Chart";
import { LayoutPosition } from "../../layout/Layout";


export default class BarSeriesView extends ComponentView {
    // 绘制类型stack堆叠图，normal普通柱状图
    seriesType: 'stack' | 'normal';
    //每个group的x坐标
    sites: number[] = [];
    // 值，y方向的高度百分比数组，有可能是堆叠图或者多柱图
    values: number[][] = [[]];
    // 显示范围
    range: [number, number] = [0, 1];
    //零轴点位
    zero: number;
    // 柱子宽度
    rectWidth = 16;
    // 组内间距
    spaceInGroup = 8;
    //组间距
    spaceOutGroup = 32;
    //每个group内柱子数量
    barCount = 0;
    //柱子组的数量
    groupCount = 0;
    //组的宽度
    groupWidth = 0;
    //绘图区域的宽度
    width = 0;
    style: PathStyleProps[] = [];
    animation: boolean;
    // 柱子的最低高度
    barMinHeight: number;

    constructor(model: ComponentMobel) {
        super(model);
        this.barMinHeight = model.option?.barMinHeight || 1;
    }

    update(chart: Chart, position: LayoutPosition): void {
        if (!chart || !position) return;
        //更新时删除所有图形重新绘制
        this.group.removeAll();
        const { x, y, width, height } = chart.getRect(position);
        if (isNaN(width)) return;
        const { adjust, seriesType } = this.model.option;
        this.width = width;
        //动态获取并更新values sites rectWidth spaceInGroup
        this.dataProcess(this.model.option);
        const { barCount, groupCount, sites, values, spaceInGroup, rectWidth, range, zero, animation } = this;
        if (!(barCount && groupCount)) return;
        for (let i = 0; i < sites.length; i++) {
            const group = new Group();
            let y0 = 0;
            group.attr({
                x: x + sites[i],
                y
            });


            for (let j = 0; j < barCount; j++) {
                let rectHeight = values[range[0] + i][j] * height;
                // 最小柱子高度设置
                if (Math.abs(rectHeight) < this.barMinHeight) {
                    rectHeight = -this.barMinHeight;
                }

                const offsetX = seriesType === 'normal' ? j * (spaceInGroup + rectWidth) : 0;
                const offsetY = seriesType === 'normal' ? zero : zero + y0;
                const rect = this.setRect({ x: offsetX, y: offsetY, width: rectWidth, height: rectHeight }, this.style[j], zero, animation);
                group.add(rect);
                y0 += (values[this.range[0] + i][j] * height);
            }
            this.group.add(group);
        }
        adjust && adjust(this.group, width, height);
    }


    //统一做数据处理，把外部传进来的动态数据标准化F
    dataProcess(option: BarSeriesOption) {
        const { barCount, groupCount, sites, values, spaceInGroup, rectWidth, range, zero, seriesType, animation } = option;
        this.rectWidth = rectWidth(this.width);
        this.animation = isSanmeType(animation, Function) ? spaceInGroup() : 0;
        this.spaceInGroup = isSameType(spaceInGroup, Function) ? spaceInGroup() : 0;
        this.style = isSameType(style, Function) ? style() : [];
        this.range = range();
        this.zero = zero();
        this.setCountValues(values);
        this.spaceInGroup = (this.barCount === 1 || seriesType === 'stack') ? 0 : this.spaceInGroup;
        this.groupWidth = seriesType === 'normal' ? this.barCount * this.rectWidth + this.spaceInGroup * (this.barCount - 1) : this.rectWidth;
        // TODO:柱子宽度偏移计算
        this.spaceOutGroup = this.spaceOutGroup(this.width);
        this.sites = isSame(sites, Function) ? sites(this.width) : [];
        if (!this.sites.length) {
            if (this.groupWidth && this.rectWidth && this.groupCount && this.spaceOutGroup) {
                this.sites = this.getStandardSites();
            } else {
                this.sites = this.getDefualtSites();
            }
        }
    }


    setCountValues(values: () => number[][]) {
        const vals = values();
        if (!vals.length || !vals[0].length) {
            this.groupCount = 0;
            this.barCount = 0;
            this.values = [[]];
        } else {
            this.values = vals;
            this.groupCount = this.values.length;
            this.barCount = this.values[0].length;
        }
    }


    //各组默认的水平点分割方法，同水平布局器分割方式一致
    getDefualtSites() {
        const { groupWidth, width, range } = this;
        const max = range[1] - range[0] + 1;
        const splitWidth = width - groupWidth;
        const sites = splitOne(max).map(e => e * splitWidth);
        return sites;
    }

    // 设计师要求的标准化柱子宽度布局
    getStandardSites() {
        const { spaceOutGroup, groupWidth, range } = this;
        let groupCount = range[1] - range[0] + 1;
        const sites = [];
        let curWidth = 0;
        while (groupCount--) {
            sites.push(curWidth);
            curWidth += (groupWidth + spaceOutGroup);
        }
        return sites;
    }


    // 设定矩形样式
    setRect(rectShape: RectShape, rectStyle: PathStyleProps, zero: number, animation: boolean): Rect {
        const rect = new Rect();
        if (animation) {
            rect.attr({
                shape: {
                    x: rectShape.x,
                    y: zero,
                    width: rectShape.width,
                    height: 0,
                    r: rectShape.r
                },
                style: rectStyle
            });
            rect.animateTo({
                shape: rectShape,
                style: rectStyle
            }, {
                duration: 600,
                easing: getBezierFun(0, 0.33, 0.68, 1)
            });
        } else {
            rect.attr({
                shape: rectShape,
                style: rectStyle
            });
        }
        return rect;
    }
    //todo：修改柱子间距的计算方法
    spaceOutwidth(width: number) {
        return (width - this.groupWidth * this.groupCount / 2) / (this.groupCount / 2 - 1);
    }

    get viewModel() {
        return this.group;
    }
}