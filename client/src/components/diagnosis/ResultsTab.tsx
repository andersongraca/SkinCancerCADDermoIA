import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ResultsTabProps {
  imagePreview: string | null;
  selectedImage: File | null;
  isProcessing: boolean;
}

export default function ResultsTab({
  imagePreview,
  selectedImage,
  isProcessing,
}: ResultsTabProps) {
  const mockResults = {
    finalClassification: 'benign',
    finalConfidence: 87,
    cnnResult: {
      classification: 'benign',
      confidence: 85,
      inferenceTime: 145,
    },
    vitResult: {
      classification: 'benign',
      confidence: 89,
      inferenceTime: 156,
    },
    hybridResult: {
      classification: 'benign',
      confidence: 88,
      inferenceTime: 301,
    },
    ensembleResult: {
      classification: 'benign',
      confidence: 87,
      inferenceTime: 602,
    },
  };

  const hasResults = imagePreview && !isProcessing;

  if (!hasResults) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum resultado disponivel. Faca upload de uma imagem e classifique-a primeiro.
        </AlertDescription>
      </Alert>
    );
  }

  const getClassificationColor = (classification: string) => {
    return classification === 'malignant' ? 'destructive' : 'default';
  };

  const getClassificationText = (classification: string) => {
    return classification === 'malignant' ? 'Maligna' : 'Benigna';
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Resultado da Classificacao</CardTitle>
          <CardDescription>Analise completa da lesao dermatoscopica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Imagem Analisada</h3>
              <div className="border rounded-lg overflow-hidden bg-slate-50">
                <img
                  src={imagePreview}
                  alt="Imagem analisada"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              {selectedImage && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Arquivo:</span> {selectedImage.name}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Diagnostico</h3>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-slate-900">Classificacao:</span>
                  <Badge variant={getClassificationColor(mockResults.finalClassification)}>
                    {getClassificationText(mockResults.finalClassification)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Confianca:</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {mockResults.finalConfidence}%
                    </span>
                  </div>
                  <Progress value={mockResults.finalConfidence} className="h-3" />
                </div>

                {mockResults.finalClassification === 'malignant' && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Resultado sugere lesao maligna. Consulte um dermatologista para confirmacao.
                    </AlertDescription>
                  </Alert>
                )}

                {mockResults.finalClassification === 'benign' && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Resultado sugere lesao benigna. Acompanhamento periodico recomendado.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analise Detalhada por Modelo</CardTitle>
          <CardDescription>
            Comparacao entre os resultados dos diferentes modelos de classificacao
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">CNN (ResNet-50)</h4>
                <Badge variant="outline">Local</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Classificacao:</span>
                  <span className="font-medium">
                    {getClassificationText(mockResults.cnnResult.classification)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Confianca:</span>
                    <span className="font-medium">{mockResults.cnnResult.confidence}%</span>
                  </div>
                  <Progress value={mockResults.cnnResult.confidence} className="h-2" />
                </div>
                <p className="text-xs text-slate-500">
                  Tempo de inferencia: {mockResults.cnnResult.inferenceTime}ms
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">Vision Transformer</h4>
                <Badge variant="outline">Global</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Classificacao:</span>
                  <span className="font-medium">
                    {getClassificationText(mockResults.vitResult.classification)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Confianca:</span>
                    <span className="font-medium">{mockResults.vitResult.confidence}%</span>
                  </div>
                  <Progress value={mockResults.vitResult.confidence} className="h-2" />
                </div>
                <p className="text-xs text-slate-500">
                  Tempo de inferencia: {mockResults.vitResult.inferenceTime}ms
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">Hibrido CNN-ViT</h4>
                <Badge variant="outline">Hibrido</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Classificacao:</span>
                  <span className="font-medium">
                    {getClassificationText(mockResults.hybridResult.classification)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Confianca:</span>
                    <span className="font-medium">{mockResults.hybridResult.confidence}%</span>
                  </div>
                  <Progress value={mockResults.hybridResult.confidence} className="h-2" />
                </div>
                <p className="text-xs text-slate-500">
                  Tempo de inferencia: {mockResults.hybridResult.inferenceTime}ms
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3 bg-blue-50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">Ensemble Learning</h4>
                <Badge className="bg-blue-600">Final</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Classificacao:</span>
                  <span className="font-medium">
                    {getClassificationText(mockResults.ensembleResult.classification)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Confianca:</span>
                    <span className="font-medium">{mockResults.ensembleResult.confidence}%</span>
                  </div>
                  <Progress value={mockResults.ensembleResult.confidence} className="h-2" />
                </div>
                <p className="text-xs text-slate-500">
                  Tempo de inferencia: {mockResults.ensembleResult.inferenceTime}ms
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mapas de Calor (Grad-CAM)</CardTitle>
          <CardDescription>
            Visualizacao das regioes relevantes para a classificacao de cada modelo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Os heatmaps mostram as areas da imagem que mais contribuiram para a decisao do modelo.
              Regioes mais quentes (vermelhas) indicam maior importancia.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-slate-900">Heatmap CNN</h4>
              <div className="bg-slate-100 h-48 rounded flex items-center justify-center text-slate-500">
                Heatmap CNN sera exibido aqui
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-slate-900">Heatmap ViT</h4>
              <div className="bg-slate-100 h-48 rounded flex items-center justify-center text-slate-500">
                Heatmap ViT sera exibido aqui
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-slate-900">Heatmap Hibrido</h4>
              <div className="bg-slate-100 h-48 rounded flex items-center justify-center text-slate-500">
                Heatmap Hibrido sera exibido aqui
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-blue-50">
              <h4 className="font-semibold text-slate-900">Heatmap Ensemble</h4>
              <div className="bg-slate-100 h-48 rounded flex items-center justify-center text-slate-500">
                Heatmap Ensemble sera exibido aqui
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
