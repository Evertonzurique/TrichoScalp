import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Users, FileText, PlusCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientesCount, setClientesCount] = useState(0);
  const [avaliacoesCount, setAvaliacoesCount] = useState(0);
  const [avaliacoesThisMonth, setAvaliacoesThisMonth] = useState(0);
  const [recentAvaliacoes, setRecentAvaliacoes] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);
      await fetchStats(user.id);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchStats = async (userId: string) => {
    try {
      // Count clientes
      const { count: clientesCount } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      setClientesCount(clientesCount || 0);

      // Count avaliacoes
      const { count: avaliacoesCount } = await supabase
        .from("avaliacoes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      setAvaliacoesCount(avaliacoesCount || 0);

      // Count avaliacoes this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: monthCount } = await supabase
        .from("avaliacoes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());
      
      setAvaliacoesThisMonth(monthCount || 0);

      // Fetch recent avaliacoes
      const { data: recentData } = await supabase
        .from("avaliacoes")
        .select(`
          id,
          created_at,
          cliente:clientes(nome)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      
      setRecentAvaliacoes(recentData || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
          <p className="mt-4 text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-background">
      <header className="border-b bg-black/40 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo-com-texto.png"
                alt="TrichoScalp Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/90">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2 text-white">
            Bem-vindo ao TrichoScalp
          </h2>
          <p className="text-white/90">
            Gerencie seus clientes e avaliações capilares de forma profissional
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="card-brand cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <span className="stat-number">{clientesCount}</span>
            </div>
            <h3>Clientes</h3>
            <p>
              Total de clientes cadastrados
            </p>
          </div>

          <div className="card-brand cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple/20">
                <FileText className="h-6 w-6 text-purple" />
              </div>
              <span className="stat-number">{avaliacoesCount}</span>
            </div>
            <h3>Avaliações</h3>
            <p>
              Avaliações capilares realizadas
            </p>
          </div>

          <div className="card-brand cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-secondary/20">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <span className="stat-number">{avaliacoesThisMonth}</span>
            </div>
            <h3>Este mês</h3>
            <p>
              Atendimentos no mês atual
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-brand">
            <h3 className="mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-accent hover:bg-accent/90 text-white"
                onClick={() => navigate("/anamnese/selecionar-cliente")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nova Avaliação Capilar
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate("/clientes")}
              >
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Clientes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate("/avaliacoes")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Histórico de Avaliações
              </Button>
            </div>
          </div>

          <div className="card-brand">
            <h3 className="mb-4">
              Últimas Atividades
            </h3>
            {recentAvaliacoes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/80">Nenhuma atividade recente</p>
                <p className="text-sm mt-2 text-white/60">
                  Comece criando sua primeira avaliação capilar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAvaliacoes.map((avaliacao) => (
                  <div
                    key={avaliacao.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{avaliacao.cliente?.nome}</p>
                      <p className="text-sm text-white/70">
                        {new Date(avaliacao.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/avaliacoes")}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
