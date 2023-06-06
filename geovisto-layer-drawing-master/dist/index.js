'use strict';

var L = require('leaflet');
require('leaflet-path-drag');
require('leaflet-path-transform');
require('leaflet-draw');
require('leaflet/dist/leaflet.css');
var turf = require('@turf/turf');
var circle = require('@turf/circle');
var union = require('@turf/union');
require('leaflet-pather');
var osmtogeojson = require('osmtogeojson');
var leafletGeosearch = require('leaflet-geosearch');
var geovisto = require('geovisto');
require('leaflet-draw/dist/leaflet.draw.css');
require('leaflet-snap');
require('leaflet-geometryutil');
var difference = require('@turf/difference');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var L__namespace = /*#__PURE__*/_interopNamespaceDefault(L);
var turf__namespace = /*#__PURE__*/_interopNamespaceDefault(turf);

/**
 * @author Andrej Tlcina
 */
const NOT_FOUND = -1;
const FIRST = 0;
const SPACE_BAR = 32;
const highlightStyles = { fillOpacity: 0.5, opacity: 0.2 };
const normalStyles = { fillOpacity: 0.2, opacity: 0.5 };
/**
 * icon options default
 */
const iconStarter = {
    shadowUrl: undefined,
    iconAnchor: new L.Point(12, 12),
    iconSize: new L.Point(24, 24),
};
const ICON_SRCS = [
    "https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png",
    "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Flag-1-Right-Azure-icon.png",
];
const COLORS = [
    "#1ABC9C",
    "#16A085",
    "#2ECC71",
    "#27AE60",
    "#3498DB",
    "#2980B9",
    "#9B59B6",
    "#8E44AD",
    "#34495E",
    "#2C3E50",
    "#F1C40F",
    "#F39C12",
    "#E67E22",
    "#D35400",
    "#E74C3C",
    "#C0392B",
    "#ECF0F1",
    "#BDC3C7",
    "#95A5A6",
    "#7F8C8D",
];
const STROKES = [
    { label: "thin", value: 3 },
    { label: "medium", value: 5, selected: true },
    { label: "bold", value: 7 },
];
const ADMIN_LEVELS = [
    { label: "State", value: 2 },
    { label: "Province", value: 4, selected: true },
    { label: "5 (depends on country)", value: 5 },
    { label: "6 (depends on country)", value: 6 },
    { label: "7 (depends on country)", value: 7 },
    { label: "8 (depends on country)", value: 8 },
    { label: "9 (depends on country)", value: 9 },
    { label: "10 (depends on country)", value: 10 },
];

/**
 * @author Andrej Tlcina
 */
/**
 * maps feature types to leaflet types
 */
const getLeafletTypeFromFeature = (feature) => {
    var _a;
    switch ((_a = feature === null || feature === void 0 ? void 0 : feature.geometry) === null || _a === void 0 ? void 0 : _a.type) {
        case "Polygon":
            return "polygon";
        case "LineString":
            return "polyline";
        case "Point":
            return "marker";
        default:
            return "";
    }
};
/**
 * converts GeoJSON properties to Leaflet options
 */
const convertPropertiesToOptions = (properties) => {
    const options = { draggable: true, transform: true };
    if (!properties)
        return options;
    options.weight = properties["stroke-width"] || STROKES[1].value;
    options.color = properties["fill"] || COLORS[0];
    options.fillOpacity = properties["fill-opacity"] || normalStyles.fillOpacity;
    options.opacity = properties["stroke-opacity"] || normalStyles.opacity;
    return options;
};
/**
 * converts Leaflet options to GeoJSON properties
 */
const convertOptionsToProperties = (options) => {
    const properties = { draggable: true, transform: true };
    properties["stroke-width"] = options.weight || STROKES[1].value;
    properties["fill"] = options.color || COLORS[0];
    // * so we don't save selected polygon
    properties["fill-opacity"] = normalStyles.fillOpacity;
    properties["stroke-opacity"] = normalStyles.opacity;
    return properties;
};
/**
 * returns GeoJSON representation, always array of them
 * used in case of selected layer, which can be 'Multi' object
 */
const getGeoJSONFeatures = (layer) => {
    if (!layer)
        return null;
    const drawnGeoJSON = layer.toGeoJSON();
    const feature = drawnGeoJSON.type === "FeatureCollection"
        ? drawnGeoJSON.features
        : [drawnGeoJSON];
    return feature;
};
/**
 * gets GeoJSON representation from layer structure
 * gets only first one, because 'Multi' object is not expected to be created
 *
 * @param {Layer} layer
 * @returns
 */
const getFirstGeoJSONFeature = (layer) => {
    if (!layer)
        return null;
    const geoFeatures = getGeoJSONFeatures(layer);
    const feature = geoFeatures ? geoFeatures[0] : null;
    return feature;
};
/**
 * checks if feature is polygon
 */
const isFeaturePoly = (feature) => {
    var _a, _b, _c, _d;
    if (!feature)
        return false;
    if ((feature === null || feature === void 0 ? void 0 : feature.type) === "FeatureCollection") {
        const f = feature.features[0];
        return (((_a = f === null || f === void 0 ? void 0 : f.geometry) === null || _a === void 0 ? void 0 : _a.type) === "Polygon" || ((_b = f === null || f === void 0 ? void 0 : f.geometry) === null || _b === void 0 ? void 0 : _b.type) === "MultiPolygon");
    }
    return (((_c = feature === null || feature === void 0 ? void 0 : feature.geometry) === null || _c === void 0 ? void 0 : _c.type) === "Polygon" ||
        ((_d = feature === null || feature === void 0 ? void 0 : feature.geometry) === null || _d === void 0 ? void 0 : _d.type) === "MultiPolygon");
};
/**
 * simplifies polygon feature according to pixels
 * AllGeoJSON was used here b/c that's what simplify takes
 */
const simplifyFeature = (feature, pixels) => {
    const tolerance = pixels || window.customTolerance;
    const result = turf__namespace.simplify(feature, { tolerance });
    return result;
};
/**
 * checks if layer structure is polygon
 */
const isLayerPoly = (layer) => {
    const feature = getFirstGeoJSONFeature(layer);
    return feature ? isFeaturePoly(feature) : false;
};
const getConversionDepth = (feature) => {
    var _a;
    let depth = 1;
    if (((_a = feature === null || feature === void 0 ? void 0 : feature.geometry) === null || _a === void 0 ? void 0 : _a.type) === "MultiPolygon") {
        depth = 2;
    }
    return depth;
};
/**
 * converts GeoJSON feature coords to leaflet coords
 * used only in one place, GeoFeature was selected here b/c features that are appended to exported GeoJSON have this type
 *
 * */
const convertCoords = (feature) => {
    if (!feature)
        return null;
    const coords = feature.geometry.coordinates;
    const depth = getConversionDepth(feature);
    if (feature.geometry.type === "Point") {
        return L.GeoJSON.coordsToLatLng(coords);
    }
    else if (feature.geometry.type === "LineString") {
        return L.GeoJSON.coordsToLatLngs([coords], 1);
    }
    else {
        return L.GeoJSON.coordsToLatLngs(coords, depth);
    }
};
/**
 * helper function for morphing GeoJSON feature to Polygon {Layer} structure
 */
const morphFeatureToPolygon = (feature, options = {}, simplify = false) => {
    const depth = getConversionDepth(feature);
    const simplified = simplify
        ? simplifyFeature(feature)
        : feature;
    const coords = simplified.geometry.coordinates;
    const latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
    const result = new L.polygon(latlngs, Object.assign(Object.assign({}, options), { draggable: true, transform: true }));
    result.layerType = "polygon";
    if (result.dragging)
        result.dragging.disable();
    return result;
};

/**
 * @author Andrej Tlcina
 */
/**
 * @brief is array or object empty
 */
const isEmpty = (obj) => {
    return (typeof obj === "object" && obj !== null && Object.keys(obj).length === 0);
};
const sortReverseAlpha = (a, b) => {
    if (a < b)
        return 1;
    if (a > b)
        return -1;
    return 0;
};
const getIntervalStep = (n) => {
    if (!n)
        return 0.0;
    const split = String(n).split(".");
    if (split.length === 2) {
        const after = split[1];
        const length = after.length - 1 < 0 ? 0 : after.length;
        const allZeros = [...Array(length)].join("0");
        if (length === 1)
            return 0.01;
        else if (length === 0)
            return 0.1;
        else
            return Number(`0.${allZeros}1`);
    }
    return 0.0;
};

/**
 * Class is Abstract for Drawing tool/feature
 *
 * Drawing tool/feature enables user to create geospatial objects
 *
 * Each tool/feature creates different objects or has different approach for the object creation
 */
class AbstractTool {
    constructor(props) {
        var _a, _b;
        // * keeps DrawingLayerTool class/object
        this.drawingTool = props.drawingTool;
        this.sidebar = props.drawingTool.getMapForm();
        this.leafletMap = (_b = (_a = props.drawingTool.getMap()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.getLeafletMap();
        // * variable for keeping L.Draw object so it is possible to enable/disable it
        this.activetool = null;
        // * flag to find out if tool/feature is active
        this._isActive = false;
    }
    static NAME() {
        return "abstract-drawing-tool";
    }
    /**
     * to be extended
     */
    getName() {
        return AbstractTool.NAME();
    }
    /**
     * to be extended
     */
    getIconName() {
        return "fa fa-pencil";
    }
    /**
     * to be extended
     */
    getTitle() {
        return "Abstract drawing tool";
    }
    /**
     * to be extended
     */
    result() {
        return "";
    }
    canBeCanceled() {
        return false;
    }
    _redrawSidebar(type) {
        this.drawingTool.redrawMapForm(type || "");
    }
    setCurrentToolAsEnabled() {
        this.sidebar.getState().setEnabledTool(this);
    }
    /**
     * because I want to run setCurrentToolAsEnabled every time enabled is run I wrap it with this function
     */
    activate() {
        this.setCurrentToolAsEnabled();
        this.enable();
        this._isActive = true;
        this._redrawSidebar(this.result());
    }
    deactivate() {
        this.disable();
        this.activetool = null;
        this._isActive = false;
        this.sidebar.getState().setEnabledTool(null);
        this._redrawSidebar();
    }
    /**
     * to be extended
     */
    enable() {
        this._redrawSidebar(this.result());
    }
    /**
     * to be extended
     */
    disable() {
        const activeTool = this.activetool;
        if (activeTool) {
            activeTool.disable();
        }
    }
    /**
     *
     * @returns currently selected geo. object
     */
    getSelectedLayer() {
        return this.drawingTool.getState().selectedLayer;
    }
    isToolActive() {
        return this._isActive;
    }
}

class EditTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "";
        };
        this.enable = () => {
            const selectedLayer = this.getSelectedLayer();
            EditTool.initNodeEdit(selectedLayer);
        };
    }
    static NAME() {
        return "edit-drawing-tool";
    }
    getName() {
        return EditTool.NAME();
    }
    getIconName() {
        return "fa fa-square";
    }
    getTitle() {
        return "Edit nodes tool";
    }
    static initNodeEdit(selectedLayer, disable = false) {
        if (selectedLayer === null || selectedLayer === void 0 ? void 0 : selectedLayer.editing) {
            if (selectedLayer.editing._enabled || disable) {
                selectedLayer.editing.disable();
            }
            else {
                selectedLayer.editing.enable();
            }
        }
    }
}
EditTool.disableNodeEdit = (selectedEl) => {
    EditTool.initNodeEdit(selectedEl, true);
};

class DeselectTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "";
        };
        this.enable = () => {
            const selected = this.getSelectedLayer();
            DeselectTool.deselect(selected, this.drawingTool);
        };
    }
    static NAME() {
        return "deselect-drawing-tool";
    }
    getName() {
        return DeselectTool.NAME();
    }
    getIconName() {
        return "fa fa-star-half-o";
    }
    getTitle() {
        return "Deselect tool";
    }
    static deselect(selected, tool) {
        var _a;
        if ((_a = selected === null || selected === void 0 ? void 0 : selected.editing) === null || _a === void 0 ? void 0 : _a._enabled) {
            selected.editing.disable();
        }
        if (selected) {
            tool === null || tool === void 0 ? void 0 : tool.normalizeElement(selected);
            EditTool.initNodeEdit(selected, true);
            tool === null || tool === void 0 ? void 0 : tool.getState().clearSelectedLayer();
            tool === null || tool === void 0 ? void 0 : tool.redrawMapForm("");
            document.querySelector(".leaflet-container").style.cursor = "";
        }
    }
}

const DEFAULT_COLOR = "#333333";
const DEFAULT_RADIUS = 30;
const ERASER_COLOR$1 = "#ee000055";
class PaintTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "painted";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this.enable = () => {
            if (this._action == "draw") {
                this.disable();
            }
            else {
                this.enablePaint();
            }
        };
        /**
         * enables painting
         */
        this.enablePaint = () => {
            this.startPaint();
        };
        /**
         * getter
         */
        this.getMouseDown = () => {
            return this._mouseDown;
        };
        /**
         * getter
         */
        this.getBrushSize = () => {
            return this._circleRadius;
        };
        /**
         * getter
         */
        this.getBrushSizeConstraints = () => {
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
        this.resizeBrush = (val) => {
            var _a;
            if (val && val <= this._maxCircleRadius && val >= this._minCircleRadius) {
                this._circleRadius = val;
                (_a = this._circle) === null || _a === void 0 ? void 0 : _a.setRadius(val);
            }
        };
        /**
         * stops brush tool, and removes circle object from mouse cursor
         */
        this.stop = () => {
            this._action = null;
            if (this._circle) {
                this._circle.remove();
            }
            this._removeMouseListener();
        };
        /**
         * creates circle around mouse cursor and applies event listeners
         */
        this.startPaint = () => {
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
        this.clearPainted = () => {
            this._accumulatedShape = null;
            this._shapeLayer = null;
        };
        /**
         * taken from https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
         */
        this._pixelsToMeters = () => {
            if (!this.leafletMap)
                return 0;
            const metersPerPixel = (40075016.686 * Math.abs(Math.cos((this._latlng.lat * Math.PI) / 180))) /
                Math.pow(2, this.leafletMap.getZoom() + 8);
            return this._circleRadius * metersPerPixel;
        };
        /**
         * creates circle and appends it to accumulated circles object
         */
        this.drawCircle = () => {
            const brushColor = this.tabState.getSelectedColor() || DEFAULT_COLOR;
            const brushStroke = this.tabState.getSelectedStroke() || STROKES[1].value;
            const turfCircle = circle([this._latlng.lng, this._latlng.lat], this._pixelsToMeters(), {
                steps: 16,
                units: "meters",
            });
            if (!this._accumulatedShape) {
                this._accumulatedShape = turfCircle;
            }
            else {
                this._accumulatedShape = union(this._accumulatedShape, turfCircle);
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
        this._redrawShapes = () => {
            var _a, _b, _c, _d, _e;
            const selectedLayer = this.drawingTool.getState().selectedLayer;
            const simplified = simplifyFeature(this._accumulatedShape);
            const coords = simplified.geometry.coordinates;
            const depth = getConversionDepth(this._accumulatedShape);
            const latlngs = L.GeoJSON.coordsToLatLngs(coords, depth);
            const color = ((_b = (_a = this._accumulatedShape) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.fill) || DEFAULT_COLOR;
            const weight = ((_c = this._accumulatedShape) === null || _c === void 0 ? void 0 : _c.properties)
                ? (_d = this._accumulatedShape) === null || _d === void 0 ? void 0 : _d.properties["stroke-width"]
                : STROKES[1].value;
            const styles = selectedLayer && isLayerPoly(selectedLayer)
                ? highlightStyles
                : normalStyles;
            const opts = this._action === "erase"
                ? { color: ERASER_COLOR$1, draggable: false, transform: false }
                : {
                    color,
                    weight,
                    draggable: true,
                    transform: true,
                };
            const result = new L.polygon(latlngs, Object.assign(Object.assign({}, opts), styles));
            (_e = result === null || result === void 0 ? void 0 : result.dragging) === null || _e === void 0 ? void 0 : _e.disable();
            // * remove previously appended object onto map, otherwise we'll have duplicates
            if (this._shapeLayer)
                this._shapeLayer.remove();
            // * this will just append shapes onto map, but not into featureGroup of all objects
            this._shapeLayer = result.addTo(this.leafletMap);
        };
        /**
         * when fired brush stroke is appended to map
         * created object is passed to 'createdListener' function of tool
         */
        this._fireCreatedShapes = () => {
            // console.log('%cfired', 'color: #085f89');
            var _a;
            (_a = this === null || this === void 0 ? void 0 : this.leafletMap) === null || _a === void 0 ? void 0 : _a.fire(L.Draw.Event.CREATED, {
                layer: this._shapeLayer,
                layerType: this._action === "erase" ? "erased" : "painted",
            });
            this.clearPainted();
        };
        // ================= EVENT LISTENERS =================
        this._addMouseListener = () => {
            if (!this.leafletMap)
                return;
            this.leafletMap.on("mousemove", this._onMouseMove);
            this.leafletMap.on("mousedown", this._onMouseDown);
            this.leafletMap.on("mouseup", this._onMouseUp);
        };
        this._removeMouseListener = () => {
            if (!this.leafletMap)
                return;
            this.leafletMap.off("mousemove", this._onMouseMove);
            this.leafletMap.off("mousedown", this._onMouseDown);
            this.leafletMap.off("mouseup", this._onMouseUp);
        };
        this._onMouseDown = (event) => {
            if (!this.leafletMap)
                return;
            this.leafletMap.dragging.disable();
            this._mouseDown = true;
            this._onMouseMove(event);
        };
        this._onMouseUp = () => {
            if (!this.leafletMap)
                return;
            this.leafletMap.dragging.enable();
            this._mouseDown = false;
            this._fireCreatedShapes();
        };
        this._onMouseMove = (event) => {
            this._setLatLng(event.latlng);
            if (this._mouseDown) {
                this.drawCircle();
            }
        };
        // ================= EVENT LISTENERS END =================
        /**
         * updates latlng so circle around mouse cursor follows it
         */
        this._setLatLng = (latlng) => {
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
        this.disable = () => {
            this.stop();
        };
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
    static NAME() {
        return "paint-drawing-tool";
    }
    getName() {
        return PaintTool.NAME();
    }
    getIconName() {
        return "fa fa-paint-brush";
    }
    getTitle() {
        return "Brush drawing tool";
    }
}
PaintTool.result = "painted";

const ERASER_COLOR = "#ee000055";
class EraseTool extends PaintTool {
    constructor(props) {
        var _a;
        super(props);
        this.result = () => {
            return "erased";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this.created = (e) => {
            var _a;
            const layer = e.layer;
            if (!layer)
                return;
            if (e.layerType === this.result())
                (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.removeLayer(layer);
        };
        this.enable = () => {
            if (this._action == "erase") {
                this.disable();
            }
            else {
                this.startErase();
            }
        };
        /**
         * creates circle around mouse cursor and applies event listeners
         */
        this.startErase = () => {
            this.stop();
            this._action = "erase";
            this._addMouseListener();
            if (this.leafletMap)
                this._circle = L.circleMarker(this._latlng, {
                    color: ERASER_COLOR,
                })
                    .setRadius(this._circleRadius)
                    .addTo(this.leafletMap);
        };
        /**
         * button for erasing is clicked
         */
        this.erase = (event) => {
            if (event.type == "mousedown") {
                L.DomEvent.stop(event);
                return;
            }
        };
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.on("draw:created", (e) => this.created(e));
    }
    static NAME() {
        return "eraser-drawing-tool";
    }
    getName() {
        return EraseTool.NAME();
    }
    getIconName() {
        return "fa fa-eraser";
    }
    getTitle() {
        return "Eraser tool";
    }
}
EraseTool.result = "erased";

/**
 * extends polyline, it does not change a lot just its type to 'knife'
 */
L.Draw.Slice = L.Draw.Polyline.extend({
    statics: {
        TYPE: "knife",
    },
    // @method initialize(): void
    initialize: function (map, options) {
        // if touch, switch to touch icon
        if (L.Browser.touch) {
            this.options.icon = this.options.touchIcon;
        }
        // Need to set this here to ensure the correct message is used.
        this.options.drawError.message = L.drawLocal.draw.handlers.polyline.error;
        // Merge default drawError options with custom options
        if (options && options.drawError) {
            options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
        }
        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Draw.Slice.TYPE;
        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },
    _calculateFinishDistance: function (potentialLatLng) {
        let lastPtDistance;
        if (this._markers.length > 0) {
            let finishMarker;
            if (this.type === L.Draw.Polyline.TYPE ||
                this.type === L.Draw.Slice.TYPE) {
                finishMarker = this._markers[this._markers.length - 1];
            }
            else if (this.type === L.Draw.Polygon.TYPE) {
                finishMarker = this._markers[0];
            }
            else {
                return Infinity;
            }
            const lastMarkerPoint = this._map.latLngToContainerPoint(finishMarker.getLatLng()), potentialMarker = new L.Marker(potentialLatLng, {
                icon: this.options.icon,
                zIndexOffset: this.options.zIndexOffset * 2,
            });
            const potentialMarkerPint = this._map.latLngToContainerPoint(potentialMarker.getLatLng());
            lastPtDistance = lastMarkerPoint.distanceTo(potentialMarkerPint);
        }
        else {
            lastPtDistance = Infinity;
        }
        return lastPtDistance;
    },
});

class GeometricSliceTool extends AbstractTool {
    constructor(props) {
        var _a;
        super(props);
        this.canBeCanceled = () => {
            return true;
        };
        this.created = (e) => {
            const layer = e.layer;
            if (!layer)
                return;
            // * SLICE
            if (e.layerType === GeometricSliceTool.result) {
                this.polySlice(layer);
                this.deactivate();
            }
        };
        this._dividePoly = () => {
            if (!this.leafletMap)
                return;
            this.activetool = new L.Draw.Slice(this.leafletMap, {
                shapeOptions: {
                    color: "#333",
                    weight: 3,
                    draggable: true,
                    transform: true,
                    guideLayers: this.sidebar.getState().guideLayers,
                },
            });
            this.activetool.enable();
        };
        this.enable = () => {
            this._dividePoly();
        };
        this.disable = () => {
            const activeTool = this.activetool;
            if (activeTool) {
                activeTool.disable();
            }
            // * hide extra btn for disabling tools
            const query = `.drawingtoolbar .${this.getName()} .extra-btn`;
            const divideBtn = document.querySelector(query);
            if (divideBtn)
                divideBtn.classList.add("hide");
        };
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.on("draw:created", this.created);
    }
    static NAME() {
        return "geometric-slice-drawing-tool";
    }
    getName() {
        return GeometricSliceTool.NAME();
    }
    getIconName() {
        return "fa fa-scissors";
    }
    getTitle() {
        return "Division tool";
    }
    /**
     * @brief - inspired by https://gis.stackexchange.com/questions/344068/splitting-a-polygon-by-multiple-linestrings-leaflet-and-turf-js
     *        - slices selected object with currently created one
     */
    polySlice(layer) {
        // * layer will always be 'polyline'
        const lineFeat = getFirstGeoJSONFeature(layer);
        const selectedLayer = this.drawingTool.getState().selectedLayer;
        if (lineFeat && selectedLayer) {
            const THICK_LINE_WIDTH = 0.00001;
            const THICK_LINE_UNITS = "kilometers";
            let offsetLine;
            const selectedFeature = getFirstGeoJSONFeature(selectedLayer);
            const isFeatPoly = isFeaturePoly(selectedFeature);
            if (isFeatPoly) {
                let coords;
                let latlngs;
                try {
                    offsetLine = turf__namespace.lineOffset(lineFeat, THICK_LINE_WIDTH, {
                        units: THICK_LINE_UNITS,
                    });
                    const polyCoords = [];
                    // * push all of the coordinates of original line
                    for (let j = 0; j < lineFeat.geometry.coordinates.length; j++) {
                        polyCoords.push(lineFeat.geometry.coordinates[j]);
                    }
                    // * push all of the coordinates of offset line
                    for (let j = offsetLine.geometry.coordinates.length - 1; j >= 0; j--) {
                        polyCoords.push(offsetLine.geometry.coordinates[j]);
                    }
                    // * to create linear ring
                    polyCoords.push(lineFeat.geometry.coordinates[0]);
                    const thickLineString = turf__namespace.lineString(polyCoords);
                    const thickLinePolygon = turf__namespace.lineToPolygon(thickLineString);
                    const clipped = turf__namespace.difference(selectedFeature, thickLinePolygon);
                    // clipped = simplifyFeature(clipped);
                    if (!clipped)
                        return;
                    coords = clipped.geometry.coordinates;
                    this.drawingTool.getState().removeSelectedLayer();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    coords.forEach((coord) => {
                        latlngs = L.GeoJSON.coordsToLatLngs(coord, 1);
                        const result = new L.polygon(latlngs, Object.assign(Object.assign({}, selectedLayer.options), normalStyles));
                        result.layerType = "polygon";
                        this.drawingTool.getState().addLayer(result);
                    });
                }
                catch (error) {
                    console.error({ coords, latlngs, error });
                }
            }
        }
    }
}
GeometricSliceTool.result = "knife";

class FreehandSliceTool extends GeometricSliceTool {
    constructor(props) {
        super(props);
        this.canBeCanceled = () => {
            return true;
        };
        this._enableSlicing = () => {
            var _a, _b;
            const pather = this.pather;
            const patherStatus = this.patherActive;
            if (!patherStatus) {
                (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.addLayer(pather);
            }
            else {
                (_b = this.leafletMap) === null || _b === void 0 ? void 0 : _b.removeLayer(pather);
            }
            this.patherActive = !patherStatus;
        };
        /**
         * @brief slices selected polygon with pather's freehand line
         */
        this.createdPath = (e) => {
            // * get polyline object
            const layer = e.polyline.polyline;
            // * get Leaflet map
            const map = this.leafletMap;
            // * get sidebar state and pather object
            const pather = this.pather;
            // * SLICE
            this.polySlice(layer);
            // * we do not want path to stay
            pather.removePath(layer);
            // * we do not want to keep cutting (drawing)
            map === null || map === void 0 ? void 0 : map.removeLayer(pather);
            // * restore state
            this.deactivate();
        };
        this.enable = () => {
            this._enableSlicing();
        };
        this.disable = () => {
            var _a;
            (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.removeLayer(this.pather);
            this.patherActive = false;
            const activeTool = this.activetool;
            if (activeTool) {
                activeTool.disable();
            }
            // * hide extra btn for disabling tools
            const query = `.drawingtoolbar .${this.getName()} .extra-btn`;
            const divideBtn = document.querySelector(query);
            if (divideBtn)
                divideBtn.classList.add("hide");
        };
        // * using any b/c I dont know how to declare class Pather in leaflet module :(
        this.pather = new L.Pather({
            strokeWidth: 3,
            smoothFactor: 5,
            moduleClass: "leaflet-pather",
            pathColour: "#333",
        });
        this.patherActive = false;
        this.pather.on("created", this.createdPath);
    }
    static NAME() {
        return "freehand-slice-drawing-tool";
    }
    getName() {
        return FreehandSliceTool.NAME();
    }
    getIconName() {
        return "fa fa-cutlery";
    }
    getTitle() {
        return "Freehand slice tool";
    }
}
FreehandSliceTool.result = "";

/**
 * @author Andrej Tlcina
 */
/**
 * extends marker so we can change its options while marker tool is enabled
 */
L.Draw.ExtendedMarker = L.Draw.Marker.extend({
    setIconOptions: function (iconOpts) {
        this.options.icon = iconOpts;
    },
});
class MarkerTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "marker";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this._markerCreate = (connectClick = false) => {
            if (!this.leafletMap)
                return;
            const additionalOpts = {
                iconUrl: this.sidebar.getState().getSelectedIcon(),
                connectClick,
            };
            const icon = new L.Icon(Object.assign(Object.assign({}, iconStarter), additionalOpts));
            const { guideLayers } = this.sidebar.getState();
            this.activetool = new L.Draw.ExtendedMarker(this.leafletMap, {
                icon,
                draggable: true,
                transform: true,
                repeatMode: true,
                guideLayers,
                snapVertices: false,
            });
            this.activetool.enable();
        };
        this.enable = () => {
            this._markerCreate();
        };
    }
    static NAME() {
        return "marker-drawing-tool";
    }
    getName() {
        return MarkerTool.NAME();
    }
    getIconName() {
        return "fa fa-map-marker";
    }
    getTitle() {
        return "Marker drawing tool";
    }
}
MarkerTool.result = "marker";

class TopologyTool extends MarkerTool {
    constructor(props) {
        var _a;
        super(props);
        this.result = () => {
            return "marker";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this.created = (e) => {
            const layer = e.layer;
            if (!layer)
                return;
            layer.layerType = e.layerType;
            // * MARKER
            if (this.isConnectMarker(layer)) {
                this.plotTopology(null, layer);
            }
        };
        this.isConnectMarker = (layer) => {
            return this.drawingTool.getState().isConnectMarker(layer);
        };
        this.enable = () => {
            this._markerCreate(true);
        };
        (_a = this.leafletMap) === null || _a === void 0 ? void 0 : _a.on("draw:created", this.created);
    }
    static NAME() {
        return "topology-drawing-tool";
    }
    getName() {
        return TopologyTool.NAME();
    }
    getIconName() {
        return "fa fa-sitemap";
    }
    getTitle() {
        return "Topology drawing tool";
    }
    plotTopology(chosen = null, createdMarker = null) {
        const toolState = this.drawingTool.getState();
        const selectedLayer = toolState.selectedLayer;
        const layersObj = toolState.featureGroup._layers;
        const layerArr = [...Object.values(layersObj)];
        const allConnected = layerArr
            .filter((_) => toolState.isConnectMarker(_))
            .reverse();
        let _markers = chosen || allConnected;
        _markers = createdMarker ? [createdMarker, ..._markers] : _markers;
        const index = 0;
        // * chronologically the last created
        const firstMarker = _markers[index];
        const selectedLayerIsConnectMarker = toolState.selectedLayerIsConnectMarker();
        // * choose selected object or the second to last created
        const secondMarker = selectedLayerIsConnectMarker && !chosen
            ? selectedLayer
            : _markers[index + 1];
        if (secondMarker) {
            const { lat: fLat, lng: fLng } = firstMarker.getLatLng();
            const { lat: sLat, lng: sLng } = secondMarker.getLatLng();
            // * create vertice
            const _latlng = [L.latLng(fLat, fLng), L.latLng(sLat, sLng)];
            const poly = new L.polyline(_latlng, Object.assign({ color: "#563412", weight: 3 }, normalStyles));
            poly.layerType = "vertice";
            if (!this._haveSameVertice(poly)) {
                toolState.pushVertice(poly);
                toolState.addLayer(poly);
            }
        }
        this._mapMarkersToVertices(_markers);
    }
    /**
     * @brief loops through each of the vertices and checks if
     *        vertice with certain coordinates is already created
     */
    _haveSameVertice(current) {
        const found = this.drawingTool
            .getState()
            .createdVertices.find((vertice) => {
            const firstPointOfVertice = vertice.getLatLngs()[0];
            const secondPointOfVertice = vertice.getLatLngs()[1];
            const firstPointOfCurrent = current.getLatLngs()[0];
            const secondPointOfCurrent = current.getLatLngs()[1];
            return ((firstPointOfVertice.equals(firstPointOfCurrent) &&
                secondPointOfVertice.equals(secondPointOfCurrent)) ||
                (firstPointOfVertice.equals(secondPointOfCurrent) &&
                    secondPointOfVertice.equals(firstPointOfCurrent)));
        });
        return Boolean(found);
    }
    /**
     * @brief maps through each of the markes and if its coordinates fit vertice's coordinates
     *        then vertice is mapped onto marker id
     */
    _mapMarkersToVertices(_markers) {
        const toolState = this.drawingTool.getState();
        _markers
            .map((marker) => ({
            latlng: marker.getLatLng(),
            lId: marker._leaflet_id,
            marker,
        }))
            .forEach(({ latlng, lId }) => {
            toolState.createdVertices.forEach((vertice, index) => {
                // * used indexing instead of another loop (vertices have only 2 points)
                const firstPoint = vertice.getLatLngs()[0];
                const secondPoint = vertice.getLatLngs()[1];
                const spread = toolState.mappedMarkersToVertices[lId] || {};
                // * depending on if first or second latlng of vertice matches with marker's latlng
                // * we save this information so we know which side we should move on drag
                if (firstPoint.equals(latlng)) {
                    toolState.setVerticesToMarker(lId, Object.assign(Object.assign({}, spread), { [`${index}-0`]: vertice }));
                }
                else if (secondPoint.equals(latlng)) {
                    toolState.setVerticesToMarker(lId, Object.assign(Object.assign({}, spread), { [`${index}-1`]: vertice }));
                }
            });
        });
    }
    /**
     * @brief event listener so vetice is dragged with marker
     */
    static applyTopologyMarkerListeners(layer, state) {
        layer.on("drag", (event) => {
            const { latlng, target } = event;
            const markerVertices = state.mappedMarkersToVertices[target._leaflet_id];
            TopologyTool.changeVerticesLocation(latlng, markerVertices);
        });
    }
    /**
     * @brief called on drag to change vertice's point location
     */
    static changeVerticesLocation(latlng, markerVertices) {
        if (!markerVertices)
            return;
        Object.keys(markerVertices).forEach((key) => {
            const vertice = markerVertices[key];
            const splitKey = key === null || key === void 0 ? void 0 : key.split("-");
            const idx = splitKey ? splitKey[1] : undefined;
            if (idx === undefined)
                return;
            // ? for some reason cloneLatLngs has return type of LatLng[][] even though it returns value of type LatLng[]
            const latLngs = L.LatLngUtil.cloneLatLngs(vertice.getLatLngs());
            latLngs[Number(idx)] = latlng;
            vertice.setLatLngs(latLngs);
        });
    }
}

const MAX_CHOSEN = 2;
class JoinTool extends TopologyTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this.enable = () => {
            this._redrawSidebar(this.result());
            this._isActive = true;
            const toolState = this.drawingTool.getState();
            toolState.setSelecting(true);
            document.querySelector(".leaflet-container").style.cursor =
                "crosshair";
        };
        this.disable = () => {
            this._redrawSidebar(this.result());
            this._isActive = false;
            const toolState = this.drawingTool.getState();
            toolState.setSelecting(false);
            document.querySelector(".leaflet-container").style.cursor =
                "";
            this.deselectChosenLayers();
        };
        /**
         * checks if geo. object may be push to an array and be joined later on
         */
        this.canPushToChosen = (layer) => {
            const acceptableType = this.isConnectMarker(layer) || isLayerPoly(layer);
            if (isEmpty(this.chosenLayers)) {
                if (acceptableType)
                    return true;
            }
            else {
                const firstChosen = this.chosenLayers[FIRST];
                if (this.isConnectMarker(firstChosen) && this.isConnectMarker(layer))
                    return true;
                if (isLayerPoly(firstChosen) && isLayerPoly(layer))
                    return true;
            }
            return false;
        };
        this.chosenLayersArePolys = () => {
            const firstChosen = this.chosenLayers[FIRST];
            return isLayerPoly(firstChosen);
        };
        /**
         * checks if layers, to be joined, are markers
         */
        this.chosenLayersAreMarkers = () => {
            const firstChosen = this.chosenLayers[FIRST];
            return this.isConnectMarker(firstChosen);
        };
        /**
         * checks if maximum size of an array is reached
         */
        this.chosenLayersMaxed = () => {
            return this.chosenLayers.length === MAX_CHOSEN;
        };
        /**
         * pushes passed object into array, if length exceeds maximum array is shifted
         * so the lenght is constant
         */
        this.pushChosenLayer = (layer) => {
            if (this.chosenLayers.length >= MAX_CHOSEN) {
                this.chosenLayers.shift();
            }
            this.drawingTool.highlightElement(layer);
            this.chosenLayers.push(layer);
        };
        /**
         * deselects all selected ones
         */
        this.deselectChosenLayers = () => {
            this.chosenLayers.forEach((chosen) => this.drawingTool.normalizeElement(chosen));
            this.chosenLayers = [];
        };
        /**
         * removes all selected ones
         */
        this.clearChosenLayers = () => {
            this.chosenLayers.forEach((chosen) => this.drawingTool.getState().removeLayer(chosen));
            this.chosenLayers = [];
        };
        /**
         * layers are joined which means remove previous ones and append joined
         */
        this.pushJoinedToChosenLayers = (joined) => {
            this.clearChosenLayers();
            this.drawingTool.highlightElement(joined);
            this.chosenLayers.push(joined);
            this.drawingTool.getState().addLayer(joined);
        };
        /**
         * @brief unifies all the features in array
         */
        this._getSummedFeature = (features) => {
            if (!features || !Array.isArray(features))
                return null;
            let summedFeature = features[0];
            for (let index = 1; index < features.length; index++) {
                const feature = features[index];
                const isfeaturePoly = isFeaturePoly(feature);
                if (isfeaturePoly) {
                    const result = union(feature, summedFeature);
                    if (result)
                        summedFeature = result;
                }
            }
            return summedFeature;
        };
        this.joinChosen = (drawObject) => {
            const unfit = !this.canPushToChosen(drawObject);
            if (unfit)
                return;
            this.pushChosenLayer(drawObject);
            // * if true that means user selected second geo. object of the same correct type
            if (this.chosenLayersMaxed()) {
                // * if all polys unify them
                if (this.chosenLayersArePolys()) {
                    const { chosenLayers } = this;
                    const chosenFeatures = chosenLayers
                        .filter((c) => isLayerPoly(c))
                        .map((chosen) => getGeoJSONFeatures(chosen));
                    if (chosenFeatures.length !== chosenLayers.length)
                        return;
                    const first = this._getSummedFeature(chosenFeatures[0]);
                    const second = this._getSummedFeature(chosenFeatures[1]);
                    if (first && second) {
                        const resultFeature = union(first, second);
                        const opts = Object.assign(Object.assign({}, chosenLayers[0].options), chosenLayers[1].options);
                        if (resultFeature) {
                            const result = morphFeatureToPolygon(resultFeature, opts);
                            this.pushJoinedToChosenLayers(result);
                        }
                    }
                    this._redrawSidebar(drawObject.layerType);
                }
                // *  if all markers plot topology
                if (this.chosenLayersAreMarkers()) {
                    const { chosenLayers } = this;
                    this.plotTopology(chosenLayers);
                    this.deselectChosenLayers();
                    this.clearChosenLayers();
                    this._redrawSidebar();
                }
            }
        };
        // * selected for join
        this.chosenLayers = [];
    }
    static NAME() {
        return "join-drawing-tool";
    }
    getName() {
        return JoinTool.NAME();
    }
    getIconName() {
        return "fa fa-plus-circle";
    }
    getTitle() {
        return "Join drawing tool";
    }
}

class LineTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "polyline";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this._polylineCreate = () => {
            if (!this.leafletMap)
                return;
            this.activetool = new L.Draw.Polyline(this.leafletMap, {
                shapeOptions: {
                    color: this.sidebar.getState().getSelectedColor(),
                    weight: this.sidebar.getState().getSelectedStroke(),
                    draggable: true,
                    transform: true,
                },
                guideLayers: this.sidebar.getState().guideLayers,
                repeatMode: true,
            });
            this.activetool.enable();
        };
        this.enable = () => {
            this._polylineCreate();
        };
    }
    static NAME() {
        return "line-drawing-tool";
    }
    getName() {
        return LineTool.NAME();
    }
    getIconName() {
        return "fa fa-minus";
    }
    getTitle() {
        return "Line drawing tool";
    }
}

class PolygonTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "polygon";
        };
        this.canBeCanceled = () => {
            return true;
        };
        this._polygonCreate = () => {
            if (!this.leafletMap)
                return;
            this.activetool = new L.Draw.Polygon(this.leafletMap, {
                allowIntersection: false,
                drawError: {
                    color: "#e1e100",
                    message: "<strong>You cannot draw that!<strong>",
                },
                shapeOptions: {
                    color: this.sidebar.getState().getSelectedColor(),
                    weight: this.sidebar.getState().getSelectedStroke(),
                    draggable: true,
                    transform: true,
                },
                guideLayers: this.sidebar.getState().guideLayers,
                snapDistance: 5,
                repeatMode: true,
            });
            this.activetool.enable();
        };
        this.enable = () => {
            this._polygonCreate();
        };
    }
    static NAME() {
        return "polygon-drawing-tool";
    }
    getName() {
        return PolygonTool.NAME();
    }
    getIconName() {
        return "fa fa-star";
    }
    getTitle() {
        return "Polygon drawing tool";
    }
}
PolygonTool.result = "polygon";

class RemoveTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "";
        };
        this.enable = () => {
            this.removeElement();
        };
    }
    static NAME() {
        return "remove-drawing-tool";
    }
    getName() {
        return RemoveTool.NAME();
    }
    getIconName() {
        return "fa fa-times";
    }
    getTitle() {
        return "Remove tool";
    }
    removeElement() {
        const state = this.drawingTool.getState();
        const selectedLayer = this.getSelectedLayer();
        // * if marker is being removed, remove its vertices if any
        if (selectedLayer && state.selectedLayerIsConnectMarker()) {
            state.removeMarkersMappedVertices(selectedLayer._leaflet_id);
        }
        if ((selectedLayer === null || selectedLayer === void 0 ? void 0 : selectedLayer.layerType) === "vertice") {
            state.removeGivenVertice(selectedLayer._leaflet_id);
        }
        state.removeSelectedLayer();
        this._redrawSidebar();
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class SearchTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "search";
        };
        this.enable = () => {
            this._redrawSidebar(this.result());
        };
    }
    static NAME() {
        return "search-drawing-tool";
    }
    getName() {
        return SearchTool.NAME();
    }
    getIconName() {
        return "fa fa-search";
    }
    getTitle() {
        return "Search drawing tool";
    }
}
SearchTool.result = "search";
/**
 * append marker on map with given latlng
 */
SearchTool.putMarkerOnMap = (featureGroup, latlng, popup, iconUrl, connectClick = false) => {
    const additionalOpts = { iconUrl: iconUrl || ICON_SRCS[0], connectClick };
    const icon = new L.Icon(Object.assign(Object.assign({}, iconStarter), additionalOpts));
    const marker = new L.Marker.Touch(latlng, { icon });
    if (popup) {
        marker.bindPopup(popup, { closeOnClick: false, autoClose: false });
        marker.popupContent = popup;
    }
    marker.layerType = "marker";
    featureGroup.addLayer(marker);
    // map.fire(L.Draw.Event.CREATED, { layer: marker, layerType: 'marker' });
    return marker;
};
/**
 * sends request to OSM with given query
 */
SearchTool.geoSearch = (featureGroup, query = "") => __awaiter(void 0, void 0, void 0, function* () {
    if (!query)
        return;
    // setup
    const provider = new leafletGeosearch.OpenStreetMapProvider();
    // search
    const results = yield provider.search({ query });
    return results;
});
SearchTool.fetchAreas = (countryCode, adminLevel, highQuality, color) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const result = { data: [], error: "" };
    const endPoint = "https://overpass-api.de/api/interpreter?data=[out:json];";
    const query = `area["ISO3166-1"="${countryCode}"]->.searchArea;(relation["admin_level"="${adminLevel}"](area.searchArea););out;>;out skel qt;`;
    try {
        const response = yield fetch(endPoint + query);
        const data = yield response.json();
        const gJSON = osmtogeojson(data);
        const opts = {
            color,
            draggable: true,
            transform: true,
        };
        (_c = (_b = gJSON === null || gJSON === void 0 ? void 0 : gJSON.features) === null || _b === void 0 ? void 0 : _b.filter((feat) => { var _b; return ((_b = feat === null || feat === void 0 ? void 0 : feat.geometry) === null || _b === void 0 ? void 0 : _b.type) === "Polygon"; })) === null || _c === void 0 ? void 0 : _c.forEach((feat) => {
            var _b;
            let coords = feat.geometry.coordinates;
            if (!highQuality) {
                const simplified = simplifyFeature(feat, 0.01);
                coords = simplified.geometry.coordinates;
            }
            const latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
            const drawnCountry = new L.polygon(latlngs, Object.assign(Object.assign({}, opts), normalStyles));
            (_b = drawnCountry === null || drawnCountry === void 0 ? void 0 : drawnCountry.dragging) === null || _b === void 0 ? void 0 : _b.disable();
            drawnCountry.layerType = "polygon";
            drawnCountry.countryCode = countryCode;
            result.data.push(drawnCountry);
        });
        result.error = "";
    }
    catch (err) {
        result.error = "There was a problem, re-try later.";
        console.error(err);
    }
    return result;
});

class TransformTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "";
        };
        this.enable = () => {
            const selected = this.getSelectedLayer();
            TransformTool.initTransform(selected);
        };
    }
    static NAME() {
        return "transform-drawing-tool";
    }
    getName() {
        return TransformTool.NAME();
    }
    getIconName() {
        return "fa fa-arrows-alt";
    }
    getTitle() {
        return "Transform tool";
    }
    static initTransform(drawObject, disable = false) {
        var _a, _b, _c, _d, _e;
        const layer = drawObject;
        if (layer === null || layer === void 0 ? void 0 : layer.transform) {
            if (layer.transform._enabled || disable) {
                layer.transform.disable();
                (_a = layer === null || layer === void 0 ? void 0 : layer.dragging) === null || _a === void 0 ? void 0 : _a.disable();
            }
            else {
                layer.transform.enable({ rotation: true, scaling: true });
                (_b = layer === null || layer === void 0 ? void 0 : layer.dragging) === null || _b === void 0 ? void 0 : _b.enable();
            }
        }
        else if ((layer === null || layer === void 0 ? void 0 : layer.layerType) === "marker") {
            if (((_c = layer === null || layer === void 0 ? void 0 : layer.dragging) === null || _c === void 0 ? void 0 : _c._enabled) || disable) {
                (_d = layer === null || layer === void 0 ? void 0 : layer.dragging) === null || _d === void 0 ? void 0 : _d.disable();
            }
            else {
                (_e = layer === null || layer === void 0 ? void 0 : layer.dragging) === null || _e === void 0 ? void 0 : _e.enable();
            }
        }
    }
}
TransformTool.disableTransform = (selectedEl) => {
    TransformTool.initTransform(selectedEl, true);
};

const EMPTY_GEOJSON = {
    type: "FeatureCollection",
    features: [],
};
/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolState extends geovisto.LayerToolState {
    /**
     * It creates a tool state.
     */
    constructor(tool) {
        super(tool);
        /**
         * clears extraSelected array and sets normal styles to each geo. object
         */
        this.clearExtraSelected = () => {
            this.extraSelected.forEach((selected) => {
                this.tool.normalizeElement(selected);
            });
            this.extraSelected = [];
        };
        /**
         * checks if layer is in extraSelected objects
         */
        this.isInExtraSelected = (layerId) => {
            const found = this.extraSelected
                .map((el) => el._leaflet_id)
                .indexOf(layerId);
            return found;
        };
        /**
         * checks if selected and passed object are of the same type
         */
        this.areSameType = (layer) => {
            if (!this.selectedLayer)
                return false;
            if (isLayerPoly(this.selectedLayer)) {
                return isLayerPoly(layer);
            }
            return this.selectedLayer.layerType === layer.layerType;
        };
        /**
         * add passed layer to array and highlights it
         */
        this.addExtraSelected = (layer) => {
            // * have only one type of object in array
            if (!this.areSameType(layer))
                return;
            const idx = this.isInExtraSelected(layer._leaflet_id);
            if (idx > -1) {
                this.tool.normalizeElement(layer);
                this.extraSelected.splice(idx, 1);
            }
            else {
                this.tool.highlightElement(layer);
                this.extraSelected.push(layer);
            }
        };
        /**
         * checks if markers is connect marker
         */
        this.isConnectMarker = (marker) => {
            var _a, _b, _c;
            return ((marker === null || marker === void 0 ? void 0 : marker.layerType) === "marker" &&
                ((_c = (_b = (_a = marker === null || marker === void 0 ? void 0 : marker.options) === null || _a === void 0 ? void 0 : _a.icon) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.connectClick));
        };
        /**
         * checks if selected layer is connect marker
         */
        this.selectedLayerIsConnectMarker = () => {
            return this.isConnectMarker(this.selectedLayer);
        };
        /**
         * Pushes vertice into created ones
         */
        this.pushVertice = (vertice) => {
            this.createdVertices.push(vertice);
        };
        /**
         * removes vertice based on given leaflet id
         *
         * @param {String} lId
         */
        this.removeGivenVertice = (lId) => {
            const idsOfVerticesToRemove = new Set([lId]);
            const result = this.removeMappedVertices(idsOfVerticesToRemove);
            const index = this.createdVertices.map((v) => v._leaflet_id).indexOf(lId);
            if (index !== NOT_FOUND) {
                this.createdVertices.splice(index, 1);
            }
            this.mappedMarkersToVertices = result;
        };
        /**
         * removes vertice which ids were passed
         *
         * @param {Set} idsOfVerticesToRemove
         * @returns {Object} mappedMarkersToVertices
         */
        this.removeMappedVertices = (idsOfVerticesToRemove) => {
            // * copy object
            const newMapped = Object.assign({}, this.mappedMarkersToVertices);
            // *  go through each marker object, containing { [index]: vertice } pairs
            Object.values(newMapped).forEach((vertObj) => {
                // * now go through each index
                Object.keys(vertObj).forEach((key) => {
                    const vert = vertObj[key];
                    if (idsOfVerticesToRemove.has(vert._leaflet_id)) {
                        this.removeLayer(vert);
                        delete vertObj[key];
                    }
                });
            });
            return newMapped;
        };
        /**
         * takes in leaflet id and removes vertices mapped to marker
         */
        this.removeMarkersMappedVertices = (lId) => {
            var _a;
            const markerVertices = this.mappedMarkersToVertices[lId];
            const idsOfVerticesToRemove = new Set();
            // * save vertices' ids
            (_a = Object.values(markerVertices)) === null || _a === void 0 ? void 0 : _a.forEach((v) => idsOfVerticesToRemove.add(v._leaflet_id));
            // * remove vertices
            const newMapped = this.removeMappedVertices(idsOfVerticesToRemove);
            // * marker no longer has vertices, so remove it
            delete newMapped[lId];
            this.mappedMarkersToVertices = newMapped;
        };
        /**
         * saving topology information to marker
         */
        this.addMappedVertices = (layer, result) => {
            const lId = layer._leaflet_id;
            const mappedVertices = this.mappedMarkersToVertices[lId];
            const mappedProperty = {};
            Object.keys(mappedVertices).forEach((key) => {
                mappedProperty[key] = mappedVertices[key]._leaflet_id;
            });
            if (!isEmpty(mappedProperty))
                result.mappedVertices = mappedProperty;
        };
        /**
         * called so when we import topology dragging of vertices works
         */
        this.initMappedMarkersToVertices = (lType, result, source) => {
            if (lType === "marker" && source.mappedVertices) {
                this.mappedMarkersToVertices[result._leaflet_id] = source.mappedVertices;
            }
            if (lType === "polyline" || lType === "vertice") {
                // * keys are marker leaflet ids
                Object.keys(this.mappedMarkersToVertices).forEach((markerId) => {
                    // * values are index of vertice
                    const verticesKeyArr = Object.keys(this.mappedMarkersToVertices[markerId]);
                    // * leaflet id of vertice
                    const vertLeafId = source.mappedVerticeId;
                    const verticesObj = this.mappedMarkersToVertices[markerId];
                    verticesKeyArr.forEach((vertKey) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (verticesObj[vertKey] === vertLeafId) {
                            const spreadable = this.mappedMarkersToVertices[markerId] || {};
                            this.mappedMarkersToVertices[markerId] = Object.assign(Object.assign({}, spreadable), { [vertKey]: result });
                        }
                    });
                });
            }
        };
        // * retyping because I'm accessing private attribute '_layers'
        this.featureGroup = new L.FeatureGroup();
        // * for knowing if we are using select tool
        this.selecting = false;
        // * for knowing if we already selected layer
        this.selectedLayer = null;
        this.tool = tool;
        this.createdVertices = [];
        this.mappedMarkersToVertices = {};
        // * selected for customization
        this.extraSelected = [];
    }
    /**
     * setter
     */
    setSelecting(is) {
        this.selecting = is;
    }
    /**
     * getter
     */
    getSelecting() {
        return this.selecting;
    }
    /**
     * add layer to featureGroup and it is displayed
     */
    addLayer(layer) {
        this.featureGroup.addLayer(layer);
        this.tool.applyEventListeners(layer);
        return layer;
    }
    /**
     * removes layer from featureGroup and from map
     */
    removeLayer(layer) {
        this.featureGroup.removeLayer(layer);
    }
    /**
     * removes selected layer
     */
    removeSelectedLayer() {
        if (!this.selectedLayer)
            return;
        TransformTool.disableTransform(this.selectedLayer);
        EditTool.disableNodeEdit(this.selectedLayer);
        this.featureGroup.removeLayer(this.selectedLayer);
        this.selectedLayer = null;
    }
    /**
     * sets selected layer and highlights it
     */
    setSelectedLayer(layer) {
        if (this.selectedLayer)
            this.tool.normalizeElement(this.selectedLayer);
        this.selectedLayer = layer;
        this.tool.highlightElement(layer);
        this.clearExtraSelected();
    }
    /**
     * removes selected layer
     */
    clearSelectedLayer() {
        this.selectedLayer = null;
    }
    /**
     * sets vertices to marker
     */
    setVerticesToMarker(lId, val) {
        this.mappedMarkersToVertices[lId] = val;
    }
    /**
     * serializes map state to GeoJSON
     */
    serializeToGeoJSON() {
        const geo = EMPTY_GEOJSON;
        this.featureGroup.eachLayer((l) => {
            var _a, _b;
            const layer = l;
            const feature = layer.toGeoJSON();
            const properties = convertOptionsToProperties(layer.options);
            feature.properties = properties;
            if (layer.popupContent)
                feature.properties.popupContent = layer.popupContent;
            if (layer.identifier)
                feature.id = layer.identifier;
            const iconOptions = (_b = (_a = layer === null || layer === void 0 ? void 0 : layer.options) === null || _a === void 0 ? void 0 : _a.icon) === null || _b === void 0 ? void 0 : _b.options;
            if (iconOptions)
                feature.properties.iconOptions = iconOptions;
            if (this.isConnectMarker(layer)) {
                this.addMappedVertices(layer, feature.properties);
            }
            if (layer.layerType === "vertice")
                feature.properties.mappedVerticeId = layer._leaflet_id;
            geo.features.push(feature);
        });
        return geo;
    }
    /**
     * deserializes GeoJSON to map state
     *
     * @param {Object} geojson
     * @returns
     */
    deserializeGeoJSON(geojson) {
        const sidebarState = this.tool.getMapForm().getState();
        // console.log({ geojson });
        if (geojson.type === "FeatureCollection" && geojson.features) {
            geojson.features
                .sort((a, b) => sortReverseAlpha(Number(a.geometry.type), Number(b.geometry.type)))
                .forEach((f) => {
                var _a, _b;
                const opts = convertPropertiesToOptions(f.properties || {});
                const lType = getLeafletTypeFromFeature(f);
                const latlng = convertCoords(f);
                let result;
                if (lType === "polygon") {
                    result = new L.polygon(latlng, opts);
                }
                else if (lType === "polyline") {
                    result = new L.polyline(latlng, opts);
                }
                else if (lType === "marker") {
                    const spreadable = ((_a = f === null || f === void 0 ? void 0 : f.properties) === null || _a === void 0 ? void 0 : _a.iconOptions) || {};
                    if (spreadable.iconUrl)
                        sidebarState.appendToIconSrcs(spreadable.iconUrl);
                    const options = Object.assign(Object.assign(Object.assign({}, iconStarter), { iconUrl: sidebarState.getSelectedIcon() }), spreadable);
                    const icon = new L.Icon(options);
                    result = new L.Marker.Touch(latlng, { icon });
                }
                if (result) {
                    result.layerType = lType;
                    // result.snapediting = new L.Handler.MarkerSnap(map, result);
                    // result.snapediting.enable();
                    sidebarState.pushGuideLayer(result);
                    if ((_b = f === null || f === void 0 ? void 0 : f.properties) === null || _b === void 0 ? void 0 : _b.popupContent) {
                        result.popupContent = f.properties.popupContent;
                        result.bindPopup(f.properties.popupContent, {
                            closeOnClick: false,
                            autoClose: false,
                        });
                    }
                    if (f.id) {
                        result.identifier = f.id;
                    }
                    if (result.dragging)
                        result.dragging.disable();
                    this.initMappedMarkersToVertices(lType, result, f.properties);
                    this.addLayer(result);
                }
            });
        }
        return;
    }
    /**
     * serializes map state to internal JSON representation
     */
    serialize(defaults) {
        const config = super.serialize(defaults);
        const exportSettings = [];
        const pushPolygon = (layer, layerType, extra = {}) => {
            const { options, _latlngs: latlngs, popupContent = "" } = layer;
            exportSettings.push(Object.assign({ layerType, options: options &&
                    Object.assign(Object.assign({}, normalStyles), { draggable: true, transform: true }), latlngs,
                popupContent }, extra));
        };
        const pushMarker = (layer, layerType) => {
            var _a, _b;
            const { popupContent = "" } = layer;
            const extra = {};
            if (this.isConnectMarker(layer)) {
                this.addMappedVertices(layer, extra);
            }
            exportSettings.push(Object.assign({ layerType, options: Object.assign(Object.assign({}, (_b = (_a = layer === null || layer === void 0 ? void 0 : layer.options) === null || _a === void 0 ? void 0 : _a.icon) === null || _b === void 0 ? void 0 : _b.options), { draggable: true, transform: true }), latlngs: layer._latlng, popupContent }, extra));
        };
        this.featureGroup.eachLayer((l) => {
            const layer = l;
            const { layerType } = layer;
            if (layerType === "marker") {
                pushMarker(layer, layerType);
            }
            else {
                if (layer._layers) {
                    layer._layers.forEach((l) => {
                        pushPolygon(l, layerType);
                    });
                }
                else {
                    const extra = layerType === "vertice"
                        ? { mappedVerticeId: layer._leaflet_id }
                        : {};
                    pushPolygon(layer, layerType, extra);
                }
            }
        });
        config.data = exportSettings;
        return config;
    }
    /**
     * deserializes internal JSON representation to map state
     */
    deserialize(config) {
        super.deserialize(config);
        const sidebarState = this.tool.getMapForm().getState();
        const { data = [] } = config;
        data.forEach((layer) => {
            var _a;
            let layerToAdd;
            // decide what type they are according to it render what is needed
            if (layer.layerType === "marker") {
                const { latlngs } = layer;
                const latlng = L.latLng(latlngs.lat, latlngs.lng);
                if ((_a = layer === null || layer === void 0 ? void 0 : layer.options) === null || _a === void 0 ? void 0 : _a.iconUrl)
                    sidebarState.appendToIconSrcs(layer.options.iconUrl);
                const iconAnchor = layer.options.iconAnchor
                    ? {
                        iconAnchor: new L.Point(layer.options.iconAnchor.x, layer.options.iconAnchor.y),
                    }
                    : {};
                const iconSize = layer.options.iconSize
                    ? {
                        iconSize: new L.Point(layer.options.iconSize.x, layer.options.iconSize.y),
                    }
                    : {};
                const options = Object.assign(Object.assign(Object.assign({}, layer.options), iconAnchor), iconSize);
                const MyCustomMarker = L.Icon.extend({
                    options,
                });
                const icon = new MyCustomMarker();
                icon.options = options;
                const marker = new L.Marker.Touch(latlng, { icon });
                layerToAdd = marker;
            }
            else {
                let _latlng;
                let poly;
                if (layer.layerType === "polyline" || layer.layerType === "vertice") {
                    _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
                    poly = new L.polyline(_latlng, layer.options);
                }
                if (layer.layerType === "polygon" || layer.layerType === "painted") {
                    _latlng = layer.latlngs[0].map((l) => L.latLng(l.lat, l.lng));
                    poly = new L.polygon(_latlng, layer.options);
                }
                layerToAdd = poly;
            }
            if (layer.popupContent) {
                layerToAdd.bindPopup(layer.popupContent, {
                    closeOnClick: false,
                    autoClose: false,
                });
                layerToAdd.popupContent = layer.popupContent;
            }
            sidebarState.pushGuideLayer(layer);
            layerToAdd.layerType = layer.layerType;
            if (layerToAdd.dragging)
                layerToAdd.dragging.disable();
            this.initMappedMarkersToVertices(layer.layerType, layerToAdd, layer);
            this.addLayer(layerToAdd);
        });
    }
}

/**
 * This class provide functions which return the default state values.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolDefaults extends geovisto.LayerToolDefaults {
    /**
     * It initializes tool defaults.
     */
    constructor() {
        super();
    }
    /**
     * A unique string of the tool type.
     */
    getType() {
        return DrawingLayerToolDefaults.TYPE;
    }
    /**
     * It returns the layer name.
     */
    getLayerName() {
        return "Drawing layer";
    }
    /**
     * It returns the label of the tool.
     */
    getLabel() {
        return this.getLayerName();
    }
    /**
     * It returns the icon of the tool.
     */
    getIcon() {
        return '<i class="fa fa-pencil"></i>';
    }
}
DrawingLayerToolDefaults.TYPE = "geovisto-tool-layer-drawing";

const ID = "geovisto-input-select-drawing";
class DrawingMapFormInputFactory extends geovisto.MapFormInputFactory {
    /**
     * It creates the select form input.
     */
    selectOpt(props) {
        return new DrawingSelectFormInput(props);
    }
    /**
     * It creates the labeled select form input.
     */
    labeledSelectOpt(props) {
        return new DrawingSelectFormInput(props);
    }
}
/**
 * This class represents a basic select form input composed of options.
 *
 * @author Jiri Hynek
 * @author Anfrej Tlcina
 */
class DrawingSelectFormInput extends geovisto.AbstractMapFormInput {
    constructor(props) {
        super(props);
    }
    /**
     * Static function returns identifier of the input type
     */
    static ID() {
        return ID;
    }
    /**
     * It returns select element.
     */
    create() {
        if (this.element == undefined) {
            const props = this.getProps();
            // create select element
            this.element = document.createElement('select');
            this.element.onchange = props.onChangeAction;
            // append options
            let option;
            const options = props.options;
            for (let i = 0; i < options.length; i++) {
                option = this.element.appendChild(document.createElement("option"));
                if (typeof options[i] === "object" && options[i] !== null) {
                    const opt = options[i];
                    option.setAttribute("value", String(opt.value));
                    option.innerHTML = opt.label;
                    option.selected = Boolean(opt.selected);
                }
                else {
                    const opt = options[i];
                    option.setAttribute("value", opt);
                    option.innerHTML = opt;
                }
            }
        }
        return this.element;
    }
    /**
     * It returns value of the select element.
     */
    getValue() {
        return this.element ? this.element.value : "";
    }
    /**
     * It sets value of the select element.
     *
     * @param value
     */
    setValue(value) {
        if (this.element) {
            this.element.value = value;
        }
    }
    /*
     * Sets/removes attribute 'disabled' from input box.
     */
    setDisabled(disabled) {
        if (this.element) {
            if (disabled == true) {
                this.element.setAttribute("disabled", "true");
            }
            else {
                this.element.removeAttribute("disabled");
            }
        }
    }
}

/**
 * @author Andrej Tlcina
 */
/**
 * creates a grid of options, when a tile is clicked passed function runs
 * was made for colors and icons, if img is true it expects icon urls as options
 */
const createPalette = (label, opts, activeIdx, changeAction, img = false) => {
    const inputPalette = document.createElement("div");
    if (label)
        inputPalette.appendChild(document.createTextNode(label + ": "));
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.width = "100%";
    wrapper.style.gridTemplateColumns = "repeat(4, 1fr)";
    inputPalette.appendChild(wrapper);
    opts.forEach((opt, idx) => {
        const elem = document.createElement("div");
        elem.style.boxSizing = "border-box";
        elem.style.background = img ? `url(${opt})` : opt;
        elem.style.backgroundRepeat = "no-repeat";
        elem.style.backgroundPosition = "center";
        elem.style.backgroundSize = "contain";
        elem.style.height = "20px";
        elem.style.display = "inline-block";
        elem.style.cursor = "pointer";
        if (idx === activeIdx) {
            elem.style.border = "1px solid #333";
        }
        elem.addEventListener("click", () => changeAction(opt));
        wrapper.appendChild(elem);
    });
    return inputPalette;
};
const createButton = (text, onClick, disabled) => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.addEventListener("click", onClick);
    if (disabled) {
        btn.setAttribute("disabled", String(disabled));
    }
    else {
        btn.removeAttribute("disabled");
    }
    return btn;
};
const FormInput = new DrawingMapFormInputFactory();
/**
 * Data mapping model which can be used in the sidebar form.
 */
const MAPPING_MODEL = {
    idKey: {
        props: {
            name: "idKey",
            label: "ID key",
        },
        input: FormInput.labeledSelectOpt,
    },
    identifier: {
        props: { name: "identifier", label: "Identifier" },
        input: FormInput.labeledAutocomplete,
    },
    description: {
        props: { name: "description", label: "Description" },
        input: FormInput.textArea,
    },
    strokeThickness: {
        props: {
            name: "stroke-thickness",
            label: "Stroke thickness",
        },
        input: FormInput.labeledSelectOpt,
    },
    search: {
        props: { name: "search", label: "Search" },
        input: FormInput.labeledAutocomplete,
    },
    searchForArea: {
        props: {
            name: "search-for-area",
            label: "Search",
        },
        input: FormInput.labeledSelectOpt,
    },
    adminLevel: {
        props: {
            name: "admin-level",
            label: "Pick level of administration",
        },
        input: FormInput.labeledSelectOpt,
    },
    iconUrl: {
        props: {
            name: "iconUrl",
            label: "Icon URL",
        },
        input: FormInput.labeledText,
    },
    dataFilterKey: {
        props: {
            name: "data-filter-key",
            label: "Pick column",
        },
        input: FormInput.labeledSelectOpt,
    },
    dataFilterValue: {
        props: {
            name: "data-filter-value",
            label: "Pick value",
        },
        input: FormInput.labeledSelectOpt,
    },
    brushSize: {
        props: {
            name: "brush-size",
        },
        input: FormInput.labeledSlider,
    },
    customToleranceValue: {
        props: {
            name: "custom-tolerance",
        },
        input: FormInput.labeledSlider,
    },
    iconAnchor: {
        props: {
            name: "icon-anchor",
        },
        input: FormInput.labeledSlider,
    },
    customToleranceCheck: {
        props: {
            name: "custom-tolerance",
            label: "By selecting the option you can custom level of detail for brush strokes",
        },
        input: FormInput.labeledCheckbox,
    },
    changeConnect: {
        props: {
            name: "change-connect",
            label: "By selecting the option marker will be able to create topology",
        },
        input: FormInput.labeledCheckbox,
    },
    intersectActivated: {
        props: {
            name: "intersect-activated",
            label: "By selecting the option you can create intersects with selected polygon",
        },
        input: FormInput.labeledCheckbox,
    },
    searchConnect: {
        props: {
            name: "search-connect",
            label: "By creating new marker while having this choice selected, you will create path between newly created marker and selected marker or last created marker via Topology tool",
        },
        input: FormInput.labeledCheckbox,
    },
    highQuality: {
        props: {
            name: "high-quality",
            label: "By selecting the option displayed polygons will be in higher quality, which however means that some operations will take longer to execute",
        },
        input: FormInput.labeledCheckbox,
    },
};

/**
 * Abstract class for control state.
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for data and logic of inputs, not rendering
 */
class AbstractControlState {
    constructor(props) {
        this._getSelected = () => {
            return this.tool.getState().selectedLayer;
        };
        this._getExtraSelected = () => {
            return this.tool.getState().extraSelected;
        };
        this._redrawSidebar = (type) => {
            return this.tabControl.redrawTabContent(type || "");
        };
        this.tabControl = props.tabControl;
        this.tool = props.tabControl.getTool();
        this.control = props.control;
    }
}

/**
 * Abstract class for control
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for rendering of inputs, not logic
 */
class AbstractControl {
    constructor(props) {
        this.state = new AbstractControlState({
            tabControl: props.tabControl,
            control: this,
        });
    }
}

/**
 * Help class which contains static methods
 */
class DataControlUtils {
}
/**
* for linebreak in poup text we use '<br>' tag
*/
DataControlUtils.convertDescToPopText = (descText) => {
    if (!descText)
        return "";
    return descText.replaceAll("\n", "<br />");
};
/**
 * for linebreak in field we use '\n' character
 */
DataControlUtils.convertDescfromPopText = (popText) => {
    if (!popText)
        return "";
    return popText.replaceAll("<br />", "\n");
};

class DataControlState extends AbstractControlState {
    constructor(props) {
        var _a, _b, _c;
        super(props);
        /**
         * runs whenever user clicks on 'Add Filter' button
         * essentially creates new filter
         */
        this.increaseFilters = () => {
            this.filtersAmount += 1;
            this.filtersKeys.push("");
            this.filtersValues.push("");
        };
        /**
         * runs whenever user clicks on 'Remove Filter' button
         * essentially removes last added filter and it's values
         */
        this.decreaseFilters = () => {
            if (this.filtersAmount === 0)
                return;
            this.filtersAmount -= 1;
            this.filtersKeys.pop();
            this.filtersValues.pop();
        };
        /**
         * sets which column we should take identifier from
         */
        this.changeWhichIdUseAction = (e) => {
            const id = e.target.value;
            const selectedEl = this._getSelected();
            this.identifierType = id;
            this._redrawSidebar(selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.layerType);
        };
        /**
         * called on field change
         */
        this.changeIdentifierAction = (id) => {
            var _a, _b, _c;
            if (!id)
                return;
            const selectedEl = this._getSelected();
            if (selectedEl)
                selectedEl.identifier = id;
            const data = ((_c = (_b = (_a = this.tool.getMap()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.getMapData()) === null || _c === void 0 ? void 0 : _c.getDataRecords()) || [];
            // * create new variable and store imported data
            let filteredData = data;
            // * go through all appended filter keys
            this.filtersKeys.forEach((key, idx) => {
                // * loop through each row of imported data
                filteredData = filteredData.filter((d) => String(d[key]) === this.filtersValues[idx]);
            });
            const idType = this.identifierType;
            const found = filteredData.find((d) => String(d[idType]) === id);
            let popupText = "";
            if (found) {
                Object.keys(found).forEach((key) => {
                    popupText += `${key}: ${found[key]}<br />`;
                });
            }
            this.changeDesc(popupText);
            this._redrawSidebar(selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.layerType);
        };
        /**
         * called on change of field
         */
        this.changeDescriptionAction = (e) => {
            this.changeDesc(e.target.value);
        };
        /**
         * Takes selected element and bind new popup to it
         *
         * @param {String} inputText
         */
        this.changeDesc = (inputText) => {
            const selectedEl = this._getSelected();
            const modInputText = DataControlUtils.convertDescToPopText(inputText);
            const popup1 = selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.getPopup();
            if (popup1) {
                popup1.setContent(modInputText);
            }
            else {
                selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.bindPopup(modInputText, {
                    closeOnClick: false,
                    autoClose: false,
                });
            }
            // store for import
            if (selectedEl)
                selectedEl.popupContent = modInputText;
            if (selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.setStyle)
                selectedEl.setStyle(modInputText);
        };
        /**
         * forcefuly change identifier (not on field change)
         */
        this.callIdentifierChange = (haveToCheckFilters = false) => {
            if (haveToCheckFilters && this.filtersAmount === 0)
                return;
            const selectedEl = this._getSelected();
            this.changeIdentifierAction((selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.identifier) || "");
        };
        this.data =
            ((_c = (_b = (_a = props.tabControl
                .getTool()
                .getMap()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.getMapData()) === null || _c === void 0 ? void 0 : _c.getDataRecords()) || [];
        this.identifierType = "";
        this.filtersAmount = 0;
        this.filtersKeys = [];
        this.filtersValues = [];
    }
    /**
     * clears all filters for data mapping
     */
    clearFilters() {
        this.filtersAmount = 0;
        this.filtersKeys = [];
        this.filtersValues = [];
    }
    /**
     * gets filter key (column header)
     */
    getFiltersKey(idx) {
        const key = this.filtersKeys[idx];
        return key;
    }
    /**
     * gets value in column
     */
    getFiltersValue(idx) {
        const value = this.filtersValues[idx];
        return value;
    }
    /**
     * sets value in filterKeys array
     */
    setFiltersKey(idx, value) {
        if (idx > this.filtersAmount)
            return;
        this.filtersKeys[idx] = value;
    }
    /**
     * sets value in filterValues array
     *
     * @param {Number} idx
     * @param {any} value
     * @returns
     */
    setFiltersValue(idx, value) {
        if (idx > this.filtersAmount)
            return;
        this.filtersValues[idx] = value;
    }
    /**
     * returns "column header name"
     */
    getIdentifierType() {
        return this.identifierType;
    }
}

class DataControl extends AbstractControl {
    constructor(props) {
        super(props);
        // ************************* Data Inputs ***************************************
        /**
         * creates a field for picking column name where to choose identifier from
         */
        this.createPickIdentifier = () => {
            const { data } = this.state;
            const idOpts = data[0]
                ? Object.keys(data[0]).map((k) => ({ value: k, label: k }))
                : [];
            const result = MAPPING_MODEL.idKey.input(Object.assign(Object.assign({}, MAPPING_MODEL.idKey.props), { onChangeAction: this.state.changeWhichIdUseAction, options: [{ value: "", label: "" }, ...idOpts] }));
            return result;
        };
        /**
         * creates a field for identier input
         */
        this.createIdentifierInput = () => {
            const { data } = this.state;
            const idKey = this.state.getIdentifierType();
            let idOpts = data && data[0][idKey] ? data.map((d) => d[idKey]) : [];
            idOpts = Array.from(new Set(idOpts));
            const result = MAPPING_MODEL.identifier.input(Object.assign(Object.assign({}, MAPPING_MODEL.identifier.props), { onChangeAction: (e) => this.state.changeIdentifierAction(e.target.value), options: idOpts, placeholder: "e.g. CZ" }));
            return result;
        };
        this.renderDataInputs = (elem) => {
            var _a, _b, _c;
            const disableTextFields = !this.state._getSelected();
            // Select Pick Identifier
            const inputPickIdentifier = this.createPickIdentifier();
            elem.appendChild(inputPickIdentifier.create());
            inputPickIdentifier.setDisabled(disableTextFields);
            inputPickIdentifier.setValue(this.state.getIdentifierType());
            // textfield Identifier
            const inputId = this.createIdentifierInput();
            elem.appendChild(inputId.create());
            inputId.setDisabled(disableTextFields);
            inputId.setValue(((_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.identifier) || "");
            // textarea Description
            const inputDesc = MAPPING_MODEL.description.input(Object.assign(Object.assign({}, MAPPING_MODEL.description.props), { onChangeAction: this.state.changeDescriptionAction }));
            elem.appendChild(inputDesc.create());
            inputDesc.setValue(DataControlUtils.convertDescfromPopText((((_c = (_b = this.state._getSelected()) === null || _b === void 0 ? void 0 : _b.getPopup()) === null || _c === void 0 ? void 0 : _c.getContent()) || "")));
            inputDesc.setDisabled(disableTextFields);
        };
        // ************************* Data Inputs END ***************************************
        // ************************* Filter Inputs ***************************************
        this.setDataKey = (e, index) => {
            var _a;
            const val = e.target.value;
            this.state.setFiltersKey(index, val);
            this.state._redrawSidebar((_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.layerType);
        };
        this.setDataValue = (e, index) => {
            var _a;
            const val = e.target.value;
            this.state.setFiltersValue(index, val);
            this.state.callIdentifierChange();
            this.state._redrawSidebar((_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.layerType);
        };
        /**
         * creates the filter fields
         */
        this.renderDataFilters = (elem) => {
            const { data } = this.state;
            const idOpts = data[0]
                ? Object.keys(data[0]).map((k) => ({ value: k, label: k }))
                : [];
            for (let index = 0; index < this.state.filtersAmount; index++) {
                const filtersKey = this.state.getFiltersKey(index);
                // * input for key
                const inputKey = MAPPING_MODEL.dataFilterKey.input(Object.assign(Object.assign({}, MAPPING_MODEL.dataFilterKey.props), { onChangeAction: (e) => this.setDataKey(e, index), options: [{ value: "", label: "" }, ...idOpts] }));
                // ***********************************************************
                let valueOpts = data && data[0][filtersKey] ? data.map((d) => d[filtersKey]) : [];
                valueOpts = Array.from(new Set(valueOpts));
                // * input for value
                const inputValue = MAPPING_MODEL.dataFilterValue.input(Object.assign(Object.assign({}, MAPPING_MODEL.dataFilterValue.props), { onChangeAction: (e) => this.setDataValue(e, index), options: ["", ...valueOpts] }));
                // * append elements
                elem.appendChild(document.createElement("hr"));
                elem.appendChild(inputKey.create());
                elem.appendChild(inputValue.create());
                inputKey.setValue(filtersKey);
                inputValue.setValue(this.state.getFiltersValue(index));
            }
        };
        this.addFilter = () => {
            var _a;
            this.state.increaseFilters();
            this.state._redrawSidebar((_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.layerType);
        };
        this.removeFilter = () => {
            var _a;
            this.state.decreaseFilters();
            this.state.callIdentifierChange();
            this.state._redrawSidebar((_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.layerType);
        };
        /**
         * creates the buttons for adding/removing buttons
         */
        this.renderFilterInputs = (elem) => {
            const disabled = !this.state._getSelected();
            const wrapper = document.createElement("div");
            wrapper.style.width = "100%";
            const addFilterBtn = createButton("Add Filter", this.addFilter, disabled);
            const removeFilterBtn = createButton("Remove Filter", this.removeFilter, disabled);
            wrapper.appendChild(addFilterBtn);
            wrapper.appendChild(removeFilterBtn);
            elem.appendChild(wrapper);
        };
        this.state = new DataControlState({
            tabControl: props.tabControl,
            control: this,
        });
    }
}

class MarkerControlState extends AbstractControlState {
    constructor(props) {
        super(props);
        /**
         * sets new marker icon options (iconUrl, anchor...) to selected object and to extra selected ones
         */
        this.changeIconOpts = (iconOpt = {}) => {
            var _a, _b;
            const { enabledTool } = this.tabControl.getState();
            const activeTool = enabledTool === null || enabledTool === void 0 ? void 0 : enabledTool.activetool;
            let selectedEl = this._getSelected();
            let marker = selectedEl;
            if ((activeTool === null || activeTool === void 0 ? void 0 : activeTool.type) === "marker") {
                selectedEl = activeTool;
                marker = activeTool._marker;
            }
            const oldIconOptions = ((_b = (_a = selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.options) === null || _a === void 0 ? void 0 : _a.icon) === null || _b === void 0 ? void 0 : _b.options) || {};
            const newIconOptions = Object.assign(Object.assign({}, oldIconOptions), iconOpt);
            const markerIcon = new L.Icon(newIconOptions);
            if (marker)
                marker.setIcon(markerIcon);
            if (marker)
                this.tool.highlightElement(marker);
            this._getExtraSelected().forEach((layer) => {
                layer === null || layer === void 0 ? void 0 : layer.setIcon(markerIcon);
                this.tool.highlightElement(layer);
            });
            if ((activeTool === null || activeTool === void 0 ? void 0 : activeTool.type) === "marker")
                activeTool.setIconOptions(markerIcon);
            return marker;
        };
        /**
         * sets new icon to marker
         *
         * @param {String} icon
         */
        this.changeIconAction = (icon) => {
            this.changeIconOpts({ iconUrl: icon });
            this.selectedIcon = icon;
            this._redrawSidebar("marker");
        };
        /**
         * sets new anchor to marker
         */
        this.changeIconAnchor = (e, coordinate) => {
            var _a, _b, _c;
            const selectedEl = ((_a = this.tabControl.getState().enabledTool) === null || _a === void 0 ? void 0 : _a.activetool) || this._getSelected();
            const iconOptions = ((_c = (_b = selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.options) === null || _b === void 0 ? void 0 : _b.icon) === null || _c === void 0 ? void 0 : _c.options) || {};
            const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
            const val = Number(e.target.value);
            iconAnchor[coordinate] = val;
            this.changeIconOpts({ iconAnchor });
        };
        /**
         * runs on 'Enter' whenever user adds new icon to list of icons
         */
        this.addIconAction = (e) => {
            const iconUrl = e.target.value;
            this.appendToIconSrcs(iconUrl);
            this._redrawSidebar("marker");
        };
        this.iconSrcs = new Set(ICON_SRCS);
        this.selectedIcon = ICON_SRCS[FIRST];
    }
    /**
     * getter
     */
    getSelectedIcon() {
        return this.selectedIcon;
    }
    /**
     * setter
     */
    setSelectedIcon(icon) {
        this.selectedIcon = icon;
    }
    /**
     * append to icon Set
     */
    appendToIconSrcs(iconUrl) {
        this.iconSrcs.add(iconUrl);
    }
}

class MarkerControl extends AbstractControl {
    constructor(props) {
        super(props);
        /**
         * slider for anchor change
         */
        this.createIconAnchorSlider = (coordinate) => {
            var _a, _b;
            const selectedEl = this.state._getSelected();
            const iconOptions = ((_b = (_a = selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.options) === null || _a === void 0 ? void 0 : _a.icon) === null || _b === void 0 ? void 0 : _b.options) || {};
            const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
            const value = iconAnchor[coordinate] || "";
            const customAnchor = MAPPING_MODEL.iconAnchor.input({
                label: `Icon '${coordinate.toUpperCase()}' anchor`,
                minValue: 0,
                maxValue: 50,
                onChangeAction: (e) => this.state.changeIconAnchor(e, coordinate),
                defaultValue: value,
            });
            return customAnchor.create();
        };
        /**
         * X coordinate slider
         */
        this.createXAnchorSlider = () => this.createIconAnchorSlider("x");
        /**
         * Y coordinate slider
         */
        this.createYAnchorSlider = () => this.createIconAnchorSlider("y");
        /**
         * checkbox to set if marker is connect marker
         */
        this.createChangeConnectCheck = () => {
            const toolState = this.tabControl.getTool().getState();
            const onChange = (e) => {
                const connectClick = e.target.checked;
                const selected = this.state.changeIconOpts({ connectClick });
                if (selected) {
                    this.tabControl.getTool().highlightElement(selected);
                }
            };
            const isConnect = toolState.selectedLayerIsConnectMarker();
            const result = MAPPING_MODEL.changeConnect.input(Object.assign(Object.assign({}, MAPPING_MODEL.changeConnect.props), { defaultValue: isConnect, onChangeAction: onChange }));
            return result.create();
        };
        /**
         * creates the fields associated with marker
         */
        this.renderIconInputs = (elem) => {
            // palette Icons
            const inputIcon = this.createIconPalette();
            elem.appendChild(inputIcon);
            const inputUrl = MAPPING_MODEL.iconUrl.input(Object.assign(Object.assign({}, MAPPING_MODEL.iconUrl.props), { action: this.state.addIconAction }));
            elem.appendChild(inputUrl.create());
            inputUrl.setValue("");
            const changeConnect = this.createChangeConnectCheck();
            elem.appendChild(changeConnect);
            elem.appendChild(this.createXAnchorSlider());
            elem.appendChild(this.createYAnchorSlider());
        };
        this.tabControl = props.tabControl;
        this.state = new MarkerControlState({
            tabControl: props.tabControl,
            control: this,
        });
    }
    /**
     * creates a icon grid
     */
    createIconPalette() {
        var _a, _b, _c, _d;
        const iconsSet = this.state.iconSrcs;
        const iconUrl = (_d = (_c = (_b = (_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.icon) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.iconUrl;
        if (iconUrl)
            iconsSet.add(iconUrl);
        const activeIcon = this.state.getSelectedIcon();
        const iconsArr = Array.from(iconsSet);
        const activeIndex = iconsArr.indexOf(activeIcon);
        const res = createPalette("Pick icon", iconsArr, activeIndex, this.state.changeIconAction, true);
        return res;
    }
}

class PolyControlState extends AbstractControlState {
    constructor(props) {
        super(props);
        /**
         * sets new color to selected object and to extra selected ones
         */
        this.changeColorAction = (color) => {
            const selectedEl = this._getSelected();
            this.selectedColor = color;
            if (selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.setStyle)
                selectedEl.setStyle({ color });
            this._getExtraSelected().forEach((layer) => {
                layer === null || layer === void 0 ? void 0 : layer.setStyle({ color });
            });
        };
        /**
         * sets new stroke weight to selected object and to extra selected ones
         */
        this.changeWeightAction = (e) => {
            const weight = Number(e.target.value);
            const selectedEl = this._getSelected();
            this.selectedStroke = weight;
            if (selectedEl === null || selectedEl === void 0 ? void 0 : selectedEl.setStyle)
                selectedEl.setStyle({ weight });
            this._getExtraSelected().forEach((layer) => {
                layer === null || layer === void 0 ? void 0 : layer.setStyle({ weight });
            });
        };
        this.intersectActivated = false;
        this.colors = COLORS;
        this.selectedColor = COLORS[0];
        this.strokes = STROKES;
        this.selectedStroke = STROKES[1].value;
    }
    /**
     * getter
     */
    getSelectedColor() {
        return this.selectedColor;
    }
    /**
     * getter
     */
    getSelectedStroke() {
        return this.selectedStroke;
    }
    /**
     * sets whether we are creating new polygons within selected one
     */
    setIntersectActivated(val) {
        this.intersectActivated = val;
    }
}

class PolyControl extends AbstractControl {
    constructor(props) {
        super(props);
        /**
         * checkbox to set if we can create within selected object
         */
        this.createIntersectionCheck = () => {
            const onChange = (e) => {
                const val = e.target.checked;
                this.state.setIntersectActivated(val);
            };
            const { intersectActivated } = this.state;
            const result = MAPPING_MODEL.intersectActivated.input(Object.assign(Object.assign({}, MAPPING_MODEL.intersectActivated.props), { defaultValue: intersectActivated, onChangeAction: onChange }));
            return result.create();
        };
        /**
         * creates the fields associated with polygons/polylines
         *
         * @param {Object} elem
         * @param {Object} model
         */
        this.renderPolyInputs = (elem) => {
            var _a, _b;
            // select stroke thickness
            const thicknessOpts = this.state.strokes;
            const inputThickness = MAPPING_MODEL.strokeThickness.input(Object.assign(Object.assign({}, MAPPING_MODEL.strokeThickness.props), { options: thicknessOpts, action: this.state.changeWeightAction }));
            elem.appendChild(inputThickness.create());
            inputThickness.setValue(((_b = (_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.weight) ||
                this.state.getSelectedStroke());
            // palette Colors
            const inputColor = this.createColorPicker();
            elem.appendChild(inputColor);
        };
        this.state = new PolyControlState({
            tabControl: props.tabControl,
            control: this,
        });
    }
    /**
     * creates color picker field
     */
    createColorPicker() {
        var _a, _b;
        const inputWrapper = document.createElement("div");
        inputWrapper.appendChild(document.createTextNode("Pick color: "));
        const colorPicker = document.createElement("input");
        colorPicker.setAttribute("type", "color");
        colorPicker.onchange = (e) => this.state.changeColorAction(e.target.value);
        colorPicker.value = String(((_b = (_a = this.state._getSelected()) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.color) || this.state.getSelectedColor());
        inputWrapper.appendChild(colorPicker);
        return inputWrapper;
    }
}

class BrushControl extends AbstractControl {
    constructor(props) {
        var _a, _b;
        super(props);
        /**
         * creates a field for brush size input
         */
        this.createBrushSizeControl = () => {
            const { drawingTools = {} } = this.tabControl.getTool();
            const paintTool = drawingTools[PaintTool.NAME()];
            const eraseTool = drawingTools[EraseTool.NAME()];
            let brush = null;
            if (paintTool === null || paintTool === void 0 ? void 0 : paintTool.isToolActive())
                brush = paintTool;
            if (eraseTool === null || eraseTool === void 0 ? void 0 : eraseTool.isToolActive())
                brush = eraseTool;
            if (!brush)
                return null;
            const { maxBrushSize, minBrushSize } = brush.getBrushSizeConstraints();
            const controlWrapper = document.createElement("div");
            const brushControl = MAPPING_MODEL.brushSize.input({
                onChangeAction: (e) => brush === null || brush === void 0 ? void 0 : brush.resizeBrush(Number(e.target.value)),
                label: "Brush size: ",
                defaultValue: brush.getBrushSize(),
                maxValue: maxBrushSize,
                minValue: minBrushSize,
            });
            controlWrapper.appendChild(brushControl.create());
            const customToleranceCheck = this.createCustomToleranceCheck();
            controlWrapper.appendChild(customToleranceCheck);
            controlWrapper.appendChild(this.customToleranceInput);
            return controlWrapper;
        };
        this.toleranceChange = (e) => {
            const val = Number(e.target.value);
            window.customTolerance = val;
        };
        this.onChange = (e) => {
            const check = e.target.checked;
            if (check) {
                const val = window.customTolerance;
                const step = getIntervalStep(val);
                const customTolerance = MAPPING_MODEL.customToleranceValue.input({
                    label: "Custom tolerance",
                    onChangeAction: (e) => this.toleranceChange(e),
                    minValue: 0.0,
                    maxValue: val * 2,
                    defaultValue: String(val || ""),
                    step: step,
                });
                this.customToleranceInput.appendChild(customTolerance.create());
            }
            else {
                const firstChild = this.customToleranceInput.firstChild;
                if (firstChild)
                    this.customToleranceInput.removeChild(firstChild);
                this.tabControl.getTool().setGlobalSimplificationTolerance(this.map);
            }
        };
        this.createCustomToleranceCheck = () => {
            var _a;
            // * tolerance changes with zoom
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.on("zoomend", () => {
                var _a;
                const firstChild = this.customToleranceInput.firstChild;
                if (firstChild) {
                    const interval = (_a = firstChild === null || firstChild === void 0 ? void 0 : firstChild.firstChild) === null || _a === void 0 ? void 0 : _a.lastChild;
                    const display = firstChild.lastChild;
                    const val = window.customTolerance;
                    if (display)
                        display.innerText = String(val);
                    if (interval) {
                        interval.value = String(val);
                        const step = getIntervalStep(val);
                        interval.step = String(step);
                        interval.max = String(val * 2);
                    }
                }
            });
            const result = MAPPING_MODEL.customToleranceCheck.input(Object.assign(Object.assign({}, MAPPING_MODEL.customToleranceCheck.props), { defaultValue: false, onChangeAction: this.onChange }));
            return result.create();
        };
        this.tabControl = props.tabControl;
        this.customToleranceInput = document.createElement("div");
        this.map = (_b = (_a = props.tabControl.getTool().getMap()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.getLeafletMap();
    }
}

class SearchControlState extends AbstractControlState {
    constructor(props) {
        super(props);
        /**
         * sets for what area we are searching for
         */
        this.searchForAreaAction = (e) => {
            const val = e.target.value;
            this.countryCode = val;
        };
        /**
         * sets for what administration level we are searching for
         */
        this.pickAdminLevelAction = (e) => {
            const val = e.target.value;
            this.adminLevel = Number(val);
        };
        /**
         * sets new options for place search
         */
        this.searchAction = (e) => __awaiter(this, void 0, void 0, function* () {
            const value = e.target.value;
            const featureGroup = this.tool.getState().featureGroup;
            const opts = yield SearchTool.geoSearch(featureGroup, value);
            this.searchOpts = opts || [];
            this.control.inputSearch.changeOptions(opts ? opts.map((opt) => opt.label || "") : []);
        });
        /**
         * called when user picks a place from displayed options
         */
        this.onInputOptClick = (value) => {
            var _a;
            const featureGroup = this.tabControl.getTool().getState().featureGroup;
            const { searchOpts: opts, connectActivated } = this;
            const found = opts.find((opt) => opt.label === value);
            const latlng = L.latLng(0, 0);
            latlng.lat = (found === null || found === void 0 ? void 0 : found.y) || 0;
            latlng.lng = (found === null || found === void 0 ? void 0 : found.x) || 0;
            const iconUrl = ((_a = found === null || found === void 0 ? void 0 : found.raw) === null || _a === void 0 ? void 0 : _a.icon) || ICON_SRCS[0];
            const marker = SearchTool.putMarkerOnMap(featureGroup, latlng, found === null || found === void 0 ? void 0 : found.label, iconUrl, connectActivated);
            this.tool.applyEventListeners(marker);
            this.tabControl.getState().setSelectedIcon(iconUrl);
            this.tabControl.getState().appendToIconSrcs(iconUrl);
            if (connectActivated) {
                this.tool.drawingTools[TopologyTool.NAME()].plotTopology();
            }
            this._redrawSidebar("search");
        };
        /**
         * builds query from inputed values and send it to Overpass API
         *
         * @returns
         */
        this.fetchAreas = () => __awaiter(this, void 0, void 0, function* () {
            const { countryCode, adminLevel, highQuality } = this;
            if (!countryCode || !adminLevel)
                return;
            document.querySelector(".leaflet-container").style.cursor = "wait";
            this.control.searchForAreasBtn.setAttribute("disabled", true);
            const color = this.tabControl.getState().getSelectedColor();
            const { data, error } = yield SearchTool.fetchAreas(countryCode, adminLevel, highQuality, color);
            if (error) {
                this.control.errorMsg.innerText = error;
            }
            else {
                this.control.errorMsg.innerText = "";
                const toolState = this.tool.getState();
                // * remove previous object of fetched country
                toolState.featureGroup.eachLayer((layer) => {
                    const drawnLayer = layer;
                    if (drawnLayer.countryCode === countryCode)
                        toolState.removeLayer(drawnLayer);
                });
                data.forEach((country) => toolState.addLayer(country));
            }
            document.querySelector(".leaflet-container").style.cursor = "";
            this.control.searchForAreasBtn.removeAttribute("disabled");
        });
        // this.countries = require("/static/geo/iso3166_countries.json");
        this.countries = [];
        this.countryCode = "";
        this.adminLevel = ADMIN_LEVELS[1].value;
        this.searchOpts = [];
        this.highQuality = false;
        this.connectActivated = false;
    }
    /**
     * takes countries from static file and maps through them
     */
    getSelectCountries() {
        const result = this.countries.map((c) => ({
            value: c["alpha-2"],
            label: c["name"],
        }));
        return [{ value: "", label: "" }, ...result];
    }
    /**
     * sets whether displayed polygon will be of high quality
     */
    setHighQuality(val) {
        this.highQuality = val;
    }
    /**
     * sets whether we are creating topology with search
     */
    setConnectActivated(val) {
        this.connectActivated = val;
    }
}

class SearchControl extends AbstractControl {
    constructor(props) {
        super(props);
        /**
         * checkbox to be able to create topology with place search
         */
        this.createConnectCheck = () => {
            const onChange = (e) => {
                const val = e.target.checked;
                this.state.setConnectActivated(val);
            };
            const { connectActivated } = this.state;
            const result = MAPPING_MODEL.searchConnect.input(Object.assign(Object.assign({}, MAPPING_MODEL.searchConnect.props), { defaultValue: connectActivated, onChangeAction: onChange }));
            const checkWrapper = document.createElement("div");
            checkWrapper.classList.add("connect-check");
            checkWrapper.appendChild(result.create());
            return checkWrapper;
        };
        /**
         * checkbox to set if result of area search will be HQ
         */
        this.createHighQualityCheck = () => {
            const onChange = (e) => {
                const val = e.target.checked;
                this.state.setHighQuality(val);
            };
            const { highQuality } = this.state;
            const result = MAPPING_MODEL.highQuality.input(Object.assign(Object.assign({}, MAPPING_MODEL.highQuality.props), { defaultValue: highQuality, onChangeAction: onChange }));
            return result.create();
        };
        /**
         * creates heading element
         */
        this.addHeading = (title, elem) => {
            const headingTag = document.createElement("h3");
            headingTag.innerText = title;
            elem.appendChild(headingTag);
        };
        /**
         * creates all of the search inputs
         *
         * @param {Object} elem HTML element wrapper
         * @param {Object} model
         */
        this.renderSearchInputs = (elem) => {
            this.addHeading("Search for place", elem);
            // * labeled text Search
            this.inputSearch = MAPPING_MODEL.search.input(Object.assign(Object.assign({}, MAPPING_MODEL.search.props), { onChangeAction: this.state.searchAction, placeholder: "Press enter for search", setData: this.state.onInputOptClick, options: [] }));
            elem.appendChild(this.inputSearch.create());
            this.inputConnect = this.createConnectCheck();
            elem.appendChild(this.inputConnect);
            // * divider
            elem.appendChild(document.createElement("hr"));
            this.addHeading("Search for area", elem);
            // * labeled text Search
            const inputSearchForArea = MAPPING_MODEL.searchForArea.input(Object.assign(Object.assign({}, MAPPING_MODEL.searchForArea.props), { options: this.state.getSelectCountries(), onChangeAction: this.state.searchForAreaAction }));
            elem.appendChild(inputSearchForArea.create());
            inputSearchForArea.setValue(this.state.countryCode || "");
            elem.appendChild(document.createElement("br"));
            const inputAdminLevel = MAPPING_MODEL.adminLevel.input(Object.assign(Object.assign({}, MAPPING_MODEL.adminLevel.props), { options: ADMIN_LEVELS, onChangeAction: this.state.pickAdminLevelAction }));
            inputAdminLevel.setValue(this.state.adminLevel);
            elem.appendChild(inputAdminLevel.create());
            elem.appendChild(document.createElement("br"));
            const hqCheck = this.createHighQualityCheck();
            elem.appendChild(hqCheck);
            this.errorMsg = document.createElement("div");
            this.errorMsg.className = "error-text";
            this.errorMsg.innerText = "";
            elem.appendChild(this.errorMsg);
            this.searchForAreasBtn = document.createElement("button");
            this.searchForAreasBtn.innerText = "Submit";
            this.searchForAreasBtn.addEventListener("click", this.state.fetchAreas);
            elem.appendChild(this.searchForAreasBtn);
        };
        this.state = new SearchControlState({
            tabControl: props.tabControl,
            control: this,
        });
        this.inputSearch = null;
        this.inputConnect = null;
        this.errorMsg = null;
        this.searchForAreasBtn = null;
    }
}

class GeoJSONControlState extends AbstractControlState {
    constructor(props) {
        super(props);
    }
}

class GeoJSONControl extends AbstractControl {
    constructor(props) {
        var _a;
        super(props);
        /**
         * creates heading element
         */
        this.addHeading = (title, elem) => {
            const headingTag = document.createElement("h3");
            headingTag.innerText = title;
            elem.appendChild(headingTag);
        };
        this.state = new GeoJSONControlState({
            tabControl: props.tabControl,
            control: this,
        });
        this.geoDataManager = (_a = this.state.tool.getMap()) === null || _a === void 0 ? void 0 : _a.getState().getGeoDataManager();
    }
    /**
     * creates all of the search inputs
     *
     * @param {Object} elem HTML element wrapper
     * @param {Object} model
     */
    renderGeoJSONInputs(elem) {
        this.createImportForm(elem);
        this.createExportForm(elem);
    }
    createImportForm(elem) {
        var _a, _b;
        const exportDiv = document.createElement("div");
        const autocompleteInput = new geovisto.LabeledAutocompleteFormInput({
            label: "Import geoJSON:",
            options: (_b = (_a = this.geoDataManager) === null || _a === void 0 ? void 0 : _a.getDomainNames()) !== null && _b !== void 0 ? _b : [],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChangeAction: () => { }
        });
        const importButton = document.createElement("input");
        importButton.id = "geovisto-tool-drawing-geojson-export-button";
        importButton.type = "button";
        importButton.size = 3;
        importButton.value = "import";
        importButton.onclick = () => {
            var _a;
            const geoData = (_a = this.geoDataManager) === null || _a === void 0 ? void 0 : _a.getDomain(autocompleteInput.getValue());
            if (geoData) {
                this.state.tool.getState().deserializeGeoJSON(geoData.getGeoJSON());
            }
        };
        importButton.style.display = "block";
        exportDiv.appendChild(autocompleteInput.create());
        exportDiv.appendChild(importButton);
        elem.appendChild(exportDiv);
    }
    createExportForm(elem) {
        const exportDiv = document.createElement("div");
        exportDiv.style.paddingTop = "1rem";
        const exportLabel = document.createElement("div");
        exportLabel.style.paddingLeft = "5px";
        //exportLabel.htmlFor = "geovisto-tool-drawing-geojson-export-button";
        exportLabel.innerHTML = "Export geoJSON:";
        const exportButton = document.createElement("input");
        exportButton.id = "geovisto-tool-drawing-geojson-export-button";
        exportButton.type = "button";
        exportButton.size = 3;
        exportButton.value = "export";
        exportButton.onclick = () => {
            const config = JSON.stringify(this.state.tool.getState().serializeToGeoJSON(), null, 2);
            // download file
            const element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(config));
            element.setAttribute("download", "map.json");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
        exportDiv.appendChild(exportLabel);
        exportDiv.appendChild(exportButton);
        elem.appendChild(exportDiv);
    }
}

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolMapFormState {
    /**
     * It creates a tab control state.
     */
    constructor(tabControl) {
        /**
         * method initializes controls for objects manipulation
         */
        this.initializeControls = () => {
            const { tabControl } = this;
            const controls = {
                DataControl: new DataControl({ tabControl }),
                MarkerControl: new MarkerControl({ tabControl }),
                PolyControl: new PolyControl({ tabControl }),
                SearchControl: new SearchControl({ tabControl }),
                BrushControl: new BrushControl({ tabControl }),
                GeoJSONControl: new GeoJSONControl({ tabControl }),
            };
            this.controls = controls;
        };
        this.tabControl = tabControl;
        // * element/layer that was enabled and not created yet
        this.enabledTool = null;
        this.guideLayers = [];
    }
    /**
     * method if defined for easier access through tabControlState class/object
     */
    getSelectedColor() {
        var _a;
        const state = (_a = this.controls["PolyControl"]) === null || _a === void 0 ? void 0 : _a.state;
        return (state === null || state === void 0 ? void 0 : state.getSelectedColor()) || "";
    }
    /**
     * method if defined for easier access through tabControlState class/object
     */
    getSelectedStroke() {
        var _a;
        const state = (_a = this.controls["PolyControl"]) === null || _a === void 0 ? void 0 : _a.state;
        return (state === null || state === void 0 ? void 0 : state.getSelectedStroke()) || 0;
    }
    /**
     * method if defined for easier access through tabControlState class/object
     */
    getSelectedIcon() {
        var _a;
        const state = (_a = this.controls["MarkerControl"]) === null || _a === void 0 ? void 0 : _a.state;
        return (state === null || state === void 0 ? void 0 : state.getSelectedIcon()) || "";
    }
    setSelectedIcon(icon) {
        var _a, _b;
        (_b = (_a = this.controls["MarkerControl"]) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.setSelectedIcon(icon);
    }
    /**
     * method if defined for easier access through tabControlState class/object
     */
    callIdentifierChange(haveToCheckFilters = false) {
        var _a;
        const state = (_a = this.controls["DataControl"]) === null || _a === void 0 ? void 0 : _a.state;
        state === null || state === void 0 ? void 0 : state.callIdentifierChange(haveToCheckFilters);
    }
    /**
     * method if defined for easier access through tabControlState class/object
     */
    appendToIconSrcs(iconUrl) {
        var _a;
        const state = (_a = this.controls["MarkerControl"]) === null || _a === void 0 ? void 0 : _a.state;
        state === null || state === void 0 ? void 0 : state.appendToIconSrcs(iconUrl);
    }
    /**
     * method for easier access through tabControlState class/object
     */
    getIntersectActivated() {
        var _a;
        const state = (_a = this.controls["PolyControl"]) === null || _a === void 0 ? void 0 : _a.state;
        return (state === null || state === void 0 ? void 0 : state.intersectActivated) || false;
    }
    /**
     * adds guide layer for snapping
     */
    pushGuideLayer(layer) {
        this.guideLayers.push(layer);
    }
    /**
     * setter for enabledTool variable
     */
    setEnabledTool(val) {
        var _a;
        (_a = this.enabledTool) === null || _a === void 0 ? void 0 : _a.disable();
        this.enabledTool = val;
    }
    /**
     * getter
     */
    getEnabledTool() {
        return this.enabledTool;
    }
}

class GeoJSONTool extends AbstractTool {
    constructor(props) {
        super(props);
        this.result = () => {
            return "geojson";
        };
        this.enable = () => {
            this._redrawSidebar(this.result());
        };
    }
    static NAME() {
        return "geojson-drawing-tool";
    }
    getName() {
        return GeoJSONTool.NAME();
    }
    getIconName() {
        return "fa fa-download";
    }
    getTitle() {
        return "GeoJSON drawing tool";
    }
}
GeoJSONTool.result = "geojson";

const POLYS = ["polyline", "polygon", "painted", "vertice"];
const tabContentClassName = "drawing-sidebar";
/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolMapForm extends geovisto.MapLayerToolForm {
    constructor(props) {
        super(props.tool);
        this.tool = props.tool;
        this.state = new DrawingLayerToolMapFormState(this);
    }
    setInputValues(dimensions) {
        return;
    }
    getTool() {
        return this.tool;
    }
    /**
     * It creates new state of the tab control.
     */
    getState() {
        return this.state;
    }
    /**
     * removes all elements of a sidebar and calls function to create new content of the sidebar
     */
    redrawTabContent(layerType) {
        //console.log("redrawing sidebar...");
        // create sidebar tab content
        const tabContent = document.getElementsByClassName(tabContentClassName)[FIRST];
        while (tabContent.firstChild) {
            tabContent.removeChild(tabContent.firstChild);
        }
        tabContent.appendChild(this.getContent(layerType));
    }
    /**
     * It returns the sidebar tab pane.
     */
    getContent(layerType = "") {
        const { controls } = this.getState();
        // tab content
        this.htmlContent = document.createElement("div");
        const elem = this.htmlContent.appendChild(document.createElement("div"));
        elem.classList.add(tabContentClassName);
        if (!controls || isEmpty(controls))
            return this.htmlContent;
        const brushControl = controls["BrushControl"].createBrushSizeControl();
        if (brushControl)
            elem.appendChild(brushControl);
        if (!layerType) {
            controls["DataControl"].state.clearFilters();
            return this.htmlContent;
        }
        if (layerType === SearchTool.result) {
            controls["SearchControl"].renderSearchInputs(elem);
            controls["DataControl"].state.clearFilters();
            return this.htmlContent;
        }
        if (layerType === GeoJSONTool.result) {
            controls["GeoJSONControl"].renderGeoJSONInputs(elem);
            return this.htmlContent;
        }
        controls["DataControl"].renderDataInputs(elem);
        controls["DataControl"].renderDataFilters(elem);
        controls["DataControl"].renderFilterInputs(elem);
        if (layerType === PaintTool.result || layerType === PolygonTool.result) {
            elem.appendChild(document.createElement("br"));
            elem.appendChild(document.createElement("br"));
            const intersectCheck = controls["PolyControl"].createIntersectionCheck();
            elem.appendChild(intersectCheck);
        }
        if (POLYS.includes(layerType)) {
            controls["PolyControl"].renderPolyInputs(elem);
        }
        if (layerType === MarkerTool.result) {
            controls["MarkerControl"].renderIconInputs(elem);
        }
        return this.htmlContent;
    }
}

/**
 * @author Andrej Tlcina
 */
function useDrawingToolbar() {
    const DrawingToolbar = L__namespace.Control.extend({
        options: {
            position: "topleft",
            drawingBtns: {},
            map: undefined,
            tool: null,
            selectedTool: null,
        },
        /**
         * runs whenever you create instance
         *
         * @param {Object} options
         */
        initialize: function (options) {
            if (options) {
                L__namespace.Util.setOptions(this, options);
            }
        },
        /**
         * runs whenever control is being added
         */
        onAdd: function (map) {
            this.options.map = map;
            return this.createUi();
        },
        /**
         * creates toolbar with multiple buttons
         */
        createUi: function () {
            var _a;
            const topContainer = L__namespace.DomUtil.create("div", "drawingtoolbar");
            const toolContainer = L__namespace.DomUtil.create("div", "leaflet-bar leaflet-control", topContainer);
            toolContainer.style.cursor = "pointer";
            const cancelables = [];
            const toggleHideBtnVisibility = (e) => {
                var _a, _b;
                cancelables.forEach((btn) => { var _a, _b; return (_b = (_a = btn === null || btn === void 0 ? void 0 : btn.lastElementChild) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.add("hide"); });
                let hideBtn = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.lastChild;
                // * if there is no last child we must've clicked the 'outside' the icon
                if (!hideBtn)
                    hideBtn = (_b = e === null || e === void 0 ? void 0 : e.target) === null || _b === void 0 ? void 0 : _b.nextSibling;
                // * careful not to hide the icon
                if ((hideBtn === null || hideBtn === void 0 ? void 0 : hideBtn.tagName) === "I")
                    return;
                if (hideBtn) {
                    // console.log({ hideBtn });
                    hideBtn.classList.toggle("hide");
                }
            };
            const drawingTools = ((_a = this.options.tool) === null || _a === void 0 ? void 0 : _a.drawingTools) || {};
            const handleClick = (e, tool) => {
                var _a;
                const selectedEl = this.getSelectedLayer();
                // * functions are called so user is not drawing over object that has transform handles
                if (tool.getName() !== "transform-drawing-tool") {
                    if (selectedEl)
                        TransformTool.disableTransform(selectedEl);
                }
                if (tool.getName() !== "edit-drawing-tool") {
                    if (selectedEl)
                        EditTool.disableNodeEdit(selectedEl);
                }
                // * disable previous tool
                (_a = this.options.selectedTool) === null || _a === void 0 ? void 0 : _a.deactivate();
                toggleHideBtnVisibility(e);
                // * enable currently selected tool
                tool.activate();
                this.options.selectedTool = tool;
            };
            Object.keys(drawingTools).forEach((key) => {
                const tool = drawingTools[key];
                const canBeCanceled = tool.canBeCanceled();
                const btn = this.createToolbarBtn(tool.getName(), toolContainer, tool.getTitle(), tool.getIconName(), canBeCanceled);
                if (canBeCanceled)
                    cancelables.push(btn);
                L__namespace.DomEvent.on(btn, "click", (e) => handleClick(e, tool), this);
                this.options.drawingBtns[key] = btn;
            });
            L__namespace.DomEvent.disableClickPropagation(topContainer);
            return topContainer;
        },
        /**
         * creates toolbar button
         */
        createToolbarBtn: function (className, btnContainer, title, icon, extra = false) {
            const returnBtn = L__namespace.DomUtil.create("a", `${className} d-side-button`, btnContainer);
            returnBtn.title = title;
            returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
            if (extra) {
                const extraBtn = L__namespace.DomUtil.create("a", "extra-btn hide", returnBtn);
                extraBtn.innerHTML = `Cancel`;
            }
            return returnBtn;
        },
        /**
         *
         * @returns currently selected geo. object
         */
        getSelectedLayer: function () {
            var _a, _b;
            return (_b = (_a = this.options.tool) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.selectedLayer;
        },
    });
    L__namespace.control.drawingToolbar = function (options) {
        if (!options) {
            options = {};
        }
        return new DrawingToolbar(options);
    };
}

/**
 * @brief - takes selected object and currently created object
 *        and executes passed operation
 *        - used for union and intersection
 */
const operateOnSelectedAndCurrectLayer = (layer, operation, selectedLayer) => {
    const feature = getFirstGeoJSONFeature(layer);
    const isFeatPoly = feature ? isFeaturePoly(feature) : false;
    if (!isFeatPoly || !feature)
        return { layer, result: false };
    let summedFeature = feature;
    // * this can be multipolygon whenever user joins 2 unconnected polygons
    const selectedFeatures = getGeoJSONFeatures(selectedLayer);
    if (!selectedFeatures)
        return { layer, result: false };
    // * selected feature may be multiple polygons so we sum them
    selectedFeatures.forEach((selectedFeature) => {
        const isSelectedFeaturePoly = isFeaturePoly(selectedFeature);
        if (isSelectedFeaturePoly) {
            summedFeature = operation(selectedFeature, summedFeature);
        }
    });
    layer = morphFeatureToPolygon(summedFeature, layer.options);
    return { layer, result: true };
};

/**
 * @brief intersect selected object with the one being currently created
 *
 * @param {Layer} layer
 * @param {Number | undefined} eKeyIndex
 * @returns
 */
const polyIntersect = (layer, state) => {
    const selectedLayer = state.selectedLayer;
    if (!selectedLayer || !isLayerPoly(selectedLayer))
        return layer;
    const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(layer, (a, b) => turf__namespace.intersect(a, b), selectedLayer);
    if (result) {
        layer.remove();
    }
    return updatedLayer;
};

/**
 * @brief unifies selected object with the one being currently created
 */
const polyJoin = (layer, state) => {
    const selectedLayer = state.selectedLayer;
    if (!selectedLayer || !isLayerPoly(selectedLayer))
        return layer;
    const { layer: updatedLayer, result } = operateOnSelectedAndCurrectLayer(layer, (a, b) => union(a, b), selectedLayer);
    if (result) {
        layer.remove();
        state.removeSelectedLayer();
        state.setSelectedLayer(updatedLayer);
    }
    return updatedLayer;
};

const replaceLayer = (state, replacement, replacedLayer, replacementCoords) => {
    var _a;
    (_a = replacement === null || replacement === void 0 ? void 0 : replacement.dragging) === null || _a === void 0 ? void 0 : _a.disable();
    replacement.layerType = "polygon";
    if (replacementCoords)
        replacement._latlngs = replacementCoords;
    replacement.identifier = replacedLayer.identifier;
    replacement.setStyle(Object.assign(Object.assign({}, replacement.options), normalStyles));
    const content = replacedLayer.popupContent;
    if (content) {
        replacement.bindPopup(content, {
            closeOnClick: false,
            autoClose: false,
        });
        replacement.popupContent = content;
    }
    state.addLayer(replacement);
    state.removeLayer(replacedLayer);
};
const diffLayers = (geoObject, layerFeature, state, canDiff) => {
    if (!geoObject)
        return;
    const feature = getFirstGeoJSONFeature(geoObject);
    if (canDiff) {
        const diffFeature = difference(feature, layerFeature);
        if (diffFeature) {
            let latlngs;
            const coords = diffFeature.geometry.coordinates;
            const isJustPoly = diffFeature.geometry.type === "Polygon";
            // * when substracting you can basically slice polygon into more parts,\
            // * then we have to increase depth by one because we have an array within an array
            const depth = getConversionDepth(diffFeature);
            try {
                // * - this conditional asks if created polygon is polygon with hole punched in it
                // * - for the rest of cases i.e. when polygon is split into multiple parts or not, we use loop\
                // * otherwise we create polygon, where hole should be
                if (isJustPoly && coords.length !== 1) {
                    latlngs = L.GeoJSON.coordsToLatLngs(coords, 1);
                    const result = new L.polygon(latlngs, Object.assign({}, geoObject.options));
                    replaceLayer(state, result, geoObject);
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    coords.forEach((coord) => {
                        latlngs = L.GeoJSON.coordsToLatLngs([coord], depth);
                        const result = new L.polygon(latlngs, Object.assign({}, geoObject.options));
                        const newLatLngs = depth === 1 ? result._latlngs : result._latlngs[FIRST];
                        replaceLayer(state, result, geoObject, newLatLngs);
                    });
                }
            }
            catch (error) {
                console.error({ coords, latlngs, error, depth });
            }
        }
        else {
            state.removeLayer(geoObject);
        }
    }
};
/**
 * @brief takes currently created polygon and loops through each polygon
 *        and executes operation 'difference'
 *
 * @param {Layer} layer
 * @param {Boolean} intersect
 */
const polyDiff = (layer, state, intersect = false) => {
    const layerFeature = getFirstGeoJSONFeature(layer);
    const isCurrentLayerPoly = isLayerPoly(layer);
    const createdIsNotEraser = layer.layerType !== "erased";
    if (isCurrentLayerPoly && layerFeature) {
        const selectedLayer = state.selectedLayer;
        // * - if intersect is active execute difference with only selected polygon
        // * - part of condition with 'selectedLayer' is here b/c, when you have intersect on\
        // * without selecting object stroke/object user creates stayes on top of everything
        if (intersect &&
            createdIsNotEraser &&
            selectedLayer &&
            isLayerPoly(selectedLayer)) {
            diffLayers(selectedLayer, layerFeature, state, true);
        }
        else {
            const fgLayers = state.featureGroup._layers;
            // * else we execute difference with each geo. object
            Object.values(fgLayers)
                .filter((geoObject) => isLayerPoly(geoObject))
                .forEach((geoObject) => {
                // * we want to avoid damaging selected layer
                const objectIsNotSelected = (geoObject === null || geoObject === void 0 ? void 0 : geoObject._leaflet_id) !== (selectedLayer === null || selectedLayer === void 0 ? void 0 : selectedLayer._leaflet_id);
                const canDiff = objectIsNotSelected;
                diffLayers(geoObject, layerFeature, state, canDiff);
            });
        }
    }
};

// ! pather throws errors without this line
// window.d3 = d33;
// * as advised in https://github.com/makinacorpus/Leaflet.Snap/issues/52
L.Draw.Feature.include(L.Evented.prototype);
L.Draw.Feature.include(L.Draw.Feature.SnapMixin);
L.Draw.Feature.addInitHook(L.Draw.Feature.SnapMixin._snap_initialize);
/**
 * This class represents Drawing layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerTool extends geovisto.AbstractLayerTool {
    /**
     * It creates a new tool with respect to the props.
     */
    constructor(props) {
        super(props);
        /**
         * @brief called whenever new geo. object is created
         */
        this.createdListener = (e) => {
            let layer = e.layer;
            if (!layer)
                return;
            layer.layerType = e.layerType;
            const sidebarState = this.getMapForm().getState();
            const state = this.getState();
            const intersectActivated = sidebarState.getIntersectActivated();
            if (layer === null || layer === void 0 ? void 0 : layer.dragging)
                layer.dragging.disable();
            if (e.layerType === PolygonTool.result ||
                e.layerType === PaintTool.result) {
                // * INTERSECT
                if (intersectActivated)
                    layer = polyIntersect(layer, state);
                // * JOIN
                else
                    layer = polyJoin(layer, state);
            }
            if (e.layerType === PolygonTool.result ||
                e.layerType === PaintTool.result ||
                e.layerType === EraseTool.result) {
                // * DIFFERENCE
                polyDiff(layer, state, intersectActivated);
            }
            // * PUSH LAYER IF NOT SLICING/ERASING
            if (e.layerType !== GeometricSliceTool.result &&
                e.layerType !== EraseTool.result) {
                state.addLayer(layer);
                sidebarState.pushGuideLayer(layer);
            }
        };
        /**
         * @brief called on object click to change its style accordingly
         */
        this.initChangeStyle = (e) => {
            var _a;
            const drawObject = e.target;
            const state = this.getState();
            const selecting = state.getSelecting();
            if (selecting) {
                const joinTool = this.drawingTools[JoinTool.NAME()];
                if (joinTool) {
                    joinTool.joinChosen(drawObject);
                    return;
                }
            }
            if (((_a = e === null || e === void 0 ? void 0 : e.originalEvent) === null || _a === void 0 ? void 0 : _a.ctrlKey) && state.selectedLayer) {
                state.addExtraSelected(drawObject);
                return;
            }
            const fgLayers = state.featureGroup._layers;
            Object.values(fgLayers).forEach((_) => {
                var _a, _b;
                this.normalizeElement(_);
                (_a = _ === null || _ === void 0 ? void 0 : _.dragging) === null || _a === void 0 ? void 0 : _a.disable();
                if ((_b = _ === null || _ === void 0 ? void 0 : _.transform) === null || _b === void 0 ? void 0 : _b._enabled) {
                    _.transform.disable();
                }
            });
            state.setSelectedLayer(drawObject);
            TransformTool.initTransform(drawObject);
            this.redrawMapForm(drawObject === null || drawObject === void 0 ? void 0 : drawObject.layerType);
            this.mapForm.getState().callIdentifierChange(true);
            document.querySelector(".leaflet-container").style.cursor = "";
            // * at this point user clicked without holdin 'CTRL' key
            // state.clearExtraSelected();
        };
        this.drawingTools = {};
    }
    /**
     * Overrides the super method.
     *
     * @param initProps
     */
    initialize(initProps) {
        // FIXME: use geo-data manager to acquire geojson
        this.getState().deserializeGeoJSON(EMPTY_GEOJSON);
        return super.initialize(initProps);
    }
    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new DrawingLayerTool(this.getProps());
    }
    /**
     * It returns the props given by the programmer.
     */
    getProps() {
        return super.getProps();
    }
    /**
     * It returns default values of the state properties.
     */
    getDefaults() {
        return super.getDefaults();
    }
    /**
     * It returns the layer tool state.
     */
    getState() {
        return super.getState();
    }
    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new DrawingLayerToolDefaults();
    }
    /**
     * It returns default tool state.
     */
    createState() {
        return new DrawingLayerToolState(this);
    }
    /**
     * It returns a tab control.
     */
    getMapForm() {
        if (this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }
    redrawMapForm(layerType) {
        if (this.mapForm == undefined)
            return;
        this.mapForm.redrawTabContent(layerType);
    }
    /**
     * It creates new tab control.
     */
    createMapForm() {
        return new DrawingLayerToolMapForm({ tool: this });
    }
    /**
     * It changes layer state to enabled/disabled.
     *
     * @param enabled
     */
    setEnabled(enabled) {
        var _a, _b;
        if (enabled != this.isEnabled()) {
            // update state
            this.getState().setEnabled(enabled);
            const map = (_b = (_a = this.getMap()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.getLeafletMap();
            // show ot hide the layer
            if (enabled) {
                this.showLayerItems();
                map === null || map === void 0 ? void 0 : map.addControl(this.controlDrawingToolbar);
            }
            else {
                map === null || map === void 0 ? void 0 : map.removeControl(this.controlDrawingToolbar);
                this.hideLayerItems();
            }
        }
    }
    initializeDrawingTools() {
        const tools = {};
        tools[GeoJSONTool.NAME()] = new GeoJSONTool({ drawingTool: this });
        tools[LineTool.NAME()] = new LineTool({ drawingTool: this });
        tools[MarkerTool.NAME()] = new MarkerTool({ drawingTool: this });
        tools[PolygonTool.NAME()] = new PolygonTool({ drawingTool: this });
        tools[SearchTool.NAME()] = new SearchTool({ drawingTool: this });
        tools[TopologyTool.NAME()] = new TopologyTool({ drawingTool: this });
        tools[GeometricSliceTool.NAME()] = new GeometricSliceTool({
            drawingTool: this,
        });
        //Problem with tool - require old D3 version
        // tools[FreehandSliceTool.NAME()] = new FreehandSliceTool({
        //   drawingTool: this,
        // });
        tools[PaintTool.NAME()] = new PaintTool({ drawingTool: this });
        tools[EraseTool.NAME()] = new EraseTool({ drawingTool: this });
        tools[JoinTool.NAME()] = new JoinTool({ drawingTool: this });
        tools[DeselectTool.NAME()] = new DeselectTool({ drawingTool: this });
        tools[TransformTool.NAME()] = new TransformTool({ drawingTool: this });
        tools[EditTool.NAME()] = new EditTool({ drawingTool: this });
        tools[RemoveTool.NAME()] = new RemoveTool({ drawingTool: this });
        this.drawingTools = tools;
    }
    /**
     * It creates layer items.
     */
    createLayerItems() {
        var _a, _b;
        //console.log("%c ...creating", "color: #ff5108");
        const map = (_b = (_a = this.getMap()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.getLeafletMap();
        this.getMapForm().getState().initializeControls();
        this.initializeDrawingTools();
        useDrawingToolbar();
        this.setGlobalSimplificationTolerance(map);
        this.controlDrawingToolbar = L.control.drawingToolbar({
            tool: this,
            selectedTool: null,
        });
        if (this.isEnabled()) {
            map === null || map === void 0 ? void 0 : map.addControl(this.controlDrawingToolbar);
        }
        // * eventlistener for when object is created
        map === null || map === void 0 ? void 0 : map.on("draw:created", this.createdListener);
        map === null || map === void 0 ? void 0 : map.on("zoomend", () => this.setGlobalSimplificationTolerance(map));
        map === null || map === void 0 ? void 0 : map.on("click", () => {
            var _a, _b;
            const sidebar = this.getMapForm();
            if ((_b = (_a = sidebar.getState()) === null || _a === void 0 ? void 0 : _a.enabledTool) === null || _b === void 0 ? void 0 : _b.isToolActive())
                return;
            if (document.querySelector(".leaflet-container").style
                .cursor === "wait")
                return;
            const selected = this.getState().selectedLayer;
            if (selected) {
                DeselectTool.deselect(selected, this);
                TransformTool.initTransform(selected, true);
            }
            this.getState().clearExtraSelected();
        });
        const sidebarState = this.getMapForm().getState();
        const handleSpacePress = (e, exec) => {
            if (e.keyCode === SPACE_BAR) {
                const enabledTool = sidebarState.enabledTool;
                if (enabledTool === null || enabledTool === void 0 ? void 0 : enabledTool.isToolActive()) {
                    exec(enabledTool);
                }
            }
        };
        const handleSpaceDown = (e) => handleSpacePress(e, (enabledTool) => enabledTool === null || enabledTool === void 0 ? void 0 : enabledTool.disable());
        const handleSpaceUp = (e) => handleSpacePress(e, (enabledTool) => enabledTool === null || enabledTool === void 0 ? void 0 : enabledTool.enable());
        document.addEventListener("keydown", handleSpaceDown);
        document.addEventListener("keyup", handleSpaceUp);
        const { featureGroup } = this.getState();
        return [featureGroup];
    }
    /**
     * @brief aplies event listeners for each geo. object
     *
     * @param {Layer} layer
     */
    applyEventListeners(layer) {
        layer
            .on("click", L.DomEvent.stopPropagation)
            .on("click", this.initChangeStyle, this);
        layer.on("mouseover", this.hightlightOnHover, this);
        layer.on("mouseout", this.normalizeOnHover, this);
        if (layer.layerType === "marker") {
            TopologyTool.applyTopologyMarkerListeners(layer, this.getState());
        }
    }
    /**
     * @brief sets global tolerance for brush stroke
     */
    setGlobalSimplificationTolerance(map) {
        if (!map)
            return;
        const metersPerPixel = (40075016.686 *
            Math.abs(Math.cos((map.getCenter().lat * Math.PI) / 180))) /
            Math.pow(2, map.getZoom() + 8);
        const zoom = map.getZoom();
        // ! this is tried out, so no real calculation
        window.customTolerance = zoom >= 4 ? 0.0001 * metersPerPixel : 1.5;
    }
    /**
     * @brief highlights element
     */
    highlightElement(el) {
        if (el === null || el === void 0 ? void 0 : el._icon) {
            L.DomUtil.addClass(el._icon, "highlight-marker");
        }
        else {
            if (el === null || el === void 0 ? void 0 : el.setStyle)
                el.setStyle(highlightStyles);
        }
    }
    /**
     * @brief highlights element on mouse hover
     */
    hightlightOnHover(e) {
        if (this.getState().getSelecting())
            return;
        this.highlightElement(e.target);
    }
    /**
     * @brief sets normal styles for element
     */
    normalizeElement(el) {
        if (el === null || el === void 0 ? void 0 : el._icon) {
            L.DomUtil.removeClass(el._icon, "highlight-marker");
        }
        else {
            if (el === null || el === void 0 ? void 0 : el.setStyle)
                el.setStyle(normalStyles);
        }
    }
    /**
     * @brief sets normal styles for element on mouse hover
     *
     * @param {Object} el
     */
    normalizeOnHover(e) {
        var _a, _b;
        if (this.getState().getSelecting())
            return;
        if (((_b = (_a = this.getState()) === null || _a === void 0 ? void 0 : _a.selectedLayer) === null || _b === void 0 ? void 0 : _b._leaflet_id) ===
            e.target._leaflet_id)
            return;
        this.normalizeElement(e.target);
    }
}

const GeovistoDrawingLayerTool = {
    getType: () => DrawingLayerToolDefaults.TYPE,
    createTool: (props) => new DrawingLayerTool(props),
};

exports.DrawingLayerTool = DrawingLayerTool;
exports.DrawingLayerToolDefaults = DrawingLayerToolDefaults;
exports.DrawingLayerToolMapForm = DrawingLayerToolMapForm;
exports.DrawingLayerToolState = DrawingLayerToolState;
exports.DrawingLayerToolTabState = DrawingLayerToolMapFormState;
exports.GeovistoDrawingLayerTool = GeovistoDrawingLayerTool;
//# sourceMappingURL=index.js.map
