import { LeafletEvent } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { PaintTool } from "../PaintTool";
import { ToolProps } from "../AbstractTool/types";
import { LayerType } from "../../model/types";
import { TEraseTool } from "./types";
declare class EraseTool extends PaintTool implements TEraseTool {
    static result: LayerType;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType;
    canBeCanceled: () => boolean;
    private created;
    enable: () => void;
    /**
     * creates circle around mouse cursor and applies event listeners
     */
    private startErase;
    /**
     * button for erasing is clicked
     */
    erase: (event: LeafletEvent) => void;
}
export default EraseTool;
