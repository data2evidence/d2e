import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req
} from "@danet/core";
import { Buffer } from "node:buffer";
import { ResourceService } from "./resource.service.ts";

// TODO: Make upload and download work
@Controller("system-portal/dataset/resource")
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get("list")
  async getResources(@Query("datasetId") datasetId: any) {
    return await this.resourceService.getResources(datasetId);
  }

  @Post()
  async uploadResource(
    @Query("datasetId") datasetId: string,
    @Req() request: Request
  ) {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const uploadedFile = {
      originalname: file.name,
      buffer: await file.arrayBuffer(),
      mimetype: file.type,
    };
    console.log(`uploadedFile: ${uploadedFile}`);
    if (
      uploadedFile.originalname.includes("\\") ||
      uploadedFile.originalname.includes("/")
    ) {
      throw new Error("Invalid filename");
    }

    return await this.resourceService.uploadResource(datasetId, uploadedFile);
  }

  @Get(":fileName/download")
  async downloadResource(
    @Query("datasetId") datasetId: string,
    @Param("fileName") fileName: string
  ) {
    try {
      const result = await this.resourceService.downloadResource(
        datasetId,
        fileName
      );

      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      result.readStream.on("data", async (chunk) => {
        try {
          const buffer = Buffer.from(chunk);
          console.log("Writing chunk:", buffer.length);
          await writer.write(buffer);
        } catch (err) {
          console.error("Error writing chunk:", err);
        }
      });

      result.readStream.on("end", () => {
        console.log("Stream ended, closing writer");
        writer.close();
      });

      result.readStream.on("error", (err) => {
        console.error("Stream error:", err);
        writer.abort(err);
      });

      return new Response(readable, {
        headers: {
          "Content-Type": result.contentType,
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch (error) {
      console.error("Download error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to download file",
          details: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  @Delete(":fileName")
  async deleteResource(
    @Query("datasetId") datasetId: string,
    @Param("fileName") fileName: string
  ) {
    return await this.resourceService.deleteResource(datasetId, fileName);
  }
}
