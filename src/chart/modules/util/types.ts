//OVER

export type ModelOption = any;
export type EventOption = {
    beforeMousemove?: (...agruments) => void;
    afterMousemove?: (...agruments) => void;
    beforeMousedown?: (...agruments) => void;
    afterMousedown?: (...agruments) => void;
    beforeCancelMousePointer?: (...agruments) => void;
    afterCancelMousePointer?: (...agruments) => void;
}

export interface ComponentOption {
    style?: {},
    Data?: {},
    Scaler?: any,
    z?: number,
    zlevel?: number
}