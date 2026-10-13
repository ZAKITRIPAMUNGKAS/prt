"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const SignInView = () => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    setError(null);
    setPending(true);

    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden p-0 border shadow-lg rounded-2xl bg-card">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[540px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-8 sm:p-10 flex flex-col justify-between"
            >
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-light text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft size={14} />
                  <span>Kembali ke Beranda</span>
                </Link>

                <div className="flex flex-col gap-1.5 mb-6">
                  <h1 className="text-2xl font-semibold tracking-tight">Selamat Datang</h1>
                  <p className="text-sm text-muted-foreground">
                    Masuk ke dashboard kelola portofolio Anda
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="nama@email.com"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            className="h-10 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!!error && (
                    <Alert className="bg-destructive/10 border-none py-2 text-xs">
                      <OctagonAlert className="h-4 w-4 text-destructive!" />
                      <AlertTitle className="text-xs">{error}</AlertTitle>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-10 font-medium text-sm" disabled={pending}>
                  {pending && <Spinner className="mr-2" />}
                  Masuk
                </Button>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:block bg-muted/40 h-full min-h-[540px] overflow-hidden">
            <Image
              src="/fotoku.png"
              alt="Zaki Tri Pamungkas"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center 20%" }}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
              <p className="text-xs tracking-wider uppercase opacity-80 font-mono">Portofolio & CMS</p>
              <p className="text-sm font-medium">Zaki Tri Pamungkas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
