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

export type AIOutputMode = 'animation' | 'text';

export interface AIGeneratedCode {
  mode?: AIOutputMode;
  html?: string;
  css?: string;
  js?: string;
  combined?: string;
  raw: string;
}
