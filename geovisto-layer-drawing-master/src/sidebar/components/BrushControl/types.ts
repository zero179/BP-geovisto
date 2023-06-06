import { TAbstractControl } from "../AbstractControl/types";

export interface TBrushControl extends TAbstractControl {
  createBrushSizeControl(): HTMLDivElement | null;
}
