import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { Sidebar } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DECISIONMESH AI",
  description: "Universal Agentic Decision Intelligence Platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="shell">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
