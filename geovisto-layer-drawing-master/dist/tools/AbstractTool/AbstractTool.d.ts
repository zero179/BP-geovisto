import { Map } from "leaflet";
import { DrawnObject, LayerType } from "../../model/types";
import IDrawingLayerTool, { ActiveTool, DrawingForm } from "../../model/types/tool/IDrawingLayerTool";
import { TAbstractTool, ToolProps } from "./types";
/**
 * Class is Abstract for Drawing tool/feature
 *
 * Drawing tool/feature enables user to create geospatial objects
 *
 * Each tool/feature creates different objects or has different approach for the object creation
 */
declare class AbstractTool implements TAbstractTool {
    drawingTool: IDrawingLayerTool;
    sidebar: DrawingForm;
    leafletMap?: Map;
    activetool: ActiveTool | null;
    _isActive: boolean;
    constructor(props: ToolProps);
    static NAME(): string;
    /**
     * to be extended
     */
    getName(): string;
    /**
     * to be extended
     */
    getIconName(): string;
    /**
     * to be extended
     */
    getTitle(): string;
    /**
     * to be extended
     */
    result(): LayerType | "";
    canBeCanceled(): boolean;
    _redrawSidebar(type?: LayerType | ""): void;
    setCurrentToolAsEnabled(): void;
    /**
     * because I want to run setCurrentToolAsEnabled every time enabled is run I wrap it with this function
     */
    activate(): void;
    deactivate(): void;
    /**
     * to be extended
     */
    enable(): void;
    /**
     * to be extended
     */
    disable(): void;
    /**
     *
     * @returns currently selected geo. object
     */
    getSelectedLayer(): DrawnObject | null;
    isToolActive(): boolean;
}
export default AbstractTool;
