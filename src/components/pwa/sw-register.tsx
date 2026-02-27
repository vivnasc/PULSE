"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ServiceWorkerRegister() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setRegistration(reg);

        // Check for updates every 60 seconds
        const interval = setInterval(() => {
          reg.update();
        }, 60 * 1000);

        // New SW waiting — show update toast
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available
              setShowUpdate(true);
            }
          });
        });

        return () => clearInterval(interval);
      })
      .catch((err) => {
        console.warn("SW registration failed:", err);
      });

    // When the new SW takes over, reload the page
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage("SKIP_WAITING");
    }
    setShowUpdate(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed bottom-6 left-4 right-4 z-[9999] mx-auto max-w-sm"
        >
          <div className="rounded-2xl border border-white/10 bg-[#1A1B23]/95 backdrop-blur-xl p-4 shadow-2xl">
            <p className="text-white text-sm font-medium">Nova versão disponível</p>
            <p className="text-white/50 text-xs mt-1">Atualizar para a versão mais recente do PULSE.</p>
            <button
              onClick={handleUpdate}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] py-2.5 text-sm font-semibold text-white active:scale-[0.98] transition-transform"
            >
              Atualizar agora
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
