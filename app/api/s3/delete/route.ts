import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { fixedWindow } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);
export async function DELETE(request: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied())
      return NextResponse.json(
        { error: "You have been blocked" },
        { status: 403 }
      );

    const body = await request.json();
    const key = body.key;
    if (!key) return new NextResponse("Key is required", { status: 400 });
    const command = await new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    S3.send(command);

    return new NextResponse("Image deleted", { status: 200 });
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
