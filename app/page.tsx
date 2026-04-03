import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to KasiLink with your South African phone number.",
};

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6) var(--space-4)",
        background: "var(--bg-primary)",
      }}
    >
      {/* Tagline above form */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "var(--space-8)",
          maxWidth: "26rem",
        }}
      >
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--text-tertiary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: "var(--space-2)",
          }}
        >
          Gauteng&apos;s Township Platform
        </p>
        <h1
          style={{
            fontSize: "var(--font-size-3xl)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "var(--space-3)",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          Use your SA phone number (+27) to sign in — no email needed.
        </p>
      </div>

      {/* Clerk SignIn — phone-first is configured in Clerk dashboard */}
      <SignIn
        routing="hash"
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: { width: "100%", maxWidth: "400px" },
            card: {
              width: "100%",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-2xl)",
              boxShadow: "var(--card-shadow)",
              padding: "var(--space-8)",
            },
            headerTitle: {
              display: "none", // we have our own header above
            },
            headerSubtitle: {
              display: "none",
            },
            socialButtonsBlockButton: {
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              color: "var(--text-primary)",
            },
            formButtonPrimary: {
              background: "var(--primary)",
              color: "var(--primary-text)",
              borderRadius: "var(--radius-lg)",
              fontFamily: "var(--font-body)",
              fontWeight: "500",
              height: "3rem",
            },
            formFieldInput: {
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              borderRadius: "var(--radius-lg)",
              color: "var(--input-text)",
              fontFamily: "var(--font-body)",
              height: "3rem",
            },
            formFieldLabel: {
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
            },
            identityPreviewText: {
              color: "var(--text-primary)",
            },
            footerActionLink: {
              color: "var(--primary)",
            },
          },
        }}
      />

      {/* Help text */}
      <p
        style={{
          marginTop: "var(--space-6)",
          fontSize: "var(--font-size-xs)",
          color: "var(--text-tertiary)",
          textAlign: "center",
          maxWidth: "22rem",
        }}
      >
        No smartphone? Visit a KasiLink community centre for assisted sign-up.
      </p>
    </div>
  );
}
