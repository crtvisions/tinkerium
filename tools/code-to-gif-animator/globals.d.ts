
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: Partial<Options>) => Promise<HTMLCanvasElement>;
    GIF: any; 
  }
}

// Options for html2canvas
interface Options {
  allowTaint: boolean;
  backgroundColor: string | null;
  canvas: HTMLCanvasElement | null;
  foreignObjectRendering: boolean;
  imageTimeout: number;
  logging: boolean;
  onclone: ((document: Document) => void) | null;
  proxy: string | null;
  removeContainer: boolean;
  scale: number;
  useCORS: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  scrollX: number;
  scrollY: number;
  windowWidth: number;
  windowHeight: number;
}

export {};
