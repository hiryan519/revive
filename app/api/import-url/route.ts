import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { importUrlToCollection } from "@/lib/import-url-service";
import { getRouteError } from "@/lib/route-errors";

export const runtime = "nodejs";

const bodySchema = z.object({
  collectionName: z.string().trim().max(80).optional(),
  url: z.string().trim().url("请输入有效的网页链接"),
  useRecentCollection: z.boolean().optional(),
}).superRefine((body, ctx) => {
  if (!body.useRecentCollection && !body.collectionName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["collectionName"],
      message: "请填写内容集名称",
    });
  }
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const stored = await importUrlToCollection(body);

    return NextResponse.json({
      success: true,
      ...stored,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message ?? "请求参数错误" }, { status: 400 });
    }

    const routeError = getRouteError(error, "导入网页失败");
    return NextResponse.json({ success: false, error: routeError.message }, { status: routeError.status });
  }
}
