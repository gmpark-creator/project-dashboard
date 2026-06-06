import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cutpilot Studio App",
  description: "AI Video Studio typed mock implementation"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
