import L, { FeatureGroup, LeafletMouseEvent, Map, TileEvent } from "leaflet";

import DrawingLayerToolState, { EMPTY_GEOJSON } from "./DrawingLayerToolState";
import DrawingLayerToolDefaults from "./DrawingLayerToolDefaults";
import DrawingLayerToolMapForm from "./sidebar/DrawingLayerToolMapForm";
import useDrawingToolbar from "./components/useDrawingToolbar";
import { TDrawingToolbar } from "./model/types/sidebar/DrawingToolbar";

import "leaflet/dist/leaflet.css";
import "./style/drawingLayer.scss";
import "leaflet-snap";
import "leaflet-geometryutil";
import "leaflet-draw";

// import * as d33 from "d3-3-5-5";
import { SPACE_BAR, highlightStyles, normalStyles } from "./util/constants";

import { polyDiff, polyIntersect, polyJoin } from "./rules";
import {
  DeselectTool,
  EditTool,
  EraseTool,
  FreehandSliceTool,
  GeometricSliceTool,
  JoinTool,
  LineTool,
  MarkerTool,
  PaintTool,
  PolygonTool,
  RemoveTool,
  SearchTool,
  TopologyTool,
  TransformTool,
} from "./tools";
import {
  CreatedEvent,
  LooseObject,
  DrawnObject,
  LayerType,
} from "./model/types";
import IDrawingLayerToolProps from "./model/types/tool/IDrawingLayerToolProps";
import IDrawingLayerTool, {
  DrawingForm,
} from "./model/types/tool/IDrawingLayerTool";
import { AbstractLayerTool, IMapFormControl, IMapToolInitProps } from "geovisto";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";
import IDrawingLayerToolState from "./model/types/tool/IDrawingLayerToolState";
import { IDrawingLayerToolConfig } from "./model/types/tool/IDrawingLayerToolConfig";
import { GeoJSONTool } from "./tools/GeoJSONTool";

// ! pather throws errors without this line
// window.d3 = d33;

// * as advised in https://github.com/makinacorpus/Leaflet.Snap/issues/52
L.Draw.Feature.include(L.Evented.prototype);
L.Draw.Feature.include((L.Draw.Feature as any).SnapMixin);
L.Draw.Feature.addInitHook((L.Draw.Feature as any).SnapMixin._snap_initialize);

declare global {
  interface Window {
    customTolerance: number;
    d3: any; //* we do not care about this type, b/c we're not even using it, it's just used in pather package
  }
}

/**
 * This class represents Drawing layer tool.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerTool
  extends AbstractLayerTool
  implements IDrawingLayerTool, IMapFormControl {
  public drawingTools: LooseObject;
  private mapForm!: DrawingForm;
  private controlDrawingToolbar!: TDrawingToolbar;

  /**
   * It creates a new tool with respect to the props.
   */
  public constructor(props?: IDrawingLayerToolProps) {
    super(props);
    this.drawingTools = {};
  }

  /**
   * Overrides the super method.
   *
   * @param initProps
   */
  public initialize(
    initProps: IMapToolInitProps<IDrawingLayerToolConfig>
  ): this {
    // FIXME: use geo-data manager to acquire geojson
    this.getState().deserializeGeoJSON(EMPTY_GEOJSON);
    return super.initialize(initProps);
  }

  /**
   * It creates a copy of the uninitialized tool.
   */
  public copy(): IDrawingLayerTool {
    return new DrawingLayerTool(this.getProps());
  }

  /**
   * It returns the props given by the programmer.
   */
  public getProps(): IDrawingLayerToolProps {
    return <IDrawingLayerToolProps>super.getProps();
  }

  /**
   * It returns default values of the state properties.
   */
  public getDefaults(): IDrawingLayerToolDefaults {
    return <IDrawingLayerToolDefaults>super.getDefaults();
  }
  /**
   * It returns the layer tool state.
   */
  public getState(): IDrawingLayerToolState {
    return <IDrawingLayerToolState>super.getState();
  }

  /**
   * It creates new defaults of the tool.
   */
  protected createDefaults(): IDrawingLayerToolDefaults {
    return new DrawingLayerToolDefaults();
  }

  /**
   * It returns default tool state.
   */
  protected createState(): IDrawingLayerToolState {
    return new DrawingLayerToolState(this);
  }

  /**
   * It returns a tab control.
   */
  public getMapForm(): DrawingForm {
    if (this.mapForm == undefined) {
      this.mapForm = this.createMapForm();
    }
    return this.mapForm;
  }

  public redrawMapForm(layerType: LayerType | ""): void {
    if (this.mapForm == undefined) return;
    this.mapForm.redrawTabContent(layerType);
  }

  /**
   * It creates new tab control.
   */
  protected createMapForm(): DrawingForm {
    return new DrawingLayerToolMapForm({ tool: this });
  }

  /**
   * It changes layer state to enabled/disabled.
   *
   * @param enabled
   */
  public setEnabled(enabled: boolean): void {
    if (enabled != this.isEnabled()) {
      // update state
      this.getState().setEnabled(enabled);

      const map = this.getMap()?.getState()?.getLeafletMap();
      // show ot hide the layer
      if (enabled) {
        this.showLayerItems();
        map?.addControl(this.controlDrawingToolbar);
      } else {
        map?.removeControl(this.controlDrawingToolbar);

        this.hideLayerItems();
      }
    }
  }

  public initializeDrawingTools(): void {
    const tools: LooseObject = {};

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
  protected createLayerItems(): FeatureGroup[] {
    //console.log("%c ...creating", "color: #ff5108");
    const map = this.getMap()?.getState()?.getLeafletMap();

    this.getMapForm().getState().initializeControls();
    this.initializeDrawingTools();
    useDrawingToolbar();
    this.setGlobalSimplificationTolerance(map);
    this.controlDrawingToolbar = L.control.drawingToolbar({
      tool: this,
      selectedTool: null,
    });
    if(this.isEnabled()) {
      map?.addControl(this.controlDrawingToolbar);
    }

    // * eventlistener for when object is created
    map?.on("draw:created" as any, this.createdListener as any);
    map?.on("zoomend", () => this.setGlobalSimplificationTolerance(map));
    map?.on("click", () => {
      const sidebar = this.getMapForm();
      if (sidebar.getState()?.enabledTool?.isToolActive()) return;
      if (
        (document.querySelector(".leaflet-container") as HTMLDivElement).style
          .cursor === "wait"
      )
        return;
      const selected = this.getState().selectedLayer;
      if (selected) {
        DeselectTool.deselect(selected, this);
        TransformTool.initTransform(selected, true);
      }
      this.getState().clearExtraSelected();
    });

    const sidebarState = this.getMapForm().getState();
    const handleSpacePress = (e: KeyboardEvent, exec: (el: any) => void) => {
      if (e.keyCode === SPACE_BAR) {
        const enabledTool = sidebarState.enabledTool;
        if (enabledTool?.isToolActive()) {
          exec(enabledTool);
        }
      }
    };
    const handleSpaceDown = (e: KeyboardEvent) =>
      handleSpacePress(e, (enabledTool) => enabledTool?.disable());
    const handleSpaceUp = (e: KeyboardEvent) =>
      handleSpacePress(e, (enabledTool) => enabledTool?.enable());

    document.addEventListener("keydown", handleSpaceDown);
    document.addEventListener("keyup", handleSpaceUp);

    const { featureGroup } = this.getState();
    return [featureGroup];
  }

  /**
   * @brief called whenever new geo. object is created
   */
  private createdListener = (e: CreatedEvent): void => {
    let layer: DrawnObject = e.layer;
    if (!layer) return;

    layer.layerType = e.layerType;
    const sidebarState = this.getMapForm().getState();
    const state = this.getState();

    const intersectActivated = sidebarState.getIntersectActivated();

    if (layer?.dragging) layer.dragging.disable();

    if (
      e.layerType === PolygonTool.result ||
      e.layerType === PaintTool.result
    ) {
      // * INTERSECT
      if (intersectActivated) layer = polyIntersect(layer, state);
      // * JOIN
      else layer = polyJoin(layer, state);
    }

    if (
      e.layerType === PolygonTool.result ||
      e.layerType === PaintTool.result ||
      e.layerType === EraseTool.result
    ) {
      // * DIFFERENCE
      polyDiff(layer, state, intersectActivated);
    }

    // * PUSH LAYER IF NOT SLICING/ERASING
    if (
      e.layerType !== GeometricSliceTool.result &&
      e.layerType !== EraseTool.result
    ) {
      state.addLayer(layer);
      sidebarState.pushGuideLayer(layer);
    }
  };

  /**
   * @brief aplies event listeners for each geo. object
   *
   * @param {Layer} layer
   */
  public applyEventListeners(layer: DrawnObject): void {
    layer
      .on("click", L.DomEvent.stopPropagation)
      .on("click", this.initChangeStyle, this);
    layer.on("mouseover" as any, this.hightlightOnHover, this);
    layer.on("mouseout" as any, this.normalizeOnHover, this);
    if (layer.layerType === "marker") {
      TopologyTool.applyTopologyMarkerListeners(layer, this.getState());
    }
  }

  /**
   * @brief sets global tolerance for brush stroke
   */
  public setGlobalSimplificationTolerance(map: Map | undefined): void {
    if (!map) return;
    const metersPerPixel =
      (40075016.686 *
        Math.abs(Math.cos((map.getCenter().lat * Math.PI) / 180))) /
      Math.pow(2, map.getZoom() + 8);
    const zoom = map.getZoom();

    // ! this is tried out, so no real calculation
    window.customTolerance = zoom >= 4 ? 0.0001 * metersPerPixel : 1.5;
  }

  /**
   * @brief highlights element
   */
  public highlightElement(el: DrawnObject): void {
    if (el?._icon) {
      L.DomUtil.addClass(el._icon, "highlight-marker");
    } else {
      if (el?.setStyle) el.setStyle(highlightStyles);
    }
  }

  /**
   * @brief highlights element on mouse hover
   */
  private hightlightOnHover(e: TileEvent): void {
    if (this.getState().getSelecting()) return;
    this.highlightElement(e.target as DrawnObject);
  }

  /**
   * @brief sets normal styles for element
   */
  public normalizeElement(el: DrawnObject): void {
    if (el?._icon) {
      L.DomUtil.removeClass(el._icon, "highlight-marker");
    } else {
      if (el?.setStyle) el.setStyle(normalStyles);
    }
  }

  /**
   * @brief sets normal styles for element on mouse hover
   *
   * @param {Object} el
   */
  private normalizeOnHover(e: TileEvent): void {
    if (this.getState().getSelecting()) return;
    if (
      this.getState()?.selectedLayer?._leaflet_id ===
      (e.target as DrawnObject)._leaflet_id
    )
      return;
    this.normalizeElement(e.target as DrawnObject);
  }

  /**
   * @brief called on object click to change its style accordingly
   */
  private initChangeStyle = (e: LeafletMouseEvent): void => {
    const drawObject = e.target as DrawnObject;
    const state = this.getState();

    const selecting = state.getSelecting();
    if (selecting) {
      const joinTool = this.drawingTools[JoinTool.NAME()];
      if (joinTool) {
        joinTool.joinChosen(drawObject);
        return;
      }
    }

    if (e?.originalEvent?.ctrlKey && state.selectedLayer) {
      state.addExtraSelected(drawObject);
      return;
    }

    const fgLayers = state.featureGroup._layers;
    Object.values(fgLayers).forEach((_) => {
      this.normalizeElement(_);
      _?.dragging?.disable();
      if (_?.transform?._enabled) {
        _.transform.disable();
      }
    });
    state.setSelectedLayer(drawObject);
    TransformTool.initTransform(drawObject);
    this.redrawMapForm(drawObject?.layerType);

    this.mapForm.getState().callIdentifierChange(true);

    (document.querySelector(
      ".leaflet-container"
    ) as HTMLDivElement).style.cursor = "";
    // * at this point user clicked without holdin 'CTRL' key
    // state.clearExtraSelected();
  };
}

export default DrawingLayerTool;
