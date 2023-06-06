import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { LayerType } from "../../model/types";
import { ToolProps } from "../AbstractTool/types";
import { TLineTool } from "./types";
declare class LineTool extends AbstractTool implements TLineTool {
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType;
    canBeCanceled: () => boolean;
    private _polylineCreate;
    enable: () => void;
}
export default LineTool;
