import React from 'react';
import { Copy, Terminal } from 'lucide-react';

interface CodePreviewProps {
  code: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center bg-gray-900 rounded-xl">
        <p>Generate the form to view the Python code agent.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1e1e1e] rounded-xl shadow-sm overflow-hidden flex flex-col text-gray-300">
      <div className="bg-[#252526] px-4 py-3 flex justify-between items-center border-b border-[#333]">
        <h2 className="font-semibold text-gray-200 flex items-center gap-2 text-sm">
          <Terminal className="w-4 h-4 text-green-400" />
          agent_script.py
        </h2>
        <button
          onClick={handleCopy}
          className="text-xs hover:bg-[#333] px-2 py-1 rounded text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-6">
        <pre>
          <code className="language-python">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
