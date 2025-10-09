import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface HabitosProps {
  data: any;
  updateData: (data: any) => void;
}

const Habitos = ({ data, updateData }: HabitosProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Hábitos</h2>
        <p className="text-muted-foreground">
          Estilo de vida e hábitos que podem afetar a saúde capilar
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="alimentacao">Como você descreveria sua alimentação?</Label>
          <Textarea
            id="alimentacao"
            value={data.alimentacao || ""}
            onChange={(e) => handleChange("alimentacao", e.target.value)}
            placeholder="Descreva seus hábitos alimentares..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>Fuma?</Label>
          <RadioGroup
            value={data.fuma || ""}
            onValueChange={(value) => handleChange("fuma", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="fuma-sim" />
              <Label htmlFor="fuma-sim" className="font-normal cursor-pointer">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="fuma-nao" />
              <Label htmlFor="fuma-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ex-fumante" id="fuma-ex" />
              <Label htmlFor="fuma-ex" className="font-normal cursor-pointer">
                Ex-fumante
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Consome bebidas alcoólicas?</Label>
          <RadioGroup
            value={data.alcool || ""}
            onValueChange={(value) => handleChange("alcool", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nunca" id="alcool-nunca" />
              <Label htmlFor="alcool-nunca" className="font-normal cursor-pointer">
                Nunca
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ocasionalmente" id="alcool-ocasional" />
              <Label htmlFor="alcool-ocasional" className="font-normal cursor-pointer">
                Ocasionalmente
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regularmente" id="alcool-regular" />
              <Label htmlFor="alcool-regular" className="font-normal cursor-pointer">
                Regularmente
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Pratica atividades físicas?</Label>
          <RadioGroup
            value={data.atividadeFisica || ""}
            onValueChange={(value) => handleChange("atividadeFisica", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="ativ-nao" />
              <Label htmlFor="ativ-nao" className="font-normal cursor-pointer">
                Não
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="leve" id="ativ-leve" />
              <Label htmlFor="ativ-leve" className="font-normal cursor-pointer">
                Leve (1-2x por semana)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderada" id="ativ-moderada" />
              <Label htmlFor="ativ-moderada" className="font-normal cursor-pointer">
                Moderada (3-4x por semana)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intensa" id="ativ-intensa" />
              <Label htmlFor="ativ-intensa" className="font-normal cursor-pointer">
                Intensa (5x ou mais por semana)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sono">Quantas horas dorme por noite em média?</Label>
          <Input
            id="sono"
            type="number"
            min="0"
            max="24"
            value={data.sono || ""}
            onChange={(e) => handleChange("sono", e.target.value)}
            placeholder="Ex: 7"
          />
        </div>

        <div className="space-y-3">
          <Label>Nível de estresse no dia a dia</Label>
          <RadioGroup
            value={data.estresse || ""}
            onValueChange={(value) => handleChange("estresse", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="baixo" id="stress-baixo" />
              <Label htmlFor="stress-baixo" className="font-normal cursor-pointer">
                Baixo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderado" id="stress-moderado" />
              <Label htmlFor="stress-moderado" className="font-normal cursor-pointer">
                Moderado
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="alto" id="stress-alto" />
              <Label htmlFor="stress-alto" className="font-normal cursor-pointer">
                Alto
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lavagem">Com que frequência lava os cabelos?</Label>
          <Input
            id="lavagem"
            value={data.lavagem || ""}
            onChange={(e) => handleChange("lavagem", e.target.value)}
            placeholder="Ex: todos os dias, 3x por semana..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exposicao-sol">Exposição ao sol</Label>
          <Textarea
            id="exposicao-sol"
            value={data.exposicaoSol || ""}
            onChange={(e) => handleChange("exposicaoSol", e.target.value)}
            placeholder="Descreva sua exposição ao sol e uso de proteção..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Habitos;
