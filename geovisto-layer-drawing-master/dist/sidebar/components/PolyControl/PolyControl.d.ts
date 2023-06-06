import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps, TAbstractControl } from "../AbstractControl/types";
import PolyControlState from "./PolyControlState";
import { TPolyControlState } from "./types";
declare class PolyControl extends AbstractControl implements TAbstractControl<TPolyControlState> {
    state: PolyControlState;
    constructor(props: ControlProps);
    /**
     * checkbox to set if we can create within selected object
     */
    createIntersectionCheck: () => HTMLElement;
    /**
     * creates the fields associated with polygons/polylines
     *
     * @param {Object} elem
     * @param {Object} model
     */
    renderPolyInputs: (elem: HTMLDivElement) => void;
    /**
     * creates color picker field
     */
    private createColorPicker;
}
export default PolyControl;
