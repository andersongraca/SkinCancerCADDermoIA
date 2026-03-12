/**
 * Página Principal de Diagnóstico Dermatológico
 * 
 * Componente principal que implementa a interface com abas para navegação
 * entre os diferentes módulos: Upload, Resultados, Histórico e Métricas.
 * Utiliza o padrão de componentes React com hooks para gerenciamento de estado.
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, History, BarChart3, FileText } from 'lucide-react';
import UploadTab from '@/components/diagnosis/UploadTab';
import ResultsTab from '@/components/diagnosis/ResultsTab';
import HistoryTab from '@/components/diagnosis/HistoryTab';
import MetricsTab from '@/components/diagnosis/MetricsTab';

/**
 * Interface que define o estado de uma classificação em progresso
 */
interface ClassificationState {
  /** Indica se está processando */
  isProcessing: boolean;
  /** Mensagem de status */
  statusMessage: string;
  /** Progresso da operação (0-100) */
  progress: number;
}

/**
 * Componente principal da página de diagnóstico
 * Gerencia o estado global da aplicação e coordena os diferentes módulos
 */
export default function DiagnosisPage() {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<string>('upload');

  // Estado para armazenar informações da classificação em progresso
  const [classificationState, setClassificationState] = useState<ClassificationState>({
    isProcessing: false,
    statusMessage: '',
    progress: 0,
  });

  // Estado para armazenar a imagem selecionada
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Estado para armazenar a prévia da imagem
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /**
   * Manipulador para quando uma imagem é selecionada no upload
   * Atualiza o estado e exibe uma prévia da imagem
   * 
   * @param file - Arquivo de imagem selecionado
   */
  const handleImageSelected = (file: File) => {
    setSelectedImage(file);

    // Cria uma prévia da imagem usando FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Manipulador para quando a classificação é iniciada
   * Atualiza o estado de processamento
   */
  const handleClassificationStart = () => {
    setClassificationState({
      isProcessing: true,
      statusMessage: 'Processando imagem...',
      progress: 0,
    });
  };

  /**
   * Manipulador para quando a classificação é concluída com sucesso
   * Atualiza o estado e navega para a aba de resultados
   */
  const handleClassificationComplete = () => {
    setClassificationState({
      isProcessing: false,
      statusMessage: 'Classificação concluída com sucesso!',
      progress: 100,
    });

    // Navega para a aba de resultados após um pequeno atraso
    setTimeout(() => {
      setActiveTab('results');
    }, 500);
  };

  /**
   * Manipulador para quando ocorre um erro na classificação
   * Atualiza o estado com mensagem de erro
   * 
   * @param error - Mensagem de erro
   */
  const handleClassificationError = (error: string) => {
    setClassificationState({
      isProcessing: false,
      statusMessage: `Erro: ${error}`,
      progress: 0,
    });
  };

  /**
   * Manipulador para limpar a seleção de imagem
   * Reseta todos os estados relacionados
   */
  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setClassificationState({
      isProcessing: false,
      statusMessage: '',
      progress: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Aplicação */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            SkinCancerCADDermoIA
          </h1>
          <p className="text-lg text-slate-600">
            Sistema de Diagnóstico Auxiliado por Computador para Detecção de Câncer de Pele
          </p>
        </div>

        {/* Sistema de Abas para Navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Lista de Abas */}
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-md rounded-lg p-1">
            {/* Aba de Upload */}
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>

            {/* Aba de Resultados */}
            <TabsTrigger value="results" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Resultados</span>
            </TabsTrigger>

            {/* Aba de Histórico */}
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>

            {/* Aba de Métricas */}
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Métricas</span>
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo da Aba de Upload */}
          <TabsContent value="upload" className="space-y-4">
            <UploadTab
              onImageSelected={handleImageSelected}
              onClassificationStart={handleClassificationStart}
              onClassificationComplete={handleClassificationComplete}
              onClassificationError={handleClassificationError}
              isProcessing={classificationState.isProcessing}
              statusMessage={classificationState.statusMessage}
              progress={classificationState.progress}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              onClearImage={handleClearImage}
            />
          </TabsContent>

          {/* Conteúdo da Aba de Resultados */}
          <TabsContent value="results" className="space-y-4">
            <ResultsTab
              imagePreview={imagePreview}
              selectedImage={selectedImage}
              isProcessing={classificationState.isProcessing}
            />
          </TabsContent>

          {/* Conteúdo da Aba de Histórico */}
          <TabsContent value="history" className="space-y-4">
            <HistoryTab />
          </TabsContent>

          {/* Conteúdo da Aba de Métricas */}
          <TabsContent value="metrics" className="space-y-4">
            <MetricsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
