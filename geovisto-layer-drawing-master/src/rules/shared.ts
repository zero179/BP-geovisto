import { DrawnObject } from "../model/types";
import {
  getGeoJSONFeatures,
  getFirstGeoJSONFeature,
  isFeaturePoly,
  morphFeatureToPolygon,
} from "../util/polyHelpers";

/**
 * @brief - takes selected object and currently created object
 *        and executes passed operation
 *        - used for union and intersection
 */
export const operateOnSelectedAndCurrectLayer = (
  layer: DrawnObject,
  operation: (a: GeoJSON.Feature, b: GeoJSON.Feature) => GeoJSON.Feature,
  selectedLayer: DrawnObject
): { layer: DrawnObject; result: boolean } => {
  const feature = getFirstGeoJSONFeature(layer);
  const isFeatPoly = feature ? isFeaturePoly(feature) : false;
  if (!isFeatPoly || !feature) return { layer, result: false };

  let summedFeature = feature;

  // * this can be multipolygon whenever user joins 2 unconnected polygons
  const selectedFeatures = getGeoJSONFeatures(selectedLayer);
  if (!selectedFeatures) return { layer, result: false };

  // * selected feature may be multiple polygons so we sum them
  selectedFeatures.forEach((selectedFeature: GeoJSON.Feature) => {
    const isSelectedFeaturePoly = isFeaturePoly(selectedFeature);

    if (isSelectedFeaturePoly) {
      summedFeature = operation(selectedFeature, summedFeature);
    }
  });

  layer = morphFeatureToPolygon(summedFeature, layer.options);

  return { layer, result: true };
};
