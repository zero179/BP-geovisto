import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { TopologyTool } from "../TopologyTool";
import { TJoinTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject } from "../../model/types";
declare class JoinTool extends TopologyTool implements TJoinTool {
    private chosenLayers;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => "";
    canBeCanceled: () => boolean;
    enable: () => void;
    disable: () => void;
    /**
     * checks if geo. object may be push to an array and be joined later on
     */
    private canPushToChosen;
    private chosenLayersArePolys;
    /**
     * checks if layers, to be joined, are markers
     */
    private chosenLayersAreMarkers;
    /**
     * checks if maximum size of an array is reached
     */
    private chosenLayersMaxed;
    /**
     * pushes passed object into array, if length exceeds maximum array is shifted
     * so the lenght is constant
     */
    private pushChosenLayer;
    /**
     * deselects all selected ones
     */
    deselectChosenLayers: () => void;
    /**
     * removes all selected ones
     */
    clearChosenLayers: () => void;
    /**
     * layers are joined which means remove previous ones and append joined
     */
    private pushJoinedToChosenLayers;
    /**
     * @brief unifies all the features in array
     */
    private _getSummedFeature;
    joinChosen: (drawObject: DrawnObject) => void;
}
export default JoinTool;
