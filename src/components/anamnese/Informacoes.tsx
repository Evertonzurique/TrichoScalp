import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InformacoesProps {
  data: any;
  updateData: (data: any) => void;
}

const Informacoes = ({ data, updateData }: InformacoesProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Informações</h2>
        <p className="text-muted-foreground">
          Informações gerais sobre testes, tratamentos e observações finais
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="testes-realizados">Testes realizados</Label>
          <Textarea
            id="testes-realizados"
            value={data.testesRealizados || ""}
            onChange={(e) => handleChange("testesRealizados", e.target.value)}
            placeholder="Liste quais testes foram realizados durante a avaliação..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resultados-testes">Resultados dos testes</Label>
          <Textarea
            id="resultados-testes"
            value={data.resultadosTestes || ""}
            onChange={(e) => handleChange("resultadosTestes", e.target.value)}
            placeholder="Descreva os resultados obtidos..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnostico-preliminar">Diagnóstico preliminar</Label>
          <Textarea
            id="diagnostico-preliminar"
            value={data.diagnosticoPreliminar || ""}
            onChange={(e) => handleChange("diagnosticoPreliminar", e.target.value)}
            placeholder="Descreva o diagnóstico preliminar baseado na avaliação..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plano-tratamento">Plano de tratamento sugerido</Label>
          <Textarea
            id="plano-tratamento"
            value={data.planoTratamento || ""}
            onChange={(e) => handleChange("planoTratamento", e.target.value)}
            placeholder="Descreva o plano de tratamento recomendado..."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientacoes">Orientações ao paciente</Label>
          <Textarea
            id="orientacoes"
            value={data.orientacoes || ""}
            onChange={(e) => handleChange("orientacoes", e.target.value)}
            placeholder="Orientações e cuidados que o paciente deve seguir..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes-finais">Observações finais</Label>
          <Textarea
            id="observacoes-finais"
            value={data.observacoesFinais || ""}
            onChange={(e) => handleChange("observacoesFinais", e.target.value)}
            placeholder="Qualquer observação adicional relevante para o caso..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proximos-passos">Próximos passos</Label>
          <Textarea
            id="proximos-passos"
            value={data.proximosPassos || ""}
            onChange={(e) => handleChange("proximosPassos", e.target.value)}
            placeholder="Agende retornos, exames complementares, etc..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default Informacoes;
