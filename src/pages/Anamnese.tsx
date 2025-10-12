import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AnamneseNav from "@/components/anamnese/AnamneseNav";
import QueixaPrincipal from "@/components/anamnese/QueixaPrincipal";
import DadosClinicos from "@/components/anamnese/DadosClinicos";
import TratamentosAnteriores from "@/components/anamnese/TratamentosAnteriores";
import HistoricoSaude from "@/components/anamnese/HistoricoSaude";
import Habitos from "@/components/anamnese/Habitos";
import HistoricoFamiliar from "@/components/anamnese/HistoricoFamiliar";
import ExameFisico from "@/components/anamnese/ExameFisico";
import Tricoscopia from "@/components/anamnese/Tricoscopia";
import Informacoes from "@/components/anamnese/Informacoes";

const sections = [
  { id: "queixa-principal", label: "Queixa Principal" },
  { id: "dados-clinicos", label: "Dados Clínicos" },
  { id: "tratamentos-anteriores", label: "Tratamentos Anteriores" },
  { id: "historico-saude", label: "Histórico de Saúde" },
  { id: "habitos", label: "Hábitos" },
  { id: "historico-familiar", label: "Histórico Familiar" },
  { id: "exame-fisico", label: "Exame Físico" },
  { id: "tricoscopia", label: "Tricoscopia" },
  { id: "informacoes", label: "Informações" },
];

const Anamnese = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clienteId } = useParams();

  const progress = ((currentSection + 1) / sections.length) * 100;

  useEffect(() => {
    if (!clienteId) {
      navigate("/anamnese/selecionar-cliente");
      return;
    }
    fetchCliente();
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", clienteId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setCliente(data);
    } catch (error) {
      console.error("Error fetching cliente:", error);
      toast({
        title: "Erro ao carregar cliente",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive",
      });
      navigate("/anamnese/selecionar-cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index);
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("avaliacoes").insert([
        {
          cliente_id: clienteId,
          user_id: user.id,
          queixa_principal: formData["queixa-principal"],
          dados_clinicos: formData["dados-clinicos"],
          tratamentos_anteriores: formData["tratamentos-anteriores"],
          historico_saude: formData["historico-saude"],
          habitos: formData["habitos"],
          historico_familiar: formData["historico-familiar"],
          exame_fisico: formData["exame-fisico"],
          tricoscopia: formData["tricoscopia"],
          informacoes: formData["informacoes"],
        },
      ]);

      if (error) throw error;

      toast({
        title: "Avaliação salva!",
        description: "A avaliação foi salva com sucesso.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving avaliacao:", error);
      toast({
        title: "Erro ao salvar avaliação",
        description: "Não foi possível salvar a avaliação.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (sectionId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: data,
    }));
  };

  const renderSection = () => {
    const sectionId = sections[currentSection].id;
    const sectionData = formData[sectionId] || {};
    const updateData = (data: any) => updateFormData(sectionId, data);

    switch (sectionId) {
      case "queixa-principal":
        return <QueixaPrincipal data={sectionData} updateData={updateData} />;
      case "dados-clinicos":
        return <DadosClinicos data={sectionData} updateData={updateData} />;
      case "tratamentos-anteriores":
        return <TratamentosAnteriores data={sectionData} updateData={updateData} />;
      case "historico-saude":
        return <HistoricoSaude data={sectionData} updateData={updateData} />;
      case "habitos":
        return <Habitos data={sectionData} updateData={updateData} />;
      case "historico-familiar":
        return <HistoricoFamiliar data={sectionData} updateData={updateData} />;
      case "exame-fisico":
        return <ExameFisico data={sectionData} updateData={updateData} />;
      case "tricoscopia":
        return <Tricoscopia data={sectionData} updateData={updateData} />;
      case "informacoes":
        return <Informacoes data={sectionData} updateData={updateData} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-card">
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-heading font-bold">
                Nova Avaliação Capilar
              </h1>
              {cliente && (
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Cliente: {cliente.nome} • {cliente.telefone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progresso da Anamnese: {Math.round(progress)}%
            </span>
            <span className="text-sm text-muted-foreground">
              Seção {currentSection + 1} de {sections.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="lg:sticky lg:top-6 h-fit">
            <AnamneseNav
              sections={sections}
              currentSection={currentSection}
              onSectionClick={handleSectionClick}
            />
          </aside>

          <main>
            <div className="bg-card rounded-xl shadow-card p-6 min-h-[600px]">
              {renderSection()}

              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                {currentSection === sections.length - 1 ? (
                  <Button onClick={handleSave} className="gradient-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Anamnese
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gradient-primary">
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Anamnese;
