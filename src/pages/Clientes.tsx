import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Search, User, Edit, Trash2, Phone, Mail, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { User as AuthUser } from "@supabase/supabase-js";
import { ClienteDialog, type ClienteFormData } from "@/components/clientes/ClienteDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  data_nascimento: string | null;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  instagram: string | null;
  observacoes: string | null;
  created_at: string;
}

const Clientes = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);
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
      await fetchClientes();
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar clientes",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setClientes(data || []);
  };

  const handleAddCliente = async (data: ClienteFormData) => {
    if (!user?.id) return;

    const { error } = await supabase.from("clientes").insert({
      nome: data.nome,
      telefone: data.telefone,
      user_id: user.id,
      email: data.email || null,
      data_nascimento: data.data_nascimento || null,
      cpf: data.cpf || null,
      endereco: data.endereco || null,
      cidade: data.cidade || null,
      estado: data.estado || null,
      instagram: data.instagram || null,
      observacoes: data.observacoes || null,
    });

    if (error) {
      toast({
        title: "Erro ao adicionar cliente",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cliente adicionado",
      description: "Cliente cadastrado com sucesso!",
    });

    setDialogOpen(false);
    await fetchClientes();
  };

  const handleEditCliente = async (data: ClienteFormData) => {
    if (!editingCliente) return;

    const { error } = await supabase
      .from("clientes")
      .update({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email || null,
        data_nascimento: data.data_nascimento || null,
        cpf: data.cpf || null,
        endereco: data.endereco || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        instagram: data.instagram || null,
        observacoes: data.observacoes || null,
      })
      .eq("id", editingCliente.id);

    if (error) {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cliente atualizado",
      description: "Dados atualizados com sucesso!",
    });

    setDialogOpen(false);
    setEditingCliente(null);
    await fetchClientes();
  };

  const handleDeleteCliente = async () => {
    if (!clienteToDelete) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", clienteToDelete);

    if (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cliente excluído",
      description: "Cliente removido com sucesso!",
    });

    setDeleteDialogOpen(false);
    setClienteToDelete(null);
    await fetchClientes();
  };

  const openEditDialog = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setDialogOpen(true);
  };

  const openDeleteDialog = (clienteId: string) => {
    setClienteToDelete(clienteId);
    setDeleteDialogOpen(true);
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-heading font-bold text-gradient">
                Gerenciar Clientes
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            className="gradient-primary"
            onClick={() => {
              setEditingCliente(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {filteredClientes.length === 0 ? (
          <Card className="p-6 shadow-card">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <User className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                {clientes.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum cliente encontrado"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {clientes.length === 0 
                  ? "Comece adicionando seu primeiro cliente ao sistema"
                  : "Tente buscar com outro termo"}
              </p>
              {clientes.length === 0 && (
                <Button 
                  className="gradient-primary"
                  onClick={() => {
                    setEditingCliente(null);
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Cliente
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="p-6 shadow-card hover:shadow-elevated transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg mb-1">
                      {cliente.nome}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {cliente.telefone}
                      </div>
                      {cliente.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {cliente.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {cliente.observacoes && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {cliente.observacoes}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 gradient-primary"
                    onClick={() => navigate(`/anamnese/${cliente.id}`)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Nova Avaliação
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(cliente)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(cliente.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <ClienteDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingCliente(null);
          }}
          onSubmit={editingCliente ? handleEditCliente : handleAddCliente}
          initialData={editingCliente ? {
            nome: editingCliente.nome,
            email: editingCliente.email || "",
            telefone: editingCliente.telefone,
            data_nascimento: editingCliente.data_nascimento || "",
            cpf: editingCliente.cpf || "",
            endereco: editingCliente.endereco || "",
            cidade: editingCliente.cidade || "",
            estado: editingCliente.estado || "",
            instagram: editingCliente.instagram || "",
            observacoes: editingCliente.observacoes || "",
          } : undefined}
          isEditing={!!editingCliente}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCliente} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Clientes;
