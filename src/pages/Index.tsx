import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Zap, Palette, ArrowRight, Upload, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Transform your resume in seconds
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              From Resume to
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                Stunning Portfolio
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your resume and watch our AI transform it into a beautiful, 
              professional portfolio website in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/upload')}
              className="bg-gradient-hero hover:shadow-primary text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
            >
              <Upload className="mr-2 w-5 h-5" />
              Upload Resume
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              View Example
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl"></div>
            <Card className="relative bg-card/80 backdrop-blur-sm border-2 border-primary/10 p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-4">See the Magic</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI analyzes your resume and creates a portfolio that showcases 
                    your skills, experience, and projects in the most compelling way.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">✓</span>
                      </div>
                      <span className="text-sm">Professional design templates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">✓</span>
                      </div>
                      <span className="text-sm">Mobile responsive layouts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">✓</span>
                      </div>
                      <span className="text-sm">SEO optimized content</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-secondary rounded-lg p-6 border">
                    <div className="space-y-4">
                      <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded"></div>
                        <div className="h-2 bg-muted rounded w-5/6"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-2 py-1 bg-primary/10 rounded text-xs">React</div>
                        <div className="px-2 py-1 bg-primary/10 rounded text-xs">Node.js</div>
                        <div className="px-2 py-1 bg-primary/10 rounded text-xs">Python</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Portfolio Maker?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for professionals who want to make a lasting impression
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Get your portfolio ready in under 30 seconds. No technical skills required.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Beautiful Design</h3>
            <p className="text-muted-foreground">
              Professional templates designed to impress recruiters and clients.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Parsing</h3>
            <p className="text-muted-foreground">
              AI extracts and organizes your information perfectly every time.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/10">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who've transformed their careers
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/upload')}
            className="bg-gradient-hero hover:shadow-primary text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            <Upload className="mr-2 w-5 h-5" />
            Upload Your Resume Now
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
