import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Database, Zap, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function CaseStudyTemplate() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <h1 className="text-lg font-bold">Case Study</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      {/* Hero Image Section */}
      <section className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-b border-border/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <span className="text-sm font-medium text-primary">Featured Case Study</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Your Project Title Here
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A brief tagline describing the key achievement or focus of this project
            </p>
          </div>
        </div>

        {/* Decorative background orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 sm:py-32 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Problem</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The client faced significant challenges with their existing workflow. They needed a
                solution that could streamline their process, reduce manual work, and improve overall
                efficiency. The traditional approach was time-consuming and error-prone.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-primary">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Challenge One</h4>
                    <p className="text-muted-foreground">
                      Description of the first challenge and its impact on the business.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-primary">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Challenge Two</h4>
                    <p className="text-muted-foreground">
                      Description of the second challenge and why it mattered.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-primary">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Challenge Three</h4>
                    <p className="text-muted-foreground">
                      Description of the third challenge and its consequences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20 sm:py-32 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Solution</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We developed a comprehensive solution that addressed each of the client's challenges.
                Our approach was strategic, user-centric, and focused on delivering measurable results.
                Here's how we solved the problem:
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-3">Approach One</h4>
                  <p className="text-muted-foreground text-sm">
                    Detailed explanation of the first part of the solution and how it addressed
                    specific challenges mentioned above.
                  </p>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-3">Approach Two</h4>
                  <p className="text-muted-foreground text-sm">
                    Description of the second approach and the benefits it brought to the project.
                  </p>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-3">Approach Three</h4>
                  <p className="text-muted-foreground text-sm">
                    Explanation of the third solution component and its role in the overall strategy.
                  </p>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-3">Implementation</h4>
                  <p className="text-muted-foreground text-sm">
                    Details about how we implemented the solution and worked with the client team
                    throughout the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used Section */}
      <section className="py-20 sm:py-32 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">Technologies Used</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Technology 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative bg-card border border-border/50 rounded-xl p-8 h-full hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 text-primary mb-6">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Frontend</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      React 18
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      Tailwind CSS
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      Vite
                    </li>
                  </ul>
                </div>
              </div>

              {/* Technology 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative bg-card border border-border/50 rounded-xl p-8 h-full hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 text-primary mb-6">
                    <Database className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Backend</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      Node.js
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      Express
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      PostgreSQL
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      REST API
                    </li>
                  </ul>
                </div>
              </div>

              {/* Technology 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative bg-card border border-border/50 rounded-xl p-8 h-full hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 text-primary mb-6">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Tools & Services</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      Docker
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      AWS
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      GitHub
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      CI/CD
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Results Section */}
      <section className="py-20 sm:py-32 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Results</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Result 1 */}
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-8 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/20 text-primary mb-6">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    45%
                  </span>
                </h3>
                <p className="text-muted-foreground mb-4">
                  Increase in efficiency and productivity
                </p>
                <p className="text-sm text-muted-foreground border-t border-border/50 pt-4">
                  The client saw immediate improvements in their workflow, reducing manual tasks and
                  increasing overall productivity.
                </p>
              </div>

              {/* Result 2 */}
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-8 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/20 text-primary mb-6">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    100+
                  </span>
                </h3>
                <p className="text-muted-foreground mb-4">
                  Active users engaged with the platform
                </p>
                <p className="text-sm text-muted-foreground border-t border-border/50 pt-4">
                  The solution was quickly adopted by the team and gained widespread usage across
                  the organization.
                </p>
              </div>

              {/* Result 3 */}
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-8 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/20 text-primary mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    3x
                  </span>
                </h3>
                <p className="text-muted-foreground mb-4">
                  Return on investment in the first year
                </p>
                <p className="text-sm text-muted-foreground border-t border-border/50 pt-4">
                  The project delivered exceptional value, exceeding expectations and generating
                  significant returns.
                </p>
              </div>
            </div>

            {/* Additional Results Text */}
            <div className="bg-card border border-border/50 rounded-xl p-8 sm:p-12 mt-8">
              <h3 className="text-2xl font-bold mb-6">Key Takeaways</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The project successfully addressed all of the client's initial challenges. By
                  implementing our solution, they were able to streamline their workflow, reduce
                  errors, and focus on strategic initiatives instead of manual tasks.
                </p>
                <p>
                  The collaborative approach and attention to detail ensured that the solution was
                  not only technically sound but also aligned with the client's business goals and
                  company culture.
                </p>
                <p>
                  This case study demonstrates the power of thoughtful problem-solving combined with
                  modern technology to drive real business impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Create Your Own Case Study?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let Portfolio Pilot AI help you generate stunning case studies that showcase your best work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 px-10"
              >
                Generate Case Study
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-card text-foreground border-border/50 hover:border-primary/30 font-semibold h-14 px-10"
              asChild
            >
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 sm:py-16 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Portfolio Pilot AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
