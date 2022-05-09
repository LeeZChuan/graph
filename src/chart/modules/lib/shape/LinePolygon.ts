import { Path, PathProps } from 'zrender';
import { VectorArray } from 'zrender/lib/core/vector';
import { buildPath } from 'zrender/lib/graphic/helper/poly';

export declare class LinePolgonShape {
    points: VectorArray[];
    smooth?: number | 'spline';
    begin: VectorArray;
    end: VectorArray;
}

export interface LinePolgonProps extends PathProps {
    shape: LinePolgonShape;
}

export class LinePolgon extends Path<LinePolgonProps>{
    declare shape: {
        points: [],
        begin: [],
        end: [],
        smooth: 0
    }


    constructor(opts?: LinePolgonProps) {
        super(opts);
    }


    buildPath(ctx: CanvasRenderingContext2D, shape: LinePolgonShape) {
        buildPath(ctx, shape, false);
        ctx.lineTo(shape.end[0], shape.end[1]);
        ctx.lineTo(shape.begin[0], shape.begin[1]);
        ctx.lineTo(shape.points[0][0], shape.points[0][1]);
    }
}