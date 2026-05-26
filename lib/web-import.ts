function normalizeText(input: string) {
  return input.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function deriveTitle(originalUrl: string, content: string) {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return originalUrl;
  }

  return firstLine.replace(/^#+\s*/, "").replace(/^Title:\s*/i, "").trim() || originalUrl;
}

export async function importFromUrl(originalUrl: string) {
  const jinaUrl = `https://r.jina.ai/${originalUrl}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(jinaUrl, {
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("链接内容无法自动解析，请改用手动粘贴正文继续导入");
    }

    const content = normalizeText(await response.text());

    if (content.length < 100) {
      throw new Error("链接内容无法自动解析，请改用手动粘贴正文继续导入");
    }

    return {
      title: deriveTitle(originalUrl, content),
      contentText: content,
      contentMarkdown: content,
    };
  } catch {
    throw new Error("链接内容无法自动解析，请改用手动粘贴正文继续导入");
  } finally {
    clearTimeout(timeout);
  }
}
