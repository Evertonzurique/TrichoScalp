import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClienteDialog } from "@/components/clientes/ClienteDialog";

interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  data_nascimento: string | null;
}

const SelecionarCliente = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefone.includes(searchTerm) ||
          (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClientes(filtered);
    }
  }, [searchTerm, clientes]);

  const fetchClientes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClientes(data || []);
      setFilteredClientes(data || []);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCliente = async (clienteData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("clientes")
        .insert([{ ...clienteData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Cliente adicionado!",
        description: "Cliente cadastrado com sucesso.",
      });

      setDialogOpen(false);
      await fetchClientes();
      
      // Navigate to anamnese with new client
      navigate(`/anamnese/${data.id}`);
    } catch (error) {
      console.error("Error adding cliente:", error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível adicionar o cliente.",
        variant: "destructive",
      });
    }
  };

  const handleSelectCliente = (clienteId: string) => {
    navigate(`/anamnese/${clienteId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando clientes...</p>
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
                Selecionar Cliente
              </h1>
              <p className="text-sm text-muted-foreground">
                Escolha um cliente existente ou cadastre um novo para iniciar a avaliação
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>

          {filteredClientes.length === 0 ? (
            <Card className="p-12 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Tente buscar com outros termos ou cadastre um novo cliente."
                  : "Comece cadastrando seu primeiro cliente para realizar avaliações."}
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Cliente
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredClientes.map((cliente) => (
                <Card
                  key={cliente.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSelectCliente(cliente.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{cliente.telefone}</span>
                          {cliente.email && <span>{cliente.email}</span>}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      Selecionar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddCliente}
      />
    </div>
  );
};

export default SelecionarCliente;
