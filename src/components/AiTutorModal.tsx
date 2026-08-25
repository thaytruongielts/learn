import React, { useState } from 'react';
import { X, Sparkles, Send, BookOpen, Lightbulb, RefreshCw, MessageSquare } from 'lucide-react';
import { Question, Passage } from '../types';
import { askAiTutor } from '../services/geminiService';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  passage?: Passage | null;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  question,
  passage,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !question) return null;

  const handleAsk = async (promptText: string) => {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const reply = await askAiTutor(promptText, {
        questionText: question.questionText,
        passage: passage?.englishText,
        correctAnswer: `${question.correctAnswer}. ${question.options[question.correctAnswer]}`,
      });
      setAiResponse(reply);
    } catch (err) {
      setAiResponse('Có lỗi kết nối. Hãy thử lại sau giây lát!');
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Giải thích tại sao đáp án đúng là ' + question.correctAnswer + ' theo cách dễ hiểu nhất cho học sinh lớp 7?',
    'Chỉ ra các bẫy thường gặp và vì sao các đáp án khác lại sai?',
    'Cho em 2 câu ví dụ mới có chứa các từ vựng xuất hiện trong câu này kèm dịch nghĩa?',
    'Cho em 1 câu hỏi tương tự để em tự kiểm tra xem đã hiểu bài chưa?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Gia Sư AI Tiếng Anh Lớp 7
              </h3>
              <p className="text-xs text-slate-500">
                Giải thích cặn kẽ câu {question.questionNumber} ({question.passageTitle})
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

        {/* Question Context Card */}
        <div className="p-4 mx-6 mt-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[11px]">Câu hỏi #{question.questionNumber}:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
              Đáp án đúng: {question.correctAnswer}
            </span>
          </div>
          <p className="font-semibold text-slate-800 text-sm">
            {question.questionText}
          </p>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Quick Prompt Suggestions */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Gợi ý câu hỏi nhanh:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={isLoading}
                  className="p-3 text-left text-xs rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-slate-700 transition-colors flex items-start gap-2 group cursor-pointer shadow-2xs"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Area */}
          {isLoading && (
            <div className="p-6 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Gia sư AI đang phân tích bài đọc và soạn lời giải thích chi tiết cho em...
              </p>
            </div>
          )}

          {aiResponse && !isLoading && (
            <div className="p-5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs sm:text-sm text-slate-800 space-y-3 leading-relaxed">
              <div className="flex items-center gap-2 text-blue-700 font-bold border-b border-blue-200 pb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Lời giải thích từ Gia sư AI:</span>
              </div>
              <div className="whitespace-pre-wrap font-normal text-slate-700">
                {aiResponse}
              </div>
            </div>
          )}
        </div>

        {/* Custom Question Input */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Em muốn hỏi thêm điều gì về câu này?..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customPrompt.trim()) {
                handleAsk(customPrompt);
                setCustomPrompt('');
              }
            }}
            className="flex-1 px-4 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              if (customPrompt.trim()) {
                handleAsk(customPrompt);
                setCustomPrompt('');
              }
            }}
            disabled={!customPrompt.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors shrink-0 shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
