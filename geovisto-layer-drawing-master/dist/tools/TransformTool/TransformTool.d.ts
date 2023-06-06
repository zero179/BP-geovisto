import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { TTransformTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject } from "../../model/types";
declare class TransformTool extends AbstractTool implements TTransformTool {
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => "";
    enable: () => void;
    static initTransform(drawObject: DrawnObject | null, disable?: boolean): void;
    static disableTransform: (selectedEl: DrawnObject | null) => void;
}
export default TransformTool;
