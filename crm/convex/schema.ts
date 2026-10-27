// CRM do Estúdio — esquema do banco (Convex).
// Modelo: uma tabela de documentos JSON, igual ao banco do painel antigo.
//   collection = "leads" ou "config"; docId = @ do Instagram (leads) ou "cadencia"/"metas" (config)
//   json = o documento serializado (texto), para aceitar qualquer formato de campo.
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  docs: defineTable({
    collection: v.string(),
    docId: v.string(),
    json: v.string(),
    updatedAt: v.string(),
  }).index("by_collection_doc", ["collection", "docId"]),
});
