import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Sparkles, Image as ImageIcon, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CaseStudyData {
  id: number | null;
  created_at: string;
  prompt: string;
  generated_text: string;
  image_url: string;
  image_design_description?: string;
}

const STORAGE_KEY = "portfolio_pilot_case_studies";

export default function CaseStudyResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudyData | null>(
    location.state?.caseStudy || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generar el prompt para Builder.io
  const generateBuilderPrompt = () => {
    if (!caseStudy) return "";

    return `INSTRUCTIONS:

Create a professional case study webpage with the following elements.

TITLE:

${caseStudy.prompt}

DESIGN INSPIRATION:

This is the most important instruction. You must generate a new layout and visual design (colors, fonts, style) based 100% on the following creative brief: ${caseStudy.image_design_description || "Modern, clean, and professional design with attention to visual hierarchy and user experience."}

CONTENT:

Once you have the design, please add the following text content: ${caseStudy.generated_text}`;
  };

  // Copiar prompt al portapapeles
  const copyPromptToClipboard = () => {
    const prompt = generateBuilderPrompt();
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // useEffect 1: Cargar desde localStorage cuando hay un ID en la URL
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const casesList: CaseStudyData[] = JSON.parse(stored);
          const index = parseInt(id, 10);

          if (!isNaN(index) && index >= 0 && index < casesList.length) {
            setCaseStudy(casesList[index]);
          } else {
            // ID inválido, redirigir a galería
            navigate("/gallery");
          }
        } else {
          // No hay casos guardados
          navigate("/gallery");
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        navigate("/gallery");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, navigate]); // Solo depende de id y navigate

  // useEffect 2: Guardar en localStorage cuando es un caso nuevo (sin ID)
  useEffect(() => {
    // Solo ejecutar si NO hay ID y SÍ hay caseStudy del state
    if (!id && location.state?.caseStudy) {
      try {
        const existingCases = localStorage.getItem(STORAGE_KEY);
        const casesList: CaseStudyData[] = existingCases ? JSON.parse(existingCases) : [];

        // Añadir el nuevo caso al inicio de la lista
        casesList.unshift(location.state.caseStudy);

        // Guardar de vuelta en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(casesList));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
    // Si no hay ID ni caseStudy, redirigir a home
    else if (!id && !location.state?.caseStudy) {
      navigate("/");
    }
  }, []); // Solo se ejecuta UNA VEZ al montar el componente

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading your case study...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve your content</p>
        </div>
      </div>
    );
  }

  // Si no hay caso de estudio después de cargar
  if (!caseStudy) {
    return null;
  }

  // Verificar que generated_text existe antes de renderizar
  if (!caseStudy.generated_text) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Incomplete case study</h2>
          <p className="text-muted-foreground mb-6">This case study is missing content</p>
          <Link to="/gallery">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Portfolio Pilot AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/gallery">
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                My Gallery
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Success Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Case Study Generated Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                {caseStudy.id ? `Saved to database (ID: ${caseStudy.id})` : "Generated successfully"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        {caseStudy.image_url && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            <img
              src={caseStudy.image_url}
              alt="Case Study Cover"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          <Button
            onClick={() => {
              // Copy text to clipboard
              navigator.clipboard.writeText(caseStudy.generated_text);
              alert("Case study copied to clipboard!");
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Copy Text
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: "My Case Study",
                  text: caseStudy.generated_text,
                });
              } else {
                alert("Sharing not supported on this browser");
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsPromptModalOpen(true)}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Get Builder.io Prompt
          </Button>
        </div>

        {/* Case Study Content */}
        <article className="prose prose-lg max-w-none">
          {caseStudy.generated_text.split("###").filter(Boolean).map((section, index) => {
            const [title, ...content] = section.trim().split("\n");
            return (
              <div key={index} className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  {title.trim()}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {content.join("\n").trim()}
                </div>
              </div>
            );
          })}
        </article>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-border/50 text-center">
          <h3 className="text-2xl font-bold mb-4">Create Another Case Study?</h3>
          <p className="text-muted-foreground mb-6">
            Generate unlimited professional case studies with AI
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90"
          >
            Generate Another
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>

      {/* Builder.io Prompt Modal */}
      <Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your AI Prompt for Builder.io</DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <p className="text-sm">
                  Copy this prompt using the button below
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <p className="text-sm">
                  Paste it into the AI bar of your 'Development Space' in Builder.io
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              readOnly
              value={generateBuilderPrompt()}
              className="min-h-[350px] font-mono text-sm resize-none"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              onClick={copyPromptToClipboard}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isCopied}
            >
              {isCopied ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Copy Prompt to Clipboard
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20 bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Portfolio Pilot AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
