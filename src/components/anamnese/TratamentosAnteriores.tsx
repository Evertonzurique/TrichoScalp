import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TratamentosAnterioresProps {
  data: any;
  updateData: (data: any) => void;
}

const TratamentosAnteriores = ({ data, updateData }: TratamentosAnterioresProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Tratamentos Anteriores</h2>
        <p className="text-muted-foreground">
          Histórico de tratamentos capilares realizados
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Já realizou algum tratamento capilar anteriormente?</Label>
          <RadioGroup
            value={data.realizouTratamento || ""}
            onValueChange={(value) => handleChange("realizouTratamento", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="trat-sim" />
              <Label htmlFor="trat-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="trat-nao" />
              <Label htmlFor="trat-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.realizouTratamento === "sim" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="tratamentos">Quais tratamentos realizou?</Label>
              <Textarea
                id="tratamentos"
                value={data.tratamentos || ""}
                onChange={(e) => handleChange("tratamentos", e.target.value)}
                placeholder="Ex: PRP, laser, medicamentos tópicos, transplante capilar..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultado-tratamento">
                Resultado dos tratamentos anteriores
              </Label>
              <Textarea
                id="resultado-tratamento"
                value={data.resultadoTratamento || ""}
                onChange={(e) => handleChange("resultadoTratamento", e.target.value)}
                placeholder="Descreva se houve melhora, nenhum resultado ou piora..."
                rows={4}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="produtos-uso">
            Produtos capilares em uso atualmente
          </Label>
          <Textarea
            id="produtos-uso"
            value={data.produtosUso || ""}
            onChange={(e) => handleChange("produtosUso", e.target.value)}
            placeholder="Liste shampoos, condicionadores, tônicos, medicamentos..."
            rows={5}
          />
        </div>

        <div className="space-y-3">
          <Label>Uso de medicamentos para cabelo ou couro cabeludo?</Label>
          <RadioGroup
            value={data.usoMedicamentos || ""}
            onValueChange={(value) => handleChange("usoMedicamentos", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="med-sim" />
              <Label htmlFor="med-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="med-nao" />
              <Label htmlFor="med-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
          </RadioGroup>
        </div>

        {data.usoMedicamentos === "sim" && (
          <div className="space-y-2">
            <Label htmlFor="medicamentos">Quais medicamentos?</Label>
            <Textarea
              id="medicamentos"
              value={data.medicamentos || ""}
              onChange={(e) => handleChange("medicamentos", e.target.value)}
              placeholder="Liste os medicamentos e dosagens..."
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TratamentosAnteriores;
