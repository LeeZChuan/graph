//over

import { LinearGradient, Polyline, Rect } from 'zrender';
import { parse } from 'zrender/lib/tool/color';
import { AreaOptionType } from './Area/areaModel';

export function createAreaOptionFromLine(line: Polyline, width: number, height: number): AreaOptionType {
    const { stroke } = line.style;
    const { points, smooth } = line.shape;
    const startColor = parse(String(stroke));
    const endColor = [...startColor];
    endColor[3] = 0;
    const bgc = new LinearGradient(1, 1, 1, 0, [{
        offset: 1,
        color: `rgba(${startColor.join(',')})`,
    }, {
        offset: 0,
        color: `rbga(${endColor.join(',')})`,
    }]);
    return {
        shape: {
            smooth: Number(smooth),
            points: [[0, height], ...points, [width, height]],
        },
        style: {
            fill: bgc,
        },
        z: 1,
        clipPath: new Rect({
            shape: {
                x: 0,
                y: 0,
                width,
                height
            },
        })
    }
}