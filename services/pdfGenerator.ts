import { jsPDF } from "jspdf";
import { FormStructure, FieldType } from "../types";

export const generateClientSidePDF = (structure: FormStructure) => {
  const doc = new jsPDF();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(structure.title, 105, 20, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  let currentY = 40;
  const marginX = 20;
  const inputX = 70;
  const lineHeight = 15;

  structure.fields.forEach((field) => {
    // Label
    doc.text(field.label, marginX, currentY);

    // Form Field
    // Note: jsPDF AcroForm support is basic. We create fields using the AcroForm API.
    
    // We need to cast to any because jsPDF types for AcroForm can be finicky in some versions
    const pdfAny = doc as any; 
    
    // Standard text field dimensions
    const fieldHeight = 8;
    const fieldWidth = 80;

    if (field.type === FieldType.TEXT || field.type === FieldType.DATE) {
        const textField = new pdfAny.AcroForm.TextField();
        textField.Rect = [inputX, currentY - 6, fieldWidth, fieldHeight];
        textField.fieldName = field.name;
        textField.value = field.value ? String(field.value) : "";
        pdfAny.addField(textField);
    } 
    else if (field.type === FieldType.CHECKBOX) {
        const checkBox = new pdfAny.AcroForm.CheckBox();
        checkBox.Rect = [inputX, currentY - 6, 6, 6];
        checkBox.fieldName = field.name;
        checkBox.appearanceState = field.value ? 'On' : 'Off';
        pdfAny.addField(checkBox);
    }
    else if (field.type === FieldType.DROPDOWN) {
        const comboBox = new pdfAny.AcroForm.ComboBox();
        comboBox.Rect = [inputX, currentY - 6, fieldWidth, fieldHeight];
        comboBox.fieldName = field.name;
        comboBox.setOptions(field.options || []);
        pdfAny.addField(comboBox);
    }

    currentY += lineHeight;
  });

  doc.save("dynamic_form.pdf");
};
