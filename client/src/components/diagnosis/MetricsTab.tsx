import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ModelMetric {
  modelName: string;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  f1Score: number;
  auc: number;
  precision: number;
  sampleCount: number;
}

export default function MetricsTab() {
  const mockMetrics: ModelMetric[] = [
    {
      modelName: 'CNN (ResNet-50)',
      accuracy: 92,
      sensitivity: 90,
      specificity: 94,
      f1Score: 91,
      auc: 96,
      precision: 93,
      sampleCount: 10000,
    },
    {
      modelName: 'Vision Transformer',
      accuracy: 94,
      sensitivity: 92,
      specificity: 96,
      f1Score: 93,
      auc: 97,
      precision: 95,
      sampleCount: 10000,
    },
    {
      modelName: 'Hibrido CNN-ViT',
      accuracy: 95,
      sensitivity: 94,
      specificity: 96,
      f1Score: 95,
      auc: 98,
      precision: 96,
      sampleCount: 10000,
    },
    {
      modelName: 'Ensemble Learning',
      accuracy: 96,
      sensitivity: 95,
      specificity: 97,
      f1Score: 96,
      auc: 99,
      precision: 97,
      sampleCount: 10000,
    },
  ];

  const chartData = mockMetrics.map((metric) => ({
    name: metric.modelName.split(' ')[0],
    accuracy: metric.accuracy,
    sensitivity: metric.sensitivity,
    specificity: metric.specificity,
    f1Score: metric.f1Score,
    auc: metric.auc,
    precision: metric.precision,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metricas de Desempenho dos Modelos</CardTitle>
          <CardDescription>
            Comparacao das metricas de avaliacao de todos os modelos de classificacao
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Modelo</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Acuracia</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Sensibilidade</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Especificidade</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">F1-Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">AUC-ROC</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Precisao</th>
                </tr>
              </thead>
              <tbody>
                {mockMetrics.map((metric, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{metric.modelName}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="default">{metric.accuracy}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{metric.sensitivity}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{metric.specificity}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{metric.f1Score}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-blue-600">{metric.auc}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{metric.precision}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparacao Grafica de Metricas</CardTitle>
          <CardDescription>
            Visualizacao comparativa das principais metricas entre modelos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Acuracia" />
              <Bar dataKey="sensitivity" fill="#10b981" name="Sensibilidade" />
              <Bar dataKey="specificity" fill="#f59e0b" name="Especificidade" />
              <Bar dataKey="f1Score" fill="#8b5cf6" name="F1-Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{metric.modelName}</CardTitle>
              <CardDescription>
                Amostras: {metric.sampleCount.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Acuracia</span>
                  <span className="text-sm font-bold text-slate-900">{metric.accuracy}%</span>
                </div>
                <Progress value={metric.accuracy} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Sensibilidade</span>
                  <span className="text-sm font-bold text-slate-900">{metric.sensitivity}%</span>
                </div>
                <Progress value={metric.sensitivity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Especificidade</span>
                  <span className="text-sm font-bold text-slate-900">{metric.specificity}%</span>
                </div>
                <Progress value={metric.specificity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">F1-Score</span>
                  <span className="text-sm font-bold text-slate-900">{metric.f1Score}%</span>
                </div>
                <Progress value={metric.f1Score} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">AUC-ROC</span>
                  <span className="text-sm font-bold text-slate-900">{metric.auc}%</span>
                </div>
                <Progress value={metric.auc} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Precisao</span>
                  <span className="text-sm font-bold text-slate-900">{metric.precision}%</span>
                </div>
                <Progress value={metric.precision} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base text-blue-900">Sobre as Metricas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-800">
          <div>
            <p className="font-semibold">Acuracia:</p>
            <p>Percentual de predicoes corretas entre todas as predicoes realizadas.</p>
          </div>
          <div>
            <p className="font-semibold">Sensibilidade (Recall):</p>
            <p>Capacidade do modelo de identificar corretamente casos positivos (lesoes malignas).</p>
          </div>
          <div>
            <p className="font-semibold">Especificidade:</p>
            <p>Capacidade do modelo de identificar corretamente casos negativos (lesoes benignas).</p>
          </div>
          <div>
            <p className="font-semibold">F1-Score:</p>
            <p>Media harmonica entre precisao e recall, util para avaliar desempenho geral.</p>
          </div>
          <div>
            <p className="font-semibold">AUC-ROC:</p>
            <p>Area sob a curva ROC, indica a capacidade do modelo de discriminar entre classes.</p>
          </div>
          <div>
            <p className="font-semibold">Precisao:</p>
            <p>Percentual de predicoes positivas que foram realmente corretas.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
