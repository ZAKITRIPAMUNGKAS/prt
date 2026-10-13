"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Globe, Loader2, Save, Sparkles } from "lucide-react";
import { PiGithubLogo } from "react-icons/pi";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTRPC } from "@/trpc/client";
import FileUploader from "@/modules/s3/ui/components/file-uploader";
import { VideoUploader } from "./video-uploader";
import { TechStackSelector } from "./tech-stack-selector";
import { projectFormSchema, ProjectFormData } from "../../schemas";
import { generateProjectSlug } from "../../lib/utils";
import { Project } from "@/db/schema";

interface ProjectFormProps {
  project?: Project;
}

const TEMPLATE_BODY = `### Masalah
[Tuliskan tantangan, masalah bisnis, atau kebutuhan pengguna yang melatarbelakangi proyek ini]

### Proses
[Jelaskan tahapan riset, arsitektur sistem, pemilihan teknologi, dan langkah implementasi]

### Hasil
[Uraikan dampak, metrik pencapaian, fitur yang berhasil diselesaikan, atau pembelajaran]`;

const formSchema = projectFormSchema;

export const ProjectForm = ({ project }: ProjectFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const isEditing = !!project;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      summary: project?.summary || "",
      role: project?.role || "",
      stack: project?.stack || [],
      year: project?.year || new Date().getFullYear().toString(),
      duration: project?.duration || "",
      coverKey: project?.coverKey || "",
      previewVideoKey: project?.previewVideoKey || "",
      repoUrl: project?.repoUrl || "",
      liveUrl: project?.liveUrl || "",
      body: project?.body || TEMPLATE_BODY,
      featured: project?.featured ?? false,
      order: project?.order ?? 0,
    },
  });

  const titleValue = useWatch({ control: form.control, name: "title" });
  const isSlugDirty = form.getFieldState("slug").isDirty;

  // Auto-generate slug when title changes (only if slug was not manually touched)
  useEffect(() => {
    if (!isEditing && !isSlugDirty && titleValue) {
      form.setValue("slug", generateProjectSlug(titleValue), {
        shouldValidate: true,
      });
    }
  }, [titleValue, isEditing, isSlugDirty, form]);

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Proyek berhasil dibuat");
        await queryClient.invalidateQueries(
          trpc.projects.getManyAdmin.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.projects.getMany.queryOptions({})
        );
        router.replace(`/dashboard/projects/${data.slug}`);
      },
      onError: (err) => {
        toast.error("Gagal membuat proyek", { description: err.message });
      },
    })
  );

  const updateProject = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Proyek berhasil diperbarui");
        await queryClient.invalidateQueries(
          trpc.projects.getManyAdmin.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.projects.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.projects.getBySlug.queryOptions({ slug: data.slug })
        );
        if (data.slug !== project?.slug) {
          router.replace(`/dashboard/projects/${data.slug}`);
        }
      },
      onError: (err) => {
        toast.error("Gagal memperbarui proyek", { description: err.message });
      },
    })
  );

  const onSubmit = (values: ProjectFormData) => {
    if (isEditing && project?.id) {
      updateProject.mutate({
        ...values,
        id: project.id,
      });
    } else {
      createProject.mutate(values);
    }
  };

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-16">
        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {isEditing ? `Edit: ${project.title}` : "Tambah Proyek Baru"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Isi informasi teknis dan studi kasus proyek
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button type="submit" size="sm" disabled={isPending || isUploading || isVideoUploading}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan Proyek
                </>
              )}
            </Button>
          </div>
        </div>

        {/* SECTION 1: COVER IMAGE */}
        <div className="bg-muted/40 p-6 rounded-xl border space-y-4">
          <h2 className="text-base font-semibold">Cover Proyek</h2>
          <FormField
            control={form.control}
            name="coverKey"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    folder="projects"
                    onUploadSuccess={(key) => {
                      field.onChange(key);
                      toast.success("Cover berhasil diunggah");
                    }}
                    onRemove={() => field.onChange("")}
                    onUploadStateChange={setIsUploading}
                  />
                </FormControl>
                <FormDescription>
                  Format yang didukung: JPG, PNG, WebP. Gambar akan ditampilkan di halaman portofolio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION 1.5: PREVIEW VIDEO */}
        <div className="bg-muted/40 p-6 rounded-xl border space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Video Teaser / Preview (Opsional)</h2>
            <p className="text-xs text-muted-foreground">
              Video teaser (MP4/WebM, maks. 8 MB) yang diputar saat hover kartu proyek di desktop dan terlihat di mobile.
            </p>
          </div>
          <FormField
            control={form.control}
            name="previewVideoKey"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VideoUploader
                    value={field.value}
                    folder="projects"
                    onUploadSuccess={(key) => {
                      field.onChange(key);
                    }}
                    onRemove={() => field.onChange("")}
                    onUploadStateChange={setIsVideoUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION 2: BASIC INFO */}
        <div className="bg-muted/40 p-6 rounded-xl border space-y-6">
          <h2 className="text-base font-semibold">Informasi Utama</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Proyek</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: ARQAM App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh: arqam-app" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tautan proyek: /projects/{field.value || "slug"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ringkasan Singkat</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi singkat mengenai proyek ini (1-2 kalimat)..."
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peran / Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Lead Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun</FormLabel>
                  <FormControl>
                    <Input placeholder="2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi</FormLabel>
                  <FormControl>
                    <Input placeholder="3 bulan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urutan Tampil</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="stack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <FormControl>
                  <TechStackSelector
                    value={field.value}
                    onChange={(tags) => field.onChange(tags)}
                  />
                </FormControl>
                <FormDescription>
                  Pilih dari daftar framework/bahasa populer yang memiliki icon otomatis (Next.js, Laravel, React, Tailwind, PostgreSQL, dll) atau ketik custom stack.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Globe className="size-4 text-primary" />
                    <span>Live Website / Demo (Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://contoh-web.com"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Jika dikosongkan, tombol &quot;Lihat Demo&quot; otomatis disembunyikan di halaman detail proyek.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <PiGithubLogo className="size-4" />
                    <span>Repository GitHub / GitLab (Opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Jika dikosongkan (misal: private repo client), tombol &quot;Source Code&quot; otomatis disembunyikan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-background">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium">
                    Featured Project
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Tampilkan proyek ini sebagai sorotan utama di halaman depan.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* SECTION 3: CASE STUDY BODY */}
        <div className="bg-muted/40 p-6 rounded-xl border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">
                Studi Kasus (Masalah → Proses → Hasil)
              </h2>
              <p className="text-xs text-muted-foreground">
                Tuliskan studi kasus dalam format Markdown. Gunakan heading ### untuk setiap bagian.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setValue("body", TEMPLATE_BODY)}
            >
              <Sparkles className="size-3.5 mr-1.5" />
              Reset ke Template
            </Button>
          </div>

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="min-h-[320px] font-mono text-sm leading-relaxed"
                    placeholder={TEMPLATE_BODY}
                    {...field}
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
};
