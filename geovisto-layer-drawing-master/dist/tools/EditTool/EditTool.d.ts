import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { TEditTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject } from "../../model/types";
declare class EditTool extends AbstractTool implements TEditTool {
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => "";
    enable: () => void;
    static initNodeEdit(selectedLayer: DrawnObject | null, disable?: boolean): void;
    static disableNodeEdit: (selectedEl: DrawnObject | null) => void;
}
export default EditTool;
