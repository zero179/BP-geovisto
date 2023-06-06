import { DrawnObject, DrawnOptions, GeoFeature, LatLngs, LayerType } from "./../model/types/index";
import { LatLng } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { LooseObject } from "../model/types";
import { AllGeoJSON } from "@turf/turf";
type StyleOptions = DrawnOptions;
/**
 * @author Andrej Tlcina
 */
/**
 * maps feature types to leaflet types
 */
export declare const getLeafletTypeFromFeature: (feature: GeoJSON.Feature) => LayerType | "";
/**
 * converts GeoJSON properties to Leaflet options
 */
export declare const convertPropertiesToOptions: (properties: LooseObject) => StyleOptions;
/**
 * converts Leaflet options to GeoJSON properties
 */
export declare const convertOptionsToProperties: (options: StyleOptions) => LooseObject;
/**
 * returns GeoJSON representation, always array of them
 * used in case of selected layer, which can be 'Multi' object
 */
export declare const getGeoJSONFeatures: (layer: DrawnObject) => Array<GeoJSON.Feature> | null;
/**
 * gets GeoJSON representation from layer structure
 * gets only first one, because 'Multi' object is not expected to be created
 *
 * @param {Layer} layer
 * @returns
 */
export declare const getFirstGeoJSONFeature: (layer: DrawnObject) => GeoJSON.Feature | null;
/**
 * checks if feature is polygon
 */
export declare const isFeaturePoly: (feature: GeoJSON.Feature | GeoJSON.FeatureCollection | null) => boolean;
/**
 * simplifies polygon feature according to pixels
 * AllGeoJSON was used here b/c that's what simplify takes
 */
export declare const simplifyFeature: (feature: turf.AllGeoJSON, pixels?: number) => GeoJSON.Feature;
/**
 * checks if layer structure is polygon
 */
export declare const isLayerPoly: (layer: DrawnObject) => boolean;
export declare const getConversionDepth: (feature: GeoJSON.Feature | null) => 1 | 2;
/**
 * converts GeoJSON feature coords to leaflet coords
 * used only in one place, GeoFeature was selected here b/c features that are appended to exported GeoJSON have this type
 *
 * */
export declare const convertCoords: (feature: GeoFeature) => LatLng | LatLngs | null;
/**
 * helper function for morphing GeoJSON feature to Polygon {Layer} structure
 */
export declare const morphFeatureToPolygon: (feature: GeoJSON.Feature, options?: {}, simplify?: boolean) => DrawnObject;
export {};
