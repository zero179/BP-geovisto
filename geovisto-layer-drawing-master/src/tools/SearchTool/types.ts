import { DrawnObject } from "../../model/types";
import { TAbstractTool } from "../AbstractTool/types";

export type AreasData = { data: DrawnObject[]; error: string };

// * turn to interface when extending
export type TSearchTool = TAbstractTool;
