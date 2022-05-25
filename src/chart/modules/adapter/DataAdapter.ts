import { LinearScaler } from "@/modules/scaler/LinearScaler";
import { getExpandCoverZero, getExpandRange, getRange, getTwoAxisCoverZero, splitOne } from "../util/math";
import { plus, strip, times } from "../util/number-precision";
import { SCALER } from "../util/value";


interface DataAdapterOption {
    // x轴的键值对
    xKey: string;
    // 左侧y轴的所有键值对
    lyKeys?: string[];
    // 左侧y轴的范围展示方式
    // lyRange?:'sum' |'max';
    // 左侧堆叠图的key组成的二维数组
    lyRangeKeys?: Array<Array<string | number>>;
    // 右侧y轴的范围展示方式
    // ryRange?:'sum' | 'max';
    // 右侧y轴的所有键
    ryKeys?: string[];
    // 右侧堆叠图的key组成的二维数组
    ryRangeKeys?: Array<Array<string | number>>;
    // 是否覆盖零轴
    coverZero?: 'left' | 'right' | 'both';
    // 是否需要凑整
    roundUp?: boolean;
    // 纵坐标划分数量
    splitCount?: number;
    // 可见的series的键名
    visible?: Set<string>;
    // y轴范围在原有的基础上放大的比例，0.1表示放大10%
    expandRate?: number;
    // 分割线数量是否自动计算
    splitLineCountAuto?: boolean;
}


export class DataAdapter {
    data: any[] = [];
    // x轴对应的数据，由xKey键值获取并更新
    xDatas: string[] = [];
    // x轴数据被x轴比例尺归一化处理后的数据
    nomalizaedX: number[] = [];
    // 左侧图像的标签key和数据map的映射
    lSeriesMap = new Map<string, number[]>();
    // 右侧图像的标签key和数据的map映射
    rSeriesMap = new Map<string, number[]>();
    // 左侧y轴的比例尺
    lyScaler: LinearScaler = SCALER;
    // 右侧y轴的比例尺
    ryScaler: LinearScaler = SCALER;
    // 数据适配器的实例化配置
    option: DataAdapterOption;
    // x轴的比例尺
    xScaler: LinearScaler = SCALER;
    // 根据分割线数量定位的分割线的位置数组
    splits: number[];
    // 元素可见集合
    visible = new Set();
    // 放大倍数
    expandRate: number;
    // 当前视图内的数据数量
    viewNumber: number;

    constructor(option: DataAdapterOption) {
        this.option = option;
        this.splits = splitOne(option.splitCount || 5);
        this.visible = option.visible ? option.visible : this.visible;
        this.expandRate = option.expandRate || 0;
        this.option.roundUp = typeof option.roundUp === 'boolean' ? option.roundUp : true;
    }

    setData(data: any[], scaler?: LinearScaler) {
        this.xScaler = scaler ? scaler : new LinearScaler(0, data.length - 1);
        this.data = data;
        this.update();
    }

    setRange(start: number, end: number) {
        const total = this.data.length - 1;
        const min = Math.round(total * start);
        const max = Math.round(total * end);
        if (min === Math.round(this.xScaler.denormalize(0)) && max === Math.round(this.xScaler.denormalize(1))) {
            return;
        }
        this.xScaler = new LinearScaler(min, max);
        this.update();
    }

    setVisible(visible: Set<string>) {
        this.visible = visible;
    }

    update() {
        const { option, data } = this;
        this.xDatas = data.map((e: any) => e[option.xKey]);
        this.nomalizaedX = this.xDatas.map((e, i) => this.xScaler.normalize(i));
        this.calSplits();
        this.updateYscaler('left');
        this.updateYscaler('right');
        // 更新双轴

        if (this.lyScaler.delta !== 0 && this.ryScaler.delta !== 0 && option.coverZero === 'both' && option.roundUp) {
            const lMin = this.lyScaler.min;
            const lMax = this.lyScaler.delta + this.lyScaler.min;
            const rMin = this.ryScaler.min;
            const rMax = this.ryScaler.delta + this.ryScaler.min;
            // 左右比例尺起始的时候都赋予了默认值，所以使用delta判断不准确，如果一开始就没有数值的话，就无需两边对齐了
            if (this.rSeriesMap.size === 0 || this.rSeriesMap.size === 0) {
                return;
            }
            const re = getTwoAxisCoverZero(lMin, lMax, rMin, rMax, this.splits.length);
            this.lyScaler = new LinearScaler(re[0][this.splits.length - 1], re[0][0]);
            this.ryScaler = new LinearScaler(re[1][this.splits.length - 1], re[1][0]);
        }
    }


    updateYscaler(rely: 'left' | 'right') {
        let range = this.calDataRange(rely);
        if (!Array.isArray(range)) {
            return;
        }
        const ySeriesMap = (rely === 'left' ? this.lSeriesMap : this.rSeriesMap);
        range = this.checkRange(range, ySeriesMap, rely);
        range = this.expandRange(range, this.expandRate);

        if (this.option.coverZero === 'both' || this.option.coverZero === rely) {
            if (range[0] > 0) {
                range[0] = 0;
            }
            if (range[1] < 0) {
                range[1] = 0;
            }
        }
        if (this.option.roundUp && range[1] !== range[0]) {
            const re = getExpandCoverZero(range[0], range[1], this.splits.length);
            range[re[0], re[this.splits.length - 1]];
        }

        const yScaler = new LinearScaler(range[1], range[0]);

        if (rely === 'left') {
            this.lyScaler = (range[1] === range[0] && range[0] === 0 ? this.lyScaler : yScaler);
        } else {
            this.ryScaler = (range[1] === range[0] && range[0] === 0 ? this.ryScaler : yScaler);
        }

    }

    // 获取左右边轴的数据范围

    calDataRange(rely: 'left' | 'right'): number[] | undefined | null {
        const { option, data } = this;
        const ykeys = (rely === 'left' ? option.lyKeys : option.ryKeys);
        const ySeriesMap = (rely === 'left' ? this.lSeriesMap : this.rSeriesMap);
        const yRangeKeys = (rely === 'left' ? this.option.lyRangeKeys : this.option.ryRangeKeys);
        if (!ykeys) {
            return;
        }
        ykeys.forEach(k => {
            ySeriesMap.set(k, data.map(d => d[k]));
        });

        const min = Math.round(this.xScaler.denormalize(0));
        const max = Math.round(this.xScaler.denormalize(1));
        const dataList: number[] = [];
        ySeriesMap.forEach((value, key) => {
            if (!this.visible.has(key)) {
                return;
            }
            if (this.getyRangeIndex(key, yRangeKeys) !== -1) {
                return;
            }
            for (let i = min, k = 0; i < value.length && i <= max; i++, k++) {
                dataList.push(value[i]);
            }
        });

        const stackData = this.getStackRange(rely);
        let range = null;

        if (dataList.length) {
            range = stackData[0] === 0 && stackData[1] === 0 ? getRange(dataList) : getRange([...dataList, ...stackData]);
        } else if (stackData[0] !== stackData[1]) {
            range = getRange([...stackData]);
        } else if (stackData.includes(0) && stackData[0] === stackData[1]) {
            range = [0, 0];
        } else {
            range = getRange([...stackData, 0]);
        }

        return range;
    }


    // 重新计算y轴分割数
    calSplits() {
        if (this.option.splitLineCountAuto) {
            const leftRange = this.calDataRange('left');
            const rightRange = this.calDataRange('right');
            let range = [0, 0];
            if (Array.isArray(leftRange)) {
                range = [...leftRange];
            }
            if (Array.isArray(rightRange)) {
                range = [...range, ...rightRange];
            }
            range = getRange(range);
            const count = calSplitCount(range[0], range[1]);
            this.splits = splitOne(count);
        }
    }

    /**
     * 获取左、右的分割值
     * @param rely 左轴还是右侧轴
     * @returns 
     */
    getYvalues(rely: 'left' | 'right') {
        const re: number[] = [];
        this.splits.forEach((item, index) => {
            re.push(this.split(index, rely));
        });
        return re;
    }


    /**
     * 获取某个值在左轴右轴的index（从上倒下）
     * @param value 要查找的值
     * @param rely 序号
     * @returns 
     */
    getYvalueIndex(value: number, rely: 'left' | 'right') {
        return this.getYvalues(rely).findIndex(item => item === value);
    }

    // 检查新的范围是否符合标准，不符合则设置新的范围
    checkRange(range: number[], seriesMap: Map<any, any>, rely: 'left' | 'right'): number[] {
        const yRangeKeys = rely === 'left' ? this.option.lyRangeKeys : this.option.ryRangeKeys;
        // 如果首尾不一样则是有效的范围
        if (range[0] !== range[1]) return range;
        // 如果是0，0
        if (range[0] === 0 && range[1] === 0) {
            const data: number[] = [];
            const min = 0;
            const max = this.data.length - 1;
            // 先尝试扩大计算范围
            seriesMap.forEach((value, key) => {
                // TODO:使用键值对，将含有sum元素的键值对剔除
                if (!this.visible.has(key)) return;
                if (this.getyRangeIndex(key, yRangeKeys) !== -1) return;
                for (let i = min, k = 0; i < value.length && i <= max; i++, k++) {
                    data.push(value[i]);
                }
            });

            const stackData = this.getStackRange(rely);
            let dataList: number[];
            if (data.length) {
                dataList = stackData[0] === 0 && stackData[1] === 0 ? data : [...data, ...stackData];
            } else if (stackData[0] !== stackData[1]) {
                dataList = [...stackData];
            } else {
                dataList = [0, 0];
            }

            // 得到新的范围
            const newRange = getRange(dataList);
            if (newRange[0] === 0 && newRange[1] === 0) {
                return [0, 1];
            }
            // 否则再次计算
            return this.checkRange(newRange, seriesMap, rely);
        } else {
            const re = getExpandCoverZero(range[0], range[1], this.splits.length);
            return [re[0], re[re.length - 1]];
        }
    }

    split(i: number, style: string) {
        let result: any;
        if (style.toLowerCase() === 'right') {
            // 右侧y轴反归一化后生成的对应的数组
            result = this.myDenormalize(this.ryScaler, this.splits[i]);
        } else if (style.toLowerCase() === 'left') {
            // 左侧y轴反归一化后生成的对应的数组
            result = this.myDenormalize(this.lyScaler, this.splits[i]);
        } else {
            result = -1;
        }
        // TODO 这里先保证返回的数据取出有效值，如果数据长度很大则需要再修改
        return Number(strip(result, 14));
    }

    /**
     * Scaler.denormalize可能会存在精度丢失问题，为了解决这个问题使用这个方法来做
     * @param scaler 标尺
     * @param val 数据
     * 
     */
    myDenormalize(scaler: LinearScaler, val: number): number {
        const delta = strip(scaler.delta, 14);
        const minVal = strip(scaler.min, 14);
        const value = strip(val, 14);
        if (delta) {
            return plus(times(delta, value), minVal);
        } else {
            return minVal;
        }
    }

    //获取左侧y轴的最大值最小值
    countDataInView() {
        const min = Math.round(this.xScaler.denormalize(0));
        const max = Math.round(this.xScaler.denormalize(1));
        return max - min + 1;
    }

    // 获取整体归一化值
    getNomalizedY(): number[] {
        let res: number[] = [];
        this.lSeriesMap.forEach(arr => {
            if (res.length === arr.length) {
                arr.forEach((v, i) => {
                    res[i] += v;
                })
            } else {
                res = [...arr];
            }
        });
        const range = getRange(res);
        const scaler = new LinearScaler(range[0], range[1]);
        return res.map(v => scaler.normalize(v));
    }

    getStackRange(rely: 'left' | 'right') {
        const yRangeKeys = (rely === 'left' ? this.option.lyRangeKeys : this.option.ryRangeKeys);
        const ySeriesMap = this.lSeriesMap;
        const min = Math.round(this.xScaler.denormalize(0));
        const max = Math.round(this.xScaler.denormalize(1));
        const dataListPlus = [];
        const dataListMinus = [];
        ySeriesMap.forEach((value, key) => {
            const index = this.getyRangeIndex(key, yRangeKeys);
            if (!this.visible.has(key) || index === -1) {
                return;
            }
            for (let i = min, k = 0; i < value.length && i <= max; i++, k++) {
                const nowNumber = Number(value[i]);
                if (!isNaN(value[i]) && nowNumber >= 0) {
                    dataListPlus[k] ? (dataListPlus[k] += nowNumber) : (dataListPlus[k] = nowNumber);
                }
                if (!isNaN(value[i]) && value[i] < 0) {
                    dataListMinus[k] ? (dataListMinus[k] += nowNumber) : (dataListMinus[k] = nowNumber);
                }
            }
        });

        const dataList = [...dataListPlus, ...dataListMinus];
        if (dataList.length === 0) {
            return [0, 0];
        }
        return getRange(dataList);
    }


    getyRangeIndex(key: any, yRangeKeys: Array<Array<number | string>>) {
        if (!yRangeKeys) {
            return -1;
        }

        return yRangeKeys.findIndex(item => item.findIndex(v => v === key && this.visible.has(key)) !== -1);
    }


    expandRange(range: number[], expandRange: number) {
        if (isNaN(expandRange) || expandRange === 0) {
            return range;
        }
        const distance = (range[1] - range[0]) * expandRange;
        const newRange = [range[0] - distance / 2, range[1] + distance / 2];
        // 扩充范围时，如果原先的范围在0轴的一侧，则不应该让范围扩展到跨越0轴
        if (range[1] * range[0] > 0 && newRange[0] * newRange[1] < 0) {
            if (range[0] > 0) {
                newRange[0] = 0;
                newRange[1] = range[1] + distance - range[0];
            }

            if (range[1] < 0) {
                newRange[1] = 0;
                newRange[0] = range[0] - distance - range[1];
            }
        }

        return newRange;
    }

}