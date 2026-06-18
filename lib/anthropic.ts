import Anthropic from "@anthropic-ai/sdk";
import type { WordAnalysis } from "@/types";

const client = new Anthropic();

export async function analyzeWord(
  text: string,
  sentence: string
): Promise<WordAnalysis> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Analyze this Spanish word or phrase: "${text}"
Sentence from document: "${sentence}"

Respond with JSON only, no markdown:
{
  "definition": "English definition in this context",
  "partOfSpeech": "verb|noun|adjective|adverb|preposition|conjunction|pronoun|article|other",
  "infinitive": "if verb: infinitive form, otherwise omit",
  "conjugationType": "if verb: describe tense, person, number, mood e.g. 'third person singular preterite', otherwise omit",
  "gender": "if noun or adjective: masculine or feminine, otherwise omit",
  "plural": "if noun: plural form, otherwise omit"
}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(raw) as WordAnalysis;
}
