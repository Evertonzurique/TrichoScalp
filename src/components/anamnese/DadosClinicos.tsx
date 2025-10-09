import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DadosClinicosProps {
  data: any;
  updateData: (data: any) => void;
}

const DadosClinicos = ({ data, updateData }: DadosClinicosProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Dados Clínicos</h2>
        <p className="text-muted-foreground">
          Informações sobre condições de saúde do couro cabeludo
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Tipo de couro cabeludo</Label>
          <RadioGroup
            value={data.tipoCouro || ""}
            onValueChange={(value) => handleChange("tipoCouro", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal" className="font-normal cursor-pointer">
                Normal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oleoso" id="oleoso" />
              <Label htmlFor="oleoso" className="font-normal cursor-pointer">
                Oleoso
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seco" id="seco" />
              <Label htmlFor="seco" className="font-normal cursor-pointer">
                Seco
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="misto" id="misto" />
              <Label htmlFor="misto" className="font-normal cursor-pointer">
                Misto
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Presença de descamação?</Label>
          <RadioGroup
            value={data.descamacao || ""}
            onValueChange={(value) => handleChange("descamacao", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="desc-sim" />
              <Label htmlFor="desc-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="desc-nao" />
              <Label htmlFor="desc-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Presença de prurido (coceira)?</Label>
          <RadioGroup
            value={data.prurido || ""}
            onValueChange={(value) => handleChange("prurido", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="prur-sim" />
              <Label htmlFor="prur-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="prur-nao" />
              <Label htmlFor="prur-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sintomas">Outros sintomas ou observações</Label>
          <Textarea
            id="sintomas"
            value={data.sintomas || ""}
            onChange={(e) => handleChange("sintomas", e.target.value)}
            placeholder="Descreva quaisquer outros sintomas relevantes..."
            rows={5}
          />
        </div>

        <div className="space-y-3">
          <Label>Sensibilidade do couro cabeludo</Label>
          <RadioGroup
            value={data.sensibilidade || ""}
            onValueChange={(value) => handleChange("sensibilidade", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="sens-normal" />
              <Label htmlFor="sens-normal" className="font-normal cursor-pointer">
                Normal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sensivel" id="sens-sensivel" />
              <Label htmlFor="sens-sensivel" className="font-normal cursor-pointer">
                Sensível
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="muito-sensivel" id="sens-muito" />
              <Label htmlFor="sens-muito" className="font-normal cursor-pointer">
                Muito sensível
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default DadosClinicos;
