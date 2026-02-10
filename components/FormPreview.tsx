import React from 'react';
import { FormStructure, FieldType, FormField } from '../types';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface FormPreviewProps {
  structure: FormStructure | null;
  onUpdateField: (index: number, field: FormField) => void;
  onDeleteField: (index: number) => void;
  onAddField: () => void;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ structure, onUpdateField, onDeleteField, onAddField }) => {
  if (!structure) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div>
          <p className="mb-2 font-medium">No Form Generated Yet</p>
          <p className="text-sm">Paste your form content on the left and click "Generate".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Live Preview</h2>
        <button 
            onClick={onAddField}
            className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-2 py-1 rounded flex items-center gap-1"
        >
            <Plus className="w-3 h-3" /> Field
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-2xl mx-auto bg-white shadow-lg border border-gray-100 rounded-lg min-h-[500px] p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8 border-b pb-4">
            {structure.title}
          </h1>

          <div className="space-y-6">
            {structure.fields.map((field, idx) => (
              <div key={field.id + idx} className="group relative p-3 -mx-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                {/* Field Edit Controls */}
                <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                  <button 
                    onClick={() => onDeleteField(idx)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded" title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 flex justify-between items-end">
                        <span className="cursor-text focus-within:border-b border-gray-300">
                           {field.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-normal border px-1 rounded">
                           {field.type}
                        </span>
                    </label>

                    {field.type === FieldType.TEXT || field.type === FieldType.DATE ? (
                        <input
                            type={field.type === FieldType.DATE ? "date" : "text"}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                            placeholder={`Enter ${field.label}...`}
                            defaultValue={String(field.value || "")}
                        />
                    ) : field.type === FieldType.DROPDOWN ? (
                        <select
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
                        >
                            <option>Select option...</option>
                            {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                disabled
                                checked={field.value === true}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-500 italic">Checkbox is interactive in PDF</span>
                        </div>
                    )}
                </div>
              </div>
            ))}
            
            {structure.fields.length === 0 && (
                <div className="text-center text-gray-400 italic py-10">
                    No fields detected.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
