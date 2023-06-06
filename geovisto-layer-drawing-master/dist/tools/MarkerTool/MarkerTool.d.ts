import { DrawnObject, LayerType, LooseObject } from "./../../model/types/index";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { ToolProps } from "../AbstractTool/types";
import { TMarkerTool } from "./types";
declare module "leaflet" {
    namespace Draw {
        class ExtendedMarker extends Marker {
            constructor(map: Map, params: MarkerOptions);
            setIconOptions(opts: LooseObject): void;
            _marker: DrawnObject;
        }
    }
}
declare class MarkerTool extends AbstractTool implements TMarkerTool {
    static result: string;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType | "";
    canBeCanceled: () => boolean;
    _markerCreate: (connectClick?: boolean) => void;
    enable: () => void;
}
export default MarkerTool;
