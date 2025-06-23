
"use client"; // Required for client-side side-effect imports

// Side-effect only imports to ensure Firebase services are registered client-side
import "firebase/auth";
import "firebase/firestore";

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext"; 

// Metadata export is removed as this is now a Client Component.
// Title and description are added directly to the <head> tag below.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>STIPS Lite - Your Student Task & Print Hub</title>
        <meta name="description" content="Streamlining academic tasks and print services for students." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider> {/* Wrap children with AuthProvider */}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
