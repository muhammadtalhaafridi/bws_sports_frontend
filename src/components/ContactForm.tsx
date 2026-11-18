import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { sendMessage } from "../api/message/fetcher";
import { getErrorMessage } from "../lib/api";
import { emailField } from "../lib/schemas";
import { FieldError } from "./ui";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: emailField,
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(5000),
});
type FormValues = z.infer<typeof schema>;

/** Contact form that saves to the messages table. Used on the Contact page and the home page. */
const emptyForm: FormValues = { name: "", email: "", message: "" };

export function ContactForm({ title = "Send us a message" }: { title?: string }) {
  // The React Compiler memoizes register() results, so reset() never re-attaches the field refs
  // and the inputs keep their text. Opting out lets reset() clear the form after sending.
  "use no memo";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyForm });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      toast.success(data.message);
      reset(emptyForm);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <form className="card form" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
      <h3>{title}</h3>
      <div className="form-row">
        <label className="field">
          <span>Name</span>
          <input className="input" placeholder="Your name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </label>
        <label className="field">
          <span>Email</span>
          <input className="input" type="email" placeholder="you@example.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea className="input" rows={6} placeholder="How can we help?" {...register("message")} />
        <FieldError message={errors.message?.message} />
      </label>
      <button className="btn btn-primary btn-lg btn-block" disabled={mutation.isPending}>
        <Send size={18} /> {mutation.isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

export function ShopDetails() {
  return (
    <aside className="card shop-details">
      <h3>Shop details</h3>
      <ul>
        <li>
          <MapPin size={20} />
          <span>
            <strong>Address</strong>
            BashirAbad, Peshawar, Pakistan
          </span>
        </li>
        <li>
          <Phone size={20} />
          <span>
            <strong>Phone</strong>
            <a href="tel:+923336257886">0333 6257886</a>
          </span>
        </li>
        <li>
          <Mail size={20} />
          <span>
            <strong>Email</strong>
            <a href="mailto:info@bwssports.com">info@bwssports.com</a>
          </span>
        </li>
        <li>
          <Clock size={20} />
          <span>
            <strong>Opening hours</strong>
            1:00 pm - 7:00 pm
          </span>
        </li>
      </ul>
    </aside>
  );
}
