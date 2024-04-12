import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AuthProvider from "@/providers/auth-provider";
import ThemeProvider from "@/providers/theme-provider";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextjs fullstack Authentication",
  description: "Sign-Up and Sign-In with Nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col h-[100svh] w-[100svw] overflow-hidden">
              <Navbar />
              <main className="flex flex-col flex-1 min-h-0 overflow-auto">
                {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
