import type { Metadata } from "next";
import { Footer } from "@/components/navigation/footer";
import { Navbar } from "@/components/navigation/navbar";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Peel UI handles browser storage, microphone audio, and external links.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#08090a] text-[#f5f5f7]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-32 sm:px-6">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy
          </h1>
          <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-zinc-400 sm:text-base">
            A short account of what this site stores and what happens when you
            use its demos.
          </p>
        </header>

        <div className="border-t border-[#232730]">
          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">
              The short version
            </h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              No accounts, ads, analytics, or form submissions are present in
              the site code. The site&apos;s code sets no cookies. Demos run in
              your browser.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">What this site is</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              Peel UI is an open-source catalog of interactive React
              components.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">What is collected</h2>
            <div className="max-w-[65ch] space-y-2 text-sm leading-relaxed text-zinc-400">
              <p>
                Vercel hosts this site. Like any web host, Vercel receives your
                IP address and request details to deliver pages. Read{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#84ff00] underline underline-offset-4 hover:text-white"
                >
                  Vercel&apos;s privacy policy
                </a>
                .
              </p>
              <p>
                Installing a component with the shadcn CLI fetches a static
                JSON file from this site. The host sees that request; the site
                does not receive your code or project files.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">Browser storage</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              The Note Button demo saves its text under{" "}
              <code className="font-mono text-xs text-[#9ea3ad]">
                peel-note:demo
              </code>{" "}
              in local storage on your device. The note stays in your browser;
              the site code does not send it anywhere.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">Microphone</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              If you choose microphone mode in Voice Pill, your browser asks
              for microphone access. Audio is analyzed in the browser to show
              the waveform. The component does not send audio to a server.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">Third parties</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              Page loads do not request third-party scripts or embedded
              content. The site does not request a star count or any other
              data from GitHub when a page loads. If you open a repository or
              Issues link, GitHub receives the request, including your IP
              address and standard connection details.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">Cookies</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              The site&apos;s code sets no cookies and does not read browser cookies.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">
              Open source and license
            </h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              Peel UI is open source under the MIT License. Read the{" "}
              <a
                href="https://github.com/Killersumit/peel-ui/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
                className="text-[#84ff00] underline underline-offset-4 hover:text-white"
              >
                license
              </a>
              .
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">Contact</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              Questions about this page? Open an issue on{" "}
              <a
                href="https://github.com/Killersumit/peel-ui/issues"
                target="_blank"
                rel="noreferrer"
                className="text-[#84ff00] underline underline-offset-4 hover:text-white"
              >
                GitHub
              </a>
              .
            </p>
          </section>

          <section className="grid grid-cols-1 gap-2 border-b border-[#232730] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
            <h2 className="text-sm font-semibold text-white">If this changes</h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
              If the site later adds analytics, a form, accounts, or anything
              else that collects data, this page will be updated at the same
              time.
            </p>
          </section>
        </div>

        <p className="mt-4 font-mono text-[11px] tracking-wider text-zinc-500">
          LAST UPDATED · 2026-10-01
        </p>
      </main>

      <Footer />
    </div>
  );
}
