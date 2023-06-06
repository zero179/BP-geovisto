import { Geometry } from "@turf/turf";
import { Feature } from "@turf/turf";
import { AllGeoJSON } from "@turf/turf";
import { normalStyles } from "./../../util/constants";
import { simplifyFeature } from "./../../util/polyHelpers";
import osmtogeojson from "osmtogeojson";
import L, { FeatureGroup, LatLng } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { OpenStreetMapProvider } from "leaflet-geosearch";

import { AbstractTool } from "../AbstractTool";
import { iconStarter, ICON_SRCS } from "../../util/constants";
import { DrawnObject, LayerType, LooseObject } from "../../model/types";
import { AreasData, TSearchTool } from "./types";
import { ToolProps } from "../AbstractTool/types";

class SearchTool extends AbstractTool implements TSearchTool {
  public static result = "search";

  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "search-drawing-tool";
  }

  public getName(): string {
    return SearchTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-search";
  }

  public getTitle(): string {
    return "Search drawing tool";
  }

  public result = (): LayerType => {
    return "search";
  };

  public enable = (): void => {
    this._redrawSidebar(this.result());
  };

  /**
   * append marker on map with given latlng
   */
  public static putMarkerOnMap = (
    featureGroup: FeatureGroup,
    latlng: LatLng,
    popup: string,
    iconUrl: string,
    connectClick = false
  ): DrawnObject => {
    const additionalOpts = { iconUrl: iconUrl || ICON_SRCS[0], connectClick };
    const icon = new L.Icon({
      ...iconStarter,
      ...additionalOpts,
    });

    const marker = new (L.Marker as any).Touch(latlng, { icon });
    if (popup) {
      marker.bindPopup(popup, { closeOnClick: false, autoClose: false });
      marker.popupContent = popup;
    }

    marker.layerType = "marker";
    featureGroup.addLayer(marker);
    // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
    return marker;
  };

  /**
   * sends request to OSM with given query
   */
  public static geoSearch = async (
    featureGroup: FeatureGroup,
    query = ""
  ): Promise<LooseObject[] | undefined> => {
    if (!query) return;

    // setup
    const provider = new OpenStreetMapProvider();

    // search
    const results = await provider.search({ query });

    return results;
  };

  public static fetchAreas = async (
    countryCode: string,
    adminLevel: number,
    highQuality: boolean,
    color: string
  ): Promise<AreasData> => {
    const result: AreasData = { data: [], error: "" };

    const endPoint = "https://overpass-api.de/api/interpreter?data=[out:json];";
    const query = `area["ISO3166-1"="${countryCode}"]->.searchArea;(relation["admin_level"="${adminLevel}"](area.searchArea););out;>;out skel qt;`;

    try {
      const response = await fetch(endPoint + query);

      const data = await response.json();

      const gJSON = osmtogeojson(data);

      const opts = {
        color,
        draggable: true,
        transform: true,
      };

      gJSON?.features
        ?.filter((feat) => feat?.geometry?.type === "Polygon")
        ?.forEach((feat) => {
          let coords = (feat.geometry as Geometry).coordinates;
          if (!highQuality) {
            const simplified = simplifyFeature(feat as AllGeoJSON, 0.01);
            coords = ((simplified as Feature).geometry as Geometry).coordinates;
          }
          const latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
          const drawnCountry: DrawnObject = new (L as any).polygon(latlngs, {
            ...opts,
            ...normalStyles,
          });
          drawnCountry?.dragging?.disable();
          drawnCountry.layerType = "polygon";
          drawnCountry.countryCode = countryCode;

          result.data.push(drawnCountry);
        });
      result.error = "";
    } catch (err) {
      result.error = "There was a problem, re-try later.";
      console.error(err);
    }

    return result;
  };
}

export default SearchTool;
