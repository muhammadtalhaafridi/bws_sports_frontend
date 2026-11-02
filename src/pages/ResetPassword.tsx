import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { AuthCard } from "../components/AuthCard";
import { PasswordInput } from "../components/PasswordInput";
import { FieldError } from "../components/ui";
import { api, getErrorMessage } from "../lib/api";
import { passwordField } from "../lib/schemas";

const schema = z
  .object({ password: passwordField, confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type FormValues = z.infer<typeof schema>;

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async ({ password }: FormValues) =>
      (await api.post<{ message: string }>("/auth/reset-password", { token, password })).data,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login", { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (!token) {
    return (
      <AuthCard title="Invalid link" subtitle="This password reset link is missing its token.">
        <Link to="/forgot-password" className="btn btn-primary btn-block">
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Enter a new password for your account">
      <form className="form" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <label className="field">
          <span>New password</span>
          <PasswordInput autoComplete="new-password" placeholder="At least 6 characters" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <PasswordInput autoComplete="new-password" placeholder="Type it again" {...register("confirmPassword")} />
          <FieldError message={errors.confirmPassword?.message} />
        </label>
        <button className="btn btn-primary btn-block btn-lg" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save new password"}
        </button>
      </form>
    </AuthCard>
  );
}
