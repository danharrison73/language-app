export interface WordAnalysis {
  definition: string;
  partOfSpeech: string;
  infinitive?: string;
  conjugationType?: string;
  gender?: string;
  plural?: string;
}

export interface Highlight {
  id: string;
  documentId: string;
  text: string;
  context: string;
  page: number;
  definition: string;
  analysis: WordAnalysis;
  isHidden: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
  highlights: Highlight[];
}
