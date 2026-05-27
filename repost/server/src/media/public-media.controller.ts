import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { createReadStream, existsSync } from "fs";
import { extname, join } from "path";

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

@ApiTags("media")
@Controller("media")
export class PublicMediaController {
  @Get("file/:filename")
  serveFile(@Param("filename") filename: string, @Res() res: Response) {
    if (!/^[\w-]+\.(jpe?g|png|webp|gif)$/i.test(filename)) {
      throw new NotFoundException("File not found");
    }

    const filePath = join(process.cwd(), "uploads", filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException("File not found");
    }

    const ext = extname(filename).toLowerCase();
    res.setHeader("Content-Type", CONTENT_TYPE[ext] ?? "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    createReadStream(filePath).pipe(res);
  }
}
