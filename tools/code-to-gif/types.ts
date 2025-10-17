export {};

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: Partial<{
        allowTaint: boolean;
        useCORS: boolean;
        width: number;
        height: number;
        x: number;
        y: number;
        // Fix: Add backgroundColor property to html2canvas options type to allow transparent backgrounds.
        backgroundColor: string | null;
    }>) => Promise<HTMLCanvasElement>;
    GIF: any; 
  }
}
