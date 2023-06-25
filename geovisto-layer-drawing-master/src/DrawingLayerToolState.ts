import { Feature } from "@turf/turf";
import {
  LooseObject,
  LayerType,
  DrawnOptions,
  LatLngs,
} from "./model/types/index";
import L, { LatLng } from "leaflet";
import {
  convertCoords,
  convertOptionsToProperties,
  convertPropertiesToOptions,
  getLeafletTypeFromFeature,
  isLayerPoly,
} from "./util/polyHelpers";
import { isEmpty, sortReverseAlpha } from "./util/baseHelpers";
import { NOT_FOUND, iconStarter, normalStyles } from "./util/constants";
import { EditTool, TransformTool } from "./tools";
import { DrawnObject } from "./model/types";
import IDrawingLayerTool from "./model/types/tool/IDrawingLayerTool";
import { LayerToolState } from "geovisto";
import IDrawingLayerToolState, {
  DrawnGroup,
  ExportGeoJSON,
  IndexedVertices,
  MappedMarkersToVertices,
  Source,
} from "./model/types/tool/IDrawingLayerToolState";
import { IDrawingLayerToolConfig } from "./model/types/tool/IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";

export const EMPTY_GEOJSON = {
  type: "FeatureCollection",
  features: [],
};

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolState
  extends LayerToolState
  implements IDrawingLayerToolState {
  public featureGroup: DrawnGroup;
  public selecting: boolean;
  public selectedLayer: DrawnObject | null;
  public tool: IDrawingLayerTool;
  public createdVertices: Array<DrawnObject>;
  public mappedMarkersToVertices: MappedMarkersToVertices;
  public extraSelected: Array<DrawnObject>;
  /**
   * It creates a tool state.
   */
  public constructor(tool: IDrawingLayerTool) {
    super(tool);
    // * retyping because I'm accessing private attribute '_layers'
    this.featureGroup = new L.FeatureGroup() as DrawnGroup;
    // * for knowing if we are using select tool
    this.selecting = false;
    // * for knowing if we already selected layer
    this.selectedLayer = null;

    this.tool = tool;

    this.createdVertices = [];
    this.mappedMarkersToVertices = {};

    // * selected for customization
    this.extraSelected = [];
  }

  /**
   * clears extraSelected array and sets normal styles to each geo. object
   */
  public clearExtraSelected = (): void => {
    this.extraSelected.forEach((selected) => {
      this.tool.normalizeElement(selected);
    });
    this.extraSelected = [];
  };

  /**
   * checks if layer is in extraSelected objects
   */
  private isInExtraSelected = (layerId: string): number => {
    const found = this.extraSelected
      .map((el) => el._leaflet_id)
      .indexOf(layerId);
    return found;
  };

  /**
   * checks if selected and passed object are of the same type
   */
  private areSameType = (layer: DrawnObject): boolean => {
    if (!this.selectedLayer) return false;

    if (isLayerPoly(this.selectedLayer)) {
      return isLayerPoly(layer);
    }

    return this.selectedLayer.layerType === layer.layerType;
  };

  /**
   * add passed layer to array and highlights it
   */
  public addExtraSelected = (layer: DrawnObject): void => {
    // * have only one type of object in array
    if (!this.areSameType(layer)) return;

    const idx = this.isInExtraSelected(layer._leaflet_id);
    if (idx > -1) {
      this.tool.normalizeElement(layer);
      this.extraSelected.splice(idx, 1);
    } else {
      this.tool.highlightElement(layer);
      this.extraSelected.push(layer);
    }
  };

  /**
   * checks if markers is connect marker
   */
  public isConnectMarker = (marker: DrawnObject | null): boolean => {
    return (
      marker?.layerType === "marker" &&
      marker?.options?.icon?.options?.connectClick
    );
  };

  /**
   * checks if selected layer is connect marker
   */
  public selectedLayerIsConnectMarker = (): boolean => {
    return this.isConnectMarker(this.selectedLayer);
  };

  /**
   * Pushes vertice into created ones
   */
  public pushVertice = (vertice: DrawnObject): void => {
    this.createdVertices.push(vertice);
  };

  /**
   * removes vertice based on given leaflet id
   *
   * @param {String} lId
   */
  public removeGivenVertice = (lId: string): void => {
    const idsOfVerticesToRemove = new Set([lId]);

    const result = this.removeMappedVertices(idsOfVerticesToRemove);

    const index = this.createdVertices.map((v) => v._leaflet_id).indexOf(lId);
    if (index !== NOT_FOUND) {
      this.createdVertices.splice(index, 1);
    }

    this.mappedMarkersToVertices = result;
  };

  /**
   * removes vertice which ids were passed
   *
   * @param {Set} idsOfVerticesToRemove
   * @returns {Object} mappedMarkersToVertices
   */
  private removeMappedVertices = (
    idsOfVerticesToRemove: Set<string>
  ): MappedMarkersToVertices => {
    // * copy object
    const newMapped = { ...this.mappedMarkersToVertices };

    // *  go through each marker object, containing { [index]: vertice } pairs
    Object.values(newMapped).forEach((vertObj) => {
      // * now go through each index
      Object.keys(vertObj).forEach((key) => {
        const vert = vertObj[key];
        if (idsOfVerticesToRemove.has(vert._leaflet_id)) {
          this.removeLayer(vert);
          delete vertObj[key];
        }
      });
    });

    return newMapped;
  };

  /**
   * takes in leaflet id and removes vertices mapped to marker
   */
  public removeMarkersMappedVertices = (lId: string): void => {
    const markerVertices = this.mappedMarkersToVertices[lId];

    const idsOfVerticesToRemove: Set<string> = new Set();
    // * save vertices' ids
    Object.values(markerVertices)?.forEach((v) =>
      idsOfVerticesToRemove.add(v._leaflet_id)
    );

    // * remove vertices
    const newMapped = this.removeMappedVertices(idsOfVerticesToRemove);

    // * marker no longer has vertices, so remove it
    delete newMapped[lId];

    this.mappedMarkersToVertices = newMapped;
  };

  /**
   * setter
   */
  public setSelecting(is: boolean): void {
    this.selecting = is;
  }

  /**
   * getter
   */
  public getSelecting(): boolean {
    return this.selecting;
  }

  /**
   * add layer to featureGroup and it is displayed
   */
  public addLayer(layer: DrawnObject): DrawnObject {
    this.featureGroup.addLayer(layer);
    this.tool.applyEventListeners(layer);
    return layer;
  }

  /**
   * removes layer from featureGroup and from map
   */
  public removeLayer(layer: DrawnObject): void {
    this.featureGroup.removeLayer(layer);
  }

  /**
   * removes selected layer
   */
  public removeSelectedLayer(): void {
    if (!this.selectedLayer) return;
    TransformTool.disableTransform(this.selectedLayer);
    EditTool.disableNodeEdit(this.selectedLayer);
    this.featureGroup.removeLayer(this.selectedLayer);
    this.selectedLayer = null;
  }

  /**
   * sets selected layer and highlights it
   */
  public setSelectedLayer(layer: DrawnObject): void {
    if (this.selectedLayer) this.tool.normalizeElement(this.selectedLayer);
    this.selectedLayer = layer;
    this.tool.highlightElement(layer);
    this.clearExtraSelected();
  }

  /**
   * removes selected layer
   */
  public clearSelectedLayer(): void {
    this.selectedLayer = null;
  }

  /**
   * sets vertices to marker
   */
  public setVerticesToMarker(lId: string, val: IndexedVertices): void {
    this.mappedMarkersToVertices[lId] = val;
  }

  /**
   * saving topology information to marker
   */
  private addMappedVertices = (layer: DrawnObject, result: Source): void => {
    const lId = layer._leaflet_id;
    const mappedVertices = this.mappedMarkersToVertices[lId];
    const mappedProperty: LooseObject = {};
    Object.keys(mappedVertices).forEach((key) => {
      mappedProperty[key] = mappedVertices[key]._leaflet_id;
    });
    if (!isEmpty<LooseObject>(mappedProperty))
      result.mappedVertices = mappedProperty;
  };

  /**
   * called so when we import topology dragging of vertices works
   */
  private initMappedMarkersToVertices = (
    lType: LayerType | "",
    result: DrawnObject,
    source: Source
  ) => {
    if (lType === "marker" && source.mappedVertices) {
      this.mappedMarkersToVertices[result._leaflet_id] = source.mappedVertices;
    }
    if (lType === "polyline" || lType === "vertice") {
      // * keys are marker leaflet ids
      Object.keys(this.mappedMarkersToVertices).forEach((markerId) => {
        // * values are index of vertice
        const verticesKeyArr = Object.keys(
          this.mappedMarkersToVertices[markerId]
        );
        // * leaflet id of vertice
        const vertLeafId = source.mappedVerticeId;
        const verticesObj = this.mappedMarkersToVertices[markerId];
        verticesKeyArr.forEach((vertKey) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (verticesObj[vertKey] === vertLeafId) {
            const spreadable = this.mappedMarkersToVertices[markerId] || {};
            this.mappedMarkersToVertices[markerId] = {
              ...spreadable,
              [vertKey]: result,
            };
          }
        });
      });
    }
  };

  /**
   * serializes map state to GeoJSON
   */
  public serializeToGeoJSON(): ExportGeoJSON {
    const geo: ExportGeoJSON = EMPTY_GEOJSON;

    this.featureGroup.eachLayer((l) => {
      const layer = l as DrawnObject;
      const feature = layer.toGeoJSON() as Feature;

      const properties = convertOptionsToProperties(layer.options);
      feature.properties = properties;

      if (layer.popupContent)
        feature.properties.popupContent = layer.popupContent;
      if (layer.identifier) feature.id = layer.identifier;

      const iconOptions = layer?.options?.icon?.options;
      if (iconOptions) feature.properties.iconOptions = iconOptions;

      if (this.isConnectMarker(layer)) {
        this.addMappedVertices(layer, feature.properties as Source);
      }
      if (layer.layerType === "vertice")
        feature.properties.mappedVerticeId = layer._leaflet_id;

      (geo.features as Feature[]).push(feature);
    });

    return geo;
  }

  /**
   * deserializes GeoJSON to map state
   *
   * @param {Object} geojson
   * @returns
   */
  public deserializeGeoJSON(geojson: ExportGeoJSON): void {
    const sidebarState = this.tool.getMapForm().getState();
     console.log({ geojson });
     console.log("hello world");
     console.log("prve");
    console.log("simon");
    if (geojson.type === "FeatureCollection" && geojson.features) {
      geojson.features
        .sort((a, b) =>
          sortReverseAlpha(Number(a.geometry.type), Number(b.geometry.type))
        )
        .forEach((f) => {
          const opts = convertPropertiesToOptions(f.properties || {});
          const lType = getLeafletTypeFromFeature(f);
          const latlng = convertCoords(f);

          let result;
          if (lType === "polygon") {
            result = new (L as any).polygon(latlng, opts);
          } else if (lType === "polyline") {
            result = new (L as any).polyline(latlng, opts);
          } else if (lType === "marker") {
            const spreadable = f?.properties?.iconOptions || {};
            if (spreadable.iconUrl)
              sidebarState.appendToIconSrcs(spreadable.iconUrl);
            const options = {
              ...iconStarter,
              iconUrl: sidebarState.getSelectedIcon(),
              ...spreadable,
            };

            const icon = new L.Icon(options);
            result = new (L as any).Marker.Touch(latlng, { icon });
          }
          if (result) {
            result.layerType = lType;

            // result.snapediting = new L.Handler.MarkerSnap(map, result);
            // result.snapediting.enable();
            sidebarState.pushGuideLayer(result);

            if (f?.properties?.popupContent) {
              result.popupContent = f.properties.popupContent;
              result.bindPopup(f.properties.popupContent, {
                closeOnClick: false,
                autoClose: false,
              });
            }
            if (f.id) {
              result.identifier = f.id;
            }
            if (result.dragging) result.dragging.disable();
            this.initMappedMarkersToVertices(
              lType,
              result,
              f.properties as Source
            );
            console.log("Result before adding layer:", result);
            this.addLayer(result);
            console.log("Layer added:", result);
          }
        });
    }

    return;
  }

  /**
   * serializes map state to internal JSON representation
   */
  public serialize(
    defaults: IDrawingLayerToolDefaults | undefined
  ): IDrawingLayerToolConfig {
    const config = super.serialize(defaults);

    const exportSettings: {
      layerType: LayerType;
      options: DrawnOptions;
      latlngs: LatLngs | LatLng;
      popupContent: string;
      [key: string]: any;
    }[] = [];

    const pushPolygon = (
      layer: DrawnObject,
      layerType: LayerType,
      extra = {}
    ) => {
      const { options, _latlngs: latlngs, popupContent = "" } = layer;
      exportSettings.push({
        layerType,
        options:
          options &&
          ({
            ...normalStyles,
            draggable: true,
            transform: true,
          } as any),
        latlngs,
        popupContent,
        ...extra,
      });
    };

    const pushMarker = (layer: DrawnObject, layerType: LayerType) => {
      const { popupContent = "" } = layer;
      const extra = {};
      if (this.isConnectMarker(layer)) {
        this.addMappedVertices(layer, extra as Source);
      }
      exportSettings.push({
        layerType,
        options: {
          ...layer?.options?.icon?.options,
          draggable: true,
          transform: true,
        } as any,
        latlngs: layer._latlng,
        popupContent,
        ...extra,
      });
    };

    this.featureGroup.eachLayer((l) => {
      const layer = l as DrawnObject;
      const { layerType } = layer;
      if (layerType === "marker") {
        pushMarker(layer, layerType);
      } else {
        if (layer._layers) {
          layer._layers.forEach((l) => {
            pushPolygon(l, layerType);
          });
        } else {
          const extra =
            layerType === "vertice"
              ? { mappedVerticeId: layer._leaflet_id }
              : {};
          pushPolygon(layer, layerType, extra);
        }
      }
    });

    config.data = exportSettings;
    return config;
  }

  /**
   * deserializes internal JSON representation to map state
   */
  public deserialize(config: IDrawingLayerToolConfig): void {
    super.deserialize(config);

    const sidebarState = this.tool.getMapForm().getState();

    const { data = [] } = config;

    (data as DrawnObject[]).forEach((layer) => {
      let layerToAdd;
      // decide what type they are according to it render what is needed
      if (layer.layerType === "marker") {
        const { latlngs } = layer;
        const latlng = L.latLng(
          (latlngs as LatLng).lat,
          (latlngs as LatLng).lng
        );
        if (layer?.options?.iconUrl)
          sidebarState.appendToIconSrcs(layer.options.iconUrl as string);

        const iconAnchor = layer.options.iconAnchor
          ? {
              iconAnchor: new L.Point(
                layer.options.iconAnchor.x,
                layer.options.iconAnchor.y
              ),
            }
          : {};
        const iconSize = layer.options.iconSize
          ? {
              iconSize: new L.Point(
                layer.options.iconSize.x,
                layer.options.iconSize.y
              ),
            }
          : {};
        const options = {
          ...layer.options,
          ...iconAnchor,
          ...iconSize,
        };
        const MyCustomMarker = L.Icon.extend({
          options,
        });

        const icon = new MyCustomMarker();
        icon.options = options;
        const marker = new (L as any).Marker.Touch(latlng, { icon });

        layerToAdd = marker;
      } else {
        let _latlng;
        let poly;
        if (layer.layerType === "polyline" || layer.layerType === "vertice") {
          _latlng = (layer.latlngs as [LatLngs])[0].map((l: LatLng) =>
            L.latLng(l.lat, l.lng)
          );
          poly = new (L as any).polyline(_latlng, layer.options);
        }
        if (layer.layerType === "polygon" || layer.layerType === "painted") {
          _latlng = (layer.latlngs as [LatLngs])[0].map((l: LatLng) =>
            L.latLng(l.lat, l.lng)
          );
          poly = new (L as any).polygon(_latlng, layer.options);
        }

        layerToAdd = poly;
      }

      if (layer.popupContent) {
        layerToAdd.bindPopup(layer.popupContent, {
          closeOnClick: false,
          autoClose: false,
        });
        layerToAdd.popupContent = layer.popupContent;
      }

      sidebarState.pushGuideLayer(layer);

      layerToAdd.layerType = layer.layerType;
      if (layerToAdd.dragging) layerToAdd.dragging.disable();
      this.initMappedMarkersToVertices(layer.layerType, layerToAdd, layer);
      this.addLayer(layerToAdd);
    });
  }
}
export default DrawingLayerToolState;
