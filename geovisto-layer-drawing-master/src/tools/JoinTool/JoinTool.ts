import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import {
  getGeoJSONFeatures,
  isFeaturePoly,
  isLayerPoly,
  morphFeatureToPolygon,
} from "../../util/polyHelpers";
import union from "@turf/union";
import { isEmpty } from "../../util/baseHelpers";
import { FIRST } from "../../util/constants";
import { TopologyTool } from "../TopologyTool";
import { TJoinTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject, Optional, TurfPolygon } from "../../model/types";

const MAX_CHOSEN = 2;

class JoinTool extends TopologyTool implements TJoinTool {
  private chosenLayers: DrawnObject[];

  public constructor(props: ToolProps) {
    super(props);

    // * selected for join
    this.chosenLayers = [];
  }

  public static NAME(): string {
    return "join-drawing-tool";
  }

  public getName(): string {
    return JoinTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-plus-circle";
  }

  public getTitle(): string {
    return "Join drawing tool";
  }

  public result = (): "" => {
    return "";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  public enable = (): void => {
    this._redrawSidebar(this.result());
    this._isActive = true;
    const toolState = this.drawingTool.getState();
    toolState.setSelecting(true);
    (document.querySelector(".leaflet-container") as HTMLElement).style.cursor =
      "crosshair";
  };

  public disable = (): void => {
    this._redrawSidebar(this.result());
    this._isActive = false;
    const toolState = this.drawingTool.getState();
    toolState.setSelecting(false);
    (document.querySelector(".leaflet-container") as HTMLElement).style.cursor =
      "";
    this.deselectChosenLayers();
  };

  /**
   * checks if geo. object may be push to an array and be joined later on
   */
  private canPushToChosen = (layer: DrawnObject): boolean => {
    const acceptableType = this.isConnectMarker(layer) || isLayerPoly(layer);
    if (isEmpty<DrawnObject[]>(this.chosenLayers)) {
      if (acceptableType) return true;
    } else {
      const firstChosen = this.chosenLayers[FIRST];
      if (this.isConnectMarker(firstChosen) && this.isConnectMarker(layer))
        return true;
      if (isLayerPoly(firstChosen) && isLayerPoly(layer)) return true;
    }

    return false;
  };

  private chosenLayersArePolys = (): boolean => {
    const firstChosen = this.chosenLayers[FIRST];
    return isLayerPoly(firstChosen);
  };

  /**
   * checks if layers, to be joined, are markers
   */
  private chosenLayersAreMarkers = (): boolean => {
    const firstChosen = this.chosenLayers[FIRST];
    return this.isConnectMarker(firstChosen);
  };

  /**
   * checks if maximum size of an array is reached
   */
  private chosenLayersMaxed = (): boolean => {
    return this.chosenLayers.length === MAX_CHOSEN;
  };

  /**
   * pushes passed object into array, if length exceeds maximum array is shifted
   * so the lenght is constant
   */
  private pushChosenLayer = (layer: DrawnObject): void => {
    if (this.chosenLayers.length >= MAX_CHOSEN) {
      this.chosenLayers.shift();
    }
    this.drawingTool.highlightElement(layer);
    this.chosenLayers.push(layer);
  };

  /**
   * deselects all selected ones
   */
  public deselectChosenLayers = (): void => {
    this.chosenLayers.forEach((chosen) =>
      this.drawingTool.normalizeElement(chosen)
    );
    this.chosenLayers = [];
  };

  /**
   * removes all selected ones
   */
  public clearChosenLayers = (): void => {
    this.chosenLayers.forEach((chosen) =>
      this.drawingTool.getState().removeLayer(chosen)
    );
    this.chosenLayers = [];
  };

  /**
   * layers are joined which means remove previous ones and append joined
   */
  private pushJoinedToChosenLayers = (joined: DrawnObject): void => {
    this.clearChosenLayers();
    this.drawingTool.highlightElement(joined);
    this.chosenLayers.push(joined);
    this.drawingTool.getState().addLayer(joined);
  };

  /**
   * @brief unifies all the features in array
   */
  private _getSummedFeature = (
    features: Optional<GeoJSON.Feature[]>
  ): Optional<TurfPolygon> => {
    if (!features || !Array.isArray(features)) return null;

    let summedFeature = features[0];
    for (let index = 1; index < features.length; index++) {
      const feature = features[index];
      const isfeaturePoly = isFeaturePoly(feature);

      if (isfeaturePoly) {
        const result = union(
          feature as TurfPolygon,
          summedFeature as TurfPolygon
        );
        if (result) summedFeature = result;
      }
    }

    return summedFeature as TurfPolygon;
  };

  public joinChosen = (drawObject: DrawnObject): void => {
    const unfit = !this.canPushToChosen(drawObject);
    if (unfit) return;
    this.pushChosenLayer(drawObject);
    // * if true that means user selected second geo. object of the same correct type
    if (this.chosenLayersMaxed()) {
      // * if all polys unify them
      if (this.chosenLayersArePolys()) {
        const { chosenLayers } = this;
        const chosenFeatures = chosenLayers
          .filter((c) => isLayerPoly(c))
          .map((chosen) => getGeoJSONFeatures(chosen));

        if (chosenFeatures.length !== chosenLayers.length) return;

        const first = this._getSummedFeature(chosenFeatures[0]);
        const second = this._getSummedFeature(chosenFeatures[1]);

        if (first && second) {
          const resultFeature = union(first, second);
          const opts = {
            ...chosenLayers[0].options,
            ...chosenLayers[1].options,
          };
          if (resultFeature) {
            const result = morphFeatureToPolygon(resultFeature, opts);
            this.pushJoinedToChosenLayers(result);
          }
        }

        this._redrawSidebar(drawObject.layerType);
      }
      // *  if all markers plot topology
      if (this.chosenLayersAreMarkers()) {
        const { chosenLayers } = this;

        this.plotTopology(chosenLayers);

        this.deselectChosenLayers();
        this.clearChosenLayers();

        this._redrawSidebar();
      }
    }
  };
}

export default JoinTool;
