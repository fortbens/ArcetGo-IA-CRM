import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Users, 
  MessageSquare, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  Gift, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  Phone, 
  Globe, 
  ExternalLink,
  Edit,
  Save,
  Building,
  Camera
} from 'lucide-react';
import { 
  WebsiteConfig, 
  WebsiteTeamMember, 
  WebsiteTestimonial, 
  WebsiteBlogPost, 
  WebsiteCustomPage 
} from '../../types/crm';
import { optimizeImageFile } from '../../utils/imageOptimizer';

interface WebsiteCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WebsiteConfig;
  onSaveConfig: (updatedConfig: WebsiteConfig) => void;
  initialTab?: 'identidade' | 'sobre_video' | 'time' | 'depoimentos' | 'blog' | 'paginas' | 'mapa' | 'banners' | 'hero_banners';
}

export const WebsiteCmsModal: React.FC<WebsiteCmsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  initialTab = 'identidade'
}) => {
  if (!isOpen) return null;

  const [activeCmsTab, setActiveCmsTab] = useState<'identidade' | 'sobre_video' | 'time' | 'depoimentos' | 'blog' | 'paginas' | 'mapa' | 'banners' | 'hero_banners'>(initialTab);
  const [formData, setFormData] = useState<WebsiteConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sub-forms states
  const [newCustomPage, setNewCustomPage] = useState<Partial<WebsiteCustomPage>>({
    title: '',
    slug: '',
    content: '',
    published: true,
    showInFooter: true
  });

  const [newTeamMember, setNewTeamMember] = useState<Partial<WebsiteTeamMember>>({
    name: '',
    role: 'Consultor Imobiliário Especialista',
    creci: '123.456-F / SP',
    phone: '(11) 98888-0000',
    email: 'corretor@imobiliaria.com.br',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    bio: 'Especialista em negociações e atendimento consultivo.',
    specialty: 'Venda & Locação'
  });

  const [newTestimonial, setNewTestimonial] = useState<Partial<WebsiteTestimonial>>({
    clientName: '',
    roleOrProfession: 'Cliente Satisfeito',
    comment: 'Experiência fantástica do início ao fim.',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    propertyTypeOrNeighborhood: 'Apartamento em São Paulo'
  });

  const [newBlogPost, setNewBlogPost] = useState<Partial<WebsiteBlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
    author: 'Equipe Editorial',
    date: 'Hoje',
    category: 'Mercado Imobiliário',
    readTime: '3 min'
  });

  // Hero Banners State
  const [newHeroBanner, setNewHeroBanner] = useState({
    title: '',
    subtitle: '',
    badge: 'Lançamento Exclusivo',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    ctaText: 'Ver Imóveis',
    ctaLink: '#imoveis',
    active: true
  });

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewHeroBanner(prev => ({
            ...prev,
            imageUrl: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHeroBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroBanner.title || !newHeroBanner.imageUrl) return;
    const bannerToAdd = {
      id: `banner_${Date.now()}`,
      ...newHeroBanner
    };
    const currentBanners = formData.heroBanners || [
      {
        id: 'b1',
        badge: 'Lançamentos 2026',
        title: 'Encontre o Imóvel dos Seus Sonhos',
        subtitle: 'Casas e apartamentos com assessoria completa',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
        ctaText: 'Explorar Imóveis',
        ctaLink: '#imoveis',
        active: true
      }
    ];
    setFormData({
      ...formData,
      heroBanners: [...currentBanners, bannerToAdd]
    });
    setNewHeroBanner({
      title: '',
      subtitle: '',
      badge: 'Destaque',
      imageUrl: '',
      ctaText: 'Ver Detalhes',
      ctaLink: '#imoveis',
      active: true
    });
  };

  const handleDeleteHeroBanner = (id: string) => {
    setFormData({
      ...formData,
      heroBanners: (formData.heroBanners || []).filter(b => b.id !== id)
    });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember.name?.trim()) return;
    const member: WebsiteTeamMember = {
      id: `tm_${Date.now()}`,
      name: newTeamMember.name.trim(),
      role: newTeamMember.role || 'Consultor Imobiliário',
      creci: newTeamMember.creci || '123.456-F',
      phone: newTeamMember.phone || '(11) 99999-0000',
      email: newTeamMember.email || 'contato@imob.com',
      photoUrl: newTeamMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      bio: newTeamMember.bio || '',
      specialty: newTeamMember.specialty || 'Geral'
    };
    setFormData(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), member]
    }));
    setNewTeamMember({
      name: '',
      role: 'Consultor Imobiliário Especialista',
      creci: '123.456-F / SP',
      phone: '(11) 98888-0000',
      email: 'corretor@imobiliaria.com.br',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Especialista em negociações e atendimento consultivo.',
      specialty: 'Venda & Locação'
    });
  };

  const handleRemoveTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter(m => m.id !== id)
    }));
  };

  const handleAddTestimonial = () => {
    if (!newTestimonial.clientName?.trim()) return;
    const test: WebsiteTestimonial = {
      id: `dep_${Date.now()}`,
      clientName: newTestimonial.clientName.trim(),
      roleOrProfession: newTestimonial.roleOrProfession || 'Cliente',
      comment: newTestimonial.comment || 'Excelente atendimento.',
      rating: newTestimonial.rating || 5,
      photoUrl: newTestimonial.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      propertyTypeOrNeighborhood: newTestimonial.propertyTypeOrNeighborhood || 'São Paulo'
    };
    setFormData(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), test]
    }));
    setNewTestimonial({
      clientName: '',
      roleOrProfession: 'Cliente Satisfeito',
      comment: 'Experiência fantástica do início ao fim.',
      rating: 5,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      propertyTypeOrNeighborhood: 'Apartamento em São Paulo'
    });
  };

  const handleRemoveTestimonial = (id: string) => {
    setFormData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter(t => t.id !== id)
    }));
  };

  const handleAddBlogPost = () => {
    if (!newBlogPost.title?.trim()) return;
    const post: WebsiteBlogPost = {
      id: `bp_${Date.now()}`,
      title: newBlogPost.title.trim(),
      slug: newBlogPost.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      excerpt: newBlogPost.excerpt || newBlogPost.title,
      content: newBlogPost.content || newBlogPost.excerpt || '',
      coverImage: newBlogPost.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
      author: newBlogPost.author || 'Redação',
      date: new Date().toLocaleDateString('pt-BR'),
      category: newBlogPost.category || 'Mercado',
      readTime: '3 min'
    };
    setFormData(prev => ({
      ...prev,
      blogPosts: [...(prev.blogPosts || []), post]
    }));
    setNewBlogPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
      author: 'Equipe Editorial',
      date: 'Hoje',
      category: 'Mercado Imobiliário',
      readTime: '3 min'
    });
  };

  const handleRemoveBlogPost = (id: string) => {
    setFormData(prev => ({
      ...prev,
      blogPosts: (prev.blogPosts || []).filter(p => p.id !== id)
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 300, quality: 0.85 });
      setFormData(prev => ({
        ...prev,
        logoUrl: optimized
      }));
    } catch (err) {
      console.error('Erro ao otimizar logo do site:', err);
    }
    e.target.value = '';
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 300, quality: 0.85 });
      setFormData(prev => ({
        ...prev,
        footerLogoUrl: optimized
      }));
    } catch (err) {
      console.error('Erro ao otimizar logo de rodapé do site:', err);
    }
    e.target.value = '';
  };

  const handleTeamPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, memberId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 400, maxHeight: 400, quality: 0.82 });
      if (memberId) {
        setFormData(prev => ({
          ...prev,
          teamMembers: (prev.teamMembers || []).map(m => m.id === memberId ? { ...m, photoUrl: optimized } : m)
        }));
      } else {
        setNewTeamMember(prev => ({
          ...prev,
          photoUrl: optimized
        }));
      }
    } catch (err) {
      console.error('Erro ao otimizar foto do corretor:', err);
    }
    e.target.value = '';
  };

  const handleAddCustomPage = () => {
    if (!newCustomPage.title?.trim()) return;
    const slug = newCustomPage.slug?.trim() || newCustomPage.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const page: WebsiteCustomPage = {
      id: `page_${Date.now()}`,
      title: newCustomPage.title.trim(),
      slug,
      content: newCustomPage.content?.trim() || 'Conteúdo explicativo da página institucional...',
      published: newCustomPage.published ?? true,
      showInFooter: newCustomPage.showInFooter ?? true
    };
    setFormData(prev => ({
      ...prev,
      customPages: [...(prev.customPages || []), page]
    }));
    setNewCustomPage({
      title: '',
      slug: '',
      content: '',
      published: true,
      showInFooter: true
    });
  };

  const handleRemoveCustomPage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customPages: (prev.customPages || []).filter(p => p.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* CMS Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">CMS Completo do Site Imobiliário</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Personalização Total
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Altere logo, cores, fontes, WhatsApp, depoimentos, corretores, vídeos, páginas e banners em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Salvo no Site!' : 'Salvar Alterações'}</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CMS Navigation Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveCmsTab('identidade')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'identidade' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Identidade & Logo & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('sobre_video')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'sobre_video' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Quem Somos & Vídeo Institucional</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('time')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'time' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Nosso Time ({formData.teamMembers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('depoimentos')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'depoimentos' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Depoimentos ({formData.testimonials?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('blog')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'blog' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('paginas')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'paginas' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Páginas Personalizadas ({formData.customPages?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('mapa')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'mapa' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Mapa nos Imóveis</span>
          </button>

          <button
            onClick={() => setActiveCmsTab('banners')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCmsTab === 'banners' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Formulário, Área do Cliente & Indique</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">

          {/* 1. IDENTIDADE VISUAL */}
          {activeCmsTab === 'identidade' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Logo da Imobiliária & Tipografia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Logo da Imobiliária (Upload ou URL)</span>
                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                          className="text-[11px] text-rose-600 hover:underline font-bold"
                        >
                          Remover Logo
                        </button>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://.../logo.png ou clique para subir arquivo"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                      />
                      <label className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer text-xs font-bold shadow-xs transition-colors shrink-0 active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {formData.logoUrl && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 inline-flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Prévia do Logo:</span>
                        <img
                          src={formData.logoUrl}
                          alt="Prévia do Logo"
                          className="h-8 max-w-44 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Logo de Rodapé do Site Oficial (Opcional)</span>
                      {formData.footerLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, footerLogoUrl: '' })}
                          className="text-[11px] text-rose-600 hover:underline font-bold"
                        >
                          Remover Logo Rodapé
                        </button>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.footerLogoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, footerLogoUrl: e.target.value })}
                        placeholder="https://.../logo-rodape.png ou envie arquivo otimizado"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                      />
                      <label className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer text-xs font-bold shadow-xs transition-colors shrink-0 active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Upload Rodapé</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFooterLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {formData.footerLogoUrl && (
                      <div className="mt-2 p-2 bg-slate-900 rounded-xl border border-slate-800 inline-flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Prévia no Rodapé Escuro:</span>
                        <img
                          src={formData.footerLogoUrl}
                          alt="Prévia do Logo Rodapé"
                          className="h-8 max-w-44 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tamanho do Logo no Site</label>
                    <select
                      value={formData.logoSize || 'MEDIO'}
                      onChange={(e) => setFormData({ ...formData, logoSize: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden font-semibold"
                    >
                      <option value="PEQUENO">Pequeno (Discreto)</option>
                      <option value="MEDIO">Médio (Padrão)</option>
                      <option value="GRANDE">Grande (Destaque)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fonte Principal (Tipografia)</label>
                    <select
                      value={formData.fontFamily || 'Outfit'}
                      onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-hidden font-semibold"
                    >
                      <option value="Outfit">Outfit (Moderna & Clean)</option>
                      <option value="Inter">Inter (Tecnológica & Minimal)</option>
                      <option value="Poppins">Poppins (Geométrica & Amigável)</option>
                      <option value="Montserrat">Montserrat (Robusta & Elegante)</option>
                      <option value="Playfair Display">Playfair Display (Luxo & Tradicional)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cor Primária (Hexadecimal)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor || '#2563EB'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor || '#2563EB'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cor Secundária (Destaques)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#06B6D4'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor || '#06B6D4'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Flutuante do WhatsApp */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Botão Flutuante do WhatsApp no Site
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800">
                    <input
                      type="checkbox"
                      checked={formData.whatsappButton?.enabled ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        whatsappButton: {
                          ...(formData.whatsappButton || {
                            enabled: true,
                            number: formData.whatsapp,
                            position: 'BOTTOM_RIGHT',
                            welcomeMessage: 'Olá!',
                            showPulse: true,
                            size: 'MEDIO'
                          }),
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>Ativar Botão Flutuante</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Número do WhatsApp com DDD</label>
                    <input
                      type="text"
                      value={formData.whatsappButton?.number || formData.whatsapp || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        whatsappButton: {
                          ...(formData.whatsappButton || {
                            enabled: true,
                            number: '',
                            position: 'BOTTOM_RIGHT',
                            welcomeMessage: '',
                            showPulse: true,
                            size: 'MEDIO'
                          }),
                          number: e.target.value
                        }
                      })}
                      placeholder="(11) 99999-8888"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Posição na Tela</label>
                    <select
                      value={formData.whatsappButton?.position || 'BOTTOM_RIGHT'}
                      onChange={(e) => setFormData({
                        ...formData,
                        whatsappButton: {
                          ...(formData.whatsappButton || {
                            enabled: true,
                            number: formData.whatsapp,
                            position: 'BOTTOM_RIGHT',
                            welcomeMessage: '',
                            showPulse: true,
                            size: 'MEDIO'
                          }),
                          position: e.target.value as any
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
                    >
                      <option value="BOTTOM_RIGHT">Canto Inferior Direito</option>
                      <option value="BOTTOM_LEFT">Canto Inferior Esquerdo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Animação de Pulso</label>
                    <select
                      value={formData.whatsappButton?.showPulse ? 'SIM' : 'NAO'}
                      onChange={(e) => setFormData({
                        ...formData,
                        whatsappButton: {
                          ...(formData.whatsappButton || {
                            enabled: true,
                            number: formData.whatsapp,
                            position: 'BOTTOM_RIGHT',
                            welcomeMessage: '',
                            showPulse: true,
                            size: 'MEDIO'
                          }),
                          showPulse: e.target.value === 'SIM'
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
                    >
                      <option value="SIM">Sim (Chamar atenção do visitante)</option>
                      <option value="NAO">Não (Estático)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Mensagem Inicial Pré-definida</label>
                    <input
                      type="text"
                      value={formData.whatsappButton?.welcomeMessage || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        whatsappButton: {
                          ...(formData.whatsappButton || {
                            enabled: true,
                            number: formData.whatsapp,
                            position: 'BOTTOM_RIGHT',
                            welcomeMessage: '',
                            showPulse: true,
                            size: 'MEDIO'
                          }),
                          welcomeMessage: e.target.value
                        }
                      })}
                      placeholder="Olá! Estava navegando no site e gostaria de falar com um corretor."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. QUEM SOMOS & VÍDEO INSTITUCIONAL */}
          {activeCmsTab === 'sobre_video' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Quem Somos (História & Autoridade)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Título da Seção</label>
                    <input
                      type="text"
                      value={formData.aboutUs?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutUs: { ...(formData.aboutUs || { story: '', mission: '', values: '', yearsInMarket: 10, dealsClosed: 500, satisfactionPercent: 99 }), title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">História & Trajetória</label>
                    <textarea
                      rows={3}
                      value={formData.aboutUs?.story || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutUs: { ...(formData.aboutUs || { title: '', mission: '', values: '', yearsInMarket: 10, dealsClosed: 500, satisfactionPercent: 99 }), story: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Anos de Mercado</label>
                    <input
                      type="number"
                      value={formData.aboutUs?.yearsInMarket || 18}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutUs: { ...(formData.aboutUs || { title: '', story: '', mission: '', values: '', dealsClosed: 500, satisfactionPercent: 99 }), yearsInMarket: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Imóveis Negociados</label>
                    <input
                      type="number"
                      value={formData.aboutUs?.dealsClosed || 3000}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutUs: { ...(formData.aboutUs || { title: '', story: '', mission: '', values: '', yearsInMarket: 10, satisfactionPercent: 99 }), dealsClosed: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Satisfação dos Clientes (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.aboutUs?.satisfactionPercent || 99.4}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutUs: { ...(formData.aboutUs || { title: '', story: '', mission: '', values: '', yearsInMarket: 10, dealsClosed: 500 }), satisfactionPercent: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Vídeo Institucional */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-600" />
                    Link para Vídeo Institucional
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.institutionalVideo?.enabled ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        institutionalVideo: {
                          ...(formData.institutionalVideo || { title: '', subtitle: '', videoUrl: '', thumbnailUrl: '' }),
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Exibir Vídeo no Site</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">URL do Vídeo (YouTube, Vimeo ou MP4)</label>
                    <input
                      type="text"
                      value={formData.institutionalVideo?.videoUrl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        institutionalVideo: {
                          ...(formData.institutionalVideo || { enabled: true, title: '', subtitle: '', thumbnailUrl: '' }),
                          videoUrl: e.target.value
                        }
                      })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Título do Vídeo</label>
                    <input
                      type="text"
                      value={formData.institutionalVideo?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        institutionalVideo: {
                          ...(formData.institutionalVideo || { enabled: true, videoUrl: '', subtitle: '', thumbnailUrl: '' }),
                          title: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duração Estimada</label>
                    <input
                      type="text"
                      value={formData.institutionalVideo?.duration || '2:30 min'}
                      onChange={(e) => setFormData({
                        ...formData,
                        institutionalVideo: {
                          ...(formData.institutionalVideo || { enabled: true, videoUrl: '', title: '', subtitle: '', thumbnailUrl: '' }),
                          duration: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOSSO TIME */}
          {activeCmsTab === 'time' && (
            <div className="space-y-6">
              {/* Add Member Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  + Adicionar Novo Membro da Equipe (Corretor ou Gestor)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      placeholder="Ex: Gabriela Fontana"
                      value={newTeamMember.name || ''}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cargo / Especialidade</label>
                    <input
                      type="text"
                      placeholder="Ex: Corretora Especialista Jardins"
                      value={newTeamMember.role || ''}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Número de CRECI</label>
                    <input
                      type="text"
                      placeholder="Ex: 114.982-F"
                      value={newTeamMember.creci || ''}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, creci: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp de Contato Direto</label>
                    <input
                      type="text"
                      placeholder="(11) 98888-0000"
                      value={newTeamMember.phone || ''}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Foto de Perfil (Upload ou URL)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="https://... ou faça upload"
                        value={newTeamMember.photoUrl || ''}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, photoUrl: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                      />
                      <label className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 border border-blue-200 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleTeamPhotoUpload(e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Corretor</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.teamMembers || []).map(member => (
                  <div key={member.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative group shrink-0">
                        <img src={member.photoUrl} alt={member.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                        <label 
                          title="Alterar foto deste corretor"
                          className="absolute inset-0 bg-slate-950/60 rounded-xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[9px] font-bold"
                        >
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>Trocar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTeamPhotoUpload(e, member.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
                        <p className="text-blue-600 font-medium text-[11px] truncate">{member.role}</p>
                        <p className="text-slate-400 font-mono text-[10px]">CRECI: {member.creci} • Tel: {member.phone}</p>
                        <label className="text-[10px] text-blue-600 hover:underline cursor-pointer font-bold inline-flex items-center gap-1 mt-1">
                          <Camera className="w-3 h-3" /> Alterar Foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTeamPhotoUpload(e, member.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTeamMember(member.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                      title="Excluir membro da equipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DEPOIMENTOS */}
          {activeCmsTab === 'depoimentos' && (
            <div className="space-y-6">
              {/* Add Testimonial Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  + Adicionar Depoimento de Cliente
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Cliente *</label>
                    <input
                      type="text"
                      placeholder="Ex: Dra. Mariana Albuquerque"
                      value={newTestimonial.clientName || ''}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Profissão / Tipo de Negócio</label>
                    <input
                      type="text"
                      placeholder="Ex: Comprador de Cobertura no Morumbi"
                      value={newTestimonial.roleOrProfession || ''}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, roleOrProfession: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Avaliação (1 a 5 estrelas)</label>
                    <select
                      value={newTestimonial.rating || 5}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-amber-600"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Estrelas - Excelente)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Estrelas - Muito Bom)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Texto do Depoimento</label>
                    <input
                      type="text"
                      placeholder="Excelente assessoria na compra e aprovação de financiamento..."
                      value={newTestimonial.comment || ''}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Salvar Depoimento</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Testimonials List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.testimonials || []).map(test => (
                  <div key={test.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={test.photoUrl} alt={test.clientName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        <div>
                          <strong className="text-slate-900 block">{test.clientName}</strong>
                          <span className="text-slate-400 text-[10px] block">{test.roleOrProfession}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTestimonial(test.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 italic">"{test.comment}"</p>
                    <div className="text-amber-500 font-bold text-xs">
                      {'★'.repeat(test.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. BLOG & PÁGINAS */}
          {activeCmsTab === 'blog' && (
            <div className="space-y-6">
              {/* Add Blog Post */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  + Publicar Artigo no Blog do Site
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Título da Matéria *</label>
                    <input
                      type="text"
                      placeholder="Ex: Como Escolher o Imóvel Ideal para Investimento em 2026"
                      value={newBlogPost.title || ''}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      placeholder="Ex: Dicas & Mercado"
                      value={newBlogPost.category || ''}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Resumo Atrativo (Lead)</label>
                    <input
                      type="text"
                      placeholder="Breve descrição que aparece no card do artigo..."
                      value={newBlogPost.excerpt || ''}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddBlogPost}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publicar Artigo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Blog Posts List */}
              <div className="space-y-3">
                {(formData.blogPosts || []).map(post => (
                  <div key={post.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={post.coverImage} alt={post.title} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                      <div className="truncate">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                          {post.category}
                        </span>
                        <h4 className="font-bold text-slate-900 truncate mt-1">{post.title}</h4>
                        <p className="text-slate-500 text-[11px] truncate">{post.excerpt}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBlogPost(post.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. PÁGINAS PERSONALIZADAS (CMS) */}
          {activeCmsTab === 'paginas' && (
            <div className="space-y-6">
              {/* Form to create new custom page */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  + Criar Nova Página Personalizada no Site
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Título da Página *</label>
                    <input
                      type="text"
                      placeholder="Ex: Assessoria Jurídica & Despachante Notarial"
                      value={newCustomPage.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setNewCustomPage({ ...newCustomPage, title, slug });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">URL Amigável (Slug)</label>
                    <div className="flex items-center">
                      <span className="text-slate-400 font-mono text-[11px] mr-1">/pagina/</span>
                      <input
                        type="text"
                        placeholder="assessoria-juridica"
                        value={newCustomPage.slug || ''}
                        onChange={(e) => setNewCustomPage({ ...newCustomPage, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Conteúdo da Página (Texto Completo)</label>
                    <textarea
                      rows={4}
                      placeholder="Digite o texto, diretrizes, benefícios ou detalhes institucionais desta página..."
                      value={newCustomPage.content || ''}
                      onChange={(e) => setNewCustomPage({ ...newCustomPage, content: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-normal leading-relaxed text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-6 sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={newCustomPage.published ?? true}
                        onChange={(e) => setNewCustomPage({ ...newCustomPage, published: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Página Publicada (Ativa)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={newCustomPage.showInFooter ?? true}
                        onChange={(e) => setNewCustomPage({ ...newCustomPage, showInFooter: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Exibir Link no Rodapé do Site</span>
                    </label>
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={handleAddCustomPage}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Salvar Página</span>
                    </button>
                  </div>
                </div>

                {/* Quick Sugestions */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="text-slate-400 font-semibold">Modelos Rápidos:</span>
                  {[
                    { title: 'Trabalhe Conosco (Seja um Corretor)', content: 'Faça parte da imobiliária que mais cresce e oferece a melhor estrutura comercial, treinamentos semanais e comissionamento diferenciado.' },
                    { title: 'Financiamento Habitacional Facilitado', content: 'Correspondente bancário credenciado Caixa, Itaú, Bradesco e Santander com as menores taxas do mercado e aprovação em 24 horas.' },
                    { title: 'Política de Privacidade & Termos de Uso (LGPD)', content: 'Em conformidade com a LGPD (Lei Geral de Proteção de Dados), tratamos com absoluto sigilo todas as informações dos nossos clientes.' },
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const slug = sug.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setNewCustomPage({
                          title: sug.title,
                          slug,
                          content: sug.content,
                          published: true,
                          showInFooter: true
                        });
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors font-medium"
                    >
                      + {sug.title.split(' ')[0]} {sug.title.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Custom Pages */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                  Páginas Institucionais Criadas ({formData.customPages?.length || 0})
                </h4>

                {(!formData.customPages || formData.customPages.length === 0) ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">Nenhuma página personalizada criada ainda.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Crie páginas como "Trabalhe Conosco", "Financiamento" ou "Assessoria Jurídica" no formulário acima.</p>
                  </div>
                ) : (
                  formData.customPages.map(page => (
                    <div
                      key={page.id}
                      className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-slate-900 truncate">{page.title}</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            page.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {page.published ? 'Publicada' : 'Rascunho'}
                          </span>
                          {page.showInFooter && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700">
                              No Rodapé
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs font-mono">
                          /pagina/{page.slug}
                        </p>
                        <p className="text-slate-600 text-xs line-clamp-1">
                          {page.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomPage(page.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                          title="Excluir página"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 7. MAPA NOS IMÓVEIS */}
          {activeCmsTab === 'mapa' && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Configuração do Mapa Interativo no Site
              </h3>
              <p className="text-slate-500">
                Ative a visualização de mapas para os anúncios quando marcado "Exibir no Mapa", permitindo ao cliente explorar a vizinhança.
              </p>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mapConfig?.displayOnMapByDefault ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      mapConfig: {
                        ...(formData.mapConfig || { showPointsOfInterest: true, mapStyle: 'MODERN', defaultZoom: 14 }),
                        displayOnMapByDefault: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <strong className="text-slate-900 block font-bold">Habilitar Seção de Mapa Geral na Página Inicial</strong>
                    <span className="text-slate-500">Exibe os imóveis distribuídos por bairros da cidade</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mapConfig?.showPointsOfInterest ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      mapConfig: {
                        ...(formData.mapConfig || { displayOnMapByDefault: true, mapStyle: 'MODERN', defaultZoom: 14 }),
                        showPointsOfInterest: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <strong className="text-slate-900 block font-bold">Destacar Pontos de Interesse (Metrô, Parques, Shoppings e Escolas)</strong>
                    <span className="text-slate-500">Enriquece a ficha técnica do imóvel com comodidades do entorno</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 7. FORMULÁRIO, ÁREA DO CLIENTE & INDIQUE E GANHE NO SITE */}
          {activeCmsTab === 'banners' && (
            <div className="space-y-6">
              {/* Formulário de Leads */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Formulário de Captura de Leads no Site
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Título da Caixa de Contato</label>
                    <input
                      type="text"
                      value={formData.leadFormConfig?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        leadFormConfig: { ...(formData.leadFormConfig || { enabled: true, subtitle: '', callToActionText: '', requireFinancingInfo: true }), title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Texto do Botão de Envio (CTA)</label>
                    <input
                      type="text"
                      value={formData.leadFormConfig?.callToActionText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        leadFormConfig: { ...(formData.leadFormConfig || { enabled: true, title: '', subtitle: '', requireFinancingInfo: true }), callToActionText: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Banner da Área do Cliente */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Integração com Área do Cliente no Site (Locação)
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-800">
                    <input
                      type="checkbox"
                      checked={formData.customerPortalConfig?.enabled ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        customerPortalConfig: {
                          ...(formData.customerPortalConfig || { title: '', subtitle: '', directAccessUrl: '' }),
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Exibir Acesso no Site</span>
                  </label>
                </div>
                <p className="text-slate-600 text-xs">
                  Permite aos clientes que acessam o site clicar em "Área do Cliente" para emitir 2ª via de boleto, abrir chamados e acompanhar repasses.
                </p>
              </div>

              {/* Banner do Indique e Ganhe no Site */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-600" />
                    Banner do Programa Indique e Ganhe no Site
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-800">
                    <input
                      type="checkbox"
                      checked={formData.referralBannerConfig?.enabled ?? true}
                      onChange={(e) => setFormData({
                        ...formData,
                        referralBannerConfig: {
                          ...(formData.referralBannerConfig || { title: '', rewardDescription: '', ctaText: '' }),
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Exibir Banner "Indique e Ganhe"</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Título do Banner</label>
                    <input
                      type="text"
                      value={formData.referralBannerConfig?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        referralBannerConfig: { ...(formData.referralBannerConfig || { enabled: true, rewardDescription: '', ctaText: '' }), title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Texto do Botão (CTA)</label>
                    <input
                      type="text"
                      value={formData.referralBannerConfig?.ctaText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        referralBannerConfig: { ...(formData.referralBannerConfig || { enabled: true, title: '', rewardDescription: '' }), ctaText: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-amber-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 text-xs">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Salvo!' : 'Salvar Alterações no Site'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
