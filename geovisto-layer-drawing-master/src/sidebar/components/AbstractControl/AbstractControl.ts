import AbstractControlState from "./AbstractControlState";
import { ControlProps, TAbstractControl } from "./types";

/**
 * Abstract class for control
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for rendering of inputs, not logic
 */
class AbstractControl implements TAbstractControl {
  public state;

  public constructor(props: ControlProps) {
    this.state = new AbstractControlState({
      tabControl: props.tabControl,
      control: this,
    });
  }
}

export default AbstractControl;
