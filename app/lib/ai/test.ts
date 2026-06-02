import { generateEmbedding } from "./embeddings";

async function main() {
  const embedding = await generateEmbedding(
    "Redis PubSub is a messaging system"
  );

  console.log("Dimensions:", embedding.length);
  console.log("Sample:", embedding.slice(0, 5));
}

main();