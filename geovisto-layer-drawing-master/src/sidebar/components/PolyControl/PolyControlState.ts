import { COLORS, SelectOpts, STROKES } from "../../../util/constants";
import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
import { TPolyControlState } from "./types";

class PolyControlState
  extends AbstractControlState
  implements TPolyControlState {
  public intersectActivated: boolean;
  public colors: string[];
  public selectedColor: string;
  public strokes: SelectOpts;
  public selectedStroke: number;

  public constructor(props: ControlStateProps) {
    super(props);

    this.intersectActivated = false;

    this.colors = COLORS;
    this.selectedColor = COLORS[0];

    this.strokes = STROKES;
    this.selectedStroke = STROKES[1].value;
  }

  /**
   * getter
   */
  public getSelectedColor(): string {
    return this.selectedColor;
  }

  /**
   * getter
   */
  public getSelectedStroke(): number {
    return this.selectedStroke;
  }

  /**
   * sets whether we are creating new polygons within selected one
   */
  public setIntersectActivated(val: boolean): void {
    this.intersectActivated = val;
  }

  /**
   * sets new color to selected object and to extra selected ones
   */
  public changeColorAction = (color: string): void => {
    const selectedEl = this._getSelected();
    this.selectedColor = color;
    if (selectedEl?.setStyle) selectedEl.setStyle({ color });
    this._getExtraSelected().forEach((layer) => {
      layer?.setStyle({ color });
    });
  };

  /**
   * sets new stroke weight to selected object and to extra selected ones
   */
  public changeWeightAction = (e: Event): void => {
    const weight = Number((e.target as HTMLSelectElement).value);
    const selectedEl = this._getSelected();
    this.selectedStroke = weight;
    if (selectedEl?.setStyle) selectedEl.setStyle({ weight });
    this._getExtraSelected().forEach((layer) => {
      layer?.setStyle({ weight });
    });
  };
}

export default PolyControlState;
