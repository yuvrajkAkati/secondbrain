import { generateEmbedding } from "@/app/lib/ai/embeddings";

export async function POST(req: Request) {
  const body = await req.json();

  const embedding = await generateEmbedding(body.query);

  return Response.json({
    dimensions: embedding.length,
    sample: embedding.slice(0, 5),
  });
}