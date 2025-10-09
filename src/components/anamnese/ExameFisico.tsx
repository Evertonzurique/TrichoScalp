import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ExameFisicoProps {
  data: any;
  updateData: (data: any) => void;
}

const ExameFisico = ({ data, updateData }: ExameFisicoProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Exame Físico</h2>
        <p className="text-muted-foreground">
          Observações clínicas sobre o couro cabeludo e cabelos
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="densidade">Densidade capilar</Label>
          <Input
            id="densidade"
            value={data.densidade || ""}
            onChange={(e) => handleChange("densidade", e.target.value)}
            placeholder="Ex: normal, reduzida, muito reduzida..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calibre">Calibre dos fios</Label>
          <Input
            id="calibre"
            value={data.calibre || ""}
            onChange={(e) => handleChange("calibre", e.target.value)}
            placeholder="Ex: fino, médio, grosso..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textura">Textura dos cabelos</Label>
          <Input
            id="textura"
            value={data.textura || ""}
            onChange={(e) => handleChange("textura", e.target.value)}
            placeholder="Ex: liso, ondulado, cacheado, crespo..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coloracao">Coloração</Label>
          <Input
            id="coloracao"
            value={data.coloracao || ""}
            onChange={(e) => handleChange("coloracao", e.target.value)}
            placeholder="Ex: natural, tingido, grisalho..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="padrao-queda">Padrão de queda capilar</Label>
          <Textarea
            id="padrao-queda"
            value={data.padraoQueda || ""}
            onChange={(e) => handleChange("padraoQueda", e.target.value)}
            placeholder="Descreva o padrão de queda observado (se houver)..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="couro-aspecto">Aspecto do couro cabeludo</Label>
          <Textarea
            id="couro-aspecto"
            value={data.couroAspecto || ""}
            onChange={(e) => handleChange("couroAspecto", e.target.value)}
            placeholder="Ex: normal, inflamado, descamação, lesões..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areas-afetadas">Áreas afetadas</Label>
          <Textarea
            id="areas-afetadas"
            value={data.areasAfetadas || ""}
            onChange={(e) => handleChange("areasAfetadas", e.target.value)}
            placeholder="Descreva quais áreas do couro cabeludo estão afetadas..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes-exame">Observações gerais do exame</Label>
          <Textarea
            id="observacoes-exame"
            value={data.observacoesExame || ""}
            onChange={(e) => handleChange("observacoesExame", e.target.value)}
            placeholder="Qualquer outra observação relevante..."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

export default ExameFisico;
