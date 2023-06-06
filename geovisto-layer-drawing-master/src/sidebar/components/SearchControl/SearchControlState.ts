import { TSearchControlState } from "./types";
import { LooseObject, DrawnObject } from "./../../../model/types/index";
import { ControlStateProps } from "./../AbstractControl/types";
import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { SearchTool, TopologyTool } from "../../../tools";
import { ADMIN_LEVELS, ICON_SRCS } from "../../../util/constants";
import AbstractControlState from "../AbstractControl/AbstractControlState";

class SearchControlState
  extends AbstractControlState
  implements TSearchControlState {
  public countries: Array<{
    name: string;
    "alpha-2": string;
    "country-code": string;
  }>;
  public countryCode: string;
  public adminLevel: number;
  public searchOpts: LooseObject[];
  public highQuality: boolean;
  public connectActivated: boolean;

  public constructor(props: ControlStateProps) {
    super(props);

    // this.countries = require("/static/geo/iso3166_countries.json");
    this.countries = [];
    this.countryCode = "";

    this.adminLevel = ADMIN_LEVELS[1].value;
    this.searchOpts = [];

    this.highQuality = false;
    this.connectActivated = false;
  }

  /**
   * takes countries from static file and maps through them
   */
  public getSelectCountries(): { value: string; label: string }[] {
    const result = this.countries.map((c) => ({
      value: c["alpha-2"],
      label: c["name"],
    }));
    return [{ value: "", label: "" }, ...result];
  }

  /**
   * sets whether displayed polygon will be of high quality
   */
  public setHighQuality(val: boolean): void {
    this.highQuality = val;
  }

  /**
   * sets whether we are creating topology with search
   */
  public setConnectActivated(val: boolean): void {
    this.connectActivated = val;
  }

  /**
   * sets for what area we are searching for
   */
  public searchForAreaAction = (e: InputEvent): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.countryCode = val;
  };

  /**
   * sets for what administration level we are searching for
   */
  public pickAdminLevelAction = (e: InputEvent): void => {
    const val = (e.target as HTMLSelectElement).value;
    this.adminLevel = Number(val);
  };

  /**
   * sets new options for place search
   */
  public searchAction = async (e: InputEvent): Promise<void> => {
    const value = (e.target as HTMLInputElement).value;
    const featureGroup = this.tool.getState().featureGroup;

    const opts = await SearchTool.geoSearch(featureGroup, value);

    this.searchOpts = opts || [];
    this.control.inputSearch.changeOptions(
      opts ? opts.map((opt) => opt.label || "") : []
    );
  };

  /**
   * called when user picks a place from displayed options
   */
  public onInputOptClick = (value: string): void => {
    const featureGroup = this.tabControl.getTool().getState().featureGroup;
    const { searchOpts: opts, connectActivated } = this;

    const found = opts.find((opt) => opt.label === value);

    const latlng = L.latLng(0, 0);
    latlng.lat = found?.y || 0;
    latlng.lng = found?.x || 0;
    const iconUrl = found?.raw?.icon || ICON_SRCS[0];
    const marker = SearchTool.putMarkerOnMap(
      featureGroup,
      latlng,
      found?.label,
      iconUrl,
      connectActivated
    );
    this.tool.applyEventListeners(marker);
    this.tabControl.getState().setSelectedIcon(iconUrl);
    this.tabControl.getState().appendToIconSrcs(iconUrl);
    if (connectActivated) {
      this.tool.drawingTools[TopologyTool.NAME()].plotTopology();
    }
    this._redrawSidebar("search");
  };

  /**
   * builds query from inputed values and send it to Overpass API
   *
   * @returns
   */
  public fetchAreas = async (): Promise<void> => {
    const { countryCode, adminLevel, highQuality } = this;

    if (!countryCode || !adminLevel) return;

    (document.querySelector(
      ".leaflet-container"
    ) as HTMLDivElement).style.cursor = "wait";
    this.control.searchForAreasBtn.setAttribute("disabled", true);

    const color = this.tabControl.getState().getSelectedColor();
    const { data, error } = await SearchTool.fetchAreas(
      countryCode,
      adminLevel,
      highQuality,
      color
    );

    if (error) {
      this.control.errorMsg.innerText = error;
    } else {
      this.control.errorMsg.innerText = "";
      const toolState = this.tool.getState();
      // * remove previous object of fetched country
      toolState.featureGroup.eachLayer((layer) => {
        const drawnLayer = layer as DrawnObject;
        if (drawnLayer.countryCode === countryCode)
          toolState.removeLayer(drawnLayer);
      });
      data.forEach((country) => toolState.addLayer(country));
    }

    (document.querySelector(
      ".leaflet-container"
    ) as HTMLDivElement).style.cursor = "";
    this.control.searchForAreasBtn.removeAttribute("disabled");
  };
}

export default SearchControlState;
