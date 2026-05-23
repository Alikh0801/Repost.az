import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(private readonly config: ConfigService) {}

  async saveImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException("Unsupported image type");
    }

    if (file.size > MAX_BYTES) {
      throw new BadRequestException("File exceeds 5MB limit");
    }

    const uploadsDir = join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const extension = extname(file.originalname) || ".jpg";
    const filename = `${randomUUID()}${extension}`;
    const absolutePath = join(uploadsDir, filename);
    await writeFile(absolutePath, file.buffer);

    const publicBase = this.config
      .get<string>("PUBLIC_BASE_URL", "http://localhost:3000")
      .replace(/\/$/, "");

    return {
      url: `${publicBase}/uploads/${filename}`,
      filename,
    };
  }
}
