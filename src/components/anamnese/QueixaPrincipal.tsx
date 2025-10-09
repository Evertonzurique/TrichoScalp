import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface QueixaPrincipalProps {
  data: any;
  updateData: (data: any) => void;
}

const QueixaPrincipal = ({ data, updateData }: QueixaPrincipalProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Queixa Principal</h2>
        <p className="text-muted-foreground">
          Motivo da consulta e principais preocupações do paciente
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="queixa">Qual é a sua queixa principal? *</Label>
          <Textarea
            id="queixa"
            value={data.queixa || ""}
            onChange={(e) => handleChange("queixa", e.target.value)}
            placeholder="Descreva o motivo da consulta..."
            rows={5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tempo-queixa">Há quanto tempo apresenta essa queixa?</Label>
          <Input
            id="tempo-queixa"
            value={data.tempoQueixa || ""}
            onChange={(e) => handleChange("tempoQueixa", e.target.value)}
            placeholder="Ex: 6 meses, 1 ano..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evolucao">Como a queixa evoluiu ao longo do tempo?</Label>
          <Textarea
            id="evolucao"
            value={data.evolucao || ""}
            onChange={(e) => handleChange("evolucao", e.target.value)}
            placeholder="Descreva se houve piora, melhora ou permaneceu estável..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatores-agravantes">
            Fatores que pioram ou melhoram o problema
          </Label>
          <Textarea
            id="fatores-agravantes"
            value={data.fatoresAgravantes || ""}
            onChange={(e) => handleChange("fatoresAgravantes", e.target.value)}
            placeholder="Ex: stress, alimentação, clima, produtos específicos..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default QueixaPrincipal;
