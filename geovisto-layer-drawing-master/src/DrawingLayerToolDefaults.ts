import { LayerToolDefaults } from "geovisto";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";

/**
 * This class provide functions which return the default state values.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolDefaults
  extends LayerToolDefaults
  implements IDrawingLayerToolDefaults {
  public static TYPE = "geovisto-tool-layer-drawing";
  /**
   * It initializes tool defaults.
   */
  public constructor() {
    super();
  }
  /**
   * A unique string of the tool type.
   */
  public getType(): string {
    return DrawingLayerToolDefaults.TYPE;
  }

  /**
   * It returns the layer name.
   */
  public getLayerName(): string {
    return "Drawing layer";
  }

  /**
   * It returns the label of the tool.
   */
  public getLabel(): string {
    return this.getLayerName();
  }

  /**
   * It returns the icon of the tool.
   */
  public getIcon(): string {
    return '<i class="fa fa-pencil"></i>';
  }
}
export default DrawingLayerToolDefaults;
