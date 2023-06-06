import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { TEditTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject } from "../../model/types";

class EditTool extends AbstractTool implements TEditTool {
  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "edit-drawing-tool";
  }

  public getName(): string {
    return EditTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-square";
  }

  public getTitle(): string {
    return "Edit nodes tool";
  }

  public result = (): "" => {
    return "";
  };

  public enable = (): void => {
    const selectedLayer = this.getSelectedLayer();

    EditTool.initNodeEdit(selectedLayer);
  };

  public static initNodeEdit(
    selectedLayer: DrawnObject | null,
    disable = false
  ): void {
    if (selectedLayer?.editing) {
      if (selectedLayer.editing._enabled || disable) {
        selectedLayer.editing.disable();
      } else {
        selectedLayer.editing.enable();
      }
    }
  }

  public static disableNodeEdit = (selectedEl: DrawnObject | null): void => {
    EditTool.initNodeEdit(selectedEl, true);
  };
}

export default EditTool;
