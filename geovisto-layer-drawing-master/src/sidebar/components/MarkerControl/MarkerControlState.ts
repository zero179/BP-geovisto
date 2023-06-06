import { TMarkerControlState } from "./types";
import { DrawnObject } from "./../../../model/types/index";
import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { FIRST, iconStarter, ICON_SRCS } from "../../../util/constants";
import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";

class MarkerControlState
  extends AbstractControlState
  implements TMarkerControlState {
  public iconSrcs: Set<string>;
  public selectedIcon: string;

  public constructor(props: ControlStateProps) {
    super(props);

    this.iconSrcs = new Set(ICON_SRCS);
    this.selectedIcon = ICON_SRCS[FIRST];
  }

  /**
   * getter
   */
  public getSelectedIcon(): string {
    return this.selectedIcon;
  }

  /**
   * setter
   */
  public setSelectedIcon(icon: string): void {
    this.selectedIcon = icon;
  }

  /**
   * sets new marker icon options (iconUrl, anchor...) to selected object and to extra selected ones
   */
  public changeIconOpts = (iconOpt = {}): DrawnObject | null => {
    const { enabledTool } = this.tabControl.getState();
    const activeTool = enabledTool?.activetool;

    let selectedEl = this._getSelected();
    let marker = selectedEl;

    if (activeTool?.type === "marker") {
      selectedEl = activeTool;
      marker = activeTool._marker;
    }

    const oldIconOptions = selectedEl?.options?.icon?.options || {};
    const newIconOptions = {
      ...oldIconOptions,
      ...iconOpt,
    };

    const markerIcon = new L.Icon(newIconOptions);
    if (marker) marker.setIcon(markerIcon);
    if (marker) this.tool.highlightElement(marker);
    this._getExtraSelected().forEach((layer) => {
      layer?.setIcon(markerIcon);
      this.tool.highlightElement(layer);
    });
    if (activeTool?.type === "marker") activeTool.setIconOptions(markerIcon);

    return marker;
  };

  /**
   * sets new icon to marker
   *
   * @param {String} icon
   */
  public changeIconAction = (icon: string): void => {
    this.changeIconOpts({ iconUrl: icon });

    this.selectedIcon = icon;
    this._redrawSidebar("marker");
  };

  /**
   * sets new anchor to marker
   */
  public changeIconAnchor = (e: Event, coordinate: "x" | "y"): void => {
    const selectedEl =
      this.tabControl.getState().enabledTool?.activetool || this._getSelected();
    const iconOptions = selectedEl?.options?.icon?.options || {};
    const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
    const val = Number((e.target as HTMLInputElement).value);
    iconAnchor[coordinate] = val;
    this.changeIconOpts({ iconAnchor });
  };

  /**
   * runs on 'Enter' whenever user adds new icon to list of icons
   */
  public addIconAction = (e: InputEvent): void => {
    const iconUrl = (e.target as HTMLInputElement).value;
    this.appendToIconSrcs(iconUrl);
    this._redrawSidebar("marker");
  };

  /**
   * append to icon Set
   */
  public appendToIconSrcs(iconUrl: string): void {
    this.iconSrcs.add(iconUrl);
  }
}

export default MarkerControlState;
