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
        className="space-y-4 px-1"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Perusahaan */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Perusahaan *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Bank Central Asia" {...field} />
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
                <FormLabel>Posisi / Jabatan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Software Engineer"
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
                <FormLabel>Platform *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: LinkedIn, JobStreet, Kalibrr, dll."
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
                <FormLabel>Status *</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status lamaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((statusKey) => (
                      <SelectItem key={statusKey} value={statusKey}>
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
                <FormLabel>URL Lowongan Pekerjaan</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tanggal Lamar */}
          <FormField
            control={form.control}
            name="appliedAt"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Tanggal Lamar</FormLabel>
                <FormControl>
                  <Input
                    type="date"
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
                <FormLabel>Tipe Pekerjaan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full time / Kontrak / Magang / ODP"
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
              <FormItem className="sm:col-span-1">
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Jakarta Selatan / Remote"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ekspektasi Gaji */}
          <FormField
            control={form.control}
            name="expectedSalary"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Ekspektasi Gaji (Rp/bulan)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Contoh: 8000000"
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
              <FormItem className="sm:col-span-1">
                <FormLabel>Gaji Minimum Lowongan (Rp)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Contoh: 7000000"
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
              <FormItem className="sm:col-span-1">
                <FormLabel>Gaji Maksimum Lowongan (Rp)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Contoh: 8000000"
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

          {/* Langkah Berikutnya */}
          <FormField
            control={form.control}
            name="nextStep"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Langkah Berikutnya</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Tes online / Follow up pesan"
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
                <FormLabel>Tanggal Langkah Berikutnya</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Catatan */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-1 sm:col-span-2">
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Catatan tambahan, kontak recruiter, instruksi khusus..."
                    rows={3}
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
          <DrawerHeader>
            <DrawerTitle>
              {isEditing ? "Edit Lamaran Kerja" : "Tambah Lamaran Kerja"}
            </DrawerTitle>
            <DrawerDescription>
              {isEditing
                ? "Perbarui rincian lamaran kerja Anda"
                : "Catat lamaran kerja baru untuk dipantau perkembangannya"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-2">{formBody}</div>
          <DrawerFooter className="pt-2">
            <Button
              type="submit"
              form="application-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Lamaran"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {isEditing ? "Edit Lamaran Kerja" : "Tambah Lamaran Kerja"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui rincian lamaran kerja Anda"
              : "Catat lamaran kerja baru untuk dipantau perkembangannya"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 max-h-[calc(90vh-140px)]">
          <div className="pb-4">{formBody}</div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-2 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="application-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1" />
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
