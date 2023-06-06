import { FeatureGroup, LatLng } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { DrawnObject, LayerType, LooseObject } from "../../model/types";
import { AreasData, TSearchTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
declare class SearchTool extends AbstractTool implements TSearchTool {
    static result: string;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType;
    enable: () => void;
    /**
     * append marker on map with given latlng
     */
    static putMarkerOnMap: (featureGroup: FeatureGroup, latlng: LatLng, popup: string, iconUrl: string, connectClick?: boolean) => DrawnObject;
    /**
     * sends request to OSM with given query
     */
    static geoSearch: (featureGroup: FeatureGroup, query?: string) => Promise<LooseObject[] | undefined>;
    static fetchAreas: (countryCode: string, adminLevel: number, highQuality: boolean, color: string) => Promise<AreasData>;
}
export default SearchTool;
