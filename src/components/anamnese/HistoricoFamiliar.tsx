import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HistoricoFamiliarProps {
  data: any;
  updateData: (data: any) => void;
}

const HistoricoFamiliar = ({ data, updateData }: HistoricoFamiliarProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Histórico Familiar</h2>
        <p className="text-muted-foreground">
          Histórico de problemas capilares na família
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Há casos de calvície na família?</Label>
          <RadioGroup
            value={data.calvicieFamilia || ""}
            onValueChange={(value) => handleChange("calvicieFamilia", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="calv-sim" />
              <Label htmlFor="calv-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="calv-nao" />
              <Label htmlFor="calv-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao-sei" id="calv-nao-sei" />
              <Label htmlFor="calv-nao-sei" className="font-normal cursor-pointer">
                Não sei
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.calvicieFamilia === "sim" && (
          <div className="space-y-2">
            <Label htmlFor="calvicie-detalhe">
              Quem na família possui calvície?
            </Label>
            <Textarea
              id="calvicie-detalhe"
              value={data.calvicieDetalhe || ""}
              onChange={(e) => handleChange("calvicieDetalhe", e.target.value)}
              placeholder="Ex: pai, mãe, avô materno, avó paterna..."
              rows={3}
            />
          </div>
        )}

        <div className="space-y-3">
          <Label>Há casos de doenças autoimunes na família?</Label>
          <RadioGroup
            value={data.autoimuneFamilia || ""}
            onValueChange={(value) => handleChange("autoimuneFamilia", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="auto-sim" />
              <Label htmlFor="auto-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="auto-nao" />
              <Label htmlFor="auto-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao-sei" id="auto-nao-sei" />
              <Label htmlFor="auto-nao-sei" className="font-normal cursor-pointer">
                Não sei
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.autoimuneFamilia === "sim" && (
          <div className="space-y-2">
            <Label htmlFor="autoimune-detalhe">
              Quais doenças autoimunes?
            </Label>
            <Textarea
              id="autoimune-detalhe"
              value={data.autoimuneDetalhe || ""}
              onChange={(e) => handleChange("autoimuneDetalhe", e.target.value)}
              placeholder="Ex: lúpus, alopecia areata, vitiligo, psoríase..."
              rows={3}
            />
          </div>
        )}

        <div className="space-y-3">
          <Label>Há casos de problemas de tireoide na família?</Label>
          <RadioGroup
            value={data.tireoideFamilia || ""}
            onValueChange={(value) => handleChange("tireoideFamilia", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="tire-sim" />
              <Label htmlFor="tire-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="tire-nao" />
              <Label htmlFor="tire-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao-sei" id="tire-nao-sei" />
              <Label htmlFor="tire-nao-sei" className="font-normal cursor-pointer">
                Não sei
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outros-problemas">
            Outros problemas capilares ou de saúde na família
          </Label>
          <Textarea
            id="outros-problemas"
            value={data.outrosProblemas || ""}
            onChange={(e) => handleChange("outrosProblemas", e.target.value)}
            placeholder="Descreva outros problemas relevantes na família..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricoFamiliar;
