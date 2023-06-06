import L, { CircleMarker, LatLng, Layer, LeafletMouseEvent } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import {
  convertOptionsToProperties,
  getConversionDepth,
  isLayerPoly,
  simplifyFeature,
} from "../../util/polyHelpers";
import circle from "@turf/circle";
import { STROKES, highlightStyles, normalStyles } from "../../util/constants";
import union from "@turf/union";
import { TPaintTool } from "./types";
import { GeoFeature, LayerType, TurfPolygon } from "../../model/types";
import { ToolProps } from "../AbstractTool/types";
import * as turf from "@turf/turf";
import { TabState } from "../../model/types/tool/IDrawingLayerTool";

const DEFAULT_COLOR = "#333333";
const DEFAULT_RADIUS = 30;
const ERASER_COLOR = "#ee000055";

class PaintTool extends AbstractTool implements TPaintTool {
  public static result: LayerType = "painted";

  private tabState: TabState;
  public _action: "draw" | "erase" | null;
  public _circle: CircleMarker | null;
  private _mouseDown: boolean;
  public _latlng: LatLng;
  private _maxCircleRadius: number;
  private _minCircleRadius: number;
  public _circleRadius: number;
  private _accumulatedShape: GeoJSON.Feature | null;
  private _shapeLayer: Layer | null;

  public constructor(props: ToolProps) {
    super(props);

    const tabControl = this.drawingTool.getMapForm();
    this.tabState = tabControl.getState();

    this._action = null;
    this._circle = null;
    this._mouseDown = false;
    this._latlng = L.latLng(0, 0);

    this._maxCircleRadius = 100;
    this._minCircleRadius = 10;
    this._circleRadius = DEFAULT_RADIUS;

    this._accumulatedShape = null;
    this._shapeLayer = null;
  }

  public static NAME(): string {
    return "paint-drawing-tool";
  }

  public getName(): string {
    return PaintTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-paint-brush";
  }

  public getTitle(): string {
    return "Brush drawing tool";
  }

  public result = (): LayerType => {
    return "painted";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  public enable = (): void => {
    if (this._action == "draw") {
      this.disable();
    } else {
      this.enablePaint();
    }
  };

  /**
   * enables painting
   */
  private enablePaint = (): void => {
    this.startPaint();
  };

  /**
   * getter
   */
  public getMouseDown = (): boolean => {
    return this._mouseDown;
  };

  /**
   * getter
   */
  public getBrushSize = (): number => {
    return this._circleRadius;
  };

  /**
   * getter
   */
  public getBrushSizeConstraints = (): {
    maxBrushSize: number;
    minBrushSize: number;
  } => {
    return {
      maxBrushSize: this._maxCircleRadius,
      minBrushSize: this._minCircleRadius,
    };
  };

  /**
   * resizes brush size (changes circle radius)
   *
   * @param {Number} val
   */
  public resizeBrush = (val: number): void => {
    if (val && val <= this._maxCircleRadius && val >= this._minCircleRadius) {
      this._circleRadius = val;
      this._circle?.setRadius(val);
    }
  };

  /**
   * stops brush tool, and removes circle object from mouse cursor
   */
  public stop = (): void => {
    this._action = null;
    if (this._circle) {
      this._circle.remove();
    }
    this._removeMouseListener();
  };

  /**
   * creates circle around mouse cursor and applies event listeners
   */
  private startPaint = (): void => {
    this.stop();
    this._action = "draw";
    this._addMouseListener();
    if (this.leafletMap)
      this._circle = L.circleMarker(this._latlng, {
        color: DEFAULT_COLOR,
      })
        .setRadius(this._circleRadius)
        .addTo(this.leafletMap);
  };

  /**
   * removes all accumulated circles (painted polygons)
   */
  private clearPainted = (): void => {
    this._accumulatedShape = null;
    this._shapeLayer = null;
  };

  /**
   * taken from https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
   */
  private _pixelsToMeters = (): number => {
    if (!this.leafletMap) return 0;

    const metersPerPixel =
      (40075016.686 * Math.abs(Math.cos((this._latlng.lat * Math.PI) / 180))) /
      Math.pow(2, this.leafletMap.getZoom() + 8);

    return this._circleRadius * metersPerPixel;
  };

  /**
   * creates circle and appends it to accumulated circles object
   */
  private drawCircle = (): void => {
    const brushColor = this.tabState.getSelectedColor() || DEFAULT_COLOR;
    const brushStroke = this.tabState.getSelectedStroke() || STROKES[1].value;
    const turfCircle = circle(
      [this._latlng.lng, this._latlng.lat],
      this._pixelsToMeters(),
      {
        steps: 16,
        units: "meters",
      }
    );

    if (!this._accumulatedShape) {
      this._accumulatedShape = turfCircle;
    } else {
      this._accumulatedShape = union(
        this._accumulatedShape as TurfPolygon,
        turfCircle
      );
    }

    if (this._accumulatedShape)
      this._accumulatedShape.properties = {
        fill: brushColor,
        "stroke-width": brushStroke,
      };

    this._redrawShapes();
  };

  /**
   * got through all accumulated circles and out put them on the map
   */
  private _redrawShapes = (): void => {
    const selectedLayer = this.drawingTool.getState().selectedLayer;

    const simplified = simplifyFeature(
      this._accumulatedShape as turf.AllGeoJSON
    ) as GeoFeature;
    const coords = simplified.geometry.coordinates;
    const depth = getConversionDepth(this._accumulatedShape);
    const latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
    const color = this._accumulatedShape?.properties?.fill || DEFAULT_COLOR;
    const weight = this._accumulatedShape?.properties
      ? this._accumulatedShape?.properties["stroke-width"]
      : STROKES[1].value;

    const styles =
      selectedLayer && isLayerPoly(selectedLayer)
        ? highlightStyles
        : normalStyles;

    const opts =
      this._action === "erase"
        ? { color: ERASER_COLOR, draggable: false, transform: false }
        : {
            color,
            weight,
            draggable: true,
            transform: true,
          };

    const result = new (L as any).polygon(latlngs, { ...opts, ...styles });

    result?.dragging?.disable();

    // * remove previously appended object onto map, otherwise we'll have duplicates
    if (this._shapeLayer) this._shapeLayer.remove();
    // * this will just append shapes onto map, but not into featureGroup of all objects
    this._shapeLayer = result.addTo(this.leafletMap);
  };

  /**
   * when fired brush stroke is appended to map
   * created object is passed to 'createdListener' function of tool
   */
  private _fireCreatedShapes = (): void => {
    // console.log('%cfired', 'color: #085f89');

    this?.leafletMap?.fire(L.Draw.Event.CREATED, {
      layer: this._shapeLayer,
      layerType: this._action === "erase" ? "erased" : "painted",
    });

    this.clearPainted();
  };

  // ================= EVENT LISTENERS =================
  public _addMouseListener = (): void => {
    if (!this.leafletMap) return;
    this.leafletMap.on("mousemove", this._onMouseMove);
    this.leafletMap.on("mousedown", this._onMouseDown);
    this.leafletMap.on("mouseup", this._onMouseUp);
  };
  public _removeMouseListener = (): void => {
    if (!this.leafletMap) return;
    this.leafletMap.off("mousemove", this._onMouseMove);
    this.leafletMap.off("mousedown", this._onMouseDown);
    this.leafletMap.off("mouseup", this._onMouseUp);
  };
  public _onMouseDown = (event: LeafletMouseEvent): void => {
    if (!this.leafletMap) return;
    this.leafletMap.dragging.disable();
    this._mouseDown = true;
    this._onMouseMove(event);
  };
  public _onMouseUp = (): void => {
    if (!this.leafletMap) return;
    this.leafletMap.dragging.enable();
    this._mouseDown = false;
    this._fireCreatedShapes();
  };
  public _onMouseMove = (event: LeafletMouseEvent): void => {
    this._setLatLng(event.latlng);
    if (this._mouseDown) {
      this.drawCircle();
    }
  };
  // ================= EVENT LISTENERS END =================

  /**
   * updates latlng so circle around mouse cursor follows it
   */
  public _setLatLng = (latlng: LatLng): void => {
    if (latlng !== undefined) {
      this._latlng = latlng;
    }
    if (this._circle) {
      this._circle.setLatLng(this._latlng);
    }
  };

  /**
   * disables tool
   */
  public disable = (): void => {
    this.stop();
  };
}

export default PaintTool;
