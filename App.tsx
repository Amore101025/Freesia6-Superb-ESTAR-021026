import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { FormPreview } from './components/FormPreview';
import { CodePreview } from './components/CodePreview';
import { DEFAULT_SAMPLE_CONTENT, MOCK_PYTHON_CODE } from './constants';
import { GeminiService } from './services/gemini';
import { generateClientSidePDF } from './services/pdfGenerator';
import { FormStructure, FormField, FieldType } from './types';
import { Download, Play, Code2, Eye } from 'lucide-react';

enum Tab {
  PREVIEW = 'preview',
  CODE = 'code'
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState(DEFAULT_SAMPLE_CONTENT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [structure, setStructure] = useState<FormStructure | null>(null);
  const [pythonCode, setPythonCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PREVIEW);
  const [error, setError] = useState<string | null>(null);

  // Load initial mock state for better UX on first load
  useEffect(() => {
    // We simulate a "pre-analysis" of the default content
    // In a real app we might just start empty or analyze on mount.
    // For this demo, let's keep it empty until user interacts or maybe parse mock immediately.
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // 1. Analyze structure
      const parsedStructure = await GeminiService.parseFormStructure(inputText);
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
    // Note: In a full implementation, we would regenerate Python code here too, 
    // or debouce a request to update it.
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
            value={inputText} 
            onChange={setInputText} 
            isProcessing={isAnalyzing}
            onAnalyze={handleAnalyze}
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
