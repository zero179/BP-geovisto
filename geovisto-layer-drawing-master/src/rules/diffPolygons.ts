import L, { LatLng } from "leaflet";
import difference from "@turf/difference";
import {
  getConversionDepth,
  getFirstGeoJSONFeature,
  isLayerPoly,
} from "../util/polyHelpers";
import { FIRST, normalStyles } from "../util/constants";
import { DrawnObject, TurfPolygon } from "../model/types";
import IDrawingLayerToolState from "../model/types/tool/IDrawingLayerToolState";

const replaceLayer = (
  state: IDrawingLayerToolState,
  replacement: DrawnObject,
  replacedLayer: DrawnObject,
  replacementCoords?: LatLng[]
) => {
  replacement?.dragging?.disable();
  replacement.layerType = "polygon";
  if (replacementCoords) replacement._latlngs = replacementCoords;
  replacement.identifier = replacedLayer.identifier;
  replacement.setStyle({ ...replacement.options, ...normalStyles } as any);
  const content = replacedLayer.popupContent;
  if (content) {
    replacement.bindPopup(content, {
      closeOnClick: false,
      autoClose: false,
    });
    replacement.popupContent = content;
  }
  state.addLayer(replacement);
  state.removeLayer(replacedLayer);
};

const diffLayers = (
  geoObject: DrawnObject,
  layerFeature: GeoJSON.Feature,
  state: IDrawingLayerToolState,
  canDiff: boolean
) => {
  if (!geoObject) return;
  const feature = getFirstGeoJSONFeature(geoObject);

  if (canDiff) {
    const diffFeature = difference(
      feature as TurfPolygon,
      layerFeature as TurfPolygon
    );

    if (diffFeature) {
      let latlngs;
      const coords = diffFeature.geometry.coordinates;
      const isJustPoly = diffFeature.geometry.type === "Polygon";
      // * when substracting you can basically slice polygon into more parts,\
      // * then we have to increase depth by one because we have an array within an array
      const depth = getConversionDepth(diffFeature);
      try {
        // * - this conditional asks if created polygon is polygon with hole punched in it
        // * - for the rest of cases i.e. when polygon is split into multiple parts or not, we use loop\
        // * otherwise we create polygon, where hole should be
        if (isJustPoly && coords.length !== 1) {
          latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
          const result = new (L as any).polygon(latlngs, {
            ...geoObject.options,
          });
          replaceLayer(state, result, geoObject);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          coords.forEach((coord) => {
            latlngs = L.GeoJSON.coordsToLatLngs([coord], depth);
            const result = new (L as any).polygon(latlngs, {
              ...geoObject.options,
            });
            const newLatLngs =
              depth === 1 ? result._latlngs : result._latlngs[FIRST];
            replaceLayer(state, result, geoObject, newLatLngs);
          });
        }
      } catch (error) {
        console.error({ coords, latlngs, error, depth });
      }
    } else {
      state.removeLayer(geoObject);
    }
  }
};

/**
 * @brief takes currently created polygon and loops through each polygon
 *        and executes operation 'difference'
 *
 * @param {Layer} layer
 * @param {Boolean} intersect
 */
export const polyDiff = (
  layer: DrawnObject,
  state: IDrawingLayerToolState,
  intersect = false
): void => {
  const layerFeature = getFirstGeoJSONFeature(layer);
  const isCurrentLayerPoly = isLayerPoly(layer);
  const createdIsNotEraser = layer.layerType !== "erased";

  if (isCurrentLayerPoly && layerFeature) {
    const selectedLayer = state.selectedLayer;
    // * - if intersect is active execute difference with only selected polygon
    // * - part of condition with 'selectedLayer' is here b/c, when you have intersect on\
    // * without selecting object stroke/object user creates stayes on top of everything
    if (
      intersect &&
      createdIsNotEraser &&
      selectedLayer &&
      isLayerPoly(selectedLayer)
    ) {
      diffLayers(selectedLayer, layerFeature, state, true);
    } else {
      const fgLayers = state.featureGroup._layers;
      // * else we execute difference with each geo. object
      Object.values(fgLayers)
        .filter((geoObject) => isLayerPoly(geoObject))
        .forEach((geoObject) => {
          // * we want to avoid damaging selected layer
          const objectIsNotSelected =
            geoObject?._leaflet_id !== selectedLayer?._leaflet_id;
          const canDiff = objectIsNotSelected;
          diffLayers(geoObject, layerFeature, state, canDiff);
        });
    }
  }
};
