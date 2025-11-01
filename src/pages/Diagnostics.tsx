import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type StatRow = {
  label: string;
  value: number | string;
};

const mask = (val?: string) => {
  if (!val) return "(indefinido)";
  if (val.length <= 8) return "****";
  return `${val.slice(0, 6)}…${val.slice(-4)}`;
};

const Diagnostics = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<StatRow[]>([]);
  const [recentClientes, setRecentClientes] = useState<any[]>([]);
  const [recentAvaliacoes, setRecentAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const uid = auth.user?.id ?? "(não autenticado)";

        const supaUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
        const supaKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined;

        const { count: clientesCount } = await supabase
          .from("clientes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", auth.user?.id ?? "");

        const { count: avaliacoesCount } = await supabase
          .from("avaliacoes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", auth.user?.id ?? "");

        const { data: clientesData } = await supabase
          .from("clientes")
          .select("id,nome,created_at")
          .eq("user_id", auth.user?.id ?? "")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: avaliacoesData } = await supabase
          .from("avaliacoes")
          .select("id,created_at")
          .eq("user_id", auth.user?.id ?? "")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats([
          { label: "Modo", value: import.meta.env.MODE },
          { label: "Supabase URL", value: supaUrl || "(indefinido)" },
          { label: "Supabase Key (mascarada)", value: mask(supaKey) },
          { label: "User ID", value: uid },
          { label: "Clientes (do usuário)", value: clientesCount ?? 0 },
          { label: "Avaliações (do usuário)", value: avaliacoesCount ?? 0 },
        ]);

        setRecentClientes(clientesData || []);
        setRecentAvaliacoes(avaliacoesData || []);
      } catch (e: any) {
        console.error("Diagnostics error", e);
        setErrorMsg(e?.message || "Erro inesperado no diagnóstico");
        toast({
          title: "Erro de Diagnóstico",
          description: e?.message || "Falha ao coletar métricas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading text-white mb-4">Diagnóstico de Ambiente e Dados</h1>

      <Card className="card-brand mb-6">
        <h2 className="mb-4">Ambiente</h2>
        {loading ? (
          <p className="text-white/80">Coletando informações…</p>
        ) : errorMsg ? (
          <p className="text-red-400">{errorMsg}</p>
        ) : (
          <ul className="space-y-2">
            {stats.map((s) => (
              <li key={s.label} className="flex justify-between">
                <span className="text-white/80">{s.label}</span>
                <span className="text-white">{String(s.value)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-brand">
          <h2 className="mb-4">Últimos Clientes (do usuário)</h2>
          {recentClientes.length === 0 ? (
            <p className="text-white/80">Nenhum cliente encontrado</p>
          ) : (
            <ul className="space-y-2">
              {recentClientes.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span className="text-white">{c.nome}</span>
                  <span className="text-white/60">{new Date(c.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="card-brand">
          <h2 className="mb-4">Últimas Avaliações (do usuário)</h2>
          {recentAvaliacoes.length === 0 ? (
            <p className="text-white/80">Nenhuma avaliação encontrada</p>
          ) : (
            <ul className="space-y-2">
              {recentAvaliacoes.map((a) => (
                <li key={a.id} className="flex justify-between">
                  <span className="text-white">{a.id}</span>
                  <span className="text-white/60">{new Date(a.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>Recarregar</Button>
        <Button onClick={() => navigator.clipboard.writeText(JSON.stringify({ stats, recentClientes, recentAvaliacoes }, null, 2))}>Copiar JSON</Button>
      </div>
    </div>
  );
};

export default Diagnostics;