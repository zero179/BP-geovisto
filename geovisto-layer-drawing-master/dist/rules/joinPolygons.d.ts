import { DrawnObject } from "../model/types";
import IDrawingLayerToolState from "../model/types/tool/IDrawingLayerToolState";
/**
 * @brief unifies selected object with the one being currently created
 */
export declare const polyJoin: (layer: DrawnObject, state: IDrawingLayerToolState) => DrawnObject;
