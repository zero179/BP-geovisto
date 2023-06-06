import L, { DrawMap } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { LayerType } from "../../model/types";
import { ToolProps } from "../AbstractTool/types";
import { TLineTool } from "./types";
import { ActiveTool } from "../../model/types/tool/IDrawingLayerTool";

class LineTool extends AbstractTool implements TLineTool {
  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "line-drawing-tool";
  }

  public getName(): string {
    return LineTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-minus";
  }

  public getTitle(): string {
    return "Line drawing tool";
  }

  public result = (): LayerType => {
    return "polyline";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  private _polylineCreate = (): void => {
    if (!this.leafletMap) return;
    this.activetool = new L.Draw.Polyline(
      this.leafletMap as DrawMap,
      {
        shapeOptions: {
          color: this.sidebar.getState().getSelectedColor(),
          weight: this.sidebar.getState().getSelectedStroke(),
          draggable: true,
          transform: true,
        },
        guideLayers: this.sidebar.getState().guideLayers,
        repeatMode: true,
      } as L.DrawOptions.PolylineOptions
    ) as ActiveTool;
    this.activetool.enable();
  };

  public enable = (): void => {
    this._polylineCreate();
  };
}

export default LineTool;
