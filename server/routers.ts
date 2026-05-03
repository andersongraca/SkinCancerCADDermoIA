import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getUserDiagnoses, getDiagnosisById, getAllModelMetrics, getModelMetrics } from "./db";

export const appRouter = router({
  // Se precisar usar socket.io, leia e registre a rota em server/_core/index.ts
  // Todas as APIs devem começar com '/api/' para que o gateway possa rotear corretamente
  system: systemRouter,

  /**
   * Router de autenticação
   * Fornece endpoints para gerenciar sessão do usuário
   */
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Router para gerenciamento de diagnósticos dermatológicos
   * Fornece endpoints para recuperar histórico de diagnósticos
   */
  diagnosis: router({
    /**
     * Obtém o histórico de diagnósticos do usuário autenticado
     * Retorna todos os diagnósticos realizados pelo usuário
     */
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      try {
        const diagnoses = await getUserDiagnoses(ctx.user.id);
        return diagnoses;
      } catch (error) {
        console.error('Erro ao obter histórico de diagnósticos:', error);
        throw new Error('Falha ao obter histórico de diagnósticos');
      }
    }),

    /**
     * Obtém um diagnóstico específico pelo seu ID
     * Valida se o diagnóstico pertence ao usuário autenticado
     */
    getById: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === 'object' && val !== null && 'id' in val && typeof (val as any).id === 'number') {
          return { id: (val as any).id };
        }
        throw new Error('ID inválido');
      })
      .query(async ({ ctx, input }) => {
        try {
          const diagnosis = await getDiagnosisById(input.id);
          if (!diagnosis || diagnosis.userId !== ctx.user.id) {
            throw new Error('Diagnóstico não encontrado ou acesso negado');
          }
          return diagnosis;
        } catch (error) {
          console.error('Erro ao obter diagnóstico:', error);
          throw new Error('Falha ao obter diagnóstico');
        }
      }),
  }),

  /**
   * Router para gerenciamento de métricas dos modelos
   * Fornece endpoints para recuperar métricas de desempenho
   */
  metrics: router({
    /**
     * Obtém as métricas de todos os modelos de classificação
     * Retorna acurácia, sensibilidade, especificidade, F1-score e AUC
     */
    getAllMetrics: publicProcedure.query(async () => {
      try {
        const metrics = await getAllModelMetrics();
        return metrics;
      } catch (error) {
        console.error('Erro ao obter métricas:', error);
        throw new Error('Falha ao obter métricas dos modelos');
      }
    }),

    /**
     * Obtém as métricas de um modelo específico
     * Permite consultar desempenho de modelos individuais
     */
    getMetricsByModel: publicProcedure
      .input((val: unknown) => {
        if (typeof val === 'object' && val !== null && 'modelName' in val && typeof (val as any).modelName === 'string') {
          return { modelName: (val as any).modelName };
        }
        throw new Error('Nome do modelo inválido');
      })
      .query(async ({ input }) => {
        try {
          const metric = await getModelMetrics(input.modelName);
          if (!metric) {
            throw new Error('Métricas não encontradas para o modelo especificado');
          }
          return metric;
        } catch (error) {
          console.error('Erro ao obter métricas do modelo:', error);
          throw new Error('Falha ao obter métricas do modelo');
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
