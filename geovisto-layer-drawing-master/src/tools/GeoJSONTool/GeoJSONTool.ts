import { LayerType } from "../../model/types";
import { AbstractTool } from "../AbstractTool";
import { ToolProps } from "../AbstractTool/types";
import { TGeoJSONTool } from "./types";


class GeoJSONTool extends AbstractTool implements TGeoJSONTool {
  public static result = "geojson";

  public constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "geojson-drawing-tool";
  }

  public getName(): string {
    return GeoJSONTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-download";
  }

  public getTitle(): string {
    return "GeoJSON drawing tool";
  }

  public result = (): LayerType => {
    return "geojson";
  };

  public enable = (): void => {
    this._redrawSidebar(this.result());
  };


}

export default GeoJSONTool;
