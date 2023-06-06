import DrawingLayerTool from "./DrawingLayerTool";
import DrawingLayerToolDefaults from "./DrawingLayerToolDefaults";
import IDrawingLayerTool from "./model/types/tool/IDrawingLayerTool";
import IDrawingLayerToolProps from "./model/types/tool/IDrawingLayerToolProps";

export const GeovistoDrawingLayerTool: {
  getType: () => string;
  createTool: (props?: IDrawingLayerToolProps) => IDrawingLayerTool;
} = {
  getType: () => DrawingLayerToolDefaults.TYPE,
  createTool: (props) => new DrawingLayerTool(props),
};
