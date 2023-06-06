import { TMarkerControlState } from "./types";
import { createPalette, MAPPING_MODEL } from "../../../util/inputs";
import { iconStarter } from "../../../util/constants";
import AbstractControl from "../AbstractControl/AbstractControl";
import MarkerControlState from "./MarkerControlState";
import { ControlProps, TAbstractControl } from "../AbstractControl/types";

class MarkerControl
  extends AbstractControl
  implements TAbstractControl<TMarkerControlState> {
  private tabControl;
  public state;

  public constructor(props: ControlProps) {
    super(props);

    this.tabControl = props.tabControl;

    this.state = new MarkerControlState({
      tabControl: props.tabControl,
      control: this,
    });
  }

  /**
   * creates a icon grid
   */
  private createIconPalette(): HTMLDivElement {
    const iconsSet = this.state.iconSrcs;
    const iconUrl = this.state._getSelected()?.options?.icon?.options?.iconUrl;
    if (iconUrl) iconsSet.add(iconUrl);
    const activeIcon = this.state.getSelectedIcon();
    const iconsArr: string[] = Array.from(iconsSet);
    const activeIndex = iconsArr.indexOf(activeIcon);
    const res = createPalette(
      "Pick icon",
      iconsArr,
      activeIndex,
      this.state.changeIconAction,
      true
    );
    return res;
  }

  /**
   * slider for anchor change
   */
  private createIconAnchorSlider = (coordinate: "x" | "y"): HTMLElement => {
    const selectedEl = this.state._getSelected();

    const iconOptions = selectedEl?.options?.icon?.options || {};
    const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
    const value = iconAnchor[coordinate] || "";

    const customAnchor = MAPPING_MODEL.iconAnchor.input({
      label: `Icon '${coordinate.toUpperCase()}' anchor`,
      minValue: 0,
      maxValue: 50,
      onChangeAction: (e: Event) => this.state.changeIconAnchor(e, coordinate),
      defaultValue: value,
    });

    return customAnchor.create();
  };

  /**
   * X coordinate slider
   */
  private createXAnchorSlider = (): HTMLElement =>
    this.createIconAnchorSlider("x");

  /**
   * Y coordinate slider
   */
  private createYAnchorSlider = (): HTMLElement =>
    this.createIconAnchorSlider("y");

  /**
   * checkbox to set if marker is connect marker
   */
  private createChangeConnectCheck = (): HTMLElement => {
    const toolState = this.tabControl.getTool().getState();
    const onChange = (e: Event) => {
      const connectClick = (e.target as HTMLInputElement).checked;
      const selected = this.state.changeIconOpts({ connectClick });

      if (selected) {
        this.tabControl.getTool().highlightElement(selected);
      }
    };
    const isConnect = toolState.selectedLayerIsConnectMarker();

    const result = MAPPING_MODEL.changeConnect.input({
      ...MAPPING_MODEL.changeConnect.props,
      defaultValue: isConnect,
      onChangeAction: onChange,
    });

    return result.create();
  };

  /**
   * creates the fields associated with marker
   */
  public renderIconInputs = (elem: HTMLDivElement): void => {
    // palette Icons
    const inputIcon = this.createIconPalette();
    elem.appendChild(inputIcon);

    const inputUrl = MAPPING_MODEL.iconUrl.input({
      ...MAPPING_MODEL.iconUrl.props,
      action: this.state.addIconAction,
    });

    elem.appendChild(inputUrl.create() as Node);
    inputUrl.setValue("");

    const changeConnect = this.createChangeConnectCheck();
    elem.appendChild(changeConnect);

    elem.appendChild(this.createXAnchorSlider());
    elem.appendChild(this.createYAnchorSlider());
  };
}

export default MarkerControl;
