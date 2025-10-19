export interface Dimensions {
  width: number;
  height: number;
}

export interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

export type EditorMode = 'combined' | 'split';

export interface AIStylePreset {
  id: string;
  label: string;
  description: string;
  systemPrompt: string;
  promptScaffold?: string;
}

export interface AIGeneratedCode {
  html?: string;
  css?: string;
  js?: string;
  combined?: string;
  raw: string;
}
