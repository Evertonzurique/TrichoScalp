import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TricoscopiaProps {
  data: any;
  updateData: (data: any) => void;
}

const Tricoscopia = ({ data, updateData }: TricoscopiaProps) => {
  const [images, setImages] = useState<string[]>(data.images || []);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 14) {
      toast({
        title: "Limite excedido",
        description: "Você pode fazer upload de no máximo 14 imagens.",
        variant: "destructive",
      });
      return;
    }

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          updateData({ ...data, images: updatedImages });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    updateData({ ...data, images: updatedImages });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Tricoscopia</h2>
        <p className="text-muted-foreground">
          Análise tricoscópica com upload de imagens (9-14 fotos)
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Imagens da Tricoscopia</Label>
            <span className="text-sm text-muted-foreground">
              {images.length} / 14 imagens
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Tricoscopia ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {images.length < 14 && (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-accent transition-smooth">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Adicionar foto
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="achados-padrao">Achados - Avaliação Padrão</Label>
          <Textarea
            id="achados-padrao"
            value={data.achadosPadrao || ""}
            onChange={(e) => handleChange("achadosPadrao", e.target.value)}
            placeholder="Descreva os achados da avaliação padrão..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achados-especifica">Achados - Avaliação Específica</Label>
          <Textarea
            id="achados-especifica"
            value={data.achadosEspecifica || ""}
            onChange={(e) => handleChange("achadosEspecifica", e.target.value)}
            placeholder="Descreva os achados da avaliação específica..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="densidade-foliculos">
            Densidade de folículos pilosos
          </Label>
          <Textarea
            id="densidade-foliculos"
            value={data.densidadeFoliculos || ""}
            onChange={(e) => handleChange("densidadeFoliculos", e.target.value)}
            placeholder="Descreva a densidade folicular observada..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="miniaturizacao">Presença de miniaturização</Label>
          <Textarea
            id="miniaturizacao"
            value={data.miniaturizacao || ""}
            onChange={(e) => handleChange("miniaturizacao", e.target.value)}
            placeholder="Descreva se há presença de fios miniaturizados..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes-trico">
            Observações adicionais da tricoscopia
          </Label>
          <Textarea
            id="observacoes-trico"
            value={data.observacoesTrico || ""}
            onChange={(e) => handleChange("observacoesTrico", e.target.value)}
            placeholder="Outras observações relevantes..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default Tricoscopia;
