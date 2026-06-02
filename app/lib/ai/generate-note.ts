export async function generateNote(prompt: string) {
  const response = await fetch(
    "http://localhost:11434/api/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi:latest",
        prompt: `
Create a detailed study note.

Return the response in exactly this format:

Title: <title>

<content>

Topic:
${prompt}

The note should contain:
- Introduction
- Core concepts
- Examples
- Best practices
- Conclusion
`,
        stream: false,
      }),
    }
  );

  const data = await response.json();

  return data.response as string;
}