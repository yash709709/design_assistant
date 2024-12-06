export interface DesignAnalysis {
  accessibility: string[];
  colorContrast: string[];
  designPrinciples: string[];
  recommendations: string[];
}

export interface UploadedFile {
  file: File;
  preview: string;
}
