import { SelectOpts } from "../../../util/constants";
import AbstractControlState from "../AbstractControl/AbstractControlState";
import { ControlStateProps } from "../AbstractControl/types";
import { TPolyControlState } from "./types";
declare class PolyControlState extends AbstractControlState implements TPolyControlState {
    intersectActivated: boolean;
    colors: string[];
    selectedColor: string;
    strokes: SelectOpts;
    selectedStroke: number;
    constructor(props: ControlStateProps);
    /**
     * getter
     */
    getSelectedColor(): string;
    /**
     * getter
     */
    getSelectedStroke(): number;
    /**
     * sets whether we are creating new polygons within selected one
     */
    setIntersectActivated(val: boolean): void;
    /**
     * sets new color to selected object and to extra selected ones
     */
    changeColorAction: (color: string) => void;
    /**
     * sets new stroke weight to selected object and to extra selected ones
     */
    changeWeightAction: (e: Event) => void;
}
export default PolyControlState;
