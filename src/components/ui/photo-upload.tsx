"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Loader2, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  className?: string;
}

export function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos = 6,
  className,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<number>(0);

  const handleUpload = useCallback(
    async (file: File, slot: number) => {
      setError(null);
      setUploading(slot);

      // Client-side validation
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Usa JPEG, PNG ou WebP.");
        setUploading(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Máximo 5MB por foto.");
        setUploading(null);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slot", slot.toString());

        const res = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload falhou");
        }

        const data = await res.json();
        onPhotosChange(data.photos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao fazer upload"
        );
      } finally {
        setUploading(null);
      }
    },
    [onPhotosChange]
  );

  const handleDelete = useCallback(
    async (url: string, index: number) => {
      try {
        const res = await fetch("/api/photos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (res.ok) {
          const data = await res.json();
          onPhotosChange(data.photos);
        } else {
          // Fallback: remove locally
          const newPhotos = photos.filter((_, i) => i !== index);
          onPhotosChange(newPhotos);
        }
      } catch {
        const newPhotos = photos.filter((_, i) => i !== index);
        onPhotosChange(newPhotos);
      }
    },
    [photos, onPhotosChange]
  );

  const handleSlotClick = (slot: number) => {
    setActiveSlot(slot);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file, activeSlot);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const slots = Array.from({ length: maxPhotos });

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-3 gap-2">
        {slots.map((_, i) => {
          const photo = photos[i];
          const isUploading = uploading === i;
          const isPrimary = i === 0;

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => !photo && handleSlotClick(i)}
                className={cn(
                  "aspect-[3/4] w-full rounded-xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden",
                  photo
                    ? "border-transparent"
                    : isPrimary
                      ? "border-[#FF3B5C]/50 bg-[#FF3B5C]/10 hover:bg-[#FF3B5C]/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-1">
                    <Loader2 className="h-6 w-6 text-[#FF3B5C] animate-spin" />
                    <span className="text-[10px] text-white/40">
                      A carregar...
                    </span>
                  </div>
                ) : photo ? (
                  <img
                    src={photo}
                    alt={`Foto ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    {isPrimary ? (
                      <Camera className="h-6 w-6 text-[#FF3B5C]/60" />
                    ) : (
                      <Plus className="h-5 w-5 text-white/25" />
                    )}
                  </div>
                )}
              </button>

              {/* Primary badge */}
              {isPrimary && !photo && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-0.5 text-[9px] text-[#FF3B5C] font-semibold bg-[#FF3B5C]/10 rounded-full px-2 py-0.5">
                    <Star className="h-2.5 w-2.5" />
                    Principal
                  </span>
                </div>
              )}

              {/* Photo actions overlay */}
              <AnimatePresence>
                {photo && !isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-xl"
                  >
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(photo, i);
                      }}
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>

                    {/* Replace button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotClick(i);
                      }}
                      className="absolute bottom-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Camera className="h-3 w-3 text-white" />
                    </button>

                    {/* Primary indicator */}
                    {isPrimary && (
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className="flex items-center gap-0.5 text-[9px] text-white font-semibold bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <Star className="h-2.5 w-2.5 text-[#FF3B5C]" />
                          Principal
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-xs text-white/30">
        Até {maxPhotos} fotos. JPEG, PNG ou WebP. Máximo 5MB cada.
        {photos.length === 0 && (
          <span className="text-[#FF3B5C]/60 ml-1">
            Adiciona pelo menos 1 foto para melhores resultados.
          </span>
        )}
      </p>
    </div>
  );
}
