import L, { Layer } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import "leaflet-pather";

import { GeometricSliceTool } from "../GeometricSliceTool";
import { ToolProps } from "../AbstractTool/types";
import { TFreehandSliceTool } from "./types";
import { DrawnObject, LayerType } from "../../model/types";

type PatherEvent = Event & { polyline: { polyline: DrawnObject } };

type Pather = Layer & {
  remove: (l: DrawnObject) => void;
  on: (type: "created", callback: (e: PatherEvent) => void) => void;
  removePath: (l: DrawnObject) => void;
};

class FreehandSliceTool
  extends GeometricSliceTool
  implements TFreehandSliceTool {
  public static result: LayerType | "" = "";

  private pather: Pather;
  private patherActive: boolean;

  public constructor(props: ToolProps) {
    super(props);

    // * using any b/c I dont know how to declare class Pather in leaflet module :(
    this.pather = new (L as any).Pather({
      strokeWidth: 3,
      smoothFactor: 5,
      moduleClass: "leaflet-pather",
      pathColour: "#333",
    });

    this.patherActive = false;

    this.pather.on("created", this.createdPath);
  }

  public static NAME(): string {
    return "freehand-slice-drawing-tool";
  }

  public getName(): string {
    return FreehandSliceTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-cutlery";
  }

  public getTitle(): string {
    return "Freehand slice tool";
  }

  public canBeCanceled = (): boolean => {
    return true;
  };

  private _enableSlicing = (): void => {
    const pather = this.pather;
    const patherStatus = this.patherActive;
    if (!patherStatus) {
      this.leafletMap?.addLayer(pather);
    } else {
      this.leafletMap?.removeLayer(pather);
    }

    this.patherActive = !patherStatus;
  };

  /**
   * @brief slices selected polygon with pather's freehand line
   */
  private createdPath = (e: PatherEvent) => {
    // * get polyline object
    const layer = e.polyline.polyline;

    // * get Leaflet map
    const map = this.leafletMap;

    // * get sidebar state and pather object
    const pather = this.pather;
    // * SLICE
    this.polySlice(layer);

    // * we do not want path to stay
    pather.removePath(layer);
    // * we do not want to keep cutting (drawing)
    map?.removeLayer(pather);
    // * restore state
    this.deactivate();
  };

  public enable = (): void => {
    this._enableSlicing();
  };

  public disable = (): void => {
    this.leafletMap?.removeLayer(this.pather);
    this.patherActive = false;
    const activeTool = this.activetool;
    if (activeTool) {
      activeTool.disable();
    }

    // * hide extra btn for disabling tools
    const query = `.drawingtoolbar .${this.getName()} .extra-btn`;
    const divideBtn = document.querySelector(query);
    if (divideBtn) divideBtn.classList.add("hide");
  };
}

export default FreehandSliceTool;
