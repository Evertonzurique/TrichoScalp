import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Camera, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Organize e acompanhe todos os seus clientes em um só lugar",
    },
    {
      icon: FileText,
      title: "Anamnese Completa",
      description: "Formulário detalhado com todas as informações necessárias",
    },
    {
      icon: Camera,
      title: "Análise Tricoscópica",
      description: "Upload e organização de imagens para análise profissional",
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento",
      description: "Histórico completo de avaliações e resultados",
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Seus dados e de seus clientes protegidos e privados",
    },
    {
      icon: Zap,
      title: "Produtividade",
      description: "Automatize processos e economize tempo valioso",
    },
  ];

  const benefits = [
    "Interface intuitiva e fácil de usar",
    "Acesso de qualquer dispositivo",
    "Suporte especializado",
    "Atualizações constantes",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-card py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src="/brand/logo-com-texto.png"
                alt="Logo Anamnese Capilar"
                className="h-20 w-auto mb-4"
                loading="eager"
                onError={(e) => {
                  console.log('Erro ao carregar logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-white">
                TrichoScalp
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Plataforma profissional para especialistas capilares
            </p>
            <p className="text-lg mb-8 text-white/80">
              Gerencie seus clientes, realize avaliações detalhadas e acompanhe resultados de forma profissional e organizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-primary text-lg px-8"
                onClick={() => navigate("/auth")}
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate("/auth")}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-muted-foreground">
              Ferramentas profissionais para otimizar sua rotina
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 shadow-card hover:shadow-elevated transition-smooth"
              >
                <div className="inline-flex p-3 rounded-lg bg-accent/10 mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Por que escolher nossa plataforma?
              </h2>
              <p className="text-xl text-muted-foreground">
                Desenvolvido por especialistas, para especialistas
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="gradient-primary text-lg px-12"
                onClick={() => navigate("/auth")}
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-card py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-heading font-bold mb-4 text-white">
              Pronto para transformar sua prática profissional?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Junte-se a profissionais que já utilizam a plataforma
            </p>
            <Button
              size="lg"
              className="gradient-primary text-lg px-12"
              onClick={() => navigate("/auth")}
            >
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 TrichoScalp. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
