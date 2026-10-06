import React, { useState } from 'react';
import { 
  GraduationCap, 
  Play, 
  Pause, 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle2, 
  Headphones, 
  Sparkles, 
  Award, 
  Plus, 
  Building, 
  Filter, 
  Search, 
  Trophy, 
  Flame, 
  Star, 
  Check, 
  ChevronRight, 
  ShieldCheck,
  Edit3,
  Trash2,
  Medal,
  Crown,
  Share2,
  Download,
  Printer
} from 'lucide-react';
import { LMSCourse, LMSLeaderboardStudent } from '../../types/crm';
import { 
  INITIAL_EXTENDED_LMS_COURSES, 
  INITIAL_LMS_LEADERBOARD, 
  INITIAL_STUDENT_BADGES 
} from '../../data/mockAcademyData';
import { CoursePlayerModal } from './CoursePlayerModal';
import { CourseCertificateModal } from './CourseCertificateModal';
import { NewCourseModal } from './NewCourseModal';

export const CorporateAcademyView: React.FC = () => {
  const [courses, setCourses] = useState<LMSCourse[]>(INITIAL_EXTENDED_LMS_COURSES);
  const [leaderboard, setLeaderboard] = useState<LMSLeaderboardStudent[]>(INITIAL_LMS_LEADERBOARD);
  
  // Navigation View: 'cursos' | 'ranking' | 'certificados'
  const [viewMode, setViewMode] = useState<'cursos' | 'ranking' | 'certificados'>('cursos');

  // Filters for Cursos
  const [sourceFilter, setSourceFilter] = useState<'TODOS' | 'PLATAFORMA_ACERTGO' | 'IMOBILIARIA_INTERNO'>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Podcast state
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);

  // Modals
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState<LMSCourse | null>(null);
  const [selectedCourseForCertificate, setSelectedCourseForCertificate] = useState<LMSCourse | null>(null);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<LMSCourse | null>(null);

  // Student Gamification State
  const [studentXp, setStudentXp] = useState(1850);
  const studentLevelTitle = 'Nível 5 · Master Closer';
  const nextLevelXp = 2500;
  const xpProgressPercent = Math.min(100, Math.round((studentXp / nextLevelXp) * 100));

  const togglePodcast = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingPodcastId(prev => prev === id ? null : id);
  };

  const handleUpdateCourse = (updatedCourse: LMSCourse) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    if (selectedCourseForPlayer?.id === updatedCourse.id) {
      setSelectedCourseForPlayer(updatedCourse);
    }
  };

  const handleSaveCourse = (savedCourse: LMSCourse) => {
    const exists = courses.some(c => c.id === savedCourse.id);
    if (exists) {
      setCourses(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
    } else {
      setCourses(prev => [savedCourse, ...prev]);
      setSourceFilter('IMOBILIARIA_INTERNO');
    }
    setCourseToEdit(null);
    setShowNewCourseModal(false);
  };

  const handleDeleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja remover este treinamento interno da imobiliária?')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
    }
  };

  const handleAwardXp = (points: number) => {
    setStudentXp(prev => {
      const newXp = prev + points;
      // Also update student ranking in leaderboard
      setLeaderboard(lb => lb.map(st => st.id === 'u_lead_1' ? { ...st, totalXp: newXp } : st));
      return newXp;
    });
  };

  // Filter logic
  const filteredCourses = courses.filter(course => {
    const matchesSource = 
      sourceFilter === 'TODOS' || course.source === sourceFilter;
    const matchesCategory = 
      categoryFilter === 'TODAS' || course.category === categoryFilter;
    const matchesSearch = 
      !searchQuery.trim() || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSource && matchesCategory && matchesSearch;
  });

  const totalAcertGoCourses = courses.filter(c => c.source === 'PLATAFORMA_ACERTGO').length;
  const totalInternalCourses = courses.filter(c => c.source === 'IMOBILIARIA_INTERNO').length;
  const completedCourses = courses.filter(c => c.progressPercent === 100 || c.certificateIssued);

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 select-none">
      
      {/* Top Banner / Corporate University Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Universidade Corporativa AcertGo</span>
              <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0">
                Gamificada
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight font-heading break-words">
              Plataforma EAD & Treinamentos da Imobiliária 🎓
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Capacitação contínua com cursos oficiais da plataforma e treinamentos exclusivos da própria imobiliária. 
              Aulas em vídeo, podcasts em áudio, simulados com quiz pedagógico e certificados com autenticidade digital.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-slate-300">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                ⭐ {totalAcertGoCourses} Cursos da Plataforma
              </span>
              <span className="bg-indigo-950/80 border border-indigo-600/60 text-indigo-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span>{totalInternalCourses} Treinamentos da Imobiliária</span>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Certificados Oficiais</span>
              </span>
            </div>
          </div>

          {/* Action Button: Subir Treinamento da Imobiliária */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => {
                setCourseToEdit(null);
                setShowNewCourseModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Subir Novo Treinamento da Imobiliária</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gamification Bar for the Student / Broker */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
            🏆
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm">Meu Aprendizado (Gamificado)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                {studentLevelTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Conclua aulas e acerte ≥ 70% nos quizzes para subir de nível e emitir certificados.
            </p>
          </div>
        </div>

        {/* XP and Badges Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Progress bar towards next level */}
          <div className="min-w-[130px] sm:min-w-[160px] p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span>Progresso Nível 6</span>
              <span className="font-mono text-amber-600">{xpProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${xpProgressPercent}%` }} 
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[85px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pontos XP</span>
            <span className="text-base font-black text-amber-600 font-mono tabular-nums">{studentXp} XP</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[85px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Certificados</span>
            <span className="text-base font-black text-emerald-600 font-mono tabular-nums">
              {completedCourses.length}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1 shrink-0">
              <span>Closer Luxo</span>
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold border border-blue-200 flex items-center gap-1 shrink-0">
              <span>Expert Crédito</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector Tabs: Cursos | Ranking | Certificados */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setViewMode('cursos')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            viewMode === 'cursos'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">Grade de Cursos ({courses.length})</span>
        </button>

        <button
          onClick={() => setViewMode('ranking')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            viewMode === 'ranking'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="truncate">Ranking da Equipe (Gamificado)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 shrink-0">
            Top 5
          </span>
        </button>

        <button
          onClick={() => setViewMode('certificados')}
          className={`shrink-0 sm:flex-1 py-2 sm:py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 ${
            viewMode === 'certificados'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">Meus Certificados ({completedCourses.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW MODE 1: CATÁLOGO DE CURSOS COM FILTROS */}
      {/* ======================================================== */}
      {viewMode === 'cursos' && (
        <div className="space-y-5">
          {/* Origin Filter Tabs: Todos | Oficiais AcertGo | Da Imobiliária */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSourceFilter('TODOS')}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                sourceFilter === 'TODOS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Todos ({courses.length})</span>
            </button>

            <button
              onClick={() => setSourceFilter('PLATAFORMA_ACERTGO')}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                sourceFilter === 'PLATAFORMA_ACERTGO'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Oficiais Plataforma AcertGo ({totalAcertGoCourses})</span>
            </button>

            <button
              onClick={() => setSourceFilter('IMOBILIARIA_INTERNO')}
              className={`shrink-0 sm:flex-1 py-2 sm:py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                sourceFilter === 'IMOBILIARIA_INTERNO'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Da Própria Imobiliária ({totalInternalCourses})</span>
            </button>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Categories Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'TODAS', label: 'Todas as Áreas' },
                { id: 'ALTO_PADRAO', label: 'Alto Padrão' },
                { id: 'VENDAS', label: 'Vendas' },
                { id: 'FINANCIAMENTO', label: 'Financiamento' },
                { id: 'JURIDICO', label: 'Jurídico' },
                { id: 'ATENDIMENTO', label: 'WhatsApp / Atendimento' },
                { id: 'MARKETING', label: 'Marketing' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border shrink-0 ${
                    categoryFilter === cat.id
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative min-w-[200px] sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar curso, instrutor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const isPlaying = playingPodcastId === course.id;
              const isCompleted = course.progressPercent === 100 || course.certificateIssued;
              const isInternal = course.source === 'IMOBILIARIA_INTERNO';

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseForPlayer(course)}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Cover Image + Source Badge */}
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />

                      {/* Top Badges: Origin and XP */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                        {isInternal ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs flex items-center gap-1 truncate max-w-[170px]">
                            <Building className="w-3 h-3 shrink-0" />
                            <span className="truncate">Da Imobiliária</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs flex items-center gap-1 truncate max-w-[170px]">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span className="truncate">Oficial AcertGo</span>
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-xs shrink-0 tabular-nums">
                          +{course.xpPoints} XP
                        </span>
                      </div>

                      {/* Bottom Category Pill */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border border-white/20">
                          {course.category.replace('_', ' ')}
                        </span>
                        {course.rating && (
                          <span className="bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-white/20 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{course.rating}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar if started */}
                    {course.progressPercent !== undefined && course.progressPercent > 0 && (
                      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    )}

                    {/* Details Container */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors break-words">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed break-words">
                        {course.summary}
                      </p>

                      <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Instrutor:</span>
                        <span className="truncate">{course.instructor}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {course.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {course.lessonsCount} aulas
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {course.completedByCount} formados
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Left Actions: Podcast and/or Edit/Delete for Internal Courses */}
                    <div className="flex items-center gap-1.5">
                      {course.hasAudioPodcast && (
                        <button
                          type="button"
                          onClick={(e) => togglePodcast(course.id, e)}
                          className={`px-2 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isPlaying
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                          }`}
                          title="Ouvir versão em áudio podcast"
                        >
                          <Headphones className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{isPlaying ? 'Pausar' : 'Podcast'}</span>
                        </button>
                      )}

                      {isInternal && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCourseToEdit(course);
                              setShowNewCourseModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar Treinamento da Imobiliária"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteCourse(course.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir Treinamento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Primary Action Button */}
                    {isCompleted ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourseForCertificate(course);
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 rounded-xl text-xs font-black shadow-2xs transition-all flex items-center gap-1 whitespace-nowrap"
                      >
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>Certificado</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedCourseForPlayer(course)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>{course.progressPercent && course.progressPercent > 0 ? 'Continuar' : 'Iniciar'}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 2: RANKING DA EQUIPE (LEADERBOARD GAMIFICADO) */}
      {/* ======================================================== */}
      {viewMode === 'ranking' && (
        <div className="space-y-6">
          {/* Top Podium: Top 3 Corretores Mais Capacitados */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Quadro de Honra & Ranking dos Corretores</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pontuação acumulada por cursos concluídos, notas nos quizzes e engajamento na capacitação corporativa
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
                Atualizado em Tempo Real
              </span>
            </div>

            {/* Podium Visual for Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 2nd Place */}
              {leaderboard[1] && (
                <div className="order-2 md:order-1 bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-center flex flex-col items-center justify-between space-y-3">
                  <div className="relative">
                    <img 
                      src={leaderboard[1].avatar} 
                      alt={leaderboard[1].name} 
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-300"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      2º
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{leaderboard[1].name}</h4>
                    <span className="text-[11px] text-slate-500 block">{leaderboard[1].role}</span>
                    <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{leaderboard[1].levelTitle}</span>
                  </div>

                  <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-full">
                    <span className="text-base font-black text-slate-800 font-mono tabular-nums">{leaderboard[1].totalXp} XP</span>
                    <span className="text-[10px] text-slate-400 block">{leaderboard[1].completedCoursesCount} cursos finalizados</span>
                  </div>
                </div>
              )}

              {/* 1st Place (Champion) */}
              {leaderboard[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 via-white to-amber-50/40 rounded-2xl p-5 border-2 border-amber-400 text-center flex flex-col items-center justify-between space-y-3 shadow-sm relative">
                  <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Líder da Imobiliária</span>
                  </div>

                  <div className="relative mt-2">
                    <img 
                      src={leaderboard[0].avatar} 
                      alt={leaderboard[0].name} 
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                      1º
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-base">{leaderboard[0].name}</h4>
                    <span className="text-xs text-slate-600 block">{leaderboard[0].role}</span>
                    <span className="text-xs font-black text-amber-700 block mt-0.5">{leaderboard[0].levelTitle}</span>
                  </div>

                  <div className="bg-amber-100/60 px-4 py-2 rounded-xl border border-amber-300 w-full">
                    <span className="text-lg font-black text-amber-900 font-mono tabular-nums">{leaderboard[0].totalXp} XP</span>
                    <span className="text-[10px] text-amber-800 font-semibold block">{leaderboard[0].completedCoursesCount} cursos · {leaderboard[0].badgesCount} badges</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <div className="order-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-center flex flex-col items-center justify-between space-y-3">
                  <div className="relative">
                    <img 
                      src={leaderboard[2].avatar} 
                      alt={leaderboard[2].name} 
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-600"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      3º
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{leaderboard[2].name}</h4>
                    <span className="text-[11px] text-slate-500 block">{leaderboard[2].role}</span>
                    <span className="text-[10px] font-bold text-teal-600 block mt-0.5">{leaderboard[2].levelTitle}</span>
                  </div>

                  <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-full">
                    <span className="text-base font-black text-slate-800 font-mono tabular-nums">{leaderboard[2].totalXp} XP</span>
                    <span className="text-[10px] text-slate-400 block">{leaderboard[2].completedCoursesCount} cursos finalizados</span>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Table of Brokers */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-700 min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 text-center">Posição</th>
                    <th className="py-3 px-4">Corretor / Aluno</th>
                    <th className="py-3 px-4">Nível de Maestria</th>
                    <th className="py-3 px-4 text-center">Cursos Concluídos</th>
                    <th className="py-3 px-4 text-center">Badges</th>
                    <th className="py-3 px-4 text-right">Pontuação Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((student) => (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        student.rank === 1 ? 'bg-amber-50/20 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${
                          student.rank === 1 ? 'bg-amber-400 text-slate-950' : student.rank === 2 ? 'bg-slate-300 text-slate-800' : student.rank === 3 ? 'bg-amber-600 text-white' : 'text-slate-500'
                        }`}>
                          {student.rank}º
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">{student.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{student.role}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {student.levelTitle}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {student.completedCoursesCount}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {student.badgesCount} badges
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-black text-amber-600 font-mono tabular-nums text-sm">
                        {student.totalXp} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 3: MEUS CERTIFICADOS & CONQUISTAS */}
      {/* ======================================================== */}
      {viewMode === 'certificados' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Meus Certificados Oficiais Emitidos</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Certificados válidos emitidos com hash de autenticidade, carga horária e assinatura digital
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                {completedCourses.length} Certificados Disponíveis
              </span>
            </div>

            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/30 via-white to-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Aprovado em Avaliação</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {c.durationMinutes} min
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug break-words">
                        {c.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {c.summary}
                      </p>

                      <div className="text-[11px] text-slate-600 pt-1">
                        Instrutor: <strong>{c.instructor}</strong> ({c.instructorRole})
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-700 flex items-center gap-1">
                        <span>{c.badgeIcon || '👑'}</span>
                        <span>{c.badgeName || 'Profissional Certificado'}</span>
                      </span>

                      <button
                        onClick={() => setSelectedCourseForCertificate(c)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Visualizar / Imprimir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">Nenhum certificado emitido ainda</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Acesse qualquer curso na aba "Grade de Cursos", complete todas as aulas e obtenha pelo menos 70% de acerto no quiz para liberar seu certificado.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Interactive EAD Course Player */}
      {selectedCourseForPlayer && (
        <CoursePlayerModal
          isOpen={!!selectedCourseForPlayer}
          onClose={() => setSelectedCourseForPlayer(null)}
          course={selectedCourseForPlayer}
          onUpdateCourse={handleUpdateCourse}
          onOpenCertificate={() => {
            setSelectedCourseForCertificate(selectedCourseForPlayer);
          }}
          onAwardXp={handleAwardXp}
        />
      )}

      {/* Modal: Official Certificate */}
      {selectedCourseForCertificate && (
        <CourseCertificateModal
          isOpen={!!selectedCourseForCertificate}
          onClose={() => setSelectedCourseForCertificate(null)}
          course={selectedCourseForCertificate}
        />
      )}

      {/* Modal: Subir / Editar Treinamento da Imobiliária */}
      {showNewCourseModal && (
        <NewCourseModal
          isOpen={showNewCourseModal}
          onClose={() => {
            setShowNewCourseModal(false);
            setCourseToEdit(null);
          }}
          onSaveCourse={handleSaveCourse}
          initialCourse={courseToEdit}
        />
      )}
    </div>
  );
};
