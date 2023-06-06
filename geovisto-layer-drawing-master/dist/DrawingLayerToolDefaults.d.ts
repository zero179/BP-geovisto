import { LayerToolDefaults } from "geovisto";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";
/**
 * This class provide functions which return the default state values.
 *
 * @author Andrej Tlcina
 */
declare class DrawingLayerToolDefaults extends LayerToolDefaults implements IDrawingLayerToolDefaults {
    static TYPE: string;
    /**
     * It initializes tool defaults.
     */
    constructor();
    /**
     * A unique string of the tool type.
     */
    getType(): string;
    /**
     * It returns the layer name.
     */
    getLayerName(): string;
    /**
     * It returns the label of the tool.
     */
    getLabel(): string;
    /**
     * It returns the icon of the tool.
     */
    getIcon(): string;
}
export default DrawingLayerToolDefaults;
