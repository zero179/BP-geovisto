import AbstractControlState from "./AbstractControlState";
import { ControlProps, TAbstractControl } from "./types";
/**
 * Abstract class for control
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for rendering of inputs, not logic
 */
declare class AbstractControl implements TAbstractControl {
    state: AbstractControlState;
    constructor(props: ControlProps);
}
export default AbstractControl;
