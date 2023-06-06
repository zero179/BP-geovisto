/**
 * @author Andrej Tlcina
 */
import L from "leaflet";
export declare const NOT_FOUND = -1;
export declare const FIRST = 0;
export declare const SPACE_BAR = 32;
export declare const highlightStyles: {
    fillOpacity: number;
    opacity: number;
};
export declare const normalStyles: {
    fillOpacity: number;
    opacity: number;
};
/**
 * icon options default
 */
export declare const iconStarter: {
    shadowUrl: undefined;
    iconAnchor: L.Point;
    iconSize: L.Point;
};
export declare const ICON_SRCS: string[];
export declare const COLORS: string[];
export type SelectOpt = {
    label: string;
    value: number;
    selected?: boolean;
};
export type SelectOpts = Array<SelectOpt>;
export declare const STROKES: SelectOpts;
export declare const ADMIN_LEVELS: SelectOpts;
