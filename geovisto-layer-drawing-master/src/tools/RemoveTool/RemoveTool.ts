import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { ToolProps } from "../AbstractTool/types";
import { TRemoveTool } from "./types";

class RemoveTool extends AbstractTool implements TRemoveTool {
  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "remove-drawing-tool";
  }

  public getName(): string {
    return RemoveTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-times";
  }

  public getTitle(): string {
    return "Remove tool";
  }

  public result = (): "" => {
    return "";
  };

  public enable = (): void => {
    this.removeElement();
  };

  private removeElement(): void {
    const state = this.drawingTool.getState();
    const selectedLayer = this.getSelectedLayer();
    // * if marker is being removed, remove its vertices if any
    if (selectedLayer && state.selectedLayerIsConnectMarker()) {
      state.removeMarkersMappedVertices(selectedLayer._leaflet_id);
    }
    if (selectedLayer?.layerType === "vertice") {
      state.removeGivenVertice(selectedLayer._leaflet_id);
    }
    state.removeSelectedLayer();
    this._redrawSidebar();
  }
}

export default RemoveTool;
