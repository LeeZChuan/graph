// 防抖函数
// 1. func 需要包装的函数
// 2. delay 延迟时间，单位ms
// 3. immediate是否默认执行一次（第一次不延迟）

export default class Debounced {
    public use = (func: any, delay: number, immediate = false): Function => {
        if (typeof func !== 'function') {
            throw new TypeError('is not a function');
        }

        let timer: number | undefined;
        return (...args: any) => {
            if (immediate) {
                // 引用指向正常，并且函数的参数也不变
                func.apply(this, args);
                immediate = false;
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
}