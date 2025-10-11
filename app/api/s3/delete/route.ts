import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const key = body.key;

    if (!key) return new NextResponse("Key is required", { status: 400 });

    const command = await new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    S3.send(command);

    return new NextResponse("Image deleted", { status: 200 });
  } catch {}
}
