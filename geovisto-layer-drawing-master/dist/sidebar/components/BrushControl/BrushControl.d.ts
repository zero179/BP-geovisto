import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import { TBrushControl } from "./types";
declare class BrushControl extends AbstractControl implements TBrushControl {
    private tabControl;
    private customToleranceInput;
    private map;
    constructor(props: ControlProps);
    /**
     * creates a field for brush size input
     */
    createBrushSizeControl: () => HTMLDivElement | null;
    private toleranceChange;
    private onChange;
    private createCustomToleranceCheck;
}
export default BrushControl;
