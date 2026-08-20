"use client";

import { useEffect, useRef, useState } from "react";

import { googleAuthAction } from "@/app/auth/actions";

const GIS_SCRIPT_ID = "google-identity-services";
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode?: "popup" | "redirect";
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      logo_alignment?: "left" | "center";
      width?: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

type GoogleSignInButtonProps = {
  nextPath?: string | null;
  onError?: (message: string) => void;
};

function loadGisScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Unavailable"));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.getElementById(GIS_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Sign-In")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.body.appendChild(script);
  });
}

export function GoogleSignInButton({
  nextPath,
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    if (!clientId || !buttonRef.current) {
      return;
    }

    let cancelled = false;

    async function setup() {
      try {
        await loadGisScript();
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId as string,
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
          callback: async (response) => {
            const idToken = response.credential;
            if (!idToken) {
              onError?.("Google Sign-In was cancelled. Please try again.");
              return;
            }

            setPending(true);
            try {
              const result = await googleAuthAction(idToken, nextPath ?? null);
              if (result?.error) {
                onError?.(result.error);
              }
            } catch {
              onError?.(
                "Unable to complete Google Sign-In. Please try again.",
              );
            } finally {
              setPending(false);
            }
          },
        });

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 320,
        });

        if (!cancelled) {
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          onError?.("Google Sign-In is temporarily unavailable.");
        }
      }
    }

    void setup();

    return () => {
      cancelled = true;
    };
  }, [nextPath, onError]);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex justify-center">
        <div
          ref={buttonRef}
          className={pending || !ready ? "pointer-events-none opacity-60" : ""}
          aria-busy={pending}
        />
      </div>
      {pending ? (
        <p className="text-center text-xs text-muted-foreground">
          Completing Google Sign-In…
        </p>
      ) : null}
    </div>
  );
}
