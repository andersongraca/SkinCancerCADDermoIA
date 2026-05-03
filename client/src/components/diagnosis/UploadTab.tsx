/**
 * Componente de Aba de Upload
 * 
 * Implementa a interface para upload de imagens dermatoscópicas,
 * validação de formato e tamanho, e exibição de prévia.
 * Gerencia o estado do upload e inicia o processo de classificação.
 * Inclui validação inteligente para detectar se a imagem é uma lesão de pele.
 */

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Upload as UploadIcon, X, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

/**
 * Interface para as props do componente UploadTab
 */
interface UploadTabProps {
  /** Callback quando uma imagem é selecionada */
  onImageSelected: (file: File) => void;
  /** Callback quando a classificação é iniciada */
  onClassificationStart: () => void;
  /** Callback quando a classificação é concluída */
  onClassificationComplete: () => void;
  /** Callback quando ocorre um erro */
  onClassificationError: (error: string) => void;
  /** Indica se está processando */
  isProcessing: boolean;
  /** Mensagem de status */
  statusMessage: string;
  /** Progresso da operação (0-100) */
  progress: number;
  /** Arquivo de imagem selecionado */
  selectedImage: File | null;
  /** Prévia da imagem em base64 */
  imagePreview: string | null;
  /** Callback para limpar a imagem selecionada */
  onClearImage: () => void;
}

/**
 * Componente que implementa a aba de upload
 * Fornece interface para seleção de imagens e validação inteligente
 */
export default function UploadTab({
  onImageSelected,
  onClassificationStart,
  onClassificationComplete,
  onClassificationError,
  isProcessing,
  statusMessage,
  progress,
  selectedImage,
  imagePreview,
  onClearImage,
}: UploadTabProps) {
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isValidatingSkin, setIsValidatingSkin] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Configuração de validação de imagens
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

  /**
   * Valida se a imagem contém uma lesão de pele usando MobileNet
   * 
   * @param imageElement - Elemento de imagem HTML para análise
   * @returns Promise com booleano indicando se é uma lesão provável
   */
  const detectSkinLesion = async (imageElement: HTMLImageElement): Promise<boolean> => {
    try {
      // Carrega o modelo MobileNet
      const model = await mobilenet.load();
      
      // Realiza a classificação
      const predictions = await model.classify(imageElement);
      
      console.log('Predições da imagem:', predictions);

      // Lista de categorias comuns que NÃO são pele
      const nonSkinCategories = [
        'dog', 'cat', 'car', 'building', 'food', 'furniture', 'electronic', 
        'animal', 'vehicle', 'landscape', 'text', 'document', 'tool', 'instrument'
      ];

      const topPrediction = predictions[0];
      const isNonSkin = nonSkinCategories.some(cat => 
        topPrediction.className.toLowerCase().includes(cat)
      );

      // Se o modelo identificar objetos comuns com alta confiança, rejeitamos.
      if (isNonSkin && topPrediction.probability > 0.4) {
        return false;
      }

      // Se for algo ambíguo ou relacionado a termos biológicos, aceitamos para análise detalhada
      return true;
    } catch (error) {
      console.error('Erro na detecção de pele:', error);
      return true; // Em caso de erro no modelo, permitimos prosseguir para não bloquear o usuário
    }
  };

  /**
   * Valida um arquivo de imagem
   * Verifica formato, tamanho e extensão
   * 
   * @param file - Arquivo a ser validado
   * @returns Objeto com resultado da validação e mensagem de erro
   */
  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Valida o tipo MIME
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `Formato não suportado. Formatos aceitos: JPEG, PNG`,
      };
    }

    // Valida a extensão do arquivo
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      return {
        isValid: false,
        error: `Extensão não permitida. Extensões aceitas: ${ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }

    // Valida o tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      return {
        isValid: false,
        error: `Arquivo muito grande. Tamanho máximo permitido: ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  };

  /**
   * Manipulador para quando um arquivo é selecionado
   * Valida o arquivo e chama o callback se válido
   * 
   * @param event - Evento do input de arquivo
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    
    // 1. Validação básica de arquivo
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Erro ao validar arquivo');
      return;
    }

    // 2. Validação inteligente (Pele vs Não-Pele)
    setIsValidatingSkin(true);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const isSkin = await detectSkinLesion(img);
      URL.revokeObjectURL(imageUrl);

      if (!isSkin) {
        setValidationError("A imagem carregada não parece ser uma lesão de pele. Por favor, carregue uma nova imagem contendo uma lesão dermatológica para análise.");
        setIsValidatingSkin(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setIsValidatingSkin(false);
      onImageSelected(file);
    } catch (error) {
      console.error("Erro na validação inteligente:", error);
      setIsValidatingSkin(false);
      onImageSelected(file); // Prossegue mesmo com erro na validação inteligente
    }
  };

  /**
   * Manipulador para o clique no botão de upload
   * Abre o diálogo de seleção de arquivo
   */
  const handleUploadClick = () => {
    if (isProcessing || isValidatingSkin) return;
    fileInputRef.current?.click();
  };

  /**
   * Manipulador para iniciar a classificação
   */
  const handleClassify = async () => {
    if (!selectedImage) {
      onClassificationError('Nenhuma imagem selecionada');
      return;
    }

    onClassificationStart();

    try {
      // Simula o processamento da imagem
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClassificationComplete();
    } catch (error) {
      onClassificationError(
        error instanceof Error ? error.message : 'Erro ao classificar imagem'
      );
    }
  };

  /**
   * Manipulador para drag and drop de arquivos
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Manipulador para drop de arquivos
   */
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isProcessing || isValidatingSkin) return;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setValidationError(null);
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Erro ao validar arquivo');
      return;
    }

    setIsValidatingSkin(true);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const isSkin = await detectSkinLesion(img);
      URL.revokeObjectURL(imageUrl);

      if (!isSkin) {
        setValidationError("A imagem carregada não parece ser uma lesão de pele. Por favor, carregue uma nova imagem contendo uma lesão dermatológica para análise.");
        setIsValidatingSkin(false);
        return;
      }

      setIsValidatingSkin(false);
      onImageSelected(file);
    } catch (error) {
      setIsValidatingSkin(false);
      onImageSelected(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerta de Erro de Validação */}
      {validationError && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Imagem Inválida</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {/* Card de Upload de Imagem */}
      <Card className={`border-2 border-dashed transition-all ${isValidatingSkin ? 'opacity-50 pointer-events-none' : ''}`}>
        <CardHeader>
          <CardTitle>Upload de Imagem Dermatoscópica</CardTitle>
          <CardDescription>
            Selecione uma imagem em formato JPEG ou PNG (máximo 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Área de Drag and Drop */}
          {!imagePreview && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-50/50"
              onClick={handleUploadClick}
            >
              {isValidatingSkin ? (
                <div className="flex flex-col items-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                  <p className="text-lg font-medium text-slate-900 mb-2">
                    Analisando imagem...
                  </p>
                  <p className="text-sm text-slate-500">
                    Verificando se a imagem contém uma lesão de pele
                  </p>
                </div>
              ) : (
                <>
                  <UploadIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium text-slate-900 mb-2">
                    Arraste uma imagem aqui ou clique para selecionar
                  </p>
                  <p className="text-sm text-slate-500">
                    Formatos suportados: JPEG, PNG | Tamanho máximo: 10MB
                  </p>
                </>
              )}
            </div>
          )}

          {/* Input de Arquivo Oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FORMATS.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Prévia da Imagem Selecionada */}
          {imagePreview && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="relative border rounded-lg overflow-hidden bg-slate-50 shadow-inner">
                <img
                  src={imagePreview}
                  alt="Prévia da imagem"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-md"
                  onClick={onClearImage}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Informações do Arquivo */}
              {selectedImage && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome do Arquivo</p>
                    <p className="text-sm text-slate-700 truncate font-medium">{selectedImage.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tamanho</p>
                    <p className="text-sm text-slate-700 font-medium">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <Button
                  onClick={handleClassify}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  size="lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    'Iniciar Análise de Câncer'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Indicador de Progresso de Classificação */}
      {isProcessing && (
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="font-medium text-blue-900">{statusMessage}</p>
                </div>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-blue-100" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas de Status do Servidor */}
      {statusMessage && statusMessage.startsWith('Erro:') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      {statusMessage && statusMessage.includes('sucesso') && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{statusMessage}</AlertDescription>
        </Alert>
      )}

      {/* Dicas de Captura */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            Dicas para Melhor Resultado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-slate-600">
          <p>• Use imagens de alta qualidade capturadas com dermatoscópio.</p>
          <p>• Certifique-se de que a lesão está bem iluminada e centralizada.</p>
          <p>• Evite sombras, reflexos ou pelos excessivos na área da lesão.</p>
          <p>• Mantenha a imagem em foco; imagens borradas serão rejeitadas pelo sistema.</p>
        </CardContent>
      </Card>
    </div>
  );
}
