import "./globals.css";
import type { Metadata } from "next";
import { QueryProvider } from "../components/query-provider";

export const metadata: Metadata = {
  title: "Upsail",
  description: "Production-ready baseline"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
