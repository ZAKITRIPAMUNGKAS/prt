"use client";

import { useState, Suspense, useRef, useCallback, useEffect } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { FramedPhoto } from "@/components/framed-photo";
import { photosUpdateSchema } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Search, X, Loader2 } from "lucide-react";
import { useGetAddress } from "@/modules/mapbox/hooks/use-get-address";
import { ApertureSelector } from "../components/aperture-selector";
import { ShutterSpeedSelector } from "../components/shutter-speed-selector";
import { ISOSelector } from "../components/iso-selector";
import { ExposureCompensationSelector } from "../components/exposure-compensation-selector";

import MapboxComponent from "@/modules/mapbox/ui/components/map";

interface PhotoIdViewProps {
  id: string;
}

const formSchema = photosUpdateSchema.extend({
  make: z.string().optional(),
  model: z.string().optional(),
  lensModel: z.string().optional(),
  focalLength: z.number().optional(),
  focalLength35mm: z.number().optional(),
  fNumber: z.number().optional(),
  iso: z.number().optional(),
  exposureTime: z.number().optional(),
  exposureCompensation: z.number().optional(),
});

export const PhotoIdView = ({ id }: PhotoIdViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.photos.getOne.queryOptions({
      id,
    })
  );

  const updateMutation = useMutation(
    trpc.photos.update.mutationOptions({
      onSuccess: () => {},
      onError: () => {},
    })
  );

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: data.latitude ?? null,
    lng: data.longitude ?? null,
  });

  const mapRef = useRef<MapRef>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      properties: { name: string; place_formatted: string };
      geometry: { coordinates: [number, number] };
    }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const hasLocation =
    currentLocation.lat != null && currentLocation.lng != null;

  const { data: addressData } = useGetAddress({
    lat: hasLocation ? currentLocation.lat : null,
    lng: hasLocation ? currentLocation.lng : null,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data.id,
      title: data.title ?? "",
      description: data.description ?? "",
      visibility: data.visibility ?? "private",
      isFavorite: data.isFavorite ?? false,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      country: data.country ?? undefined,
      countryCode: data.countryCode ?? undefined,
      region: data.region ?? undefined,
      city: data.city ?? undefined,
      district: data.district ?? undefined,
      fullAddress: data.fullAddress ?? undefined,
      placeFormatted: data.placeFormatted ?? undefined,
      make: data.make ?? undefined,
      model: data.model ?? undefined,
      lensModel: data.lensModel ?? undefined,
      focalLength: data.focalLength ?? undefined,
      focalLength35mm: data.focalLength35mm ?? undefined,
      fNumber: data.fNumber ?? undefined,
      iso: data.iso ?? undefined,
      exposureTime: data.exposureTime ?? undefined,
      exposureCompensation: data.exposureCompensation ?? undefined,
    },
  });

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      setCurrentLocation({ lat, lng });
      form.setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
      form.setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
    },
    [form]
  );

  const handleClearLocation = useCallback(() => {
    setCurrentLocation({ lat: null, lng: null });
    form.setValue("latitude", undefined, { shouldDirty: true, shouldValidate: true });
    form.setValue("longitude", undefined, { shouldDirty: true, shouldValidate: true });
    form.setValue("country", undefined, { shouldDirty: true });
    form.setValue("countryCode", undefined, { shouldDirty: true });
    form.setValue("region", undefined, { shouldDirty: true });
    form.setValue("city", undefined, { shouldDirty: true });
    form.setValue("district", undefined, { shouldDirty: true });
    form.setValue("fullAddress", undefined, { shouldDirty: true });
    form.setValue("placeFormatted", undefined, { shouldDirty: true });
  }, [form]);

  // Sync reverse geocoded address to form
  useEffect(() => {
    const feat = addressData?.features?.[0];
    if (feat) {
      const country = feat.properties?.context?.country?.name;
      const countryCode = feat.properties?.context?.country?.country_code;
      const city =
        feat.properties?.context?.locality?.name ||
        feat.properties?.context?.place?.name;
      const region = feat.properties?.context?.region?.name;
      const placeFormatted = feat.properties?.place_formatted;
      const fullAddress = feat.properties?.full_address || placeFormatted;

      if (country) form.setValue("country", country, { shouldDirty: true });
      if (countryCode) form.setValue("countryCode", countryCode, { shouldDirty: true });
      if (city) form.setValue("city", city, { shouldDirty: true });
      if (region) form.setValue("region", region, { shouldDirty: true });
      if (placeFormatted) form.setValue("placeFormatted", placeFormatted, { shouldDirty: true });
      if (fullAddress) form.setValue("fullAddress", fullAddress, { shouldDirty: true });
    }
  }, [addressData, form]);

  // Place search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
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
          `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
            searchQuery
          )}&access_token=${token}&limit=10`
        );
        if (response.ok) {
          const res = await response.json();
          if (res.features && res.features.length > 0) {
            setSearchResults(res.features);
            return;
          }
        }
      } catch {
        // Fallback to OSM
      }
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=geojson&limit=10`,
        { headers: { "Accept-Language": "id,en" } }
      );
      if (response.ok) {
        const res = await response.json();
        const osmResults = (res.features || []).map(
          (feature: {
            properties: { name?: string; display_name: string };
            geometry: { coordinates: [number, number] };
          }) => ({
            properties: {
              name:
                feature.properties.name ||
                feature.properties.display_name.split(",")[0],
              place_formatted: feature.properties.display_name,
            },
            geometry: feature.geometry,
          })
        );
        setSearchResults(osmResults);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleSelectLocation = (result: {
    geometry: { coordinates: [number, number] };
  }) => {
    const [lng, lat] = result.geometry.coordinates;
    handleLocationChange(lat, lng);
    setSearchQuery("");
    setSearchResults([]);
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 12, duration: 1000 });
  };

  const isSubmitting = updateMutation.isPending;

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate({ ...values, id: data.id });
  }

  const takenAt = data.dateTimeOriginal
    ? format(new Date(data.dateTimeOriginal), "d MMM yyyy")
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {data.title || "Untitled photo"}
            </h1>
            {takenAt && (
              <p className="text-sm text-muted-foreground">
                Taken on {takenAt}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)] items-start">
          {/* Form on the left */}
          <div className="bg-card border rounded-xl p-6 shadow-sm w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Photo title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          className="resize-none"
                          placeholder="Photo description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <FormLabel>Visibility</FormLabel>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {field.value === "public" ? "Public" : "Private"}
                            </span>
                            <FormControl>
                              <Switch
                                checked={field.value === "public"}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked ? "public" : "private")
                                }
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFavorite"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between gap-4">
                        <FormLabel>Favorite</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Camera parameters */}
                <div className="@container min-w-0 space-y-5 rounded-xl border bg-muted/15 p-4 sm:p-5">
                  <div>
                    <h3 className="text-sm font-semibold">Camera Parameters</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Auto-filled from EXIF when available. You can edit these
                      values.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
                    <h4 className="col-span-full text-xs font-semibold tracking-wide text-muted-foreground">Camera & lens</h4>
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Camera Make</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Canon" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Camera Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., EOS R5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="lensModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lens Model</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., RF 24-70mm f/2.8L"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 border-t pt-5 @sm:grid-cols-2">
                    <h4 className="col-span-full text-xs font-semibold tracking-wide text-muted-foreground">Focal length</h4>
                    <FormField
                      control={form.control}
                      name="focalLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Focal Length (mm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              placeholder="50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="focalLength35mm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>35mm Equivalent (mm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              placeholder="50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 items-start gap-4 border-t pt-5 @sm:grid-cols-2 @3xl:grid-cols-4">
                    <h4 className="col-span-full text-xs font-semibold tracking-wide text-muted-foreground">Exposure settings</h4>
                    <FormField
                      control={form.control}
                      name="fNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aperture</FormLabel>
                          <FormControl>
                            <ApertureSelector
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exposureTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shutter Speed</FormLabel>
                          <FormControl>
                            <ShutterSpeedSelector
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="iso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISO</FormLabel>
                          <FormControl>
                            <ISOSelector
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exposureCompensation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compensation (EV)</FormLabel>
                          <FormControl>
                            <ExposureCompensationSelector
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Summary in form (no raw coordinates required) */}
                <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" /> Lokasi Foto
                    </FormLabel>
                    {hasLocation && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={handleClearLocation}
                      >
                        Hapus Lokasi
                      </Button>
                    )}
                  </div>
                  {hasLocation ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {addressData?.features?.[0]?.properties?.place_formatted ||
                          `${currentLocation.lat?.toFixed(4)}, ${currentLocation.lng?.toFixed(4)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pilih lokasi baru via pencarian atau klik pada peta di sebelah kanan.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Belum ada lokasi dipilih. Cari tempat atau klik pada peta di sebelah kanan untuk menentukan lokasi foto.
                    </p>
                  )}
                  {hasLocation && (
                    <details className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <summary className="cursor-pointer hover:underline text-[11px]">
                        Koordinat GPS ({currentLocation.lat?.toFixed(4)}, {currentLocation.lng?.toFixed(4)})
                      </summary>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-[10px] uppercase text-muted-foreground">Latitude:</span>
                          <p className="font-mono text-xs">{currentLocation.lat}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-muted-foreground">Longitude:</span>
                          <p className="font-mono text-xs">{currentLocation.lng}</p>
                        </div>
                      </div>
                    </details>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Photo + Map on the right */}
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-gray-50 dark:bg-muted rounded-xl p-6">
              <FramedPhoto
                src={data.url}
                alt={data.title}
                blurhash={data.blurData}
                width={data.width}
                height={data.height}
                className="max-h-[50vh]"
              />
            </div>

            <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">Pilih Lokasi</h2>
                  <p className="text-xs text-muted-foreground">
                    Cari tempat, klik peta, atau geser pin untuk menentukan lokasi.
                  </p>
                </div>
                {hasLocation && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleClearLocation}
                  >
                    Reset
                  </Button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Input
                    placeholder="Cari lokasi (e.g. Bunaken, Jakarta, Monas)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-16 text-xs h-9"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <Card className="absolute z-20 w-full mt-1 p-0 shadow-lg border">
                    <ScrollArea className="max-h-[200px]">
                      <div className="p-0">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-start gap-2 border-b last:border-b-0"
                            onClick={() => handleSelectLocation(result)}
                          >
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs truncate">
                                {result.properties.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {result.properties.place_formatted}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
                )}
              </div>

              {/* Map */}
              <div className="h-64 w-full rounded-md overflow-hidden border">
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <Skeleton className="h-full w-full" />
                    </div>
                  }
                >
                  <MapboxComponent
                    ref={mapRef}
                    draggableMarker
                    markers={
                      hasLocation
                        ? [
                            {
                              id: "photo-location",
                              longitude: currentLocation.lng!,
                              latitude: currentLocation.lat!,
                            },
                          ]
                        : []
                    }
                    initialViewState={{
                      longitude: currentLocation.lng ?? 106.8456,
                      latitude: currentLocation.lat ?? -6.2088,
                      zoom: hasLocation ? 11 : 3,
                    }}
                    onMapClick={(lngLat) => {
                      handleLocationChange(lngLat.lat, lngLat.lng);
                    }}
                    onMarkerDragEnd={(_, lngLat) => {
                      handleLocationChange(lngLat.lat, lngLat.lng);
                    }}
                  />
                </Suspense>
              </div>

              {/* Address indicator below map */}
              {addressData?.features?.[0] && (
                <div className="text-xs text-muted-foreground flex items-start gap-1.5 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {addressData.features[0].properties.place_formatted}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
