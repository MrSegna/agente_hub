import { ThemeProvider } from "@/components/theme-provider";
import AppSidebar from "@/components/app-sidebar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Agent Model",
  description: "Sistema de gestão de agentes IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <AppSidebar />
            
            {/* Área principal */}
            <main className="flex-1 md:pl-64 relative overflow-y-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}