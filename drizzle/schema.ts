import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela para armazenar imagens dermatoscópicas carregadas pelos usuários.
 * Cada imagem é associada a um usuário e pode ter múltiplos diagnósticos.
 */
export const dermatologicalImages = mysqlTable("dermatological_images", {
  /** Identificador único da imagem */
  id: int("id").autoincrement().primaryKey(),
  /** ID do usuário que carregou a imagem */
  userId: int("user_id").notNull(),
  /** Nome original do arquivo */
  fileName: varchar("file_name", { length: 255 }).notNull(),
  /** Caminho ou URL da imagem armazenada */
  imagePath: text("image_path").notNull(),
  /** Caminho ou URL da imagem em miniatura */
  thumbnailPath: text("thumbnail_path"),
  /** Tamanho do arquivo em bytes */
  fileSize: int("file_size").notNull(),
  /** Tipo MIME da imagem (ex: image/jpeg) */
  mimeType: varchar("mime_type", { length: 50 }).notNull(),
  /** Descrição ou notas adicionais sobre a imagem */
  description: text("description"),
  /** Data de carregamento */
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  /** Data de atualização */
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DermatologicalImage = typeof dermatologicalImages.$inferSelect;
export type InsertDermatologicalImage = typeof dermatologicalImages.$inferInsert;

/**
 * Tabela para armazenar diagnósticos realizados nos modelos de classificação.
 * Um diagnóstico contém os resultados de classificação e informações sobre os modelos utilizados.
 */
export const diagnoses = mysqlTable("diagnoses", {
  /** Identificador único do diagnóstico */
  id: int("id").autoincrement().primaryKey(),
  /** ID da imagem analisada */
  imageId: int("image_id").notNull(),
  /** ID do usuário que solicitou o diagnóstico */
  userId: int("user_id").notNull(),
  /** Resultado da classificação: 'benign' ou 'malignant' */
  classification: varchar("classification", { length: 50 }).notNull(),
  /** Confiança da classificação (0-100) */
  confidence: int("confidence").notNull(),
  /** Resultado do modelo CNN */
  cnnResult: varchar("cnn_result", { length: 50 }),
  /** Confiança do modelo CNN */
  cnnConfidence: int("cnn_confidence"),
  /** Resultado do modelo Vision Transformer */
  vitResult: varchar("vit_result", { length: 50 }),
  /** Confiança do modelo Vision Transformer */
  vitConfidence: int("vit_confidence"),
  /** Resultado do modelo híbrido */
  hybridResult: varchar("hybrid_result", { length: 50 }),
  /** Confiança do modelo híbrido */
  hybridConfidence: int("hybrid_confidence"),
  /** Caminho ou URL do heatmap Grad-CAM */
  heatmapPath: text("heatmap_path"),
  /** Versão dos modelos utilizados */
  modelVersion: varchar("model_version", { length: 50 }),
  /** Data do diagnóstico */
  diagnosedAt: timestamp("diagnosed_at").defaultNow().notNull(),
  /** Data de atualização */
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = typeof diagnoses.$inferInsert;

/**
 * Tabela para armazenar métricas de desempenho dos modelos.
 * Permite rastrear a evolução do desempenho ao longo do tempo.
 */
export const modelMetrics = mysqlTable("model_metrics", {
  /** Identificador único da métrica */
  id: int("id").autoincrement().primaryKey(),
  /** Nome do modelo (CNN, ViT, Hybrid, Ensemble) */
  modelName: varchar("model_name", { length: 100 }).notNull(),
  /** Versão do modelo */
  modelVersion: varchar("model_version", { length: 50 }).notNull(),
  /** Acurácia do modelo (0-100) */
  accuracy: int("accuracy").notNull(),
  /** Sensibilidade (recall) do modelo (0-100) */
  sensitivity: int("sensitivity").notNull(),
  /** Especificidade do modelo (0-100) */
  specificity: int("specificity").notNull(),
  /** F1-score do modelo (0-100) */
  f1Score: int("f1_score").notNull(),
  /** AUC-ROC do modelo (0-100) */
  auc: int("auc").notNull(),
  /** Precisão do modelo (0-100) */
  precision: int("precision").notNull(),
  /** Número de amostras utilizadas para calcular as métricas */
  sampleCount: int("sample_count").notNull(),
  /** Data de atualização das métricas */
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ModelMetric = typeof modelMetrics.$inferSelect;
export type InsertModelMetric = typeof modelMetrics.$inferInsert;