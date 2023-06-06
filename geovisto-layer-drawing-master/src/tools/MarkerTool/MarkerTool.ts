import { DrawnObject, LayerType, LooseObject } from "./../../model/types/index";
import L, { MarkerOptions } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { iconStarter } from "../../util/constants";
import { ToolProps } from "../AbstractTool/types";
import { TMarkerTool } from "./types";
import { ActiveTool } from "../../model/types/tool/IDrawingLayerTool";

declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Draw {
    class ExtendedMarker extends Marker {
      public constructor(map: Map, params: MarkerOptions);
      public setIconOptions(opts: LooseObject): void;
      public _marker: DrawnObject;
    }
  }
}

/**
 * @author Andrej Tlcina
 */

/**
 * extends marker so we can change its options while marker tool is enabled
 */
L.Draw.ExtendedMarker = L.Draw.Marker.extend({
  setIconOptions: function (iconOpts: LooseObject) {
    this.options.icon = iconOpts;
  },
});

class MarkerTool extends AbstractTool implements TMarkerTool {
  public static result = "marker";

  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "marker-drawing-tool";
  }

  public getName(): string {
    return MarkerTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-map-marker";
  }

  public getTitle(): string {
    return "Marker drawing tool";
  }

  public result = (): LayerType | "" => {
    return "marker";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  public _markerCreate = (connectClick = false): void => {
    if (!this.leafletMap) return;
    const additionalOpts = {
      iconUrl: this.sidebar.getState().getSelectedIcon(),
      connectClick,
    };
    const icon = new L.Icon({ ...iconStarter, ...additionalOpts });
    const { guideLayers } = this.sidebar.getState();

    this.activetool = new L.Draw.ExtendedMarker(this.leafletMap, {
      icon,
      draggable: true,
      transform: true,
      repeatMode: true,
      guideLayers,
      snapVertices: false,
    } as MarkerOptions) as ActiveTool;
    this.activetool.enable();
  };

  public enable = (): void => {
    this._markerCreate();
  };
}

export default MarkerTool;
