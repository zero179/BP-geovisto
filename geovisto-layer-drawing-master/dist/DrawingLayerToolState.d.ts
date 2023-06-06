import { DrawnObject } from "./model/types";
import IDrawingLayerTool from "./model/types/tool/IDrawingLayerTool";
import { LayerToolState } from "geovisto";
import IDrawingLayerToolState, { DrawnGroup, ExportGeoJSON, IndexedVertices, MappedMarkersToVertices } from "./model/types/tool/IDrawingLayerToolState";
import { IDrawingLayerToolConfig } from "./model/types/tool/IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";
export declare const EMPTY_GEOJSON: {
    type: string;
    features: never[];
};
/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
declare class DrawingLayerToolState extends LayerToolState implements IDrawingLayerToolState {
    featureGroup: DrawnGroup;
    selecting: boolean;
    selectedLayer: DrawnObject | null;
    tool: IDrawingLayerTool;
    createdVertices: Array<DrawnObject>;
    mappedMarkersToVertices: MappedMarkersToVertices;
    extraSelected: Array<DrawnObject>;
    /**
     * It creates a tool state.
     */
    constructor(tool: IDrawingLayerTool);
    /**
     * clears extraSelected array and sets normal styles to each geo. object
     */
    clearExtraSelected: () => void;
    /**
     * checks if layer is in extraSelected objects
     */
    private isInExtraSelected;
    /**
     * checks if selected and passed object are of the same type
     */
    private areSameType;
    /**
     * add passed layer to array and highlights it
     */
    addExtraSelected: (layer: DrawnObject) => void;
    /**
     * checks if markers is connect marker
     */
    isConnectMarker: (marker: DrawnObject | null) => boolean;
    /**
     * checks if selected layer is connect marker
     */
    selectedLayerIsConnectMarker: () => boolean;
    /**
     * Pushes vertice into created ones
     */
    pushVertice: (vertice: DrawnObject) => void;
    /**
     * removes vertice based on given leaflet id
     *
     * @param {String} lId
     */
    removeGivenVertice: (lId: string) => void;
    /**
     * removes vertice which ids were passed
     *
     * @param {Set} idsOfVerticesToRemove
     * @returns {Object} mappedMarkersToVertices
     */
    private removeMappedVertices;
    /**
     * takes in leaflet id and removes vertices mapped to marker
     */
    removeMarkersMappedVertices: (lId: string) => void;
    /**
     * setter
     */
    setSelecting(is: boolean): void;
    /**
     * getter
     */
    getSelecting(): boolean;
    /**
     * add layer to featureGroup and it is displayed
     */
    addLayer(layer: DrawnObject): DrawnObject;
    /**
     * removes layer from featureGroup and from map
     */
    removeLayer(layer: DrawnObject): void;
    /**
     * removes selected layer
     */
    removeSelectedLayer(): void;
    /**
     * sets selected layer and highlights it
     */
    setSelectedLayer(layer: DrawnObject): void;
    /**
     * removes selected layer
     */
    clearSelectedLayer(): void;
    /**
     * sets vertices to marker
     */
    setVerticesToMarker(lId: string, val: IndexedVertices): void;
    /**
     * saving topology information to marker
     */
    private addMappedVertices;
    /**
     * called so when we import topology dragging of vertices works
     */
    private initMappedMarkersToVertices;
    /**
     * serializes map state to GeoJSON
     */
    serializeToGeoJSON(): ExportGeoJSON;
    /**
     * deserializes GeoJSON to map state
     *
     * @param {Object} geojson
     * @returns
     */
    deserializeGeoJSON(geojson: ExportGeoJSON): void;
    /**
     * serializes map state to internal JSON representation
     */
    serialize(defaults: IDrawingLayerToolDefaults | undefined): IDrawingLayerToolConfig;
    /**
     * deserializes internal JSON representation to map state
     */
    deserialize(config: IDrawingLayerToolConfig): void;
}
export default DrawingLayerToolState;
