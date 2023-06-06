import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { ToolProps } from "../AbstractTool/types";
import { TRemoveTool } from "./types";
declare class RemoveTool extends AbstractTool implements TRemoveTool {
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => "";
    enable: () => void;
    private removeElement;
}
export default RemoveTool;
