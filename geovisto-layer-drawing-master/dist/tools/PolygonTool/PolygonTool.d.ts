import { ToolProps } from "./../AbstractTool/types";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { TPolygonTool } from "./types";
import { LayerType } from "../../model/types";
declare class PolygonTool extends AbstractTool implements TPolygonTool {
    static result: LayerType | "";
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType;
    canBeCanceled: () => boolean;
    private _polygonCreate;
    enable: () => void;
}
export default PolygonTool;
