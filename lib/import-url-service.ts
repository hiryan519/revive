import { storeImportedItem } from "@/lib/server";
import { importFromUrl } from "@/lib/web-import";

export const RECENT_COLLECTION_NAME = "最近收藏";
export const RECENT_COLLECTION_DESCRIPTION = "通过书签导入的内容";

export async function importUrlToCollection(params: {
  url: string;
  collectionName?: string;
  useRecentCollection?: boolean;
}) {
  const collectionName = params.useRecentCollection ? RECENT_COLLECTION_NAME : params.collectionName?.trim();

  if (!collectionName) {
    throw new Error("请填写内容集名称");
  }

  const imported = await importFromUrl(params.url);

  return storeImportedItem({
    collectionName,
    collectionDescription: params.useRecentCollection ? RECENT_COLLECTION_DESCRIPTION : undefined,
    title: imported.title,
    contentText: imported.contentText,
    contentMarkdown: imported.contentMarkdown,
    sourceType: "url",
    sourceUrl: params.url,
  });
}
