import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, Eye } from 'lucide-react';

interface DiagnosisRecord {
  id: number;
  date: string;
  imageName: string;
  classification: 'benign' | 'malignant';
  confidence: number;
  modelUsed: string;
}

export default function HistoryTab() {
  const [selectedRecord, setSelectedRecord] = useState<DiagnosisRecord | null>(null);

  const mockHistory: DiagnosisRecord[] = [
    {
      id: 1,
      date: '2026-02-20',
      imageName: 'lesao_001.jpg',
      classification: 'benign',
      confidence: 87,
      modelUsed: 'Ensemble',
    },
    {
      id: 2,
      date: '2026-02-19',
      imageName: 'lesao_002.png',
      classification: 'malignant',
      confidence: 92,
      modelUsed: 'Ensemble',
    },
    {
      id: 3,
      date: '2026-02-18',
      imageName: 'lesao_003.jpg',
      classification: 'benign',
      confidence: 85,
      modelUsed: 'Hybrid',
    },
  ];

  const getClassificationColor = (classification: string) => {
    return classification === 'malignant' ? 'destructive' : 'default';
  };

  const getClassificationText = (classification: string) => {
    return classification === 'malignant' ? 'Maligna' : 'Benigna';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historico de Diagnosticos</CardTitle>
          <CardDescription>
            Lista de todos os diagnosticos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockHistory.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum diagnostico no historico. Comece fazendo upload de uma imagem.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {mockHistory.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-900">{record.imageName}</p>
                      <p className="text-sm text-slate-500">{record.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getClassificationColor(record.classification)}>
                        {getClassificationText(record.classification)}
                      </Badge>
                      <Badge variant="outline">{record.confidence}%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Modelo: <span className="font-medium">{record.modelUsed}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRecord && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Diagnostico</CardTitle>
            <CardDescription>
              Informacoes detalhadas do diagnostico selecionado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Arquivo</p>
                <p className="font-medium text-slate-900">{selectedRecord.imageName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Data</p>
                <p className="font-medium text-slate-900">{selectedRecord.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Classificacao</p>
                <p className="font-medium text-slate-900">
                  {getClassificationText(selectedRecord.classification)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Confianca</p>
                <p className="font-medium text-slate-900">{selectedRecord.confidence}%</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSelectedRecord(null)}
            >
              Fechar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
