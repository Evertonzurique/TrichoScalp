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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold text-gradient">
              TricoPro
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">
            Bem-vindo ao TricoPro
          </h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e avaliações capilares de forma profissional
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="font-heading font-semibold mb-1">Clientes</h3>
            <p className="text-sm text-muted-foreground">
              Total de clientes cadastrados
            </p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple/10">
                <FileText className="h-6 w-6 text-purple" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="font-heading font-semibold mb-1">Avaliações</h3>
            <p className="text-sm text-muted-foreground">
              Avaliações capilares realizadas
            </p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="font-heading font-semibold mb-1">Este mês</h3>
            <p className="text-sm text-muted-foreground">
              Atendimentos no mês atual
            </p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 shadow-card">
            <h3 className="font-heading font-semibold text-lg mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start gradient-primary"
                onClick={() => navigate("/anamnese")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nova Avaliação Capilar
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Clientes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <FileText className="h-4 w-4 mr-2" />
                Histórico de Avaliações
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="font-heading font-semibold text-lg mb-4">
              Últimas Atividades
            </h3>
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma atividade recente</p>
              <p className="text-sm mt-2">
                Comece criando sua primeira avaliação capilar
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
