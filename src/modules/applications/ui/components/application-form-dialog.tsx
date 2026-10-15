"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  applicationFormSchema,
  ApplicationFormData,
} from "../../schemas";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
  JobApplication,
} from "../../types";

interface ApplicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: JobApplication | null;
}

export const ApplicationFormDialog = ({
  open,
  onOpenChange,
  application,
}: ApplicationFormDialogProps) => {
  const isMobile = useIsMobile();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isEditing = !!application;

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      company: "",
      position: "",
      platform: "LinkedIn",
      jobUrl: "",
      status: "applied",
      appliedAt: new Date().toISOString().slice(0, 10),
      salaryMin: null,
      salaryMax: null,
      expectedSalary: null,
      employmentType: "Full time",
      location: "",
      nextStep: "",
      nextStepAt: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (application) {
        form.reset({
          company: application.company,
          position: application.position ?? "",
          platform: application.platform,
          jobUrl: application.jobUrl ?? "",
          status: application.status as ApplicationStatus,
          appliedAt: application.appliedAt ?? "",
          salaryMin: application.salaryMin ?? null,
          salaryMax: application.salaryMax ?? null,
          expectedSalary: application.expectedSalary ?? null,
          employmentType: application.employmentType ?? "",
          location: application.location ?? "",
          nextStep: application.nextStep ?? "",
          nextStepAt: application.nextStepAt ?? "",
          notes: application.notes ?? "",
        });
      } else {
        form.reset({
          company: "",
          position: "",
          platform: "LinkedIn",
          jobUrl: "",
          status: "applied",
          appliedAt: new Date().toISOString().slice(0, 10),
          salaryMin: null,
          salaryMax: null,
          expectedSalary: null,
          employmentType: "Full time",
          location: "",
          nextStep: "",
          nextStepAt: "",
          notes: "",
        });
      }
    }
  }, [open, application, form]);

  const createMutation = useMutation(trpc.applications.create.mutationOptions());
  const updateMutation = useMutation(trpc.applications.update.mutationOptions());

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: ApplicationFormData) => {
    const payload = {
      ...values,
      position: values.position || null,
      jobUrl: values.jobUrl || null,
      appliedAt: values.appliedAt || null,
      employmentType: values.employmentType || null,
      location: values.location || null,
      nextStep: values.nextStep || null,
      nextStepAt: values.nextStepAt || null,
      notes: values.notes || null,
    };

    if (isEditing && application) {
      updateMutation.mutate(
        {
          ...payload,
          id: application.id,
        },
        {
          onSuccess: (data) => {
            toast.success(`Lamaran ke ${data.company} berhasil diperbarui`);
            onOpenChange(false);
            void queryClient.invalidateQueries(
              trpc.applications.getMany.queryOptions({})
            );
            void queryClient.invalidateQueries(
              trpc.applications.getStats.queryOptions()
            );
          },
          onError: (err) => {
            toast.error(err.message || "Gagal memperbarui lamaran");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          toast.success(`Lamaran ke ${data.company} berhasil ditambahkan`);
          onOpenChange(false);
          void queryClient.invalidateQueries(
            trpc.applications.getMany.queryOptions({})
          );
          void queryClient.invalidateQueries(
            trpc.applications.getStats.queryOptions()
          );
        },
        onError: (err) => {
          toast.error(err.message || "Gagal menambahkan lamaran");
        },
      });
    }
  };

  const formBody = (
    <Form {...form}>
      <form
        id="application-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-1"
      >
        {/* Grup 1: Informasi Utama */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Informasi Lowongan
          </div>
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {/* Perusahaan */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Perusahaan *</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Bank Central Asia" className="h-9 text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Posisi */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Posisi / Jabatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Software Engineer"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Platform */}
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Platform *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: LinkedIn, JobStreet, Kalibrr"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Status *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((statusKey) => (
                        <SelectItem key={statusKey} value={statusKey} className="text-sm">
                          {APPLICATION_STATUS_LABELS[statusKey]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL Lowongan */}
            <FormField
              control={form.control}
              name="jobUrl"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel className="text-xs font-medium">URL Lowongan</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://..."
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Grup 2: Jadwal & Tahapan */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Jadwal & Tahapan
          </div>
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {/* Tanggal Lamar */}
            <FormField
              control={form.control}
              name="appliedAt"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Tanggal Lamar</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipe Pekerjaan */}
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Tipe Pekerjaan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full time / Kontrak / Magang / ODP"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Langkah Berikutnya */}
            <FormField
              control={form.control}
              name="nextStep"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Langkah Berikutnya</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Tes online / Interview HR"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Langkah Berikutnya */}
            <FormField
              control={form.control}
              name="nextStepAt"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel className="text-xs font-medium">Jadwal Langkah Berikutnya</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lokasi */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel className="text-xs font-medium">Lokasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Jakarta Selatan / Hybrid / Remote"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Grup 3: Kompensasi & Gaji */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Gaji & Kompensasi (IDR)
          </div>
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
            {/* Ekspektasi Gaji */}
            <FormField
              control={form.control}
              name="expectedSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Ekspektasi Gaji</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="8000000"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gaji Lowongan Min */}
            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Gaji Min Lowongan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="7000000"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gaji Lowongan Max */}
            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Gaji Maks Lowongan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000000"
                      className="h-9 text-sm"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Grup 4: Catatan */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">Catatan Tambahan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tuliskan catatan interview, link tugas, nomor kontak recruiter..."
                    rows={3}
                    className="text-sm resize-none"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>
              {isEditing ? "Edit Lamaran Kerja" : "Tambah Lamaran Kerja"}
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              {isEditing
                ? "Perbarui rincian lamaran kerja Anda"
                : "Catat lamaran baru untuk dipantau perkembangannya"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-2">{formBody}</div>
          <DrawerFooter className="pt-3 border-t">
            <Button
              type="submit"
              form="application-form"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Lamaran"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isSubmitting} className="w-full">
                Batal
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[calc(100dvh-2rem)] w-[min(92vw,52rem)] max-h-[52rem] sm:max-w-3xl flex flex-col gap-0 overflow-hidden p-0 shadow-lg">
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="text-lg">
            {isEditing ? "Edit Lamaran Kerja" : "Tambah Lamaran Kerja"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Perbarui rincian lamaran kerja Anda"
              : "Catat lamaran baru untuk dipantau perkembangannya"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-0 min-h-0 flex-1 px-6 py-5">
          {formBody}
        </ScrollArea>
        <DialogFooter className="shrink-0 border-t bg-muted/20 px-6 py-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            size="sm"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="application-form"
            disabled={isSubmitting}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                Menyimpan...
              </>
            ) : isEditing ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Lamaran"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
