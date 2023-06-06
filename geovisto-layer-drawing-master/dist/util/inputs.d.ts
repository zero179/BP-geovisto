/**
 * @author Andrej Tlcina
 */
import { MappingModel } from "../model/types/tool/IDrawingLayerToolDefaults";
/**
 * creates checkbox
 */
export declare const createCheck: (value: boolean, onCheck: (val: boolean) => void, prefix: string, label: string) => HTMLDivElement;
/**
 * creates a grid of options, when a tile is clicked passed function runs
 * was made for colors and icons, if img is true it expects icon urls as options
 */
export declare const createPalette: (label: string, opts: string[], activeIdx: number, changeAction: (opt: string) => void, img?: boolean) => HTMLDivElement;
export declare const createButton: (text: string, onClick: () => void, disabled: boolean) => HTMLButtonElement;
/**
 * Data mapping model which can be used in the sidebar form.
 */
export declare const MAPPING_MODEL: MappingModel;
