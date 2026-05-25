import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { detectImageFromBuffer, mimeFromExtension } from "./detect-image";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(private readonly config: ConfigService) {}

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

    const uploadsDir = join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${randomUUID()}${extension}`;
    await writeFile(join(uploadsDir, filename), file.buffer);

    const publicBase = this.config
      .get<string>("PUBLIC_BASE_URL", "http://localhost:3000")
      .replace(/\/$/, "");

    return {
      url: `${publicBase}/uploads/${filename}`,
      filename,
      mime,
    };
  }
}
