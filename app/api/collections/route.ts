import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { listCollections } from "@/lib/server";

export const runtime = "nodejs";

const querySchema = z.object({
  id: z.string().uuid().optional(),
});

export async function GET(request: Request) {
  try {
    querySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );

    const collections = await listCollections();
    return NextResponse.json({ collections });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "请求参数错误" }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "读取内容集失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
