import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { TTransformTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import { DrawnObject } from "../../model/types";

class TransformTool extends AbstractTool implements TTransformTool {
  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "transform-drawing-tool";
  }

  public getName(): string {
    return TransformTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-arrows-alt";
  }

  public getTitle(): string {
    return "Transform tool";
  }

  public result = (): "" => {
    return "";
  };

  public enable = (): void => {
    const selected = this.getSelectedLayer();

    TransformTool.initTransform(selected);
  };

  public static initTransform(
    drawObject: DrawnObject | null,
    disable = false
  ): void {
    const layer = drawObject;
    if (layer?.transform) {
      if (layer.transform._enabled || disable) {
        layer.transform.disable();
        layer?.dragging?.disable();
      } else {
        layer.transform.enable({ rotation: true, scaling: true });
        layer?.dragging?.enable();
      }
    } else if (layer?.layerType === "marker") {
      if (layer?.dragging?._enabled || disable) {
        layer?.dragging?.disable();
      } else {
        layer?.dragging?.enable();
      }
    }
  }

  public static disableTransform = (selectedEl: DrawnObject | null): void => {
    TransformTool.initTransform(selectedEl, true);
  };
}

export default TransformTool;
