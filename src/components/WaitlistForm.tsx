import { useState } from "react";
import { Zap, Loader2, Mail } from "lucide-react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

type WaitlistFormProps = {
  tier?: "individual" | "team" | "enterprise";
  className?: string;
  stacked?: boolean;
};

export function WaitlistForm({
  tier = "individual",
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
        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center ${className}`}
      >
        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
          <Mail className="w-4 h-4" />
          Check your email to confirm your spot.
        </div>
        <p className="text-[11px] text-green-400/60">
          Don&apos;t see it? Check your junk or spam folder.
        </p>
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
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Join Waiting List
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
