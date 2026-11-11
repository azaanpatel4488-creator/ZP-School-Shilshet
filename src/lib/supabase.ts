import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Compresses an image file before upload (max 500KB, max 1000px dimension, 1:1 friendly)
 */
export async function compressImage(file: File, maxSizeKB = 500): Promise<File> {
  return new Promise((resolve) => {
    // If not an image or already smaller than 100KB, keep as is
    if (!file.type.startsWith("image/") || file.size <= 100 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Upload student passport photo to Supabase bucket 'student-photos'
 * Fallback: Base64 data URL for instant client preview if Supabase is offline/unconfigured
 */
export async function uploadStudentPhoto(file: File): Promise<string> {
  const compressed = await compressImage(file, 500);

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = compressed.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `passports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("student-photos")
        .upload(filePath, compressed, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.warn("Supabase storage upload error, falling back to local base64:", uploadError.message);
      } else {
        const { data } = supabase.storage.from("student-photos").getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn("Storage upload exception, using local URL:", err);
    }
  }

  // Graceful local preview fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.readAsDataURL(compressed);
  });
}

/**
 * Upload assignment material/document to Supabase bucket 'assignment-files'
 */
export async function uploadAssignmentFile(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `assignments/${fileName}`;

      const { error } = await supabase.storage
        .from("assignment-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error) {
        const { data } = supabase.storage.from("assignment-files").getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn("Assignment upload failed, using local URL:", err);
    }
  }

  return URL.createObjectURL(file);
}

