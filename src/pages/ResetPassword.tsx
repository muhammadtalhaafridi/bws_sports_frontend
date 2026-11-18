import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { requestResetCode, resetPassword, verifyResetCode } from "../api/auth/fetcher";
import { AuthCard } from "../components/AuthCard";
import { PasswordInput } from "../components/PasswordInput";
import { FieldError } from "../components/ui";
import { getErrorMessage } from "../lib/api";
import { emailField, passwordField, resetCodeField } from "../lib/schemas";

const RESEND_SECONDS = 60;

const codeSchema = z.object({ email: emailField, code: resetCodeField });
type CodeValues = z.infer<typeof codeSchema>;

const passwordSchema = z
  .object({ password: passwordField, confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type PasswordValues = z.infer<typeof passwordSchema>;

export function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState<CodeValues | null>(null);
  const [cooldown, setCooldown] = useState(params.get("sent") ? RESEND_SECONDS : 0);

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { email: params.get("email") ?? "", code: params.get("code") ?? "" },
  });
  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verify = useMutation({
    mutationFn: async (values: CodeValues) => {
      await verifyResetCode(values);
      return values;
    },
    onSuccess: (values) => setVerified(values),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const resend = useMutation({
    mutationFn: (email: string) => requestResetCode({ email }),
    onSuccess: (data) => {
      toast.success(data.message);
      setCooldown(RESEND_SECONDS);
      codeForm.setValue("code", data.devResetCode ?? "");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const save = useMutation({
    mutationFn: ({ password }: PasswordValues) => resetPassword({ ...verified!, password }),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      // The code expired or was used up: go back so a new one can be requested.
      if (error instanceof AxiosError && error.response?.status === 400) setVerified(null);
    },
  });

  // The button in the email opens this page with the email and code filled in, so check it right away.
  const autoVerified = useRef(false);
  useEffect(() => {
    if (autoVerified.current || !params.get("email") || !params.get("code")) return;
    autoVerified.current = true;
    void codeForm.handleSubmit((v) => verify.mutate(v))();
  }, [params, codeForm, verify]);

  async function requestNewCode() {
    if (await codeForm.trigger("email")) resend.mutate(codeForm.getValues("email"));
  }

  if (verified) {
    return (
      <AuthCard title="Choose a new password" subtitle={`Code verified for ${verified.email}`}>
        <form className="form" onSubmit={passwordForm.handleSubmit((v) => save.mutate(v))} noValidate>
          <label className="field">
            <span>New password</span>
            <PasswordInput
              autoComplete="new-password"
              placeholder="At least 6 characters"
              autoFocus
              {...passwordForm.register("password")}
            />
            <FieldError message={passwordForm.formState.errors.password?.message} />
          </label>
          <label className="field">
            <span>Confirm password</span>
            <PasswordInput
              autoComplete="new-password"
              placeholder="Type it again"
              {...passwordForm.register("confirmPassword")}
            />
            <FieldError message={passwordForm.formState.errors.confirmPassword?.message} />
          </label>
          <button className="btn btn-primary btn-block btn-lg" disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save new password"}
          </button>
        </form>
      </AuthCard>
    );
  }

  const { errors } = codeForm.formState;
  return (
    <AuthCard title="Enter verification code" subtitle="We sent a 6-digit code to your email. It is valid for 15 minutes.">
      <form className="form" onSubmit={codeForm.handleSubmit((v) => verify.mutate(v))} noValidate>
        <label className="field">
          <span>Email</span>
          <input className="input" type="email" autoComplete="email" placeholder="you@example.com" {...codeForm.register("email")} />
          <FieldError message={errors.email?.message} />
        </label>
        <label className="field">
          <span>Verification code</span>
          <input
            className="input otp-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            autoFocus={Boolean(params.get("email"))}
            {...codeForm.register("code", {
              onChange: (e) => codeForm.setValue("code", e.target.value.replace(/\D/g, "").slice(0, 6)),
            })}
          />
          <FieldError message={errors.code?.message} />
        </label>
        <button className="btn btn-primary btn-block btn-lg" disabled={verify.isPending}>
          {verify.isPending ? "Checking..." : "Verify code"}
        </button>
      </form>
      <p className="auth-foot">
        Didn't get the code? Check your spam folder or{" "}
        <button type="button" className="btn-link" onClick={requestNewCode} disabled={cooldown > 0 || resend.isPending}>
          {cooldown > 0 ? `resend in ${cooldown}s` : resend.isPending ? "sending..." : "send a new code"}
        </button>
      </p>
      <p className="auth-foot">
        <Link to="/login">
          <strong>Back to login</strong>
        </Link>
      </p>
    </AuthCard>
  );
}
