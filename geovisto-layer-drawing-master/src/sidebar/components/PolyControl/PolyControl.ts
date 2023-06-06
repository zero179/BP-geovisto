import { MAPPING_MODEL } from "../../../util/inputs";
import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps, TAbstractControl } from "../AbstractControl/types";
import PolyControlState from "./PolyControlState";
import { TPolyControlState } from "./types";

class PolyControl
  extends AbstractControl
  implements TAbstractControl<TPolyControlState> {
  public state;

  public constructor(props: ControlProps) {
    super(props);

    this.state = new PolyControlState({
      tabControl: props.tabControl,
      control: this,
    });
  }

  /**
   * checkbox to set if we can create within selected object
   */
  public createIntersectionCheck = (): HTMLElement => {
    const onChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).checked;
      this.state.setIntersectActivated(val);
    };
    const { intersectActivated } = this.state;

    const result = MAPPING_MODEL.intersectActivated.input({
      ...MAPPING_MODEL.intersectActivated.props,
      defaultValue: intersectActivated,
      onChangeAction: onChange,
    });

    return result.create();
  };

  /**
   * creates the fields associated with polygons/polylines
   *
   * @param {Object} elem
   * @param {Object} model
   */
  public renderPolyInputs = (elem: HTMLDivElement): void => {
    // select stroke thickness
    const thicknessOpts = this.state.strokes;
    const inputThickness = MAPPING_MODEL.strokeThickness.input({
      ...MAPPING_MODEL.strokeThickness.props,
      options: thicknessOpts,
      action: this.state.changeWeightAction,
    });
    elem.appendChild(inputThickness.create() as Node);
    inputThickness.setValue(
      this.state._getSelected()?.options?.weight ||
        this.state.getSelectedStroke()
    );

    // palette Colors
    const inputColor = this.createColorPicker();
    elem.appendChild(inputColor);
  };

  /**
   * creates color picker field
   */
  private createColorPicker(): HTMLDivElement {
    const inputWrapper = document.createElement("div");
    inputWrapper.appendChild(document.createTextNode("Pick color: "));
    const colorPicker = document.createElement("input");
    colorPicker.setAttribute("type", "color");
    colorPicker.onchange = (e) =>
      this.state.changeColorAction((e.target as HTMLInputElement).value);
    colorPicker.value = String(
      this.state._getSelected()?.options?.color || this.state.getSelectedColor()
    );
    inputWrapper.appendChild(colorPicker);
    return inputWrapper;
  }
}

export default PolyControl;
