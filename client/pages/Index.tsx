import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-case-study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate case study");
      }

      const data = await response.json();

      // Navigate to the result page with the case study data
      navigate("/case-study-result", {
        state: {
          caseStudy: data.newCaseStudy
        }
      });

    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate case study. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Portfolio Pilot AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              How It Works
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition">
              My Gallery
            </Link>
            <Link to="/case-study" className="text-sm text-muted-foreground hover:text-foreground transition">
              Example
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40">
        {/* Background gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  AI-Powered Case Study Generation
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight relative z-10">
                Transform Your Work into
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  Stunning Case Studies
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-8 relative z-0">
                Let Portfolio Pilot AI automatically generate compelling case studies from a single prompt. <strong className="text-foreground">Visualize your best work in minutes, then seamlessly transfer your AI-generated content and design inspiration to Builder.io for a perfect, production-ready portfolio.</strong> Showcase your best work, not your time.
              </p>
            </div>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto space-y-4 pt-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Describe your project: 'E-commerce platform redesign that increased conversions by 45%'..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                  className="flex-1 bg-input border-border/50 text-foreground placeholder:text-muted-foreground h-14 px-6 text-base"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!inputValue.trim() || isLoading}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 px-8 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⚡</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate My Case Study
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground">
                Free • No credit card required • Takes less than a minute
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-32 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your project into a professional case study
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 h-full hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Share Your Project</h3>
                <p className="text-muted-foreground">
                  Tell us about your project in your own words. What problem did you solve? What impact did it have?
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm">
                  <span>Step 1</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    1
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 h-full hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Generates Content</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your input and generates a compelling, professional case study with sections and insights.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm">
                  <span>Step 2</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    2
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 h-full hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-6">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Polish & Share</h3>
                <p className="text-muted-foreground">
                  Review, edit, and customize your case study. Export as PDF, share on your portfolio, or publish online.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm">
                  <span>Step 3</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional case studies that impress clients
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                title: "AI-Powered Writing",
                description: "Advanced AI technology generates polished, professional content from your brief descriptions.",
              },
              {
                title: "Fast & Efficient",
                description: "Get a complete case study in under a minute. No more hours spent on writing.",
              },
              {
                title: "Professional Templates",
                description: "Choose from multiple industry-specific templates designed by UX professionals.",
              },
              {
                title: "Easy Customization",
                description: "Edit, refine, and personalize every section to match your exact vision.",
              },
              {
                title: "Multiple Export Formats",
                description: "Download as PDF, share online, or integrate with your portfolio website.",
              },
              {
                title: "Real Results Showcase",
                description: "Built-in metrics and results sections to highlight your impact and value.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Showcase Your Best Work?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join hundreds of freelancers and agencies creating stunning case studies in minutes.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 px-10"
            onClick={() => {
              const heroInput = document.querySelector(
                'input[placeholder*="Describe your project"]'
              ) as HTMLInputElement;
              if (heroInput) {
                heroInput.focus();
                heroInput.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Start Creating Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 sm:py-16 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Portfolio Pilot AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered case study generation for freelancers and agencies.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Portfolio Pilot AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
