import { NextResponse } from "next/server";
import { deleteItem } from "@/lib/server";

export const runtime = "nodejs";

export async function DELETE(_: Request, context: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await context.params;
    await deleteItem(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除内容失败";
    const status = message === "内容不存在" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
