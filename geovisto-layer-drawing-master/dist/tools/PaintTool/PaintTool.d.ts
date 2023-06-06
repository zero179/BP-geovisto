import { CircleMarker, LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import { AbstractTool } from "../AbstractTool";
import { TPaintTool } from "./types";
import { LayerType } from "../../model/types";
import { ToolProps } from "../AbstractTool/types";
declare class PaintTool extends AbstractTool implements TPaintTool {
    static result: LayerType;
    private tabState;
    _action: "draw" | "erase" | null;
    _circle: CircleMarker | null;
    private _mouseDown;
    _latlng: LatLng;
    private _maxCircleRadius;
    private _minCircleRadius;
    _circleRadius: number;
    private _accumulatedShape;
    private _shapeLayer;
    constructor(props: ToolProps);
    static NAME(): string;
    getName(): string;
    getIconName(): string;
    getTitle(): string;
    result: () => LayerType;
    canBeCanceled: () => boolean;
    enable: () => void;
    /**
     * enables painting
     */
    private enablePaint;
    /**
     * getter
     */
    getMouseDown: () => boolean;
    /**
     * getter
     */
    getBrushSize: () => number;
    /**
     * getter
     */
    getBrushSizeConstraints: () => {
        maxBrushSize: number;
        minBrushSize: number;
    };
    /**
     * resizes brush size (changes circle radius)
     *
     * @param {Number} val
     */
    resizeBrush: (val: number) => void;
    /**
     * stops brush tool, and removes circle object from mouse cursor
     */
    stop: () => void;
    /**
     * creates circle around mouse cursor and applies event listeners
     */
    private startPaint;
    /**
     * removes all accumulated circles (painted polygons)
     */
    private clearPainted;
    /**
     * taken from https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
     */
    private _pixelsToMeters;
    /**
     * creates circle and appends it to accumulated circles object
     */
    private drawCircle;
    /**
     * got through all accumulated circles and out put them on the map
     */
    private _redrawShapes;
    /**
     * when fired brush stroke is appended to map
     * created object is passed to 'createdListener' function of tool
     */
    private _fireCreatedShapes;
    _addMouseListener: () => void;
    _removeMouseListener: () => void;
    _onMouseDown: (event: LeafletMouseEvent) => void;
    _onMouseUp: () => void;
    _onMouseMove: (event: LeafletMouseEvent) => void;
    /**
     * updates latlng so circle around mouse cursor follows it
     */
    _setLatLng: (latlng: LatLng) => void;
    /**
     * disables tool
     */
    disable: () => void;
}
export default PaintTool;
