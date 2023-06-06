import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { MarkerTool } from "../MarkerTool";
import { CreatedEvent, DrawnObject, LayerType, Optional } from "../../model/types";
import { TTopologyTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import IDrawingLayerToolState from "../../model/types/tool/IDrawingLayerToolState";
declare class TopologyTool extends MarkerTool implements TTopologyTool {
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType | "";
    canBeCanceled: () => boolean;
    created: (e: CreatedEvent) => void;
    isConnectMarker: (layer: DrawnObject) => boolean;
    enable: () => void;
    plotTopology(chosen?: Optional<DrawnObject[]>, createdMarker?: Optional<DrawnObject>): void;
    /**
     * @brief loops through each of the vertices and checks if
     *        vertice with certain coordinates is already created
     */
    private _haveSameVertice;
    /**
     * @brief maps through each of the markes and if its coordinates fit vertice's coordinates
     *        then vertice is mapped onto marker id
     */
    private _mapMarkersToVertices;
    /**
     * @brief event listener so vetice is dragged with marker
     */
    static applyTopologyMarkerListeners(layer: DrawnObject, state: IDrawingLayerToolState): void;
    /**
     * @brief called on drag to change vertice's point location
     */
    private static changeVerticesLocation;
}
export default TopologyTool;
