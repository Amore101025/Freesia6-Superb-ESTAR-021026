import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { FormPreview } from './components/FormPreview';
import { CodePreview } from './components/CodePreview';
import { DEFAULT_SAMPLE_CONTENT, DEFAULT_PDF_SPEC, MOCK_PYTHON_CODE } from './constants';
import { GeminiService } from './services/gemini';
import { generateClientSidePDF } from './services/pdfGenerator';
import { FormStructure, FormField, FieldType } from './types';
import { Download, Play, Code2, Eye } from 'lucide-react';

enum Tab {
  PREVIEW = 'preview',
  CODE = 'code'
}

type InputMode = 'raw' | 'spec';

const App: React.FC = () => {
  // Input State
  const [inputMode, setInputMode] = useState<InputMode>('spec');
  const [rawText, setRawText] = useState(DEFAULT_SAMPLE_CONTENT);
  const [specText, setSpecText] = useState(DEFAULT_PDF_SPEC);
  
  // Output/Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [structure, setStructure] = useState<FormStructure | null>(null);
  const [pythonCode, setPythonCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PREVIEW);
  const [error, setError] = useState<string | null>(null);

  // Derived state for the active input
  const activeInputText = inputMode === 'raw' ? rawText : specText;
  const handleActiveInputChange = (val: string) => {
      if (inputMode === 'raw') setRawText(val);
      else setSpecText(val);
  };

  useEffect(() => {
    // We default to the spec tab with the spec loaded.
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // 1. Analyze structure using the currently active text
      const parsedStructure = await GeminiService.parseFormStructure(activeInputText);
      setStructure(parsedStructure);

      // 2. Generate Python Code based on that structure
      const code = await GeminiService.generatePythonCode(parsedStructure);
      setPythonCode(code);
      
      // Auto switch to preview
      setActiveTab(Tab.PREVIEW);
    } catch (err: any) {
        setError(err.message || "An error occurred during processing");
        console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (structure) {
      generateClientSidePDF(structure);
    }
  };

  const handleDownloadPython = () => {
    if (!pythonCode) return;
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generate_form.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateField = (index: number, updatedField: FormField) => {
    if (!structure) return;
    const newFields = [...structure.fields];
    newFields[index] = updatedField;
    const newStructure = { ...structure, fields: newFields };
    setStructure(newStructure);
  };

  const handleDeleteField = (index: number) => {
    if (!structure) return;
    const newFields = structure.fields.filter((_, i) => i !== index);
    setStructure({ ...structure, fields: newFields });
  };

  const handleAddField = () => {
      if (!structure) return;
      const newField: FormField = {
          id: `new_${Date.now()}`,
          label: "New Text Field",
          name: "new_field",
          type: FieldType.TEXT
      };
      setStructure({
          ...structure,
          fields: [...structure.fields, newField]
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Input */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-[500px] lg:h-[calc(100vh-140px)]">
          <InputSection 
            value={activeInputText} 
            onChange={handleActiveInputChange} 
            isProcessing={isAnalyzing}
            onAnalyze={handleAnalyze}
            mode={inputMode}
            onModeChange={setInputMode}
          />
          {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  {error}
              </div>
          )}
        </div>

        {/* Right Panel: Output */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-[500px] lg:h-[calc(100vh-140px)]">
            {/* Tabs & Actions */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="bg-gray-200/50 p-1 rounded-lg flex w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab(Tab.PREVIEW)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none justify-center ${
                            activeTab === Tab.PREVIEW ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button
                        onClick={() => setActiveTab(Tab.CODE)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none justify-center ${
                            activeTab === Tab.CODE ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Code2 className="w-4 h-4" /> Python Code
                    </button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={!structure}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                    <button 
                        onClick={handleDownloadPython}
                        disabled={!pythonCode}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 border border-transparent hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        .py Script
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === Tab.PREVIEW ? (
                    <FormPreview 
                        structure={structure} 
                        onUpdateField={handleUpdateField}
                        onDeleteField={handleDeleteField}
                        onAddField={handleAddField}
                    />
                ) : (
                    <CodePreview code={pythonCode} />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
