import "../style/drawingLayerTabControl.scss";
import { MapLayerToolForm } from "geovisto";
import IDrawingLayerTool, { DrawingForm, TabState } from "../model/types/tool/IDrawingLayerTool";
import { LayerType } from "../model/types";
import IDrawingLayerToolDimensions from "../model/types/tool/IDrawingLayerToolDimensions";
/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Andrej Tlcina
 */
declare class DrawingLayerToolMapForm extends MapLayerToolForm<IDrawingLayerTool> implements DrawingForm {
    private htmlContent;
    private tool;
    private state;
    constructor(props: {
        tool: IDrawingLayerTool;
    });
    setInputValues(dimensions: IDrawingLayerToolDimensions): void;
    getTool(): IDrawingLayerTool;
    /**
     * It creates new state of the tab control.
     */
    getState(): TabState;
    /**
     * removes all elements of a sidebar and calls function to create new content of the sidebar
     */
    redrawTabContent(layerType: LayerType | ""): void;
    /**
     * It returns the sidebar tab pane.
     */
    getContent(layerType?: LayerType | ""): HTMLDivElement;
}
export default DrawingLayerToolMapForm;
