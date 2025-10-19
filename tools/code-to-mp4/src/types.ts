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
