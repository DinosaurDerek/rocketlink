import ClientOnly from "@/components/ClientOnly";
import AppProviders from "@/components/AppProviders";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientOnly
          fallback={<div style={{ height: "100vh", background: "#f7f8fa" }} />}
        >
          <AppProviders>{children}</AppProviders>
        </ClientOnly>
      </body>
    </html>
  );
}
