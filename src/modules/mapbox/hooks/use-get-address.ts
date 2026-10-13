import { useQuery } from "@tanstack/react-query";
import { Feature, FeatureCollection, Point } from "geojson";

export interface MapboxFeature extends Feature {
  geometry: Point;
  properties: {
    full_address: string;
    name: string;
    place_formatted: string;
    context: {
      country: {
        country_code: string;
        name: string;
      };
      locality: {
        name: string;
      } | null;
      place: {
        name: string;
      } | null;
      region: {
        name: string;
      } | null;
    };
  };
}

export interface MapboxReverseGeocodingResponse extends FeatureCollection {
  features: MapboxFeature[];
  query: [number, number];
}

export type AddressData = MapboxReverseGeocodingResponse | null;

interface UseGetLocationProps {
  lat: number | null | undefined;
  lng: number | null | undefined;
}

export const useGetAddress = ({ lat, lng }: UseGetLocationProps) => {
  const { data, isFetching, error } = useQuery({
    queryKey: ["mapbox", "reverse-geocoding", lat, lng],
    enabled: lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng),
    queryFn: async ({ signal }): Promise<MapboxReverseGeocodingResponse> => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();
      const hasValidToken = Boolean(
        token &&
          !token.includes("placeholder") &&
          token.startsWith("pk.") &&
          token.length > 25
      );

      if (hasValidToken) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&language=en&access_token=${token}`,
            { signal }
          );
          if (response.ok) {
            return response.json();
          }
        } catch {
          // Fallback to OSM Nominatim
        }
      }

      // Fallback: OpenStreetMap Nominatim reverse geocoding
      const nomResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geojson`,
        {
          headers: { "Accept-Language": "id,en" },
          signal,
        }
      );

      if (!nomResponse.ok) {
        throw new Error(`Reverse geocoding error! status: ${nomResponse.status}`);
      }

      const nomData = await nomResponse.json();
      const feat = nomData.features?.[0];

      if (!feat) {
        return {
          type: "FeatureCollection",
          features: [],
          query: [lng!, lat!],
        };
      }

      const props = feat.properties || {};
      const addr = props.address || {};

      return {
        type: "FeatureCollection",
        query: [lng!, lat!],
        features: [
          {
            type: "Feature",
            geometry: feat.geometry,
            properties: {
              full_address: props.display_name || "",
              name: props.name || props.display_name?.split(",")?.[0] || "",
              place_formatted: props.display_name || "",
              context: {
                country: {
                  country_code: (addr.country_code || "").toUpperCase(),
                  name: addr.country || "",
                },
                locality:
                  addr.city || addr.town
                    ? { name: addr.city || addr.town }
                    : null,
                place:
                  addr.suburb || addr.village
                    ? { name: addr.suburb || addr.village }
                    : null,
                region: addr.state ? { name: addr.state } : null,
              },
            },
          },
        ],
      };
    },
  });

  return {
    data: data ?? null,
    isLoading: isFetching,
    error: error?.message ?? null,
  };
};
