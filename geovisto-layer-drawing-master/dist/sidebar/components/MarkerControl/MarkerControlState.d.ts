import { TMarkerControlState } from "./types";
import { DrawnObject } from "./../../../model/types/index";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
declare class MarkerControlState extends AbstractControlState implements TMarkerControlState {
    iconSrcs: Set<string>;
    selectedIcon: string;
    constructor(props: ControlStateProps);
    /**
     * getter
     */
    getSelectedIcon(): string;
    /**
     * setter
     */
    setSelectedIcon(icon: string): void;
    /**
     * sets new marker icon options (iconUrl, anchor...) to selected object and to extra selected ones
     */
    changeIconOpts: (iconOpt?: {}) => DrawnObject | null;
    /**
     * sets new icon to marker
     *
     * @param {String} icon
     */
    changeIconAction: (icon: string) => void;
    /**
     * sets new anchor to marker
     */
    changeIconAnchor: (e: Event, coordinate: "x" | "y") => void;
    /**
     * runs on 'Enter' whenever user adds new icon to list of icons
     */
    addIconAction: (e: InputEvent) => void;
    /**
     * append to icon Set
     */
    appendToIconSrcs(iconUrl: string): void;
}
export default MarkerControlState;
