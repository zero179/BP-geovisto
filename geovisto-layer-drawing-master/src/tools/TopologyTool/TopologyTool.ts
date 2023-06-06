import L, { FeatureGroup, LatLng, Marker, Polyline } from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { MarkerTool } from "../MarkerTool";
import { normalStyles } from "../../util/constants";
import {
  CreatedEvent,
  DrawnObject,
  LayerType,
  LooseObject,
  Optional,
} from "../../model/types";
import { CustomMarker, LeafletDrag, TTopologyTool } from "./types";
import { ToolProps } from "../AbstractTool/types";
import IDrawingLayerToolState, {
  IndexedVertices,
} from "../../model/types/tool/IDrawingLayerToolState";

class TopologyTool extends MarkerTool implements TTopologyTool {
  public constructor(props: ToolProps) {
    super(props);

    this.leafletMap?.on("draw:created" as any, this.created as any);
  }

  public static NAME(): string {
    return "topology-drawing-tool";
  }

  public getName(): string {
    return TopologyTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-sitemap";
  }

  public getTitle(): string {
    return "Topology drawing tool";
  }

  public result = (): LayerType | "" => {
    return "marker";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  public created = (e: CreatedEvent): void => {
    const layer = e.layer;
    if (!layer) return;
    layer.layerType = e.layerType;

    // * MARKER
    if (this.isConnectMarker(layer)) {
      this.plotTopology(null, layer);
    }
  };

  public isConnectMarker = (layer: DrawnObject): boolean => {
    return this.drawingTool.getState().isConnectMarker(layer);
  };

  public enable = (): void => {
    this._markerCreate(true);
  };

  public plotTopology(
    chosen: Optional<DrawnObject[]> = null,
    createdMarker: Optional<DrawnObject> = null
  ): void {
    const toolState = this.drawingTool.getState();
    const selectedLayer = toolState.selectedLayer;

    const layersObj: LooseObject = toolState.featureGroup._layers;
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
    const secondMarker =
      selectedLayerIsConnectMarker && !chosen
        ? selectedLayer
        : _markers[index + 1];
    if (secondMarker) {
      const { lat: fLat, lng: fLng } = firstMarker.getLatLng();
      const { lat: sLat, lng: sLng } = secondMarker.getLatLng();

      // * create vertice
      const _latlng = [L.latLng(fLat, fLng), L.latLng(sLat, sLng)];
      const poly = new (L as any).polyline(_latlng, {
        color: "#563412",
        weight: 3,
        ...normalStyles,
      });
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
  private _haveSameVertice(current: Polyline): boolean {
    const found = this.drawingTool
      .getState()
      .createdVertices.find((vertice: DrawnObject) => {
        const firstPointOfVertice = vertice.getLatLngs()[0] as LatLng;
        const secondPointOfVertice = vertice.getLatLngs()[1] as LatLng;
        const firstPointOfCurrent = current.getLatLngs()[0] as LatLng;
        const secondPointOfCurrent = current.getLatLngs()[1] as LatLng;

        return (
          (firstPointOfVertice.equals(firstPointOfCurrent) &&
            secondPointOfVertice.equals(secondPointOfCurrent)) ||
          (firstPointOfVertice.equals(secondPointOfCurrent) &&
            secondPointOfVertice.equals(firstPointOfCurrent))
        );
      });

    return Boolean(found);
  }

  /**
   * @brief maps through each of the markes and if its coordinates fit vertice's coordinates
   *        then vertice is mapped onto marker id
   */
  private _mapMarkersToVertices(_markers: CustomMarker[]): void {
    const toolState = this.drawingTool.getState();

    _markers
      .map((marker) => ({
        latlng: marker.getLatLng(),
        lId: marker._leaflet_id,
        marker,
      }))
      .forEach(({ latlng, lId }) => {
        toolState.createdVertices.forEach(
          (vertice: DrawnObject, index: number) => {
            // * used indexing instead of another loop (vertices have only 2 points)

            const firstPoint = vertice.getLatLngs()[0] as LatLng;
            const secondPoint = vertice.getLatLngs()[1] as LatLng;

            const spread = toolState.mappedMarkersToVertices[lId] || {};
            // * depending on if first or second latlng of vertice matches with marker's latlng
            // * we save this information so we know which side we should move on drag
            if (firstPoint.equals(latlng)) {
              toolState.setVerticesToMarker(lId, {
                ...spread,
                [`${index}-0`]: vertice,
              });
            } else if (secondPoint.equals(latlng)) {
              toolState.setVerticesToMarker(lId, {
                ...spread,
                [`${index}-1`]: vertice,
              });
            }
          }
        );
      });
  }

  /**
   * @brief event listener so vetice is dragged with marker
   */
  public static applyTopologyMarkerListeners(
    layer: DrawnObject,
    state: IDrawingLayerToolState
  ): void {
    layer.on("drag", (event: LeafletDrag) => {
      const { latlng, target } = event;
      const markerVertices = state.mappedMarkersToVertices[target._leaflet_id];

      TopologyTool.changeVerticesLocation(latlng, markerVertices);
    });
  }

  /**
   * @brief called on drag to change vertice's point location
   */
  private static changeVerticesLocation(
    latlng: LatLng,
    markerVertices?: IndexedVertices
  ): void {
    if (!markerVertices) return;

    Object.keys(markerVertices).forEach((key) => {
      const vertice: DrawnObject = markerVertices[key];
      const splitKey = key?.split("-");
      const idx = splitKey ? splitKey[1] : undefined;
      if (idx === undefined) return;
      // ? for some reason cloneLatLngs has return type of LatLng[][] even though it returns value of type LatLng[]
      const latLngs = (L.LatLngUtil.cloneLatLngs(
        vertice.getLatLngs() as LatLng[]
      ) as unknown) as LatLng[];
      latLngs[Number(idx)] = latlng;
      vertice.setLatLngs(latLngs);
    });
  }
}

export default TopologyTool;
