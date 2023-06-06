import { LayerType } from "../../model/types";
import { AbstractTool } from "../AbstractTool";
import { ToolProps } from "../AbstractTool/types";
import { TGeoJSONTool } from "./types";
declare class GeoJSONTool extends AbstractTool implements TGeoJSONTool {
    static result: string;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType;
    enable: () => void;
}
export default GeoJSONTool;
