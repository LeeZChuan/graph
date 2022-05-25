/** 
 *  解决浮动小数的运算问题，避免小数点后产生多为数和计算精度损失
 *  例如：2.3+2.4=4.699999999999999999
 * 
 * 把错误的数据转成正确的数据
 * strip(0.0999999999999998)=0.1
 *  */


function strip(num: number, precision: number) {
    if (isNaN(num)) {
        return num;
    }

    if (precision === void 0) {
        precision = 12;
    }

    return +parseFloat(num.toPrecision(precision));
}



function digitLength(num: number) {
    const eSplit = num.toString().split(/[eE]/);
    const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
}

// 把小数转换成整数，支持科学计数法
function float2Fixed(num: number) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().toString().replace('.', ''));
    }
    const dLen = digitLength(num);
    return dLen > 0 ? num * Math.pow(10, dLen) : num;
}

//检查数字是否越界
function checkBoundary(num: number) {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        console.warn('数字越界')
    }
}

// 精确乘法
function times(num1: number, num2: number) {
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    const baseNum = digitLength(num1) + digitLength(num2);
    const leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
}

//精确加法
function plus(num1: number, num2: number) {
    const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

//精确减法
function minus(num1: number, num2: number) {
    const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}

//精确除法
function divide(num1: number, num2: number, ..._res: number[]) {
    const num1Changed = float2Fixed(num1);
    const num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times(num1Changed / num2Changed, Math.pow(10, digitLength(num2) - digitLength(num1)));
}

function round(num: number, ratio: number) {
    const base = Math.pow(10, ratio);
    return divide(Math.round(times(num, base)), base);
}

export { strip, plus, minus, times, divide, round, digitLength, float2Fixed }
