import { TMarkerControlState } from "./types";
import AbstractControl from "../AbstractControl/AbstractControl";
import MarkerControlState from "./MarkerControlState";
import { ControlProps, TAbstractControl } from "../AbstractControl/types";
declare class MarkerControl extends AbstractControl implements TAbstractControl<TMarkerControlState> {
    private tabControl;
    state: MarkerControlState;
    constructor(props: ControlProps);
    /**
     * creates a icon grid
     */
    private createIconPalette;
    /**
     * slider for anchor change
     */
    private createIconAnchorSlider;
    /**
     * X coordinate slider
     */
    private createXAnchorSlider;
    /**
     * Y coordinate slider
     */
    private createYAnchorSlider;
    /**
     * checkbox to set if marker is connect marker
     */
    private createChangeConnectCheck;
    /**
     * creates the fields associated with marker
     */
    renderIconInputs: (elem: HTMLDivElement) => void;
}
export default MarkerControl;
