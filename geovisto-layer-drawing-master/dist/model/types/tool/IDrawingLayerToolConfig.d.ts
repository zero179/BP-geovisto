import { ILayerToolConfig, ILayerToolDimensionsConfig } from "geovisto";
/**
 * This type provides specification of the Drawing layer tool config model.
 *
 * @author Andrej Tlcina
 */
type IDrawingLayerToolConfig = ILayerToolConfig & {
    data?: IDrawingLayerToolDimensionsConfig;
};
/**
 * This type provides specification of the Drawing layer tool dimensions config model.
 *
 * @author Andrej Tlcina
 */
type IDrawingLayerToolDimensionsConfig = ILayerToolDimensionsConfig;
export type { IDrawingLayerToolConfig, IDrawingLayerToolDimensionsConfig };
