import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import "leaflet-pather";
import { GeometricSliceTool } from "../GeometricSliceTool";
import { ToolProps } from "../AbstractTool/types";
import { TFreehandSliceTool } from "./types";
import { LayerType } from "../../model/types";
declare class FreehandSliceTool extends GeometricSliceTool implements TFreehandSliceTool {
    static result: LayerType | "";
    private pather;
    private patherActive;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    canBeCanceled: () => boolean;
    private _enableSlicing;
    /**
     * @brief slices selected polygon with pather's freehand line
     */
    private createdPath;
    enable: () => void;
    disable: () => void;
}
export default FreehandSliceTool;
