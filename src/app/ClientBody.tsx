"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased min-h-screen bg-background";
  }, []);

  return (
    <div className="antialiased min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  );
}
