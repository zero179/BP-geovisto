/**
 * @author Andrej Tlcina
 */

import L from "leaflet";

export const NOT_FOUND = -1;

export const FIRST = 0;

export const SPACE_BAR = 32;

export const highlightStyles = { fillOpacity: 0.5, opacity: 0.2 };
export const normalStyles = { fillOpacity: 0.2, opacity: 0.5 };

/**
 * icon options default
 */
export const iconStarter = {
  shadowUrl: undefined,
  iconAnchor: new L.Point(12, 12),
  iconSize: new L.Point(24, 24),
};

export const ICON_SRCS: string[] = [
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/Marker_location.png",
  "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/32/Map-Marker-Flag-1-Right-Azure-icon.png",
];
export const COLORS: string[] = [
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

export type SelectOpt = {
  label: string;
  value: number;
  selected?: boolean;
};

export type SelectOpts = Array<SelectOpt>;

export const STROKES: SelectOpts = [
  { label: "thin", value: 3 },
  { label: "medium", value: 5, selected: true },
  { label: "bold", value: 7 },
];
export const ADMIN_LEVELS: SelectOpts = [
  { label: "State", value: 2 },
  { label: "Province", value: 4, selected: true },
  { label: "5 (depends on country)", value: 5 },
  { label: "6 (depends on country)", value: 6 },
  { label: "7 (depends on country)", value: 7 },
  { label: "8 (depends on country)", value: 8 },
  { label: "9 (depends on country)", value: 9 },
  { label: "10 (depends on country)", value: 10 },
];
