/**
 * Serviço de Classificação de Lesões de Pele
 * 
 * Orquestra o processamento de imagens através dos diferentes modelos
 * de classificação. Implementa encapsulamento da lógica de negócio
 * e fornece uma interface unificada para classificação.
 */

import {
  BaseClassificationModel,
  ClassificationResult,
  CNNModel,
  ViTModel,
  HybridModel,
  EnsembleModel,
  ModelMetrics,
} from './ClassificationModels';

/**
 * Interface que representa o resultado completo de uma classificação,
 * incluindo resultados de todos os modelos individuais.
 */
export interface ComprehensiveClassificationResult {
  /** Resultado do modelo CNN */
  cnnResult: ClassificationResult;
  /** Resultado do modelo ViT */
  vitResult: ClassificationResult;
  /** Resultado do modelo Híbrido */
  hybridResult: ClassificationResult;
  /** Resultado do modelo Ensemble */
  ensembleResult: ClassificationResult;
  /** Classificação final (baseada no ensemble) */
  finalClassification: 'benign' | 'malignant';
  /** Confiança final */
  finalConfidence: number;
}

/**
 * Classe responsável pela orquestração do processo de classificação.
 * Gerencia os modelos e coordena a execução das predições.
 * Implementa o padrão Facade para simplificar a interface de uso.
 */
export class ClassificationService {
  /** Instância do modelo CNN */
  private cnnModel: CNNModel;
  /** Instância do modelo ViT */
  private vitModel: ViTModel;
  /** Instância do modelo Híbrido */
  private hybridModel: HybridModel;
  /** Instância do modelo Ensemble */
  private ensembleModel: EnsembleModel;

  /**
   * Construtor do serviço de classificação.
   * Inicializa todos os modelos com suas métricas padrão.
   */
  constructor() {
    // Métricas padrão para o modelo CNN
    const cnnMetrics: ModelMetrics = {
      modelName: 'CNN (ResNet-50)',
      modelVersion: '1.0.0',
      accuracy: 92,
      sensitivity: 90,
      specificity: 94,
      f1Score: 91,
      auc: 96,
      precision: 93,
      sampleCount: 10000,
    };

    // Métricas padrão para o modelo ViT
    const vitMetrics: ModelMetrics = {
      modelName: 'Vision Transformer (ViT)',
      modelVersion: '1.0.0',
      accuracy: 94,
      sensitivity: 92,
      specificity: 96,
      f1Score: 93,
      auc: 97,
      precision: 95,
      sampleCount: 10000,
    };

    // Métricas padrão para o modelo Híbrido
    const hybridMetrics: ModelMetrics = {
      modelName: 'Hybrid CNN-ViT',
      modelVersion: '1.0.0',
      accuracy: 95,
      sensitivity: 94,
      specificity: 96,
      f1Score: 95,
      auc: 98,
      precision: 96,
      sampleCount: 10000,
    };

    // Métricas padrão para o modelo Ensemble
    const ensembleMetrics: ModelMetrics = {
      modelName: 'Ensemble Learning',
      modelVersion: '1.0.0',
      accuracy: 96,
      sensitivity: 95,
      specificity: 97,
      f1Score: 96,
      auc: 99,
      precision: 97,
      sampleCount: 10000,
    };

    // Inicializa os modelos
    this.cnnModel = new CNNModel('CNN (ResNet-50)', '1.0.0', cnnMetrics);
    this.vitModel = new ViTModel('Vision Transformer (ViT)', '1.0.0', vitMetrics);
    this.hybridModel = new HybridModel('1.0.0', hybridMetrics, this.cnnModel, this.vitModel);
    this.ensembleModel = new EnsembleModel(
      '1.0.0',
      ensembleMetrics,
      [this.cnnModel, this.vitModel, this.hybridModel]
    );
  }

  /**
   * Classifica uma imagem utilizando todos os modelos disponíveis.
   * Retorna resultados detalhados de cada modelo e uma classificação final.
   * 
   * @param imagePath - Caminho da imagem a ser classificada
   * @returns Resultado abrangente da classificação com todos os modelos
   */
  async classifyImage(imagePath: string): Promise<ComprehensiveClassificationResult> {
    try {
      // Executa a classificação em paralelo para melhor desempenho
      const [cnnResult, vitResult, hybridResult, ensembleResult] = await Promise.all([
        this.cnnModel.classify(imagePath),
        this.vitModel.classify(imagePath),
        this.hybridModel.classify(imagePath),
        this.ensembleModel.classify(imagePath),
      ]);

      return {
        cnnResult,
        vitResult,
        hybridResult,
        ensembleResult,
        finalClassification: ensembleResult.classification,
        finalConfidence: ensembleResult.confidence,
      };
    } catch (error) {
      console.error('Erro ao classificar imagem:', error);
      throw new Error(`Falha na classificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Gera heatmaps para interpretabilidade de todos os modelos.
   * 
   * @param imagePath - Caminho da imagem
   * @param outputDir - Diretório onde salvar os heatmaps
   * @returns Objeto com caminhos dos heatmaps gerados
   */
  async generateAllHeatmaps(
    imagePath: string,
    outputDir: string
  ): Promise<{
    cnnHeatmapPath: string;
    vitHeatmapPath: string;
    hybridHeatmapPath: string;
  }> {
    try {
      const cnnHeatmapPath = `${outputDir}/heatmap_cnn.png`;
      const vitHeatmapPath = `${outputDir}/heatmap_vit.png`;
      const hybridHeatmapPath = `${outputDir}/heatmap_hybrid.png`;

      // Gera heatmaps em paralelo
      await Promise.all([
        this.cnnModel.generateHeatmap(imagePath, cnnHeatmapPath),
        this.vitModel.generateHeatmap(imagePath, vitHeatmapPath),
        this.hybridModel.generateHeatmap(imagePath, hybridHeatmapPath),
      ]);

      return {
        cnnHeatmapPath,
        vitHeatmapPath,
        hybridHeatmapPath,
      };
    } catch (error) {
      console.error('Erro ao gerar heatmaps:', error);
      throw new Error(`Falha ao gerar heatmaps: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Obtém as métricas de todos os modelos.
   * 
   * @returns Array com as métricas de cada modelo
   */
  public getAllModelMetrics(): ModelMetrics[] {
    return [
      this.cnnModel.getMetrics(),
      this.vitModel.getMetrics(),
      this.hybridModel.getMetrics(),
      this.ensembleModel.getMetrics(),
    ];
  }

  /**
   * Obtém as métricas de um modelo específico.
   * 
   * @param modelName - Nome do modelo ('CNN', 'ViT', 'Hybrid', 'Ensemble')
   * @returns Métricas do modelo ou null se não encontrado
   */
  public getModelMetrics(modelName: string): ModelMetrics | null {
    switch (modelName.toLowerCase()) {
      case 'cnn':
        return this.cnnModel.getMetrics();
      case 'vit':
        return this.vitModel.getMetrics();
      case 'hybrid':
        return this.hybridModel.getMetrics();
      case 'ensemble':
        return this.ensembleModel.getMetrics();
      default:
        return null;
    }
  }

  /**
   * Atualiza as métricas de um modelo específico.
   * Útil para atualizar métricas após retreinamento.
   * 
   * @param modelName - Nome do modelo
   * @param metrics - Novas métricas
   * @returns true se atualizado com sucesso, false caso contrário
   */
  public updateModelMetrics(modelName: string, metrics: ModelMetrics): boolean {
    const model = this.getModelByName(modelName);
    if (model) {
      model.setMetrics(metrics);
      return true;
    }
    return false;
  }

  /**
   * Obtém uma instância de modelo pelo seu nome.
   * Método privado para acesso interno.
   * 
   * @param modelName - Nome do modelo
   * @returns Instância do modelo ou null se não encontrado
   */
  private getModelByName(modelName: string): BaseClassificationModel | null {
    switch (modelName.toLowerCase()) {
      case 'cnn':
        return this.cnnModel;
      case 'vit':
        return this.vitModel;
      case 'hybrid':
        return this.hybridModel;
      case 'ensemble':
        return this.ensembleModel;
      default:
        return null;
    }
  }

  /**
   * Obtém o modelo CNN.
   * 
   * @returns Instância do modelo CNN
   */
  public getCNNModel(): CNNModel {
    return this.cnnModel;
  }

  /**
   * Obtém o modelo ViT.
   * 
   * @returns Instância do modelo ViT
   */
  public getViTModel(): ViTModel {
    return this.vitModel;
  }

  /**
   * Obtém o modelo Híbrido.
   * 
   * @returns Instância do modelo Híbrido
   */
  public getHybridModel(): HybridModel {
    return this.hybridModel;
  }

  /**
   * Obtém o modelo Ensemble.
   * 
   * @returns Instância do modelo Ensemble
   */
  public getEnsembleModel(): EnsembleModel {
    return this.ensembleModel;
  }
}

/**
 * Instância singleton do serviço de classificação.
 * Garante que apenas uma instância seja criada e reutilizada em toda a aplicação.
 */
export const classificationService = new ClassificationService();
