import IDrawingLayerTool from "./model/types/tool/IDrawingLayerTool";
import IDrawingLayerToolProps from "./model/types/tool/IDrawingLayerToolProps";
export declare const GeovistoDrawingLayerTool: {
    getType: () => string;
    createTool: (props?: IDrawingLayerToolProps) => IDrawingLayerTool;
};
