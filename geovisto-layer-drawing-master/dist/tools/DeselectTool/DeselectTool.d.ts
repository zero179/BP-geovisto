import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { DrawnObject } from "../../model/types";
import { TDeselectTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import IDrawingLayerTool from "../../model/types/tool/IDrawingLayerTool";
declare class DeselectTool extends AbstractTool implements TDeselectTool {
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => "";
    enable: () => void;
    static deselect(selected: DrawnObject | null, tool: IDrawingLayerTool): void;
}
export default DeselectTool;
