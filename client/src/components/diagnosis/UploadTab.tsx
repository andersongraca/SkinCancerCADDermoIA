/**
 * Componente de Aba de Upload
 * 
 * Implementa a interface para upload de imagens dermatoscópicas,
 * validação de formato e tamanho, e exibição de prévia.
 * Gerencia o estado do upload e inicia o processo de classificação.
 */

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Upload as UploadIcon, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
 * Fornece interface para seleção de imagens e validação
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

  // Configuração de validação de imagens
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

  /**
   * Valida um arquivo de imagem
   * Verifica formato, tamanho e extensão
   * 
   * @param file - Arquivo a ser validado
   * @returns Objeto com resultado da validação e mensagem de erro
   */
  const validateImage = (file: File): { isValid: boolean; error?: string } => {
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Valida o arquivo
    const validation = validateImage(file);
    if (!validation.isValid) {
      onClassificationError(validation.error || 'Erro ao validar arquivo');
      return;
    }

    // Chama o callback com o arquivo validado
    onImageSelected(file);
  };

  /**
   * Manipulador para o clique no botão de upload
   * Abre o diálogo de seleção de arquivo
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Manipulador para iniciar a classificação
   * Simula o envio da imagem para o servidor
   */
  const handleClassify = async () => {
    if (!selectedImage) {
      onClassificationError('Nenhuma imagem selecionada');
      return;
    }

    onClassificationStart();

    try {
      // Simula o processamento da imagem
      // Em produção, isso faria uma requisição para o servidor
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
   * Permite arrastar e soltar imagens na área de upload
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Manipulador para drop de arquivos
   * Processa o arquivo solto
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    // Valida o arquivo
    const validation = validateImage(file);
    if (!validation.isValid) {
      onClassificationError(validation.error || 'Erro ao validar arquivo');
      return;
    }

    // Chama o callback com o arquivo validado
    onImageSelected(file);
  };

  return (
    <div className="space-y-6">
      {/* Card de Upload de Imagem */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle>Upload de Imagem Dermatoscópica</CardTitle>
          <CardDescription>
            Selecione uma imagem em formato JPEG ou PNG (máximo 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Área de Drag and Drop */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer"
            onClick={handleUploadClick}
          >
            <UploadIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-lg font-medium text-slate-900 mb-2">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-sm text-slate-500">
              Formatos suportados: JPEG, PNG | Tamanho máximo: 10MB
            </p>
          </div>

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
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-slate-50">
                <img
                  src={imagePreview}
                  alt="Prévia da imagem"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              {/* Informações do Arquivo */}
              {selectedImage && (
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Nome:</span>{' '}
                    <span className="text-slate-600">{selectedImage.name}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Tamanho:</span>{' '}
                    <span className="text-slate-600">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Tipo:</span>{' '}
                    <span className="text-slate-600">{selectedImage.type}</span>
                  </p>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <Button
                  onClick={handleClassify}
                  disabled={isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? 'Processando...' : 'Classificar Imagem'}
                </Button>
                <Button
                  onClick={onClearImage}
                  disabled={isProcessing}
                  variant="outline"
                  size="lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Botão de Upload (quando nenhuma imagem está selecionada) */}
          {!imagePreview && (
            <Button
              onClick={handleUploadClick}
              disabled={isProcessing}
              className="w-full"
              size="lg"
              variant="default"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Selecionar Imagem
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Indicador de Progresso */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <UploadIcon className="w-4 h-4 text-blue-500" />
                </div>
                <p className="font-medium text-slate-900">{statusMessage}</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerta de Erro */}
      {statusMessage && statusMessage.startsWith('Erro:') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      {/* Alerta de Sucesso */}
      {statusMessage && statusMessage.includes('sucesso') && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{statusMessage}</AlertDescription>
        </Alert>
      )}

      {/* Informações Úteis */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base text-blue-900">Dicas para Melhor Resultado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>• Use imagens de alta qualidade capturadas com dermatoscópio</p>
          <p>• Certifique-se de que a lesão está bem iluminada e centralizada</p>
          <p>• Evite sombras e reflexos na imagem</p>
          <p>• Mantenha a imagem em foco e com resolução adequada</p>
        </CardContent>
      </Card>
    </div>
  );
}
