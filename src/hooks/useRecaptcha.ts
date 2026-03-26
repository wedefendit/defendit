import { useCallback, useEffect } from "react";

const SITE_KEY = "6LdvjZgsAAAAAEyZKwovF8I5A8UgMtofJEgVNk2m";
const SCRIPT_ID = "recaptcha-v3";

export function useRecaptcha() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const execute = useCallback(async (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const g = (window as any).grecaptcha;
      if (!g) {
        reject(new Error("reCAPTCHA not loaded"));
        return;
      }
      g.ready(() => {
        g.execute(SITE_KEY, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  }, []);

  return { execute };
}
