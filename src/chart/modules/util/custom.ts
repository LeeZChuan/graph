
// 计算图表内文本长度方法
export function metureTextWidth(text: string, option: any) {
    const tmpContext = document.createElement('canvas').getContext('2d');
    tmpContext.font = `${option.fontWeight} ${option.fontSize}px ${option.fontFamily}`;
    return tmpContext?.measureText(text).width;
}

