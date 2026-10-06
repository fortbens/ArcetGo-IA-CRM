import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Plus,
  Trash2,
  BookOpen,
  Video,
  FileText,
  Award,
  Sparkles,
  HelpCircle,
  Building
} from 'lucide-react';
import { LMSCourse, LMSModule, LMSQuizQuestion } from '../../types/crm';
import { ImageUploadField } from '../common/ImageUploadField';

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCourse: (course: LMSCourse) => void;
  initialCourse?: LMSCourse | null;
}

export const NewCourseModal: React.FC<NewCourseModalProps> = ({
  isOpen,
  onClose,
  onSaveCourse,
  initialCourse
}) => {
  if (!isOpen) return null;

  // Form State
  const [title, setTitle] = useState(initialCourse?.title || '');
  const [category, setCategory] = useState<LMSCourse['category']>(initialCourse?.category || 'VENDAS');
  const [summary, setSummary] = useState(initialCourse?.summary || '');
  const [instructor, setInstructor] = useState(initialCourse?.instructor || 'Equipe Comercial AcertGo');
  const [instructorRole, setInstructorRole] = useState(initialCourse?.instructorRole || 'Gestor de Treinamento Imobiliário');
  const [durationMinutes, setDurationMinutes] = useState(initialCourse?.durationMinutes || 60);
  const [xpPoints, setXpPoints] = useState(initialCourse?.xpPoints || 300);
  const [badgeName, setBadgeName] = useState(initialCourse?.badgeName || 'Especialista em Negócios');
  const [coverImage, setCoverImage] = useState(
    initialCourse?.coverImage ||
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80'
  );

  // Lesson inputs
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState(20);
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [lessonsList, setLessonsList] = useState<Array<{ title: string; duration: number; url: string }>>(
    initialCourse?.modules?.[0]?.lessons?.map(l => ({
      title: l.title,
      duration: l.durationMinutes,
      url: l.videoUrl
    })) || [
      { title: '1. Introdução e Contexto do Treinamento', duration: 15, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { title: '2. Aplicação Prática no Dia a Dia da Imobiliária', duration: 25, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  );

  // Quiz inputs
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOption1, setQuizOption1] = useState('');
  const [quizOption2, setQuizOption2] = useState('');
  const [quizOption3, setQuizOption3] = useState('');
  const [quizOption4, setQuizOption4] = useState('');
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  const [quizList, setQuizList] = useState<LMSQuizQuestion[]>(
    initialCourse?.quiz || [
      {
        id: 'q_default_1',
        question: 'Qual é o principal foco da nossa abordagem com novos clientes?',
        options: [
          'Vender o mais rápido possível sem ouvir necessidades',
          'Compreensão profunda das dores, localização desejada e segurança financeira',
          'Oferecer desconto imediato na comissão',
          'Deixar o cliente sem resposta até ele ligar'
        ],
        correctOptionIndex: 1,
        explanation: 'O método consultivo prioriza o diagnóstico preciso do cliente antes de qualquer apresentação.'
      }
    ]
  );

  const handleAddLesson = () => {
    if (!lessonTitle.trim()) return;
    setLessonsList([
      ...lessonsList,
      { title: lessonTitle.trim(), duration: Number(lessonDuration) || 15, url: lessonVideoUrl }
    ]);
    setLessonTitle('');
  };

  const handleRemoveLesson = (idx: number) => {
    setLessonsList(lessonsList.filter((_, i) => i !== idx));
  };

  const handleAddQuizQuestion = () => {
    if (!quizQuestion.trim() || !quizOption1.trim() || !quizOption2.trim()) {
      alert('Preencha a pergunta e pelo menos duas opções de resposta.');
      return;
    }

    const options = [quizOption1, quizOption2];
    if (quizOption3.trim()) options.push(quizOption3.trim());
    if (quizOption4.trim()) options.push(quizOption4.trim());

    const newQ: LMSQuizQuestion = {
      id: `q_${Date.now()}`,
      question: quizQuestion.trim(),
      options,
      correctOptionIndex: quizCorrectIdx,
      explanation: quizExplanation.trim() || 'Resposta alinhada às melhores práticas do treinamento.'
    };

    setQuizList([...quizList, newQ]);
    setQuizQuestion('');
    setQuizOption1('');
    setQuizOption2('');
    setQuizOption3('');
    setQuizOption4('');
    setQuizExplanation('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const moduleLessons = lessonsList.map((l, idx) => ({
      id: `les_${Date.now()}_${idx}`,
      title: l.title,
      durationMinutes: l.duration,
      videoUrl: l.url,
      description: 'Aula gravada do treinamento interno da imobiliária.',
      isCompleted: false
    }));

    const newCourse: LMSCourse = {
      id: initialCourse?.id || `course_custom_${Date.now()}`,
      title: title.trim(),
      category,
      source: 'IMOBILIARIA_INTERNO', // Marked as internal training created by the agency
      durationMinutes: Number(durationMinutes) || 60,
      lessonsCount: lessonsList.length,
      completedByCount: initialCourse?.completedByCount || 0,
      hasAudioPodcast: true,
      podcastAudioUrl: initialCourse?.podcastAudioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
      summary: summary.trim() || 'Treinamento exclusivo desenvolvido pela liderança da imobiliária.',
      instructor: instructor.trim() || 'Liderança AcertGo',
      instructorRole: instructorRole.trim() || 'Gestor Imobiliário',
      xpPoints: Number(xpPoints) || 300,
      badgeName: badgeName.trim() || 'Especialista em Vendas',
      badgeIcon: '⭐',
      rating: initialCourse?.rating || 5.0,
      level: 'INTERMEDIARIO',
      tags: initialCourse?.tags || ['Treinamento Interno', 'Imobiliária'],
      isEnrolled: initialCourse?.isEnrolled || false,
      progressPercent: initialCourse?.progressPercent || 0,
      certificateIssued: initialCourse?.certificateIssued || false,
      modules: [
        {
          id: `mod_custom_1`,
          title: 'Módulo 1: Conteúdo Programático do Treinamento',
          lessons: moduleLessons
        }
      ],
      quiz: quizList,
      downloadMaterials: [
        { title: `Guia de Estudos - ${title.trim()}.pdf`, type: 'PDF', size: '2.5 MB' }
      ]
    };

    onSaveCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-400/40">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Subir Treinamento da Imobiliária</h3>
              <p className="text-xs text-slate-400">
                Crie um novo curso com vídeos, quiz avaliativo e certificado oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          
          {/* Section 1: Dados Gerais */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                1. Informações do Curso
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                Curso Próprio da Imobiliária
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Título do Treinamento *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Treinamento Especial: Lançamento Torre Horizon"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  <option value="VENDAS">Vendas & Negociação</option>
                  <option value="ALTO_PADRAO">Alto Padrão & Luxo</option>
                  <option value="FINANCIAMENTO">Financiamento Imobiliário</option>
                  <option value="JURIDICO">Jurídico & Contratos</option>
                  <option value="ATENDIMENTO">Atendimento & WhatsApp</option>
                  <option value="MARKETING">Marketing & Captação</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Carga Horária (minutos)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instrutor / Palestrante</label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Nome do Instrutor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cargo do Instrutor</label>
                <input
                  type="text"
                  value={instructorRole}
                  onChange={(e) => setInstructorRole(e.target.value)}
                  placeholder="Ex: Diretor de Vendas"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Resumo / Objetivos</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Descreva o que o corretor irá aprender neste curso..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Image Upload Field */}
            <div className="pt-1">
              <ImageUploadField
                label="Capa do Treinamento"
                value={coverImage}
                onChange={setCoverImage}
                aspect="landscape"
                helperText="Upload da capa do computador/celular ou URL externa"
              />
            </div>
          </div>

          {/* Section 2: Aulas do Treinamento */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              2. Módulos & Vídeo-Aulas ({lessonsList.length} cadastradas)
            </span>

            {/* List of lessons added */}
            <div className="space-y-1.5">
              {lessonsList.map((les, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{les.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-slate-400">{les.duration} min</span>
                    {lessonsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new lesson */}
            <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Título da nova aula..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(Number(e.target.value))}
                    placeholder="Duração (min)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Aula</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Gamificação & Quiz */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              3. Gamificação, XP & Avaliação (Quiz)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pontos XP Concedidos</label>
                <input
                  type="number"
                  value={xpPoints}
                  onChange={(e) => setXpPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-amber-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título da Badge de Conquista</label>
                <input
                  type="text"
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none"
                />
              </div>
            </div>

            {/* Quiz Questions List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-600 block">
                Perguntas Cadastradas no Quiz ({quizList.length}):
              </span>
              {quizList.map((q, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700">
                  <span className="font-bold text-slate-900 block truncate">
                    {idx + 1}. {q.question}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    ✓ Correta: {q.options[q.correctOptionIndex]}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Quiz Question */}
            <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 space-y-2">
              <span className="font-semibold text-slate-700 block">Adicionar Pergunta ao Quiz:</span>
              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="Digite a pergunta..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={quizOption1}
                  onChange={(e) => setQuizOption1(e.target.value)}
                  placeholder="Opção A *"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={quizOption2}
                  onChange={(e) => setQuizOption2(e.target.value)}
                  placeholder="Opção B *"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={quizOption3}
                  onChange={(e) => setQuizOption3(e.target.value)}
                  placeholder="Opção C (opcional)"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={quizOption4}
                  onChange={(e) => setQuizOption4(e.target.value)}
                  placeholder="Opção D (opcional)"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-600">Opção Correta:</span>
                <select
                  value={quizCorrectIdx}
                  onChange={(e) => setQuizCorrectIdx(Number(e.target.value))}
                  className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value={0}>Opção A</option>
                  <option value={1}>Opção B</option>
                  <option value={2}>Opção C</option>
                  <option value={3}>Opção D</option>
                </select>
              </div>

              <input
                type="text"
                value={quizExplanation}
                onChange={(e) => setQuizExplanation(e.target.value)}
                placeholder="Explicação pedagógica da resposta correta..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddQuizQuestion}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Pergunta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>{initialCourse ? 'Salvar Alterações no Treinamento' : 'Publicar Treinamento na Universidade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
