import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HistoricoSaudeProps {
  data: any;
  updateData: (data: any) => void;
}

const HistoricoSaude = ({ data, updateData }: HistoricoSaudeProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Histórico de Saúde</h2>
        <p className="text-muted-foreground">
          Condições de saúde geral que podem afetar os cabelos
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="doencas">
            Possui alguma doença crônica ou condição médica?
          </Label>
          <Textarea
            id="doencas"
            value={data.doencas || ""}
            onChange={(e) => handleChange("doencas", e.target.value)}
            placeholder="Ex: diabetes, hipertensão, problemas de tireoide, doenças autoimunes..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicamentos-continuo">
            Faz uso contínuo de algum medicamento?
          </Label>
          <Textarea
            id="medicamentos-continuo"
            value={data.medicamentosContinuo || ""}
            onChange={(e) => handleChange("medicamentosContinuo", e.target.value)}
            placeholder="Liste os medicamentos e para que são usados..."
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label>Já passou por alguma cirurgia?</Label>
          <RadioGroup
            value={data.cirurgias || ""}
            onValueChange={(value) => handleChange("cirurgias", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="cirur-sim" />
              <Label htmlFor="cirur-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="cirur-nao" />
              <Label htmlFor="cirur-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.cirurgias === "sim" && (
          <div className="space-y-2">
            <Label htmlFor="cirurgias-detalhe">Quais cirurgias?</Label>
            <Textarea
              id="cirurgias-detalhe"
              value={data.cirurgiasDetalhe || ""}
              onChange={(e) => handleChange("cirurgiasDetalhe", e.target.value)}
              placeholder="Descreva as cirurgias realizadas..."
              rows={3}
            />
          </div>
        )}

        <div className="space-y-3">
          <Label>Possui alergias?</Label>
          <RadioGroup
            value={data.alergias || ""}
            onValueChange={(value) => handleChange("alergias", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="aler-sim" />
              <Label htmlFor="aler-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="aler-nao" />
              <Label htmlFor="aler-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.alergias === "sim" && (
          <div className="space-y-2">
            <Label htmlFor="alergias-detalhe">A quais substâncias?</Label>
            <Textarea
              id="alergias-detalhe"
              value={data.alergiasDetalhe || ""}
              onChange={(e) => handleChange("alergiasDetalhe", e.target.value)}
              placeholder="Ex: medicamentos, alimentos, produtos químicos..."
              rows={3}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="historico-outros">Outras informações relevantes</Label>
          <Textarea
            id="historico-outros"
            value={data.outrasInfo || ""}
            onChange={(e) => handleChange("outrasInfo", e.target.value)}
            placeholder="Qualquer outra informação médica importante..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricoSaude;
