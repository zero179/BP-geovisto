import { DrawnObject, TurfPolygon } from "./../model/types/index";
import * as turf from "@turf/turf";
import { isLayerPoly } from "../util/polyHelpers";
import { operateOnSelectedAndCurrectLayer } from "./shared";
import IDrawingLayerToolState from "../model/types/tool/IDrawingLayerToolState";

/**
 * @brief intersect selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
export const polyIntersect = (
  layer: DrawnObject,
  state: IDrawingLayerToolState
): DrawnObject => {
  const selectedLayer = state.selectedLayer;
  if (!selectedLayer || !isLayerPoly(selectedLayer)) return layer;
  const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(
    layer,
    (a: GeoJSON.Feature, b: GeoJSON.Feature) =>
      turf.intersect(a as TurfPolygon, b as TurfPolygon) as GeoJSON.Feature,
    selectedLayer
  );

  if (result) {
    layer.remove();
  }

  return updatedLayer;
};
