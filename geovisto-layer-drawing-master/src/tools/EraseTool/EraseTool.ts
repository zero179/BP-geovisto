import L, { LeafletEvent, TileEvent } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { PaintTool } from "../PaintTool";
import { ToolProps } from "../AbstractTool/types";
import { CreatedEvent, LayerType } from "../../model/types";
import { TEraseTool } from "./types";

const ERASER_COLOR = "#ee000055";

class EraseTool extends PaintTool implements TEraseTool {
  public static result: LayerType = "erased";

  public constructor(props: ToolProps) {
    super(props);

    this.leafletMap?.on("draw:created" as any, (e: TileEvent) =>
      this.created((e as unknown) as CreatedEvent)
    );
  }

  public static NAME(): string {
    return "eraser-drawing-tool";
  }

  public getName(): string {
    return EraseTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-eraser";
  }

  public getTitle(): string {
    return "Eraser tool";
  }

  public result = (): LayerType => {
    return "erased";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  private created = (e: CreatedEvent): void => {
    const layer = e.layer;
    if (!layer) return;
    if (e.layerType === this.result()) this.leafletMap?.removeLayer(layer);
  };

  public enable = (): void => {
    if (this._action == "erase") {
      this.disable();
    } else {
      this.startErase();
    }
  };

  /**
   * creates circle around mouse cursor and applies event listeners
   */
  private startErase = (): void => {
    this.stop();
    this._action = "erase";
    this._addMouseListener();
    if (this.leafletMap)
      this._circle = L.circleMarker(this._latlng, {
        color: ERASER_COLOR,
      })
        .setRadius(this._circleRadius)
        .addTo(this.leafletMap);
  };

  /**
   * button for erasing is clicked
   */
  public erase = (event: LeafletEvent): void => {
    if (event.type == "mousedown") {
      L.DomEvent.stop(event);
      return;
    }
  };
}

export default EraseTool;
