"use client";

// External dependencies
import * as maplibregl from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { useCallback, useRef, useState, forwardRef } from "react";
import Map, {
  GeolocateControl,
  Layer,
  LayerProps,
  MapRef,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";
import { useTheme } from "next-themes";
import { siteConfig } from "@/site.config";
// Styles
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapboxProps {
  id?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers?: Array<{
    id: string;
    longitude: number;
    latitude: number;
    popupContent?: React.ReactNode;
    element?: React.ReactNode;
  }>;
  geoJsonData?: GeoJSON.FeatureCollection;
  onMarkerDragEnd?: (
    markerId: string,
    lngLat: { lng: number; lat: number },
  ) => void;
  onGeoJsonClick?: (feature: GeoJSON.Feature) => void;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  onMove?: (viewState: {
    zoom: number;
    latitude: number;
    longitude: number;
  }) => void;
  draggableMarker?: boolean;
  showGeocoder?: boolean;
  showControls?: boolean;
  scrollZoom?: boolean;
  doubleClickZoom?: boolean;
  boxZoom?: boolean;
  dragRotate?: boolean;
  dragPan?: boolean;
}

const CARTO_VOYAGER_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const CARTO_DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const Mapbox = forwardRef<MapRef, MapboxProps>(
  (
    {
      id,
      initialViewState = {
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      },
      markers = [],
      geoJsonData,
      onMarkerDragEnd,
      onGeoJsonClick,
      onMapClick,
      onMove,
      draggableMarker = false,
      showControls = true,
      scrollZoom = true,
      doubleClickZoom = true,
      boxZoom = true,
      dragRotate = true,
      dragPan = true,
    }: MapboxProps,
    ref,
  ) => {
    const mapRef = useRef<MapRef>(null);
    const { theme } = useTheme();

    const handleRef = useCallback(
      (node: MapRef | null) => {
        mapRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<MapRef | null>).current = node;
        }
      },
      [ref],
    );

    // Ensure markers is always an array
    const safeMarkers = Array.isArray(markers) ? markers : [];
    const showTemporaryMarker = draggableMarker && safeMarkers.length === 0;
    const [temporaryLocation, setTemporaryLocation] = useState({
      longitude: initialViewState.longitude,
      latitude: initialViewState.latitude,
    });
    const visibleMarkers: NonNullable<MapboxProps["markers"]> = showTemporaryMarker
      ? [{ id: "location", ...temporaryLocation }]
      : safeMarkers;

    // GeoJSON layer style for visited countries
    const layerStyle: LayerProps = {
      id: "data",
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["get", "visited"],
          theme === "dark" ? "#3b82f6" : "#2563eb", // Blue color for visited countries
          "#0080ff", // Default color for non-visited
        ],
        "fill-opacity": [
          "case",
          ["get", "visited"],
          0.6, // Higher opacity for visited countries
          0.2, // Lower opacity for non-visited
        ],
      },
    };

    // Add stroke layer for visited countries
    const strokeLayerStyle: LayerProps = {
      id: "data-stroke",
      type: "line",
      paint: {
        "line-color": [
          "case",
          ["get", "visited"],
          theme === "dark" ? "#3b82f6" : "#2563eb", // Blue color for visited countries
          "transparent",
        ],
        "line-width": 2,
        "line-opacity": 0.8,
      },
    };

    const activeMapStyle =
      theme === "dark"
        ? siteConfig.mapbox.darkStyle?.trim() || CARTO_DARK_STYLE
        : siteConfig.mapbox.lightStyle?.trim() || CARTO_VOYAGER_STYLE;

    // Handle GeoJSON and Map click
    const onClick = useCallback(
      (
        event: MapLayerMouseEvent & {
          features?: GeoJSON.Feature[];
        },
      ) => {
        const feature = event.features?.[0];
        if (feature && onGeoJsonClick) {
          onGeoJsonClick(feature);
          return;
        }

        if (onMapClick && event.lngLat) {
          onMapClick({ lng: event.lngLat.lng, lat: event.lngLat.lat });
        }
      },
      [onGeoJsonClick, onMapClick],
    );

    // Fly to location
    const flyToLocation = useCallback((longitude: number, latitude: number) => {
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        duration: 2000,
        zoom: 14,
      });
    }, []);

    return (
      <Map
        id={id}
        ref={handleRef}
        mapLib={maplibregl}
        scrollZoom={scrollZoom}
        doubleClickZoom={doubleClickZoom}
        boxZoom={boxZoom}
        dragRotate={dragRotate}
        dragPan={dragPan}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={activeMapStyle}
        interactiveLayerIds={geoJsonData ? ["data"] : undefined}
        onClick={onClick}
        onMove={(evt) => {
          if (showTemporaryMarker) {
            setTemporaryLocation({
              longitude: evt.viewState.longitude,
              latitude: evt.viewState.latitude,
            });
          }
          if (onMove) {
            onMove({
              zoom: evt.viewState.zoom,
              latitude: evt.viewState.latitude,
              longitude: evt.viewState.longitude,
            });
          }
        }}
      >
        {/* Navigation Controls */}
        {showControls && <NavigationControl position="bottom-left" />}
        {/* Show location button */}
        {showControls && (
          <GeolocateControl
            position="bottom-left"
            trackUserLocation
            onGeolocate={(e) => {
              flyToLocation(e.coords.longitude, e.coords.latitude);
            }}
          />
        )}
        {/* Markers */}
        {visibleMarkers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            draggable={draggableMarker}
            style={{ cursor: draggableMarker ? "grab" : "pointer" }}
            onDragEnd={
              onMarkerDragEnd
                ? (e) => onMarkerDragEnd(marker.id, e.lngLat)
                : undefined
            }
            onClick={(e) => {
              // Prevent map-level click handler from firing when clicking a marker
              e.originalEvent.stopPropagation();
            }}
          >
            {marker.element}
          </Marker>
        ))}

        {/* GeoJSON Layer */}
        {geoJsonData && (
          <Source type="geojson" data={geoJsonData}>
            <Layer {...layerStyle} />
            <Layer {...strokeLayerStyle} />
          </Source>
        )}
      </Map>
    );
  },
);

Mapbox.displayName = "Mapbox";

export default Mapbox;
