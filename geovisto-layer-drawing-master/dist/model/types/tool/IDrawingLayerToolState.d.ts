import { FeatureGroup } from "leaflet";
import { DrawnObject, GeoFeature } from "..";
import { ILayerToolState } from "geovisto";
import IDrawingLayerTool from "./IDrawingLayerTool";
import { IDrawingLayerToolConfig, IDrawingLayerToolDimensionsConfig } from "./IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./IDrawingLayerToolDefaults";
import IDrawingLayerToolDimensions from "./IDrawingLayerToolDimensions";
import IDrawingLayerToolProps from "./IDrawingLayerToolProps";
export type IndexedVertices = {
    [idx: string]: DrawnObject;
};
export type MappedMarkersToVertices = {
    [vertKey: string]: IndexedVertices;
};
export type Source = {
    mappedVertices: IndexedVertices;
    mappedVerticeId: string;
};
export type ExportGeoJSON = {
    type: string;
    features: GeoFeature[];
};
export type DrawnGroup = FeatureGroup & {
    _layers: DrawnObject[];
};
/**
 * This interface declares functions for using the state of the layer tool.
 *
 * @author Jiri Hynek
 */
interface IDrawingLayerToolState<TProps extends IDrawingLayerToolProps = IDrawingLayerToolProps, TDefaults extends IDrawingLayerToolDefaults = IDrawingLayerToolDefaults, TConfig extends IDrawingLayerToolConfig = IDrawingLayerToolConfig, TDimensionsConfig extends IDrawingLayerToolDimensionsConfig = IDrawingLayerToolDimensionsConfig, TDimensions extends IDrawingLayerToolDimensions = IDrawingLayerToolDimensions> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {
    featureGroup: DrawnGroup;
    selecting: boolean;
    selectedLayer: DrawnObject | null;
    tool: IDrawingLayerTool;
    createdVertices: Array<DrawnObject>;
    mappedMarkersToVertices: MappedMarkersToVertices;
    extraSelected: Array<DrawnObject>;
    clearExtraSelected(): void;
    addExtraSelected(layer: DrawnObject): void;
    isConnectMarker(marker: DrawnObject | null): boolean;
    selectedLayerIsConnectMarker(): boolean;
    pushVertice(vertice: DrawnObject): void;
    removeGivenVertice(lId: string): void;
    removeMarkersMappedVertices(lId: string): void;
    setSelecting(is: boolean): void;
    getSelecting(): boolean;
    addLayer(layer: DrawnObject): DrawnObject;
    removeLayer(layer: DrawnObject): void;
    removeSelectedLayer(): void;
    setSelectedLayer(layer: DrawnObject): void;
    clearSelectedLayer(): void;
    setVerticesToMarker(lId: string, val: IndexedVertices): void;
    serializeToGeoJSON(): ExportGeoJSON;
    deserializeGeoJSON(geojson: ExportGeoJSON): void;
}
export default IDrawingLayerToolState;
