import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { AuthCard } from "../components/AuthCard";
import { PasswordInput } from "../components/PasswordInput";
import { FieldError } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useObjectUrl } from "../hooks/useObjectUrl";
import { api, getErrorMessage } from "../lib/api";
import { safeRedirect } from "../lib/redirect";
import { emailField, passwordField, phoneField } from "../lib/schemas";
import type { AuthResponse } from "../lib/types";

const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: z.string().trim().optional(),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type FormValues = z.infer<typeof schema>;

export function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [image, setImage] = useState<File | null>(null);
  const preview = useObjectUrl(image);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const form = new FormData();
      for (const key of ["name", "email", "phone", "password", "address"] as const) {
        if (values[key]) form.append(key, values[key]);
      }
      if (image) form.append("image", image);
      return (await api.post<AuthResponse>("/auth/register", form)).data;
    },
    onSuccess: ({ token, user }) => {
      login(token, user);
      toast.success("Your account has been created");
      navigate(safeRedirect(params.get("redirect")), { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not create your account")),
  });

  const onImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be 2 MB or smaller");
    setImage(file);
  };

  return (
    <AuthCard title="Register" subtitle="Create your BWS Sports account">
      <form className="form" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <label className="field">
          <span>Name</span>
          <input className="input" autoComplete="name" placeholder="Your full name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </label>
        <label className="field">
          <span>Email</span>
          <input className="input" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </label>
        <label className="field">
          <span>Phone</span>
          <input className="input" type="tel" autoComplete="tel" placeholder="+92 300 1234567" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </label>
        <div className="form-row">
          <label className="field">
            <span>Password</span>
            <PasswordInput autoComplete="new-password" placeholder="At least 6 characters" {...register("password")} />
            <FieldError message={errors.password?.message} />
          </label>
          <label className="field">
            <span>Confirm password</span>
            <PasswordInput autoComplete="new-password" placeholder="Type it again" {...register("confirmPassword")} />
            <FieldError message={errors.confirmPassword?.message} />
          </label>
        </div>
        <label className="field optional">
          <span>
            Address <em className="muted">(optional)</em>
          </span>
          <textarea className="input" rows={2} placeholder="House, street, area, city" {...register("address")} />
        </label>
        <label className="field optional">
          <span>
            Image <em className="muted">(optional)</em>
          </span>
          <span className="file-picker">
            {preview ? <img src={preview} alt="" className="avatar avatar-lg" /> : <ImagePlus size={22} />}
            <span>{image ? image.name : "Choose file"}</span>
            <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} />
          </span>
        </label>
        <button className="btn btn-primary btn-block btn-lg" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="auth-foot">
        Already have an account?{" "}
        <Link to={`/login${params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : ""}`}>
          <strong>Login</strong>
        </Link>
      </p>
    </AuthCard>
  );
}
