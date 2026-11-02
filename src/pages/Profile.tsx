import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { PasswordInput } from "../components/PasswordInput";
import { FieldError, PageHeader } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useObjectUrl } from "../hooks/useObjectUrl";
import { api, getErrorMessage } from "../lib/api";
import { formatDate, imageUrl } from "../lib/format";
import { passwordField, phoneField } from "../lib/schemas";
import type { User } from "../lib/types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: phoneField,
  address: z.string().trim().optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type PasswordValues = z.infer<typeof passwordSchema>;

export function Profile() {
  const { user, setUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const preview = useObjectUrl(image);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "", address: user?.address ?? "" },
  });

  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const saveProfile = useMutation({
    mutationFn: async (values: ProfileValues) => {
      const form = new FormData();
      form.append("name", values.name);
      form.append("phone", values.phone);
      form.append("address", values.address ?? "");
      if (image) form.append("image", image);
      return (await api.put<{ user: User }>("/auth/me", form)).data.user;
    },
    onSuccess: (updated) => {
      setUser(updated);
      setImage(null);
      toast.success("Profile saved");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const changePassword = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: PasswordValues) =>
      (await api.put<{ message: string }>("/auth/me/password", { currentPassword, newPassword })).data,
    onSuccess: (data) => {
      toast.success(data.message);
      passwordForm.reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (!user) return null;
  const avatar = preview ?? imageUrl(user.image);
  const pErrors = profileForm.formState.errors;
  const pwErrors = passwordForm.formState.errors;

  return (
    <>
      <PageHeader title="My profile" subtitle={`Member since ${formatDate(user.createdAt)}`} />
      <div className="container section profile-layout">
        <form className="card form" onSubmit={profileForm.handleSubmit((v) => saveProfile.mutate(v))} noValidate>
          <h3>Account details</h3>
          <div className="profile-avatar">
            {avatar ? (
              <img src={avatar} alt="" className="avatar avatar-xl" />
            ) : (
              <span className="avatar avatar-xl avatar-letter">{user.name.charAt(0).toUpperCase()}</span>
            )}
            <label className="btn btn-outline btn-sm">
              <Camera size={16} /> Change photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size > 2 * 1024 * 1024) toast.error("Image must be 2 MB or smaller");
                  else if (file) setImage(file);
                }}
              />
            </label>
          </div>
          <label className="field">
            <span>Email</span>
            <input className="input" value={user.email} disabled />
          </label>
          <label className="field">
            <span>Name</span>
            <input className="input" {...profileForm.register("name")} />
            <FieldError message={pErrors.name?.message} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input className="input" type="tel" {...profileForm.register("phone")} />
            <FieldError message={pErrors.phone?.message} />
          </label>
          <label className="field">
            <span>Address</span>
            <textarea className="input" rows={3} {...profileForm.register("address")} />
          </label>
          <button className="btn btn-primary" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? "Saving..." : "Save changes"}
          </button>
        </form>

        <form className="card form" onSubmit={passwordForm.handleSubmit((v) => changePassword.mutate(v))} noValidate>
          <h3>Change password</h3>
          <label className="field">
            <span>Current password</span>
            <PasswordInput autoComplete="current-password" {...passwordForm.register("currentPassword")} />
            <FieldError message={pwErrors.currentPassword?.message} />
          </label>
          <label className="field">
            <span>New password</span>
            <PasswordInput autoComplete="new-password" {...passwordForm.register("newPassword")} />
            <FieldError message={pwErrors.newPassword?.message} />
          </label>
          <label className="field">
            <span>Confirm new password</span>
            <PasswordInput autoComplete="new-password" {...passwordForm.register("confirmPassword")} />
            <FieldError message={pwErrors.confirmPassword?.message} />
          </label>
          <button className="btn btn-primary" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </>
  );
}
