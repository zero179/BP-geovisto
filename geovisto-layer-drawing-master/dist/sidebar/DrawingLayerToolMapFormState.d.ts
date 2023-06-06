import { Controls, DrawingForm, SelectedDrawingTool, TabState } from "../model/types/tool/IDrawingLayerTool";
import { DrawnObject } from "../model/types";
/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
declare class DrawingLayerToolMapFormState implements TabState {
    tabControl: DrawingForm;
    enabledTool: SelectedDrawingTool | null;
    guideLayers: DrawnObject[];
    controls: Controls;
    /**
     * It creates a tab control state.
     */
    constructor(tabControl: DrawingForm);
    /**
     * method initializes controls for objects manipulation
     */
    initializeControls: () => void;
    /**
     * method if defined for easier access through tabControlState class/object
     */
    getSelectedColor(): string;
    /**
     * method if defined for easier access through tabControlState class/object
     */
    getSelectedStroke(): number;
    /**
     * method if defined for easier access through tabControlState class/object
     */
    getSelectedIcon(): string;
    setSelectedIcon(icon: string): void;
    /**
     * method if defined for easier access through tabControlState class/object
     */
    callIdentifierChange(haveToCheckFilters?: boolean): void;
    /**
     * method if defined for easier access through tabControlState class/object
     */
    appendToIconSrcs(iconUrl: string): void;
    /**
     * method for easier access through tabControlState class/object
     */
    getIntersectActivated(): boolean;
    /**
     * adds guide layer for snapping
     */
    pushGuideLayer(layer: DrawnObject): void;
    /**
     * setter for enabledTool variable
     */
    setEnabledTool(val: SelectedDrawingTool | null): void;
    /**
     * getter
     */
    getEnabledTool(): SelectedDrawingTool | null;
}
export default DrawingLayerToolMapFormState;
