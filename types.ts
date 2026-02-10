export enum FieldType {
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  DATE = 'date'
}

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  options?: string[]; // For dropdowns
  value?: string | boolean; // For default values
  x?: number; // Coordinates for PDF mapping (simulated)
  y?: number;
  width?: number;
  height?: number;
}

export interface FormStructure {
  title: string;
  fields: FormField[];
}

export interface GeneratedArtifacts {
  structure: FormStructure;
  pythonCode: string;
}
