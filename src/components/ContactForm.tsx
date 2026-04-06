import { useState } from "react";
import {
  Send,
  Check,
  Loader2,
  Mail,
  User,
  MessageSquare,
  Tag,
} from "lucide-react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const TOPICS = [
  { value: "general", label: "General Inquiry" },
  { value: "computer_repair", label: "Computer Repair" },
  { value: "virus_removal", label: "Virus & Malware Removal" },
  { value: "network_security", label: "Network Security" },
  { value: "scam_protection", label: "Scam & Fraud Protection" },
  { value: "data_recovery", label: "Backup & Data Recovery" },
  { value: "onsite_support", label: "On-Site Tech Support" },
  { value: "remote_support", label: "Remote Support" },
  { value: "smart_home", label: "Smart Home Setup" },
  { value: "sigint_pro", label: "SIGINT Pro" },
  { value: "sigint_enterprise", label: "SIGINT Enterprise" },
  { value: "sigint_community", label: "SIGINT Community" },
  { value: "other", label: "Other" },
];

type ContactFormProps = {
  defaultTopic?: string;
  className?: string;
};

export function ContactForm({
  defaultTopic = "general",
  className = "",
}: ContactFormProps) {
  const [topic, setTopic] = useState(defaultTopic);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { execute } = useRecaptcha();

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!message.trim()) {
      errors.message = "Message is required";
    } else if (message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (message.length > 5000) {
      errors.message = "Message too long (5000 char max)";
    }

    if (name.trim().length > 100) {
      errors.name = "Name too long (100 char max)";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const captchaToken = await execute("contact");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          topic,
          message: message.trim(),
          captchaToken,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
        setMessage("");
        setFieldErrors({});
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
        className={`flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-lg bg-green-500/10 border border-green-500/30 ${className}`}
      >
        <Check className="w-8 h-8 text-green-400" />
        <p className="text-green-400 font-semibold">Message sent!</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-sky-400 hover:text-sky-300 hover:underline transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic */}
        <div>
          <label
            htmlFor="contact-topic"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Topic
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 transition-colors appearance-none"
            >
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name)
                  setFieldErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="Your name"
              maxLength={100}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 transition-colors"
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email)
                  setFieldErrors((p) => ({ ...p, email: "" }));
                if (status === "error") setStatus("idle");
              }}
              placeholder="your@email.com"
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-1 transition-colors ${
                fieldErrors.email
                  ? "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400"
                  : "border-gray-300 dark:border-gray-600 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <textarea
              id="contact-message"
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (fieldErrors.message)
                  setFieldErrors((p) => ({ ...p, message: "" }));
                if (status === "error") setStatus("idle");
              }}
              placeholder="How can we help?"
              rows={5}
              maxLength={5000}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-1 transition-colors resize-y ${
                fieldErrors.message
                  ? "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400"
                  : "border-gray-300 dark:border-gray-600 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400"
              }`}
            />
          </div>
          <div className="flex justify-between mt-1">
            {fieldErrors.message ? (
              <p className="text-xs text-red-400">{fieldErrors.message}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-gray-400">{message.length}/5000</p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:border dark:border-sky-400/18 dark:bg-sky-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,132,199,0.18)] dark:ring-1 dark:ring-white/5 dark:backdrop-blur-sm dark:hover:-translate-y-0.5 dark:hover:border-sky-400/28 dark:hover:bg-sky-900/72 dark:hover:shadow-[0_18px_34px_rgba(2,132,199,0.24)] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send Message
        </button>

        {status === "error" && (
          <p className="text-xs text-red-400 text-center">{errorMsg}</p>
        )}
      </form>
      <p className="mt-3 text-[10px] text-gray-500 dark:text-gray-600 text-center">
        Protected by reCAPTCHA. Your message goes directly to our team.
      </p>
    </div>
  );
}
