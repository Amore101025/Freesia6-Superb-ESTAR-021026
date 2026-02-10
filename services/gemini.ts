import { GoogleGenAI } from "@google/genai";
import { FormStructure, FieldType } from "../types";

const parseFormStructure = async (text: string): Promise<FormStructure> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an expert data extraction agent. Analyze the following document text and extract the structure for a fillable PDF form.
      
      The input might be a raw natural language document OR a structured markdown specification (e.g. starting with ## pdf_spec).
      
      Input Text:
      """
      ${text}
      """
      
      Return ONLY a valid JSON object. Do not wrap it in markdown code blocks. The JSON should match this TypeScript interface:
      
      interface FormStructure {
        title: string; // A suitable title extracted from the text
        fields: Array<{
          id: string; // specific unique identifier
          label: string; // The text label for the field
          name: string; // A variable-safe name (snake_case)
          type: 'text' | 'checkbox' | 'dropdown' | 'date';
          options?: string[]; // Only for dropdowns
          value?: string; // Default value if specified (e.g. for date)
        }>;
      }

      For "Submission Type: [Option1, Option2]", create a dropdown.
      For "Device Name: [...]", create a text field.
      For "[ ]" or "Checkbox", create a checkbox.
      For lists like "1. Full Name *Required*", create a text field.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const jsonText = response.text || "{}";
    const structure = JSON.parse(jsonText) as FormStructure;
    return structure;
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    // Fallback Mock for demo purposes if API fails or key is missing
    throw new Error("Failed to parse form structure. Please check your API Key and Model availability.");
  }
};

const generatePythonCode = async (structure: FormStructure): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a Python expert specializing in PDF generation using the 'fpdf2' library.
      Generate a complete, runnable Python script that creates a dynamic PDF form based on the following JSON structure.
      
      JSON Structure:
      ${JSON.stringify(structure, null, 2)}
      
      Requirements:
      1. Use 'fpdf2'. Import FPDF.
      2. If there are date fields, import datetime and pre-fill with today's date if applicable.
      3. Set font to Arial size 12.
      4. Add a title centered at the top.
      5. Iterate through the fields and place them vertically with appropriate spacing.
      6. Use 'pdf.form_text', 'pdf.form_combo', 'pdf.form_checkbox' appropriately.
      7. Ensure 'y' coordinates increment so fields don't overlap.
      8. Output the file to "dynamic_form.pdf".
      9. Return ONLY the raw Python code. Do not wrap in markdown blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    let code = response.text || "";
    // Clean up potential markdown wrapping if the model ignores the instruction
    code = code.replace(/```python/g, '').replace(/```/g, '');
    return code;

  } catch (error) {
    console.error("Gemini Code Gen Error:", error);
    return "# Error generating code. Please check API Key and Model availability.";
  }
};

export const GeminiService = {
  parseFormStructure,
  generatePythonCode
};
