import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { requestResetCode } from "../api/auth/fetcher";
import { AuthCard } from "../components/AuthCard";
import { FieldError } from "../components/ui";
import { getErrorMessage } from "../lib/api";
import { emailField } from "../lib/schemas";

const schema = z.object({ email: emailField });
type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: requestResetCode,
    onSuccess: (data, values) => {
      toast.success(data.message);
      // In development without an email server, the API returns the code so it can be filled in.
      const next = new URLSearchParams({ email: values.email, sent: "1" });
      if (data.devResetCode) next.set("code", data.devResetCode);
      navigate(`/reset-password?${next}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we will send you a verification code">
      <form className="form" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <label className="field">
          <span>Email</span>
          <input className="input" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </label>
        <button className="btn btn-primary btn-block btn-lg" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send verification code"}
        </button>
      </form>
      <p className="auth-foot">
        Already have a code? <Link to="/reset-password"><strong>Enter it here</strong></Link>
      </p>
      <p className="auth-foot">
        Remembered it? <Link to="/login"><strong>Back to login</strong></Link>
      </p>
    </AuthCard>
  );
}
