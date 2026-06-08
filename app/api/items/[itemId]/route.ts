import { NextResponse } from "next/server";
import { deleteItem } from "@/lib/server";
import { getRouteError } from "@/lib/route-errors";

export const runtime = "nodejs";

export async function DELETE(_: Request, context: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await context.params;
    await deleteItem(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const routeError = getRouteError(error, "删除内容失败");
    const message = routeError.message;
    const status = message === "内容不存在" ? 404 : routeError.status;
    return NextResponse.json({ error: message }, { status });
  }
}
