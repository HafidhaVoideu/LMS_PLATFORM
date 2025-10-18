import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { S3 } from "@/lib/S3Client";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { error: "File name is required" }),
  contentType: z.string().min(1, { error: "Content type is required" }),
  size: z.number().min(1, { error: "Size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);
export async function POST(req: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied())
      return NextResponse.json(
        { error: "You have been blocked" },
        { status: 403 }
      );

    const body = await req.json();

    const validatedFile = fileUploadSchema.safeParse(body);

    console.log("validated file:", validatedFile);

    if (!validatedFile.success)
      return NextResponse.json(
        { error: "File validation has failed" },
        { status: 400 }
      );
    const { fileName, contentType, size, isImage } = validatedFile.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    console.log("presignedUrl", presignedUrl);
    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 400 }
    );
  }
  // console.log(bodu);
}
