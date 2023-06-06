import { TAbstractTool } from '../AbstractTool/types';

export interface TMarkerTool extends TAbstractTool {
  _markerCreate(val: boolean): void;
}
