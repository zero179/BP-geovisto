import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import "../../components/useKnife";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject, LayerType } from "../../model/types";
import { TGeometricSliceTool } from "./types";
declare class GeometricSliceTool extends AbstractTool implements TGeometricSliceTool {
    static result: LayerType | "";
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    canBeCanceled: () => boolean;
    private created;
    /**
     * @brief - inspired by https://gis.stackexchange.com/questions/344068/splitting-a-polygon-by-multiple-linestrings-leaflet-and-turf-js
     *        - slices selected object with currently created one
     */
    polySlice(layer: DrawnObject): void;
    private _dividePoly;
    enable: () => void;
    disable: () => void;
}
export default GeometricSliceTool;
