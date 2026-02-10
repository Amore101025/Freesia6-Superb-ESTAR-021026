export const DEFAULT_SAMPLE_CONTENT = `# FDA Submission Form Example

**Device Information**
Please provide the details of the medical device being submitted.

- Device Name: [Enter Device Name]
- Manufacturer: [Enter Manufacturer Name]

**Submission Details**
Select the type of submission you are filing.

- Submission Type: [510(k), PMA, De Novo]
- Submission Date: [Today's Date]

**Confirmation**
- Confirm Accuracy: [ ] I certify that the information provided is true and correct.
`;

export const MOCK_PYTHON_CODE = `from fpdf import FPDF
import datetime

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

# Title
pdf.cell(0, 10, "FDA Submission Form Example", ln=True, align="C")

# Text field: Device Name
pdf.text(10, 30, "Device Name:")
pdf.form_text(name="Device_Name", x=50, y=25, w=100, h=10)

# Text field: Manufacturer
pdf.text(10, 50, "Manufacturer:")
pdf.form_text(name="Manufacturer", x=50, y=45, w=100, h=10)

# Dropdown: Submission Type
pdf.text(10, 70, "Submission Type:")
pdf.form_combo(name="Submission_Type", x=50, y=65, w=60, h=10,
               options=["510(k)", "PMA", "De Novo"])

# Text field: Submission Date
pdf.text(10, 90, "Submission Date:")
today = datetime.date.today().strftime("%m/%d/%Y")
pdf.form_text(name="Submission_Date", x=50, y=85, w=60, h=10, value=today)

# Checkbox: Confirm Accuracy
pdf.text(10, 110, "Confirm Accuracy:")
pdf.form_checkbox(name="Confirm_Accuracy", x=60, y=105, w=5, h=5)

pdf.output("dynamic_form.pdf")
`;
