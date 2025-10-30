# 🚀 Deploy - Assessoria de Anamnese com IA

## Próximos Passos para Implementação Completa

### 1️⃣ Executar Migration SQL

```bash
# Via Supabase CLI
supabase db reset

# Ou via Dashboard Supabase:
# 1. Acesse: https://app.supabase.com
# 2. Vá em Database → Migrations
# 3. Execute a migration: 20250125000000_add_ia_anamnese_features.sql
```

**O que a migration faz:**
- ✅ Adiciona campo `analise_ia JSONB` na tabela `avaliacoes`
- ✅ Adiciona campos `consentimento_ia` e `consentimento_ia_data` na tabela `clientes`
- ✅ Cria índices para otimização de queries
- ✅ Cria buckets de storage (`tricoscopia` e `fotos-cliente`)
- ✅ Configura políticas RLS (Row Level Security) para os buckets

### 2️⃣ Deploy da Edge Function

```bash
# Deploy da function analisar-tricoscopia
supabase functions deploy analisar-tricoscopia

# Ou criar manualmente no Dashboard:
# 1. Acesse: https://app.supabase.com
# 2. Vá em Edge Functions
# 3. Crie nova function "analisar-tricoscopia"
# 4. Cole o conteúdo de: supabase/functions/analisar-tricoscopia/index.ts
```

**O que a Edge Function faz:**
- Processa análise IA (atualmente MOCK)
- Recebe URLs de imagens da avaliação
- Retorna análise quantitativa e qualitativa
- Salva resultado em `avaliacoes.analise_ia`

### 3️⃣ Configurar Buckets no Supabase Dashboard

**Manual (se ainda não criados):**

1. Acesse: **Storage** → **Buckets**
2. Clique em **"New bucket"**

**Bucket 1: `tricoscopia`**
```yaml
ID: tricoscopia
Public: Yes
File size limit: 10 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

**Bucket 2: `fotos-cliente`**
```yaml
ID: fotos-cliente
Public: Yes
File size limit: 10 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

### 4️⃣ Políticas RLS (Row Level Security)

As políticas já foram criadas pela migration. Verifique se estão ativas:

```sql
-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE schemaname = 'storage';
```

**Políticas aplicadas:**
- ✅ `Authenticated users can view/upload/update/delete` (cada bucket)

### 5️⃣ Testar Funcionalidade

**Fluxo de Teste:**

1. **Criar Anamnese com Imagens:**
   ```
   Dashboard → Clientes → Novo Cliente → Anamnese
   → Preencher todas as seções
   → Na seção "Tricoscopia", fazer upload de imagens
   → Salvar
   ```

2. **Verificar Consentimento:**
   ```
   Se houver imagens, aparecerá dialog de consentimento LGPD
   → Marcar checkbox de aceite
   → Consentimento será salvo no banco
   ```

3. **Status da Análise IA:**
   ```
   Após salvar, análise IA será acionada automaticamente
   → Status aparecerá na tela (Aguardando → Processando → Concluído)
   → Resultados ficam disponíveis em poucos segundos
   ```

4. **Visualizar Resultados:**
   ```
   Dashboard → Avaliações → Abrir avaliação
   → Aba "Assessoria IA"
   → Ver dados quantitativos, gráficos, e recomendações
   ```

5. **Comparativo Histórico:**
   ```
   Se houver avaliações anteriores do mesmo cliente
   → Comparativo automático será exibido
   → Gráfico de evolução temporal
   ```

6. **Gerar PDF Completo:**
   ```
   Na tela de detalhes da avaliação
   → Clicar em "Baixar PDF"
   → PDF com todos os dados + análise IA + gráficos
   ```

### 6️⃣ Monitorar e Debugar

**Logs da Edge Function:**
```bash
supabase functions logs analisar-tricoscopia
```

**Verificar dados no banco:**
```sql
-- Ver avaliações com análise IA
SELECT id, cliente_id, created_at, analise_ia 
FROM public.avaliacoes 
WHERE analise_ia IS NOT NULL;

-- Ver clientes com consentimento
SELECT id, nome, consentimento_ia, consentimento_ia_data 
FROM public.clientes 
WHERE consentimento_ia = true;
```

**Verificar storage:**
- Dashboard → Storage → Preview dos buckets
- Verificar se as imagens foram uploadadas corretamente

### 7️⃣ Substituir Mock por API Real (Futuro)

**Quando a API de IA estiver pronta:**

1. **Atualizar Edge Function:**
   ```typescript
   // supabase/functions/analisar-tricoscopia/index.ts
   
   // Substituir:
   const iaResult = await mockAnalyzeTricoscopia(imageUrls, previousAnalysis);
   
   // Por:
   const iaResult = await callRealAIApi(imageUrls, {
     apiKey: Deno.env.get('IA_API_KEY'),
     endpoint: Deno.env.get('IA_API_ENDPOINT')
   });
   ```

2. **Adicionar variáveis de ambiente:**
   ```bash
   # No Supabase Dashboard
   Settings → Edge Functions → Environment Variables
   
   IA_API_KEY=your_api_key
   IA_API_ENDPOINT=https://your-api.com/analyze
   ```

3. **Implementar função real:**
   ```typescript
   async function callRealAIApi(urls: string[], config: any) {
     const response = await fetch(config.endpoint, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${config.apiKey}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ image_urls: urls })
     });
     
     return await response.json();
   }
   ```

### 8️⃣ Otimizações e Melhorias

**Performance:**
- [ ] Cache de análises IA para evitar reprocessamento
- [ ] Compressão de imagens antes do upload
- [ ] Lazy loading de imagens no componente de tricoscopia

**UX:**
- [ ] Barra de progresso durante análise IA
- [ ] Notificações quando análise concluir
- [ ] Filtros avançados no comparativo histórico

**Segurança:**
- [ ] Rate limiting na Edge Function
- [ ] Validação de tipos de arquivo no upload
- [ ] Backup automático dos buckets

**Analytics:**
- [ ] Dashboard com estatísticas de análises realizadas
- [ ] Relatórios de tendências dos clientes
- [ ] Métricas de confiabilidade do modelo IA

### 📊 Estrutura de Dados da Análise IA

```json
{
  "cliente_id": "uuid",
  "avaliacao_id": "uuid",
  "data_avaliacao": "2025-01-24",
  "grupos_imagens": {
    "grupo_1": {
      "descricao": "Imagens tricoscópicas de 10x a 200x",
      "urls": ["url1", "url2", ...]
    },
    "grupo_2": {
      "descricao": "Fotos panorâmicas da cabeça",
      "urls": ["url1", "url2", ...]
    }
  },
  "analise_quantitativa": {
    "densidade_capilar": 0.72,
    "oleosidade": 0.48,
    "descamacao": 0.25,
    "miniaturizacao": 0.31,
    "inflamacao": 0.08
  },
  "analise_qualitativa": {
    "resumo": "Descrição da análise...",
    "achados": ["achado1", "achado2"],
    "recomendacoes": ["recomendacao1", ...]
  },
  "comparativo": {
    "avaliacao_anterior": { ... },
    "variacao": { ... },
    "evolucao_geral": "Melhora geral observada"
  },
  "interpretacao_final": {
    "avaliacao_ia": "Evolução positiva...",
    "confiabilidade_modelo": 0.93,
    "nota_global": 8.7
  },
  "metadata": {
    "gerado_por": "Assessoria de Anamnese – IA TrichoScalp",
    "versao_modelo": "1.0.0-mock",
    "data_processamento": "2025-01-24T14:30:00Z"
  }
}
```

### 🔗 Referências

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### ✅ Checklist Final

- [ ] Migration SQL executada
- [ ] Edge Function deployada
- [ ] Buckets criados e configurados
- [ ] Políticas RLS verificadas
- [ ] Fluxo completo testado
- [ ] Consentimento LGPD funcionando
- [ ] PDF sendo gerado corretamente
- [ ] Comparativo histórico exibindo dados
- [ ] Logs monitorados
- [ ] Documentação atualizada

---

**Status Atual:** ✅ Pronto para deploy e testes!

**Próxima etapa:** Executar migration e deploy da Edge Function conforme instruções acima.
