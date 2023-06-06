import { DrawnObject } from "./../model/types/index";
import IDrawingLayerToolState from "../model/types/tool/IDrawingLayerToolState";
/**
 * @brief intersect selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export declare const polyIntersect: (layer: DrawnObject, state: IDrawingLayerToolState) => DrawnObject;
