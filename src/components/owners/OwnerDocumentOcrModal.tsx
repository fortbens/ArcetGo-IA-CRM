import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Scan, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  FlipHorizontal,
  Maximize2,
  FileCheck2,
  SlidersHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import { 
  ExtractedDocumentData, 
  extractOwnerDataFromDocument 
} from '../../services/documentOcrService';
import { MaritalStatus } from '../../types/crm';

interface OwnerDocumentOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExtractedData: (data: ExtractedDocumentData) => void;
}

export const OwnerDocumentOcrModal: React.FC<OwnerDocumentOcrModalProps> = ({
  isOpen,
  onClose,
  onApplyExtractedData
}) => {
  // Capture Mode: CAMERA vs UPLOAD
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'UPLOAD'>('CAMERA');
  
  // Document Type Hint
  const [docTypeHint, setDocTypeHint] = useState<string>('CNH');
  
  // Camera State
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Captured Image & Processing State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);

  // Editable fields in review state
  const [editName, setEditName] = useState('');
  const [editDocument, setEditDocument] = useState('');
  const [editRg, setEditRg] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editMaritalStatus, setEditMaritalStatus] = useState<MaritalStatus>('SOLTEIRO');
  const [editProfession, setEditProfession] = useState('');
  const [editCep, setEditCep] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editNeighborhood, setEditNeighborhood] = useState('');
  const [editCity, setEditCity] = useState('São Paulo');
  const [editState, setEditState] = useState('SP');

  // Start video stream when in CAMERA tab
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Câmera não suportada neste navegador ou ambiente iFrame.');
      setActiveTab('UPLOAD');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Erro ao acessar a câmera:', err);
      let msg = 'Não foi possível acessar a câmera. Verifique as permissões do dispositivo.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Permissão de acesso à câmera negada. Você pode utilizar a aba de Upload de Arquivo.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'Nenhuma câmera detectada neste dispositivo. Utilize o upload de imagem.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Manage camera on modal open/close or tab change
  useEffect(() => {
    if (isOpen && activeTab === 'CAMERA' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, cameraFacing, capturedImage]);

  // Handle capture snapshot from live video
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      stopCamera();
      runOcrExtraction(dataUrl);
    }
  };

  // Switch between front/back camera
  const handleToggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCapturedImage(dataUrl);
        runOcrExtraction(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run OCR processing via service
  const runOcrExtraction = async (imageDataUrl: string) => {
    setIsScanning(true);
    setExtractedData(null);

    try {
      const result = await extractOwnerDataFromDocument(imageDataUrl, docTypeHint);
      setExtractedData(result);

      // Populate editable fields
      setEditName(result.name || '');
      setEditDocument(result.document || '');
      setEditRg(result.rg || '');
      setEditBirthDate(result.birthDate || '');
      setEditMaritalStatus(result.maritalStatus || 'SOLTEIRO');
      setEditProfession(result.profession || '');

      if (result.address) {
        setEditCep(result.address.cep || '');
        setEditStreet(result.address.street || '');
        setEditNumber(result.address.number || '');
        setEditNeighborhood(result.address.neighborhood || '');
        setEditCity(result.address.city || 'São Paulo');
        setEditState(result.address.state || 'SP');
      }
    } catch (err) {
      console.error('Falha ao processar OCR do documento:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Quick Sample Document Test
  const handleLoadSample = (sampleType: 'CNH' | 'RG' | 'COMPROVANTE_RESIDENCIA') => {
    setDocTypeHint(sampleType);
    // Create high-res canvas simulation badge
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = sampleType === 'CNH' ? '#14532d' : sampleType === 'RG' ? '#1e3a8a' : '#334155';
      ctx.fillRect(0, 0, 800, 500);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(
        sampleType === 'CNH'
          ? 'REPÚBLICA FEDERATIVA DO BRASIL - CNH'
          : sampleType === 'RG'
          ? 'REGISTRO GERAL - SSP/SP'
          : 'COMPROVANTE DE CONSUMO RESIDENCIAL',
        40,
        70
      );
      ctx.font = '20px sans-serif';
      ctx.fillText('DOCUMENTO OFICIAL PARA CADASTRO IMOBILIÁRIO', 40, 110);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(40, 140, 720, 310);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('NOME: CARLOS EDUARDO MENDONÇA', 60, 190);
      ctx.fillText('CPF: 123.456.789-00', 60, 230);
      ctx.fillText('RG: 28.192.483-2 SSP/SP', 60, 270);
      ctx.fillText('NASCIMENTO: 14/11/1979', 60, 310);
      ctx.fillText('FILIAÇÃO: MARLENE ALVES MENDONÇA', 60, 350);
      ctx.fillText('ENDEREÇO: RUA OSCAR FREIRE, 1420 - JARDINS - SP', 60, 390);

      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      runOcrExtraction(dataUrl);
    }
  };

  // Retake photo / start over
  const handleResetCapture = () => {
    setCapturedImage(null);
    setExtractedData(null);
    if (activeTab === 'CAMERA') {
      startCamera();
    }
  };

  // Confirm and apply data to OwnerModal
  const handleConfirmAndApply = () => {
    if (!extractedData && !editName) return;

    const payload: ExtractedDocumentData = {
      documentType: (extractedData?.documentType || docTypeHint) as any,
      name: editName.trim() || extractedData?.name,
      document: editDocument.trim() || extractedData?.document,
      rg: editRg.trim() || extractedData?.rg,
      birthDate: editBirthDate || extractedData?.birthDate,
      maritalStatus: editMaritalStatus,
      profession: editProfession.trim() || extractedData?.profession,
      address: {
        cep: editCep.trim() || extractedData?.address?.cep || '',
        street: editStreet.trim() || extractedData?.address?.street || '',
        number: editNumber.trim() || extractedData?.address?.number || '',
        neighborhood: editNeighborhood.trim() || extractedData?.address?.neighborhood || '',
        city: editCity.trim() || extractedData?.address?.city || 'São Paulo',
        state: editState.trim() || extractedData?.address?.state || 'SP',
      },
      confidenceScore: extractedData?.confidenceScore || 95,
      extractedAt: new Date().toISOString(),
    };

    onApplyExtractedData(payload);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md font-bold">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Leitor de Documentos (OCR Inteligente)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  IA Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Capture CNH, RG ou Comprovante de Residência para preenchimento automático do proprietário
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shutter Flash Animation Effect */}
        {shutterFlash && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200 pointer-events-none" />
        )}

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* Step 1: When no image is captured yet */}
          {!capturedImage ? (
            <div className="space-y-4">
              
              {/* Capture Mode Tabs & Document Type Hint */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('CAMERA');
                      setCameraError(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'CAMERA'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capturar com Câmera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setActiveTab('UPLOAD');
                    }}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'UPLOAD'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload de Imagem</span>
                  </button>
                </div>

                {/* Document Type Hint Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Tipo de Documento:</span>
                  <select
                    value={docTypeHint}
                    onChange={(e) => setDocTypeHint(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="CNH">CNH (Habilitação)</option>
                    <option value="RG">RG (Identidade)</option>
                    <option value="CPF">Cartão CPF</option>
                    <option value="COMPROVANTE_RESIDENCIA">Comprovante de Residência</option>
                    <option value="PJ_CONTRATO_SOCIAL">Contrato Social / Cartão CNPJ</option>
                  </select>
                </div>
              </div>

              {/* CAMERA VIEWPORT */}
              {activeTab === 'CAMERA' && (
                <div className="space-y-3">
                  {cameraError ? (
                    <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                      <h4 className="font-bold text-rose-900 text-sm">Acesso à Câmera Indisponível</h4>
                      <p className="text-xs text-rose-700 max-w-md mx-auto">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('UPLOAD')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer transition-colors"
                      >
                        Alternar para Upload de Foto / Arquivo
                      </button>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-[380px] flex items-center justify-center border-2 border-slate-800 shadow-inner">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {/* Document Viewfinder Overlay (Moldura de Enquadramento) */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                        <div className="w-[85%] h-[75%] border-2 border-dashed border-white/70 rounded-2xl relative shadow-2xl flex flex-col justify-between p-3 bg-black/10 backdrop-blur-[0.5px]">
                          {/* Corner Guides */}
                          <div className="w-6 h-6 border-t-4 border-l-4 border-blue-400 absolute -top-1 -left-1 rounded-tl-lg" />
                          <div className="w-6 h-6 border-t-4 border-r-4 border-blue-400 absolute -top-1 -right-1 rounded-tr-lg" />
                          <div className="w-6 h-6 border-b-4 border-l-4 border-blue-400 absolute -bottom-1 -left-1 rounded-bl-lg" />
                          <div className="w-6 h-6 border-b-4 border-r-4 border-blue-400 absolute -bottom-1 -right-1 rounded-br-lg" />

                          <div className="text-center bg-black/60 text-white px-3 py-1 rounded-full text-[11px] font-bold self-center shadow-md">
                            Posicione a frente da {docTypeHint} dentro da moldura
                          </div>

                          <div className="text-center text-white/80 text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-md self-center">
                            Evite reflexos e mantenha os dados legíveis
                          </div>
                        </div>
                      </div>

                      {/* Controls over camera */}
                      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-20">
                        <button
                          type="button"
                          onClick={handleToggleCameraFacing}
                          className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-95 border border-white/20"
                          title="Alternar entre câmera frontal e traseira"
                        >
                          <FlipHorizontal className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={handleCaptureSnapshot}
                          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-2xl cursor-pointer active:scale-90 transition-all border-2 border-white"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Tirar Foto do Documento</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* UPLOAD VIEWPORT */}
              {activeTab === 'UPLOAD' && (
                <div className="space-y-4">
                  <div className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-3xl bg-slate-50 hover:bg-blue-50/30 text-center transition-colors relative">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="space-y-3 pointer-events-none">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-slate-800 block">
                          Clique ou arraste a imagem do documento aqui
                        </strong>
                        <span className="text-xs text-slate-500">
                          Formatos aceitos: JPEG, PNG, WEBP, PDF (até 10MB)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Test with Sample Documents */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                      Ambiente de Testes Rápidos (1 Clique):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSample('CNH')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Simular Leitura CNH Digital</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadSample('RG')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Simular Leitura RG Oficial</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadSample('COMPROVANTE_RESIDENCIA')}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-purple-600" />
                        <span>Simular Comprovante de Residência</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Step 2: Image is captured, OCR in progress or review ready */
            <div className="space-y-5">
              
              {/* Top Banner Status */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  {isScanning ? (
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {isScanning ? 'Processando Leitura e Extração de Campos com IA...' : 'Dados Extraídos com Sucesso!'}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {isScanning ? 'Identificando CPF, Nome, RG e datas...' : 'Confira os campos abaixo antes de preencher o formulário'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetCapture}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Capturar Outra Foto</span>
                </button>
              </div>

              {/* Grid: Photo on left, Extracted fields on right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Photo Thumbnail */}
                <div className="md:col-span-5 space-y-2">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Imagem do Documento Capturado:
                  </span>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 relative max-h-[300px] flex items-center justify-center">
                    <img
                      src={capturedImage}
                      alt="Documento Capturado"
                      className="w-full h-auto object-contain max-h-[300px]"
                    />
                    {isScanning && (
                      <div className="absolute inset-0 bg-blue-950/60 flex flex-col items-center justify-center text-white space-y-2">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-400 border-t-transparent animate-spin" />
                        <span className="font-bold text-xs tracking-wider">LENDO DOCUMENTO...</span>
                      </div>
                    )}
                  </div>
                  {extractedData && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center justify-between">
                      <span className="font-bold">Confiança do Reconhecimento:</span>
                      <span className="font-black font-mono text-emerald-700">
                        {extractedData.confidenceScore}% • {extractedData.documentType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Extracted Form Inputs */}
                <div className="md:col-span-7 space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Campos Reconhecidos (Prontos para Aplicação)
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Edição Permitida</span>
                  </div>

                  {isScanning ? (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                      <p className="font-bold text-xs text-slate-700">Extraindo informações estruturadas...</p>
                      <p className="text-[11px] text-slate-400">Validando dígitos verificadores de CPF e datas</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nome Completo do Titular:</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                          placeholder="Nome Completo"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">CPF / CNPJ:</label>
                          <input
                            type="text"
                            value={editDocument}
                            onChange={(e) => setEditDocument(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                            placeholder="000.000.000-00"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">RG / Órgão Emissor:</label>
                          <input
                            type="text"
                            value={editRg}
                            onChange={(e) => setEditRg(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                            placeholder="00.000.000-0 SSP/SP"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Data de Nascimento:</label>
                          <input
                            type="date"
                            value={editBirthDate}
                            onChange={(e) => setEditBirthDate(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Estado Civil:</label>
                          <select
                            value={editMaritalStatus}
                            onChange={(e) => setEditMaritalStatus(e.target.value as MaritalStatus)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="SOLTEIRO">Solteiro(a)</option>
                            <option value="CASADO">Casado(a)</option>
                            <option value="DIVORCIADO">Divorciado(a)</option>
                            <option value="VIUVO">Viúvo(a)</option>
                            <option value="UNIAO_ESTAVEL">União Estável</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Profissão:</label>
                          <input
                            type="text"
                            value={editProfession}
                            onChange={(e) => setEditProfession(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                            placeholder="Profissão"
                          />
                        </div>
                      </div>

                      {/* Address Fields if recognized */}
                      {(editStreet || editCep) && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <span className="font-bold text-slate-800 text-[11px] block">
                            Endereço Reconhecido no Documento:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                            <div className="sm:col-span-1">
                              <label className="block text-[10px] font-bold text-slate-500">CEP:</label>
                              <input
                                type="text"
                                value={editCep}
                                onChange={(e) => setEditCep(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-500">Logradouro / Rua:</label>
                              <input
                                type="text"
                                value={editStreet}
                                onChange={(e) => setEditStreet(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {capturedImage && extractedData && (
            <button
              type="button"
              onClick={handleConfirmAndApply}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Preencher Formulário Automaticamente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
