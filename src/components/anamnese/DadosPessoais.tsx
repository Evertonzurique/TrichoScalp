import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DadosPessoaisProps {
  data: any;
  updateData: (data: any) => void;
}

const DadosPessoais = ({ data, updateData }: DadosPessoaisProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Dados Pessoais</h2>
        <p className="text-muted-foreground">
          Informações básicas do paciente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input
            id="nome"
            value={data.nome || ""}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Nome do paciente"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data-nascimento">Data de nascimento *</Label>
          <Input
            id="data-nascimento"
            type="date"
            value={data.dataNascimento || ""}
            onChange={(e) => handleChange("dataNascimento", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            type="tel"
            value={data.telefone || ""}
            onChange={(e) => handleChange("telefone", e.target.value)}
            placeholder="(00) 00000-0000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Textarea
            id="endereco"
            value={data.endereco || ""}
            onChange={(e) => handleChange("endereco", e.target.value)}
            placeholder="Endereço completo"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profissao">Profissão</Label>
          <Input
            id="profissao"
            value={data.profissao || ""}
            onChange={(e) => handleChange("profissao", e.target.value)}
            placeholder="Profissão do paciente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado-civil">Estado civil</Label>
          <Input
            id="estado-civil"
            value={data.estadoCivil || ""}
            onChange={(e) => handleChange("estadoCivil", e.target.value)}
            placeholder="Solteiro(a), Casado(a), etc."
          />
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;
