import React, { useState } from 'react';
import { X, Search, Volume2, BookMarked, Filter } from 'lucide-react';
import { PASSAGES } from '../data/readingData';
import { VocabularyItem } from '../types';

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  if (!isOpen) return null;

  // Flatten all vocabulary with unit metadata
  const allVocabList: (VocabularyItem & { unit: string; passageTitle: string })[] = [];
  PASSAGES.forEach((p) => {
    p.keyGlossary.forEach((v) => {
      allVocabList.push({
        ...v,
        unit: p.unit,
        passageTitle: p.title,
      });
    });
  });

  const filteredVocab = allVocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnit === 'all' || item.unit === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Sổ Tay Từ Vựng Tiếng Anh Lớp 7
              </h3>
              <p className="text-xs text-slate-500">
                Tổng hợp từ vựng trọng tâm từ 6 bài đọc hiểu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm từ vựng hoặc nghĩa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedUnit('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                selectedUnit === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tất cả ({allVocabList.length})
            </button>
            {PASSAGES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedUnit(p.unit)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                  selectedUnit === p.unit
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Đoạn {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Vocab Items Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filteredVocab.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">
              Không tìm thấy từ vựng phù hợp với từ khóa tìm kiếm.
            </p>
          ) : (
            filteredVocab.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all flex items-start justify-between gap-3 group shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      {item.word}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {item.ipa}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      {item.pos}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      • {item.unit}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    {item.meaning}
                  </p>

                  {item.example && (
                    <p className="text-[11px] text-slate-500 italic">
                      "{item.example}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => playPronunciation(item.word)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                  title="Phát âm từ này"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số: {filteredVocab.length} mục từ vựng</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
