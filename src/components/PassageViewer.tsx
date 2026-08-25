import React, { useState } from 'react';
import { ZoomIn, ZoomOut, BookOpen } from 'lucide-react';
import { Passage, VocabularyItem } from '../types';

interface PassageViewerProps {
  passage: Passage;
  highlightedClue?: string | null;
  onSelectGlossaryWord?: (word: VocabularyItem) => void;
}

export const PassageViewer: React.FC<PassageViewerProps> = ({
  passage,
  highlightedClue,
  onSelectGlossaryWord,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [activeWordPopup, setActiveWordPopup] = useState<VocabularyItem | null>(null);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xlarge':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  // Helper to render paragraph with clickable glossary keywords and clue highlights
  const renderParagraph = (text: string, pIndex: number) => {
    const isClueInThisParagraph = highlightedClue && text.includes(highlightedClue);

    return (
      <div key={pIndex} className="relative mb-4 group">
        <p
          className={`${getFontSizeClass()} text-slate-800 transition-all ${
            isClueInThisParagraph
              ? 'bg-amber-100/80 p-3 rounded-lg border-l-4 border-amber-500 font-medium'
              : ''
          }`}
        >
          {text}
        </p>
      </div>
    );
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Top Banner with Unit badge and Font Size controls */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Đoạn văn đọc hiểu
          </span>
          <span className="text-slate-300 font-bold">•</span>
          <span className="text-xs font-semibold text-slate-600">
            {passage.unit}
          </span>
        </div>

        {/* Font Size controls */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <button
            onClick={() => setFontSize(fontSize === 'xlarge' ? 'large' : fontSize === 'large' ? 'normal' : 'normal')}
            disabled={fontSize === 'normal'}
            className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            title="Thu nhỏ cỡ chữ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 text-xs font-semibold text-slate-700 select-none border-x border-slate-100">
            {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
          </span>
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'xlarge')}
            disabled={fontSize === 'xlarge'}
            className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            title="Phóng to cỡ chữ"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Passage Title */}
      <div className="px-8 pt-6 pb-2">
        <h2 className="text-xl font-bold text-slate-900">
          {passage.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Chủ đề: {passage.topicVi}
        </p>
      </div>

      {/* Main Text Content */}
      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg focus:outline-none">
        {passage.paragraphs.map((p, idx) => renderParagraph(p, idx))}
      </div>

      {/* Key Glossary Tags at Bottom of Passage */}
      <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Từ vựng trọng tâm trong đoạn:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {passage.keyGlossary.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveWordPopup(activeWordPopup?.word === item.word ? null : item);
                if (onSelectGlossaryWord) onSelectGlossaryWord(item);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <span className="font-semibold">{item.word}</span>
              <span className="text-[10px] text-slate-400">({item.pos})</span>
            </button>
          ))}
        </div>

        {/* Word Info Quick Card */}
        {activeWordPopup && (
          <div className="mt-3 p-3 bg-white border border-blue-200 rounded-xl text-xs flex items-start justify-between gap-2 shadow-xs transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-700 text-sm">{activeWordPopup.word}</span>
                <span className="font-mono text-slate-600">{activeWordPopup.ipa}</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {activeWordPopup.pos}
                </span>
              </div>
              <p className="font-semibold text-slate-800 mt-1">
                Nghĩa: {activeWordPopup.meaning}
              </p>
              {activeWordPopup.example && (
                <p className="text-slate-600 italic mt-0.5">
                  Ví dụ: "{activeWordPopup.example}"
                </p>
              )}
            </div>
            <button
              onClick={() => setActiveWordPopup(null)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
