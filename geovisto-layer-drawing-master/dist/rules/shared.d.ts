import { DrawnObject } from "../model/types";
/**
 * @brief - takes selected object and currently created object
 *        and executes passed operation
 *        - used for union and intersection
 */
export declare const operateOnSelectedAndCurrectLayer: (layer: DrawnObject, operation: (a: GeoJSON.Feature, b: GeoJSON.Feature) => GeoJSON.Feature, selectedLayer: DrawnObject) => {
    layer: DrawnObject;
    result: boolean;
};
