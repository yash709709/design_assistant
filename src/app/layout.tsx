import "@/styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design Review Assistant",
  description: "AI-powered design review tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-center items-center h-16">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Design Review Assistant
                </Link>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
