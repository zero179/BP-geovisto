import { TurfPolygon } from "./../model/types/index";
import union from "@turf/union";
import { DrawnObject } from "../model/types";
import { isLayerPoly } from "../util/polyHelpers";
import { operateOnSelectedAndCurrectLayer } from "./shared";
import IDrawingLayerToolState from "../model/types/tool/IDrawingLayerToolState";

/**
 * @brief unifies selected object with the one being currently created
 */
export const polyJoin = (
  layer: DrawnObject,
  state: IDrawingLayerToolState
): DrawnObject => {
  const selectedLayer = state.selectedLayer;
  if (!selectedLayer || !isLayerPoly(selectedLayer)) return layer;
  const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(
    layer,
    (a: GeoJSON.Feature, b: GeoJSON.Feature) =>
      union(a as TurfPolygon, b as TurfPolygon) as GeoJSON.Feature,
    selectedLayer
  );

  if (result) {
    layer.remove();
    state.removeSelectedLayer();
    state.setSelectedLayer(updatedLayer);
  }

  return updatedLayer;
};
