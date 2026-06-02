export function extractText(content: string): string {
  try {
    const blocks = JSON.parse(content);

    return blocks
      .flatMap((block: any) => block.content || [])
      .map((item: any) => item.text || "")
      .join(" ");
  } catch {
    return content;
  }
}