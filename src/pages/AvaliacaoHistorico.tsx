import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AvaliacaoCard from "@/components/avaliacoes/AvaliacaoCard";
import AvaliacaoDetalhes from "@/components/avaliacoes/AvaliacaoDetalhes";

// ==================== EXEMPLO DE USO DO MÓDULO PDF ====================
// 
// Para usar o novo módulo de geração de PDF em outros componentes:
//
// import { usePDFGenerator, useTrichologyReportData } from "@/hooks/usePDFGenerator";
// import { generateTrichologyPDF } from "@/lib/pdf-generator";
//
// const { generatePDF, isGenerating, progress } = usePDFGenerator();
// const { prepareReportData } = useTrichologyReportData();
//
// const handleGeneratePDF = async (avaliacao) => {
//   const reportData = prepareReportData(
//     avaliacao.cliente,
//     avaliacao.anamnese,
//     avaliacao.imagens,
//     avaliacao.analise_ia,
//     profissional
//   );
//   
//   await generatePDF(reportData, {
//     autoDownload: true,
//     uploadToStorage: true,
//     theme: 'light'
//   });
// };
//
// =====================================================================

const AvaliacaoHistorico = () => {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [filteredAvaliacoes, setFilteredAvaliacoes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any>(null);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAvaliacoes(avaliacoes);
    } else {
      const filtered = avaliacoes.filter((avaliacao) =>
        avaliacao.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAvaliacoes(filtered);
    }
  }, [searchTerm, avaliacoes]);

  const fetchAvaliacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
          *,
          cliente:clientes(nome)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAvaliacoes(data || []);
      setFilteredAvaliacoes(data || []);
    } catch (error) {
      console.error("Error fetching avaliacoes:", error);
      toast({
        title: "Erro ao carregar avaliações",
        description: "Não foi possível carregar o histórico de avaliações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAvaliacao = (avaliacaoId: string) => {
    const avaliacao = avaliacoes.find((a) => a.id === avaliacaoId);
    setSelectedAvaliacao(avaliacao);
    setDetalhesOpen(true);
  };

  const handleDeleteAvaliacao = async (avaliacaoId: string) => {
    try {
      setDeletingId(avaliacaoId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("avaliacoes")
        .delete()
        .eq("id", avaliacaoId);

      if (error) throw error;

      setAvaliacoes((prev) => prev.filter((a) => a.id !== avaliacaoId));
      setFilteredAvaliacoes((prev) => prev.filter((a) => a.id !== avaliacaoId));

      toast({
        title: "Avaliação excluída",
        description: "A avaliação foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando avaliações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-background">
      <header className="bg-black/40 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-heading font-bold text-white">
                Histórico de Avaliações
              </h1>
              <p className="text-sm text-white/80">
                Visualize todas as avaliações capilares realizadas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="relative">
              <label htmlFor="search-client" className="sr-only">Buscar por nome do cliente</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-client"
                aria-label="Buscar por cliente"
                placeholder="Buscar por nome do cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-primary/20 shadow-card rounded-lg focus-visible:ring-accent/50 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {filteredAvaliacoes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "Nenhuma avaliação encontrada"
                  : "Nenhuma avaliação realizada"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Tente buscar com outros termos."
                  : "Comece criando sua primeira avaliação capilar."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate("/anamnese/selecionar-cliente")}
                  aria-label="Criar nova avaliação capilar"
                  className="gradient-primary shadow-card"
                >
                  Nova Avaliação
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAvaliacoes.map((avaliacao) => (
                <AvaliacaoCard
                  key={avaliacao.id}
                  avaliacao={avaliacao}
                  onView={handleViewAvaliacao}
                  onDelete={handleDeleteAvaliacao}
                  isDeleting={deletingId === avaliacao.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AvaliacaoDetalhes
        avaliacao={selectedAvaliacao}
        open={detalhesOpen}
        onOpenChange={setDetalhesOpen}
      />
    </div>
  );
};

export default AvaliacaoHistorico;
