import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  BookOpen,
  Award,
  Headphones,
  Download,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  ThumbsUp,
  RotateCcw,
  Volume2,
  Maximize2
} from 'lucide-react';
import { LMSCourse, LMSLesson } from '../../types/crm';

interface CoursePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: LMSCourse;
  onUpdateCourse: (updated: LMSCourse) => void;
  onOpenCertificate: () => void;
  onAwardXp?: (points: number) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  isOpen,
  onClose,
  course,
  onUpdateCourse,
  onOpenCertificate,
  onAwardXp
}) => {
  if (!isOpen) return null;

  // Selected Lesson
  const allLessons = course.modules?.flatMap(m => m.lessons) || [];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    allLessons[0]?.id || 'les_default'
  );
  const activeLesson = allLessons.find(l => l.id === selectedLessonId) || allLessons[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'aulas' | 'quiz' | 'podcast' | 'materiais'>('aulas');

  // Video playback state simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [notesText, setNotesText] = useState('');

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(course.certificateIssued || false);

  // Toggle lesson complete
  const handleToggleLessonComplete = (lessonId: string) => {
    if (!course.modules) return;

    const updatedModules = course.modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(l => (l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l))
    }));

    const total = updatedModules.flatMap(m => m.lessons).length;
    const completed = updatedModules.flatMap(m => m.lessons).filter(l => l.isCompleted).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const updatedCourse: LMSCourse = {
      ...course,
      modules: updatedModules,
      progressPercent: progress,
      isEnrolled: true
    };

    onUpdateCourse(updatedCourse);
  };

  // Submit Quiz
  const handleAnswerOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted && quizPassed) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!course.quiz || course.quiz.length === 0) return;

    let correctCount = 0;
    course.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / course.quiz.length) * 100);
    const passed = scorePercent >= 70;

    setQuizSubmitted(true);
    setQuizPassed(passed);

    if (passed) {
      if (onAwardXp) {
        onAwardXp(course.xpPoints || 250);
      }
      onUpdateCourse({
        ...course,
        certificateIssued: true,
        progressPercent: 100
      });
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(l => l.isCompleted).length;
  const currentProgress = course.progressPercent ?? (totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              🎓
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                {course.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>Instrutor: {course.instructor}</span>
                <span>·</span>
                <span className="text-amber-400 font-bold">+{course.xpPoints} XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentProgress === 100 && (
              <button
                onClick={onOpenCertificate}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Ver Certificado</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div className="w-full bg-slate-800 px-5 py-2 flex items-center justify-between text-xs text-slate-300 gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
              Progresso do Curso:
            </span>
            <span className="font-mono font-bold text-emerald-400">{currentProgress}% concluído</span>
          </div>

          <div className="flex-1 max-w-md bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {completedLessons}/{totalLessons} aulas
          </span>
        </div>

        {/* Main Content: Player (Left) + Learning Tabs (Right) */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Column 1: Video Player & Active Lesson Info */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50 space-y-4">
            
            {/* Video Canvas Simulation */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-slate-800 group">
              <img
                src={course.coverImage}
                alt="Lesson Thumbnail"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Overlay Player Controls */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs font-semibold">
                    {activeLesson?.title || course.title}
                  </span>
                  <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs font-mono font-bold">
                    HD 1080p
                  </span>
                </div>

                {/* Big Center Play/Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center self-center shadow-xl transition-transform active:scale-95 group-hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-1" />
                  )}
                </button>

                {/* Bottom Video Scrubbing Bar */}
                <div className="space-y-1.5 text-white">
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                    <div className={`h-full bg-blue-500 rounded-full ${isPlaying ? 'w-2/3' : 'w-1/4'}`} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span>{isPlaying ? '14:20' : '00:00'} / {activeLesson?.durationMinutes || 25}:00</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : s === 1.5 ? 2 : 1)}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold"
                      >
                        {playbackSpeed}x
                      </button>
                      <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                      <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Title & Completion Action */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeLesson?.title || 'Aula do Treinamento'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {activeLesson?.description || course.summary}
                </p>
              </div>

              {activeLesson && (
                <button
                  onClick={() => handleToggleLessonComplete(activeLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs ${
                    activeLesson.isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeLesson.isCompleted ? 'Aula Concluída ✅' : 'Marcar como Concluída'}</span>
                </button>
              )}
            </div>

            {/* Personal Notes Box for Student */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Bloco de Notas da Aula (Salvo Automaticamente)
                </span>
                <span className="text-[10px] text-slate-400">Insights para fechamentos</span>
              </div>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Anote aqui os argumentos que mais chamaram sua atenção para aplicar nos seus atendimentos..."
                rows={2}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Column 2: Course Sidebar with Tabs (Right) */}
          <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0">
            
            {/* Tab Buttons */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex gap-1">
              <button
                onClick={() => setActiveTab('aulas')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'aulas' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Aulas ({totalLessons})
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'quiz' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Quiz</span>
                {quizPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </button>
              <button
                onClick={() => setActiveTab('podcast')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'podcast' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Podcast
              </button>
              <button
                onClick={() => setActiveTab('materiais')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'materiais' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Material
              </button>
            </div>

            {/* Tab 1: Aulas List */}
            {activeTab === 'aulas' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {course.modules?.map((mod, modIdx) => (
                  <div key={mod.id} className="space-y-1.5">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 block">
                      {mod.title}
                    </span>
                    <div className="space-y-1">
                      {mod.lessons.map((lesson) => {
                        const isSelected = lesson.id === activeLesson?.id;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold shadow-2xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLessonComplete(lesson.id);
                                }}
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                  lesson.isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : 'border-2 border-slate-300 hover:border-emerald-500 text-transparent'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {lesson.durationMinutes}m
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Quiz & Avaliação */}
            {activeTab === 'quiz' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Avaliação Pedagógica Final</span>
                  </div>
                  <p className="text-[11px] text-indigo-800 mt-1">
                    Nota mínima de aprovação: <strong>70%</strong>. A aprovação desbloqueia o <strong>Certificado Oficial</strong> e concede <strong>+{course.xpPoints} XP</strong>.
                  </p>
                </div>

                {/* Questions */}
                <div className="space-y-4 text-xs">
                  {course.quiz?.map((q, qIdx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = isAnswered && selectedOpt === q.correctOptionIndex;

                    return (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                        <span className="font-bold text-slate-900 block leading-tight">
                          {qIdx + 1}. {q.question}
                        </span>

                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            let style = 'bg-white border-slate-200 text-slate-700 hover:border-blue-300';

                            if (quizSubmitted) {
                              if (optIdx === q.correctOptionIndex) {
                                style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                              } else if (isChosen && !isCorrect) {
                                style = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                              }
                            } else if (isChosen) {
                              style = 'bg-blue-50 border-blue-500 text-blue-950 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleAnswerOption(q.id, optIdx)}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 ${style}`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-2 rounded-lg text-[11px] leading-relaxed ${
                            isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                          }`}>
                            <strong>{isCorrect ? '✓ Resposta Correta!' : '✗ Resposta Incorreta.'}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Button */}
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < (course.quiz?.length || 1)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
                  >
                    Finalizar Avaliação e Calcular Nota
                  </button>
                ) : (
                  <div className="space-y-2">
                    {quizPassed ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2">
                        <span className="text-sm font-black text-emerald-900 block">
                          APROVADO COM SUCESSO!
                        </span>
                        <p className="text-xs text-emerald-800">
                          Você atingiu os requisitos pedagógicos do curso. Seu certificado já está disponível!
                        </p>
                        <button
                          onClick={onOpenCertificate}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all"
                        >
                          Emitir Meu Certificado Oficial
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-center space-y-2">
                        <span className="text-sm font-bold text-rose-900 block">
                          Nota abaixo de 70%
                        </span>
                        <p className="text-xs text-rose-800">
                          Revise as aulas do treinamento e tente novamente para conquistar o certificado.
                        </p>
                        <button
                          onClick={handleRetakeQuiz}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tentar Novamente</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Podcast em Áudio */}
            {activeTab === 'podcast' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                    <Headphones className="w-4 h-4" />
                    <span>Áudio-Treinamento (Podcast)</span>
                  </div>
                  <h4 className="font-bold text-sm leading-tight">
                    Ouça no trânsito ou durante visitas
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Versão resumida e comentada em áudio para fixação rápida dos conceitos de negociação e fechamento.
                  </p>
                  
                  <div className="pt-2">
                    <audio controls className="w-full h-9 rounded-lg">
                      <source src={course.podcastAudioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'} type="audio/mpeg" />
                      Seu navegador não suporta áudio.
                    </audio>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Materiais Complementares (Downloads) */}
            {activeTab === 'materiais' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Arquivos e Modelos para Download
                </span>

                {course.downloadMaterials && course.downloadMaterials.length > 0 ? (
                  course.downloadMaterials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">{mat.title}</span>
                          <span className="text-[10px] text-slate-400">{mat.type} · {mat.size}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Iniciando download do arquivo: ${mat.title}`)}
                        className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shrink-0 transition-colors"
                        title="Baixar Arquivo"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Nenhum material complementar cadastrado.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
