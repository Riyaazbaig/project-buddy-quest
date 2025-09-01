import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, CheckCircle, ArrowRight } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    toast({
      title: "File uploaded successfully",
      description: `${selectedFile.name} is ready to process`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/portfolio-preview');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Transform Your Resume
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Upload your resume and watch it become a stunning portfolio
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOC, and DOCX files up to 10MB
            </p>
          </div>

          {/* Upload Card */}
          <Card className="p-8 shadow-lg border-2 border-dashed border-border transition-all duration-300 hover:shadow-primary/20">
            <div
              className={`relative transition-all duration-300 ${
                isDragging ? 'scale-105 opacity-80' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              
              <div className="text-center">
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-accent/10 rounded-full">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        File Ready!
                      </h3>
                      <p className="text-muted-foreground flex items-center justify-center gap-2 mt-2">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Drop your resume here
                      </h3>
                      <p className="text-muted-foreground">
                        or <span className="text-primary font-medium">browse files</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={!file || isProcessing}
              size="lg"
              className="bg-gradient-hero hover:shadow-primary text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Resume...
                </>
              ) : (
                <>
                  Create Portfolio
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Smart Parsing</h4>
              <p className="text-sm text-muted-foreground mt-1">
                AI extracts key information from your resume
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold">Professional Design</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Beautiful, responsive portfolio templates
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h4 className="font-semibold">Instant Results</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your portfolio is ready in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;