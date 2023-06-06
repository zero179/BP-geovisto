import { DrawnObject } from "../model/types";
import IDrawingLayerToolState from "../model/types/tool/IDrawingLayerToolState";
/**
 * @brief takes currently created polygon and loops through each polygon
 *        and executes operation 'difference'
 *
 * @param {Layer} layer
 * @param {Boolean} intersect
 */
export declare const polyDiff: (layer: DrawnObject, state: IDrawingLayerToolState, intersect?: boolean) => void;
