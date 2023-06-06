import {
  Feature,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "@turf/turf";
import { DrawEvents, Icon, LatLng, Layer } from "leaflet";
import { TAbstractTool } from "../../tools/AbstractTool/types";
import { TDeselectTool } from "../../tools/DeselectTool/types";
import { TEditTool } from "../../tools/EditTool/types";
import { TEraseTool } from "../../tools/EraseTool/types";
import { TFreehandSliceTool } from "../../tools/FreehandSliceTool/types";
import { TGeometricSliceTool } from "../../tools/GeometricSliceTool/types";
import { TJoinTool } from "../../tools/JoinTool/types";
import { TLineTool } from "../../tools/LineTool/types";
import { TMarkerTool } from "../../tools/MarkerTool/types";
import { TPaintTool } from "../../tools/PaintTool/types";
import { TPolygonTool } from "../../tools/PolygonTool/types";
import { TRemoveTool } from "../../tools/RemoveTool/types";
import { TSearchTool } from "../../tools/SearchTool/types";
import { LeafletDrag, TTopologyTool } from "../../tools/TopologyTool/types";
import { TTransformTool } from "../../tools/TransformTool/types";
import { IndexedVertices } from "./tool/IDrawingLayerToolState";

export type LatLngs = LatLng[];

export type LayerType =
  | "marker"
  | "polyline"
  | "polygon"
  | "painted"
  | "vertice"
  | "erased"
  | "knife"
  | "search"
  | "geojson";

export interface LooseObject {
  [key: string]: any;
}

export type DrawnOptions = { [key: string]: string | number | boolean } & {
  icon?: { options: LooseObject };
} & {
  iconAnchor?: { x: number; y: number };
  iconSize?: { x: number; y: number };
};

export type DrawnObject = Layer & {
  layerType: LayerType;
  options: DrawnOptions;
  identifier: string;
  dragging?: { _enabled: boolean; disable: () => void; enable: () => void };
  editing?: { _enabled: boolean; disable: () => void; enable: () => void };
  transform?: {
    _enabled: boolean;
    disable: () => void;
    enable: (opt: { rotation: boolean; scaling: boolean }) => void;
  };
  setStyle: (val: { [key: string]: string | number } | string) => void;
  popupContent?: string;
  _latlngs: LatLngs;
  latlngs: LatLng | [LatLngs]; //* if LayerType is 'marker' then LatLng otherwise LatLngs
  _latlng: LatLng;
  _leaflet_id: string;
  toGeoJSON: () => GeoJSON.Feature | GeoJSON.FeatureCollection;
  on(type: "drag", fn: (e: LeafletDrag) => void): void;
  setIcon: (icon: Icon<LooseObject>) => void;
  countryCode?: string;
  mappedVertices: IndexedVertices;
  mappedVerticeId: string;
  _icon: HTMLElement;
  getLatLngs(): LatLngs;
  setLatLngs(l: LatLngs): void;
  _layers: DrawnObject[];
};

export type CreatedEvent = DrawEvents.Created & {
  layer: DrawnObject;
  layerType: LayerType;
};

export type TurfPolygon =
  | Feature<Polygon | MultiPolygon>
  | Polygon
  | MultiPolygon;

export type GeoFeature = Feature<
  Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
>;

export type Optional<T> = T | null;

export type Tool =
  | TAbstractTool
  | TDeselectTool
  | TEditTool
  | TEraseTool
  | TFreehandSliceTool
  | TGeometricSliceTool
  | TJoinTool
  | TLineTool
  | TMarkerTool
  | TPaintTool
  | TPolygonTool
  | TRemoveTool
  | TSearchTool
  | TTopologyTool
  | TTransformTool;
