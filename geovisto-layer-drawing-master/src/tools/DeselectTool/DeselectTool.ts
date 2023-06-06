import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { EditTool } from "../EditTool";
import { DrawnObject } from "../../model/types";
import { TDeselectTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import IDrawingLayerTool from "../../model/types/tool/IDrawingLayerTool";

class DeselectTool extends AbstractTool implements TDeselectTool {
  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "deselect-drawing-tool";
  }

  public getName(): string {
    return DeselectTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-star-half-o";
  }

  public getTitle(): string {
    return "Deselect tool";
  }

  public result = (): "" => {
    return "";
  };

  public enable = (): void => {
    const selected = this.getSelectedLayer();

    DeselectTool.deselect(selected, this.drawingTool);
  };

  public static deselect(
    selected: DrawnObject | null,
    tool: IDrawingLayerTool
  ): void {
    if (selected?.editing?._enabled) {
      selected.editing.disable();
    }
    if (selected) {
      tool?.normalizeElement(selected);
      EditTool.initNodeEdit(selected, true);
      tool?.getState().clearSelectedLayer();
      tool?.redrawMapForm("");
      (document.querySelector(
        ".leaflet-container"
      ) as HTMLElement).style.cursor = "";
    }
  }
}

export default DeselectTool;
