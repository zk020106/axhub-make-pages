import React, { useState } from 'react';
import { FileText, MessageSquare, X, ChevronRight } from 'lucide-react';

interface AnnotationProps {
  pageName: string;
  pageDescription: string;
  interactions?: Array<{
    element: string;
    action: string;
    result: string;
  }>;
  states?: Array<{
    name: string;
    description: string;
  }>;
  notes?: string[];
}

export const PrototypeAnnotation: React.FC<AnnotationProps> = ({
  pageName,
  pageDescription,
  interactions = [],
  states = [],
  notes = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'interactions' | 'states'>('info');

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#0052ff] text-white p-3 rounded-full shadow-lg hover:bg-[#003ecc] transition-all z-50 flex items-center gap-2"
        title="查看原型标注"
      >
        <FileText size={20} />
        <span className="text-sm font-medium">PRD</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white border border-[#dee1e6] rounded-xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0a0b0d] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} />
          <span className="text-sm font-semibold">原型标注</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#dee1e6] bg-[#f7f7f7]">
        {[
          { key: 'info', label: '页面说明' },
          { key: 'interactions', label: '交互说明', count: interactions.length },
          { key: 'states', label: '状态说明', count: states.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-[#0052ff] border-b-2 border-[#0052ff]'
                : 'text-[#5b616e] hover:text-[#0a0b0d]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-[#0052ff]/10 text-[#0052ff] rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0a0b0d] mb-2">{pageName}</h3>
              <p className="text-xs text-[#5b616e] leading-relaxed">{pageDescription}</p>
            </div>

            {notes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#0a0b0d] mb-2">补充说明</h4>
                <ul className="space-y-1.5">
                  {notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-[#5b616e]">
                      <span className="text-[#0052ff] mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className="space-y-3">
            {interactions.length === 0 ? (
              <p className="text-xs text-[#a8acb3] text-center py-8">暂无交互说明</p>
            ) : (
              interactions.map((interaction, index) => (
                <div key={index} className="bg-[#f7f7f7] rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#0052ff]" />
                    <span className="text-xs font-semibold text-[#0a0b0d]">{interaction.element}</span>
                  </div>
                  <div className="text-xs text-[#5b616e] space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-[#0052ff] font-medium">操作:</span>
                      <span>{interaction.action}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#05b169] font-medium">结果:</span>
                      <span>{interaction.result}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'states' && (
          <div className="space-y-2.5">
            {states.length === 0 ? (
              <p className="text-xs text-[#a8acb3] text-center py-8">暂无状态说明</p>
            ) : (
              states.map((state, index) => (
                <div key={index} className="border-l-2 border-[#0052ff] pl-3 py-1">
                  <div className="text-xs font-semibold text-[#0a0b0d] mb-1">{state.name}</div>
                  <div className="text-xs text-[#5b616e]">{state.description}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#dee1e6] p-3 bg-[#f7f7f7]">
        <a
          href="http://localhost:51720/prototypes/xinyu-traffic-supervision"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-[#0052ff] hover:text-[#003ecc] transition-colors"
        >
          <span className="font-medium">查看完整 PRD</span>
          <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
};
