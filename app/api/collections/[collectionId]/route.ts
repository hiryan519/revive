import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { deleteCollection, getCollectionDetail, renameCollection } from "@/lib/server";
import { getRouteError } from "@/lib/route-errors";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().min(1, "请填写内容集名称").max(80),
});

export async function GET(_: Request, context: { params: Promise<{ collectionId: string }> }) {
  try {
    const { collectionId } = await context.params;
    const collection = await getCollectionDetail(collectionId);

    if (!collection) {
      return NextResponse.json({ error: "内容集不存在" }, { status: 404 });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    const routeError = getRouteError(error, "读取内容集详情失败");
    return NextResponse.json({ error: routeError.message }, { status: routeError.status });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ collectionId: string }> }) {
  try {
    const { collectionId } = await context.params;
    const body = bodySchema.parse(await request.json());
    const collection = await renameCollection(collectionId, body.name);

    if (!collection) {
      return NextResponse.json({ error: "内容集不存在" }, { status: 404 });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "请求参数错误" }, { status: 400 });
    }

    const routeError = getRouteError(error, "更新内容集名称失败");
    return NextResponse.json({ error: routeError.message }, { status: routeError.status });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ collectionId: string }> }) {
  try {
    const { collectionId } = await context.params;
    await deleteCollection(collectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const routeError = getRouteError(error, "删除内容集失败");
    const message = routeError.message;
    const status = message === "内容集不存在" ? 404 : routeError.status;
    return NextResponse.json({ error: message }, { status });
  }
}
