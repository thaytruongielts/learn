import React, { useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb, Sparkles, BookOpen } from 'lucide-react';
import { Question, TestMode } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isFlagged: boolean;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  onToggleFlag: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  mode: TestMode;
  isSubmitted: boolean;
  onAskAi: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  mode,
  isSubmitted,
  onAskAi,
}) => {
  const [showInstantCheck, setShowInstantCheck] = useState(false);

  const optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const isPracticeFeedbackVisible = (mode === 'practice' && showInstantCheck) || isSubmitted;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
      {/* Top bar of question card */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-slate-900">
            Câu hỏi {question.questionNumber}/30
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-md font-bold">
            {question.questionType === 'main_idea' && 'Ý chính'}
            {question.questionType === 'detail' && 'Chi tiết'}
            {question.questionType === 'vocabulary' && 'Từ vựng'}
            {question.questionType === 'reference' && 'Đại từ'}
            {question.questionType === 'inference' && 'Suy luận'}
            {question.questionType === 'cloze' && 'Điền từ'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFlag}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isFlagged
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Đánh dấu câu này để xem lại sau"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isFlagged ? 'Đã lưu' : 'Đánh dấu'}</span>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <p className="text-base sm:text-lg font-medium text-slate-800 mb-6 leading-relaxed">
        {question.questionText}
      </p>

      {/* Options List */}
      <div className="space-y-3 flex-1">
        {optionKeys.map((key) => {
          const optionText = question.options[key];
          const isSelected = selectedOption === key;
          const isCorrect = question.correctAnswer === key;

          let buttonStyle = 'border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 bg-white text-slate-800';
          let badgeStyle = 'border-2 border-slate-300 text-slate-700 bg-white';
          let textStyle = 'text-slate-800 font-normal';

          if (isPracticeFeedbackVisible) {
            if (isCorrect) {
              buttonStyle = 'border-2 border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
              textStyle = 'text-emerald-950 font-semibold';
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-2 border-rose-500 bg-rose-50/80 text-rose-950';
              badgeStyle = 'bg-rose-600 text-white border-rose-600 shadow-xs';
              textStyle = 'text-rose-950 font-medium';
            } else {
              buttonStyle = 'opacity-60 border border-slate-200 bg-slate-50 text-slate-500';
              badgeStyle = 'border-2 border-slate-200 text-slate-400 bg-slate-50';
              textStyle = 'text-slate-500';
            }
          } else if (isSelected) {
            buttonStyle = 'border-2 border-blue-500 bg-blue-50 text-blue-900';
            badgeStyle = 'bg-blue-600 text-white border-blue-600 shadow-xs';
            textStyle = 'font-medium text-blue-900';
          }

          return (
            <button
              key={key}
              type="button"
              disabled={isSubmitted}
              onClick={() => {
                onSelectOption(key);
                if (mode === 'practice') {
                  setShowInstantCheck(false);
                }
              }}
              className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${buttonStyle}`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${badgeStyle}`}
                >
                  {key}
                </span>
                <span className={`text-sm sm:text-base leading-snug ${textStyle}`}>{optionText}</span>
              </div>

              {isPracticeFeedbackVisible && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isPracticeFeedbackVisible && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Practice Mode: Instant Check Button */}
      {mode === 'practice' && !isSubmitted && (
        <div className="pt-4 mt-2">
          {!showInstantCheck ? (
            <button
              onClick={() => setShowInstantCheck(true)}
              disabled={!selectedOption}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Kiểm tra đáp án câu này ngay</span>
            </button>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đáp án đúng: <span className="text-emerald-700 font-extrabold text-sm">{question.correctAnswer}</span>
                </span>
                <button
                  onClick={() => onAskAi(question)}
                  className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hỏi Gia sư AI</span>
                </button>
              </div>

              <p className="text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Giải thích: </span>
                {question.detailedExplanation}
              </p>

              <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-amber-900 italic">
                <span className="font-semibold not-italic">Dẫn chứng từ bài: </span>"{question.clueExcerpt}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Explanation (when submitted) */}
      {isSubmitted && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">
              Đáp án chính xác: <span className="text-emerald-600 font-black">{question.correctAnswer}</span>
            </span>
            <button
              onClick={() => onAskAi(question)}
              className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline bg-white px-2 py-1 rounded-md border border-slate-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Gia sư AI giải thích thêm</span>
            </button>
          </div>

          <p className="text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Giải thích chi tiết: </strong>
            {question.detailedExplanation}
          </p>

          <div className="p-2.5 bg-white rounded-lg border-l-4 border-amber-500 text-slate-800 text-xs">
            <span className="font-semibold text-amber-800">Dẫn chứng đoạn văn: </span>
            <span className="italic">"{question.clueExcerpt}"</span>
          </div>

          {question.grammarPoint && (
            <div className="p-2 bg-blue-50 rounded-lg text-blue-900 border border-blue-100">
              <strong>Điểm ngữ pháp lớp 7: </strong> {question.grammarPoint}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons (Prev / Next) */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Phím tắt A, B, C, D • F (Đánh dấu)
        </span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
        >
          <span>Tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
