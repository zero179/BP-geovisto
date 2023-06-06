import { ToolProps } from "./../AbstractTool/types";
import L, { DrawMap } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { TPolygonTool } from "./types";
import { LayerType } from "../../model/types";
import { ActiveTool } from "../../model/types/tool/IDrawingLayerTool";

class PolygonTool extends AbstractTool implements TPolygonTool {
  public static result: LayerType | "" = "polygon";

  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "polygon-drawing-tool";
  }

  public getName(): string {
    return PolygonTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-star";
  }

  public getTitle(): string {
    return "Polygon drawing tool";
  }

  public result = (): LayerType => {
    return "polygon";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  private _polygonCreate = (): void => {
    if (!this.leafletMap) return;
    this.activetool = new L.Draw.Polygon(
      this.leafletMap as DrawMap,
      {
        allowIntersection: false,
        drawError: {
          color: "#e1e100",
          message: "<strong>You cannot draw that!<strong>",
        },
        shapeOptions: {
          color: this.sidebar.getState().getSelectedColor(),
          weight: this.sidebar.getState().getSelectedStroke(),
          draggable: true,
          transform: true,
        },
        guideLayers: this.sidebar.getState().guideLayers,
        snapDistance: 5,
        repeatMode: true,
      } as L.DrawOptions.PolygonOptions
    ) as ActiveTool;
    this.activetool.enable();
  };

  public enable = (): void => {
    this._polygonCreate();
  };
}

export default PolygonTool;
