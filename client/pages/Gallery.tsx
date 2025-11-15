import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Image as ImageIcon } from "lucide-react";

interface CaseStudyData {
  id: number | null;
  created_at: string;
  prompt: string;
  generated_text: string;
  image_url: string;
}

const STORAGE_KEY = "portfolio_pilot_case_studies";

export default function Gallery() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyData[]>([]);

  // Cargar casos de estudio del localStorage
  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCaseStudies(parsed);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  const handleDelete = (indexToDelete: number) => {
    try {
      const updatedCases = caseStudies.filter((_, index) => index !== indexToDelete);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCases));
      setCaseStudies(updatedCases);
    } catch (error) {
      console.error("Error deleting from localStorage:", error);
    }
  };

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
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              Home
            </Link>
            <span className="text-sm font-semibold text-primary">Gallery</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Your Private Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All your generated case studies, stored locally on your device
          </p>
        </div>

        {/* Empty State */}
        {caseStudies.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">No case studies yet</h3>
            <p className="text-muted-foreground mb-8">
              Generate your first case study to see it here
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First Case Study
              </Button>
            </Link>
          </div>
        )}

        {/* Gallery Grid */}
        {caseStudies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Delete case study"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Clickable Link Wrapper */}
                <Link to={`/case-study-result/${index}`} className="block">
                  {/* Image */}
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {caseStudy.image_url ? (
                      <img
                        src={caseStudy.image_url}
                        alt={caseStudy.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
                      {caseStudy.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(caseStudy.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {caseStudy.id && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {caseStudy.id}
                      </p>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        {caseStudies.length > 0 && (
          <div className="mt-12 p-6 border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Private & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Your case studies are stored locally on your device using localStorage.
                  They are private to you and never shared with anyone else. You have {caseStudies.length} case {caseStudies.length === 1 ? "study" : "studies"} saved.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Portfolio Pilot AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
