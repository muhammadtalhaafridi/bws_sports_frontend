import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

export function PasswordInput(props: ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-input">
      <input {...props} type={show ? "text" : "password"} className="input" />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
