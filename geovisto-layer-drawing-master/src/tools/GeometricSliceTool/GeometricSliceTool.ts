import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";
import * as turf from "@turf/turf";

import { AbstractTool } from "../AbstractTool";
import "../../components/useKnife";
import { getFirstGeoJSONFeature, isFeaturePoly } from "../../util/polyHelpers";
import { normalStyles } from "../../util/constants";
import { ToolProps } from "../AbstractTool/types";
import {
  CreatedEvent,
  DrawnObject,
  LayerType,
  TurfPolygon,
} from "../../model/types";
import {
  Geometry,
  getCoord,
  getCoords,
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
} from "@turf/turf";
import { TGeometricSliceTool } from "./types";
import { ActiveTool } from "../../model/types/tool/IDrawingLayerTool";

type LineObject = GeoJSON.Feature<LineString | MultiLineString>;
type PolyObject = GeoJSON.Feature<Polygon | MultiPolygon>;

class GeometricSliceTool extends AbstractTool implements TGeometricSliceTool {
  public static result: LayerType | "" = "knife";

  public constructor(props: ToolProps) {
    super(props);

    this.leafletMap?.on("draw:created" as any, this.created as any);
  }

  public static NAME(): string {
    return "geometric-slice-drawing-tool";
  }

  public getName(): string {
    return GeometricSliceTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-scissors";
  }

  public getTitle(): string {
    return "Division tool";
  }

  public canBeCanceled = (): boolean => {
    return true;
  };

  private created = (e: CreatedEvent): void => {
    const layer = e.layer;
    if (!layer) return;

    // * SLICE
    if (e.layerType === GeometricSliceTool.result) {
      this.polySlice(layer);
      this.deactivate();
    }
  };

  /**
   * @brief - inspired by https://gis.stackexchange.com/questions/344068/splitting-a-polygon-by-multiple-linestrings-leaflet-and-turf-js
   *        - slices selected object with currently created one
   */
  public polySlice(layer: DrawnObject): void {
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
          offsetLine = turf.lineOffset(
            (lineFeat as unknown) as LineString,
            THICK_LINE_WIDTH,
            {
              units: THICK_LINE_UNITS,
            }
          );

          const polyCoords = [];
          // * push all of the coordinates of original line
          for (
            let j = 0;
            j < (lineFeat.geometry as Geometry).coordinates.length;
            j++
          ) {
            polyCoords.push((lineFeat.geometry as Geometry).coordinates[j]);
          }
          // * push all of the coordinates of offset line
          for (
            let j = offsetLine.geometry.coordinates.length - 1;
            j >= 0;
            j--
          ) {
            polyCoords.push(offsetLine.geometry.coordinates[j]);
          }
          // * to create linear ring
          polyCoords.push((lineFeat.geometry as Geometry).coordinates[0]);

          const thickLineString = turf.lineString(polyCoords as any);
          const thickLinePolygon = turf.lineToPolygon(thickLineString);
          const clipped = turf.difference(
            selectedFeature as TurfPolygon,
            thickLinePolygon
          );
          // clipped = simplifyFeature(clipped);
          if (!clipped) return;

          coords = clipped.geometry.coordinates;
          this.drawingTool.getState().removeSelectedLayer();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          coords.forEach((coord) => {
            latlngs = L.GeoJSON.coordsToLatLngs(coord, 1);
            const result = new (L as any).polygon(latlngs, {
              ...selectedLayer.options,
              ...normalStyles,
            });
            result.layerType = "polygon";
            this.drawingTool.getState().addLayer(result);
          });
        } catch (error) {
          console.error({ coords, latlngs, error });
        }
      }
    }
  }

  private _dividePoly = (): void => {
    if (!this.leafletMap) return;
    this.activetool = new L.Draw.Slice(this.leafletMap, {
      shapeOptions: {
        color: "#333",
        weight: 3,
        draggable: true,
        transform: true,
        guideLayers: this.sidebar.getState().guideLayers,
      },
    }) as ActiveTool;
    this.activetool.enable();
  };

  public enable = (): void => {
    this._dividePoly();
  };

  public disable = (): void => {
    const activeTool = this.activetool;

    if (activeTool) {
      activeTool.disable();
    }

    // * hide extra btn for disabling tools
    const query = `.drawingtoolbar .${this.getName()} .extra-btn`;
    const divideBtn = document.querySelector(query);
    if (divideBtn) divideBtn.classList.add("hide");
  };
}

export default GeometricSliceTool;
