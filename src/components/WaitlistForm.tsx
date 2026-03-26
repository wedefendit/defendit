import { useState } from "react";
import { Zap, Check, Loader2, Mail } from "lucide-react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

type WaitlistFormProps = {
  tier?: "pro" | "enterprise";
  className?: string;
  stacked?: boolean;
};

export function WaitlistForm({
  tier = "pro",
  className = "",
  stacked = false,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { execute } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const captchaToken = await execute("waitlist");

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), tier, captchaToken }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium text-center ${className}`}
      >
        <Check className="w-4 h-4" />
        You&apos;re on the list. We&apos;ll be in touch.
      </div>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={`flex gap-2 ${stacked ? "flex-col" : "flex-col sm:flex-row"}`}
      >
        <div className="relative flex-1 min-w-0">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Join Waitlist
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}
      <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-600">
        Protected by reCAPTCHA.
      </p>
    </div>
  );
}
