import React from 'react';
import { X, Printer, ArrowLeft } from 'lucide-react';
import { PASSAGES, QUESTIONS } from '../data/readingData';
import { TestResult } from '../types';

interface PrintViewProps {
  isOpen: boolean;
  onClose: () => void;
  result?: TestResult | null;
  userAnswers?: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
}

export const PrintView: React.FC<PrintViewProps> = ({
  isOpen,
  onClose,
  result,
  userAnswers = {},
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col print:shadow-none print:w-full print:max-w-none print:rounded-none">
        {/* Print Bar (Hidden during actual print) */}
        <div className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm">Chế độ Xem & In Đề Thi (30 Câu - Thang 10)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>In ra máy in / Lưu PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 sm:p-12 space-y-8 print:p-6 text-black text-sm">
          {/* Header of Test Paper */}
          <div className="border-b-2 border-black pb-4">
            <div className="flex justify-between items-start text-center sm:text-left">
              <div>
                <p className="font-bold uppercase tracking-wider text-xs">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
                <p className="font-semibold text-xs">TRƯỜNG THCS: ......................................................</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">ĐỀ KHẢO SÁT CHẤT LƯỢNG TIẾNG ANH LỚP 7</p>
                <p className="text-xs italic">Kỹ năng: Đọc hiểu (Reading Comprehension) • 30 câu</p>
                <p className="text-xs">Thời gian làm bài: 60 phút (Thang điểm 10)</p>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <p><strong>Họ và tên:</strong> ....................................................</p>
              <p><strong>Lớp:</strong> 7........... <strong>SBD:</strong> ...................</p>
              <p>
                <strong>Điểm số:</strong> {result ? `${result.scoreOutOf10} / 10 (${result.scoreRating})` : '....... / 10'}
              </p>
            </div>
          </div>

          {/* Passages and Questions */}
          {PASSAGES.map((passage, pIdx) => {
            const passageQuestions = QUESTIONS.filter((q) => q.passageId === passage.id);

            return (
              <div key={passage.id} className="space-y-4 page-break-inside-avoid">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 print:bg-transparent">
                  <h3 className="font-bold text-base text-blue-900 print:text-black">
                    PASSAGE {pIdx + 1}: {passage.title.toUpperCase()}
                  </h3>
                  <p className="text-xs italic text-slate-600 print:text-black mb-2">
                    ({passage.unit} - {passage.topicVi})
                  </p>
                  <div className="text-justify leading-relaxed text-xs space-y-2 whitespace-pre-line">
                    {passage.englishText}
                  </div>
                </div>

                {/* Questions for this passage */}
                <div className="space-y-3 pl-2">
                  <p className="font-bold text-xs italic">
                    Read the passage carefully and choose the correct answer A, B, C, or D for questions {passageQuestions[0]?.questionNumber} to {passageQuestions[passageQuestions.length - 1]?.questionNumber}:
                  </p>

                  {passageQuestions.map((q) => {
                    const userSelected = userAnswers[q.id];
                    return (
                      <div key={q.id} className="space-y-1.5 text-xs">
                        <p className="font-bold">
                          Question {q.questionNumber}: {q.questionText}
                          {userSelected && (
                            <span className="font-normal italic text-slate-500 ml-2">
                              (Em chọn: {userSelected})
                            </span>
                          )}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-4">
                          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                            <p key={opt}>
                              <strong>{opt}.</strong> {q.options[opt]}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Answer Key & Explanations Section */}
          <div className="border-t-2 border-black pt-6 space-y-4 page-break-before-always">
            <div className="text-center">
              <h3 className="font-bold text-base uppercase">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM THANG ĐIỂM 10</h3>
              <p className="text-xs italic">Quy tắc tính điểm: Mỗi câu đúng = 10 / 30 = 0.333 điểm (Làm tròn 2 chữ số thập phân)</p>
            </div>

            {/* Quick Answer Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 text-center text-xs font-bold border border-black p-3 rounded">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="p-1 border border-slate-300">
                  <span className="text-[10px] text-slate-500 block">C{q.questionNumber}</span>
                  <span className="text-blue-700 print:text-black font-extrabold">{q.correctAnswer}</span>
                </div>
              ))}
            </div>

            {/* Detailed Explanation Table */}
            <div className="space-y-3 pt-4">
              <h4 className="font-bold text-xs uppercase">Bảng Giải Thích Chi Tiết & Dẫn Chứng:</h4>
              <div className="space-y-2 text-xs">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="p-2 border-b border-slate-200">
                    <p className="font-bold">
                      Câu {q.questionNumber} - Đáp án {q.correctAnswer}:
                    </p>
                    <p className="text-slate-700 print:text-black">
                      • <strong>Giải thích:</strong> {q.detailedExplanation}
                    </p>
                    <p className="text-slate-600 print:text-black italic">
                      • <strong>Dẫn chứng:</strong> "{q.clueExcerpt}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
