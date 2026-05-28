import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { buildMediaFilePath } from "../common/media-url";
import { detectImageFromBuffer, mimeFromExtension } from "./detect-image";
import { initCloudinary } from "./cloudinary.client";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

@Injectable()
export class MediaService {
  private readonly cloudinary: ReturnType<typeof initCloudinary>;

  constructor(private readonly config: ConfigService) {
    this.cloudinary = initCloudinary(config);
  }

  async saveImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    if (file.size > MAX_BYTES) {
      throw new BadRequestException("File exceeds 5MB limit");
    }

    const detected = detectImageFromBuffer(file.buffer);
    const extFromName = extname(file.originalname).toLowerCase();
    const mimeFromExt = mimeFromExtension(extFromName);
    const reportedMime = file.mimetype?.toLowerCase() ?? "";

    let extension: string | undefined;
    let mime: string | undefined;

    if (detected) {
      mime = detected.mime;
      extension = detected.extension;
    } else if (
      mimeFromExt &&
      (reportedMime === mimeFromExt ||
        reportedMime === "application/octet-stream" ||
        reportedMime === "")
    ) {
      mime = mimeFromExt;
      extension = extFromName;
    } else if (MIME_TO_EXT[reportedMime]) {
      mime = reportedMime;
      extension = extFromName || MIME_TO_EXT[reportedMime];
    }

    if (!mime || !extension || !MIME_TO_EXT[mime]) {
      throw new BadRequestException(
        "Dəstəklənən formatlar: JPEG, PNG, WEBP, GIF",
      );
    }

    const filename = `${randomUUID()}${extension}`;
    const folder = this.config.get<string>("CLOUDINARY_FOLDER")?.trim() || "repost";

    if (this.cloudinary) {
      try {
        const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const stream = this.cloudinary!.uploader.upload_stream(
            {
              folder,
              public_id: filename.replace(/\.[^.]+$/, ""),
              resource_type: "image",
              overwrite: false,
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }
              if (!result?.secure_url) {
                reject(new Error("Cloudinary upload returned empty URL"));
                return;
              }
              resolve(result as any);
            },
          );

          stream.on("error", (err) => reject(err));
          stream.end(file.buffer);
        });

        return {
          url: uploaded.secure_url,
          filename,
          mime,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // Render logları üçün real səbəb
        console.error("[MediaService] Cloudinary upload failed:", message);
        throw new BadRequestException(
          "Şəkil yüklənmədi. Cloudinary ayarlarını yoxlayın və yenidən cəhd edin.",
        );
      }
    }

    // Fallback: local disk (legacy / local dev)
    const uploadsDir = join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), file.buffer);

    return {
      url: buildMediaFilePath(filename),
      filename,
      mime,
    };
  }
}
