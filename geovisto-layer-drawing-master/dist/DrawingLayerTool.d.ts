import { FeatureGroup, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style/drawingLayer.scss";
import "leaflet-snap";
import "leaflet-geometryutil";
import "leaflet-draw";
import { LooseObject, DrawnObject, LayerType } from "./model/types";
import IDrawingLayerToolProps from "./model/types/tool/IDrawingLayerToolProps";
import IDrawingLayerTool, { DrawingForm } from "./model/types/tool/IDrawingLayerTool";
import { AbstractLayerTool, IMapFormControl, IMapToolInitProps } from "geovisto";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";
import IDrawingLayerToolState from "./model/types/tool/IDrawingLayerToolState";
import { IDrawingLayerToolConfig } from "./model/types/tool/IDrawingLayerToolConfig";
declare global {
    interface Window {
        customTolerance: number;
        d3: any;
    }
}
/**
 * This class represents Drawing layer tool.
 *
 * @author Andrej Tlcina
 */
declare class DrawingLayerTool extends AbstractLayerTool implements IDrawingLayerTool, IMapFormControl {
    drawingTools: LooseObject;
    private mapForm;
    private controlDrawingToolbar;
    /**
     * It creates a new tool with respect to the props.
     */
    constructor(props?: IDrawingLayerToolProps);
    /**
     * Overrides the super method.
     *
     * @param initProps
     */
    initialize(initProps: IMapToolInitProps<IDrawingLayerToolConfig>): this;
    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IDrawingLayerTool;
    /**
     * It returns the props given by the programmer.
     */
    getProps(): IDrawingLayerToolProps;
    /**
     * It returns default values of the state properties.
     */
    getDefaults(): IDrawingLayerToolDefaults;
    /**
     * It returns the layer tool state.
     */
    getState(): IDrawingLayerToolState;
    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IDrawingLayerToolDefaults;
    /**
     * It returns default tool state.
     */
    protected createState(): IDrawingLayerToolState;
    /**
     * It returns a tab control.
     */
    getMapForm(): DrawingForm;
    redrawMapForm(layerType: LayerType | ""): void;
    /**
     * It creates new tab control.
     */
    protected createMapForm(): DrawingForm;
    /**
     * It changes layer state to enabled/disabled.
     *
     * @param enabled
     */
    setEnabled(enabled: boolean): void;
    initializeDrawingTools(): void;
    /**
     * It creates layer items.
     */
    protected createLayerItems(): FeatureGroup[];
    /**
     * @brief called whenever new geo. object is created
     */
    private createdListener;
    /**
     * @brief aplies event listeners for each geo. object
     *
     * @param {Layer} layer
     */
    applyEventListeners(layer: DrawnObject): void;
    /**
     * @brief sets global tolerance for brush stroke
     */
    setGlobalSimplificationTolerance(map: Map | undefined): void;
    /**
     * @brief highlights element
     */
    highlightElement(el: DrawnObject): void;
    /**
     * @brief highlights element on mouse hover
     */
    private hightlightOnHover;
    /**
     * @brief sets normal styles for element
     */
    normalizeElement(el: DrawnObject): void;
    /**
     * @brief sets normal styles for element on mouse hover
     *
     * @param {Object} el
     */
    private normalizeOnHover;
    /**
     * @brief called on object click to change its style accordingly
     */
    private initChangeStyle;
}
export default DrawingLayerTool;
