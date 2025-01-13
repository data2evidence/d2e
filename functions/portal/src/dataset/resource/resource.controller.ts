import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res
} from "@danet/core";
import { Readable, pipeline } from "node:stream"
import { ResourceService } from "./resource.service.ts";

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
    @Param("fileName") fileName: string,
    @Res() res: Response
  ) {
    const result = await this.resourceService.downloadResource(
      datasetId,
      fileName
    );

    const webStream = Readable.toWeb(result.readStream) as ReadableStream<Uint8Array>;

    const streamResponse = new Response(webStream, {
      headers: new Headers({
        "Content-Type": result.contentType,
        "Content-Disposition": result.contentDisposition,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache"
      })
    });

    // TODO: Investigate why danet by default overwritten the response content-type as application/json
    // Download file is not equipped with the correct data
    return streamResponse;
  }

  @Delete(":fileName")
  async deleteResource(
    @Query("datasetId") datasetId: string,
    @Param("fileName") fileName: string
  ) {
    return await this.resourceService.deleteResource(datasetId, fileName);
  }
}
