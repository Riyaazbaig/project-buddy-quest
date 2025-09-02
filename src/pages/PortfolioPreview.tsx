import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Download, ExternalLink, Github, Linkedin, ArrowLeft, FileText } from "lucide-react";

const PortfolioPreview = () => {
  const [resumeContent, setResumeContent] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the resume content from localStorage
    const content = localStorage.getItem('resumeContent');
    const fileName = localStorage.getItem('resumeFileName');
    
    console.log("Portfolio Preview - Retrieved content:", content?.substring(0, 100));
    console.log("Portfolio Preview - Retrieved filename:", fileName);
    
    if (content) {
      setResumeContent(content);
    }
    if (fileName) {
      setResumeFileName(fileName);
    }
    
    // If no content, redirect back to upload
    if (!content) {
      console.log("No resume content found, redirecting to upload");
      navigate('/upload');
    }
  }, [navigate]);

  // Parse resume content into a simple portfolio structure
  const extractSection = (text: string, headerRegex: RegExp): string | null => {
    const re = new RegExp(`(?:^|\\n)\\s*(${headerRegex.source})\\s*:?\\s*[\\n\\r]+([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Za-z .'/&-]{2,}\\s*:|\\n\\s*(?:SKILLS|EXPERIENCE|WORK EXPERIENCE|EDUCATION|PROJECTS|SUMMARY|OBJECTIVE)\\b|$)`, 'i');
    const match = text.match(re);
    return match ? match[2].trim() : null;
  };

  const parseResume = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim());
    const nonEmpty = lines.filter(Boolean);
    const firstLines = nonEmpty.slice(0, 10).join(' ');

    const name = nonEmpty[0] || 'Your Name';
    const titleMatch = firstLines.match(/\b(Software|Full[- ]?Stack|Frontend|Backend|Data|Machine Learning|DevOps|Product|UI\/?UX)\b.*\b(Engineer|Developer|Designer|Scientist|Manager)\b/i);
    const title = titleMatch ? titleMatch[0] : '';

    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
    const locationMatch = text.match(/\b[A-Za-z .'-]+,\s*[A-Za-z]{2,}\b/);

    const summary = extractSection(text, /(summary|objective)/i) || nonEmpty.slice(1, 6).join(' ');

    const skillsRaw = extractSection(text, /(skills|technical skills)/i);
    const skills = skillsRaw
      ? Array.from(new Set(
          skillsRaw
            .replace(/[•\*\u2022]/g, ',')
            .split(/,|\n|;|\t/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.length < 40)
        ))
      : [];

    const experienceRaw = extractSection(text, /(experience|work experience|professional experience)/i);
    const experience = experienceRaw
      ? experienceRaw
          .split(/\n{2,}/)
          .slice(0, 5)
          .map(block => {
            const [firstLine, ...rest] = block.split('\n');
            return {
              title: (firstLine || 'Experience').slice(0, 80),
              company: '',
              duration: '',
              description: rest.join(' ').slice(0, 300),
            };
          })
          .filter(x => x.title || x.description)
      : [];

    const educationRaw = extractSection(text, /(education|academics)/i);
    const education = educationRaw
      ? educationRaw.split(/\n{2,}/).slice(0, 3).map(block => {
          const l = block.split('\n').filter(Boolean);
          return {
            degree: (l[0] || 'Education').slice(0, 80),
            school: l[1] || '',
            year: (block.match(/\b(20\d{2}|19\d{2})\b/) || [''])[0],
          };
        })
      : [];

    const projectsRaw = extractSection(text, /(projects?|personal projects?)/i);
    const projects = projectsRaw
      ? projectsRaw.split(/\n{2,}/).slice(0, 3).map(block => {
          const l = block.split('\n');
          return {
            name: (l[0] || 'Project').slice(0, 60),
            description: l.slice(1).join(' ').slice(0, 200),
            tech: Array.from(new Set((block.match(/\b([A-Za-z+#.]{2,})\b/g) || []).slice(0, 6))),
          };
        })
      : [];

    return {
      name,
      title,
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      location: locationMatch?.[0] || '',
      summary,
      skills,
      experience,
      education,
      projects,
    };
  };

  const parsed = parseResume(resumeContent || '');
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Actions */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/upload')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Portfolio Preview</h1>
                <p className="text-muted-foreground">
                  {resumeFileName ? `Generated from: ${resumeFileName}` : 'Your portfolio is ready!'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button className="bg-gradient-hero text-white gap-2">
                <ExternalLink className="w-4 h-4" />
                Publish Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-card to-secondary/30">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(parsed.name || 'Your Name').split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{parsed.name || 'Your Name'}</h1>
              <p className="text-xl text-primary font-semibold mb-4">{parsed.title || ''}</p>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                {parsed.summary || ''}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {parsed.email || '—'}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {parsed.phone || '—'}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {parsed.location || '—'}
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Experience */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">Experience</h2>
                <div className="space-y-6">
                  {parsed.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      {exp.company && <p className="text-primary font-medium">{exp.company}</p>}
                      {exp.duration && <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>}
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Projects */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">Projects</h2>
                <div className="grid gap-6">
                  {parsed.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Resume Content Debug Section */}
              {resumeContent && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resume Content
                  </h2>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      File: {resumeFileName}
                    </p>
                    <div className="bg-background p-4 rounded border max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap text-foreground">
                        {resumeContent}
                      </pre>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * This shows the raw content extracted from your resume. In production, this would be parsed to automatically populate the portfolio sections above.
                  </p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {parsed.skills.map((skill, index) => (
                    <Badge key={index} className="bg-primary/10 text-primary border-primary/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Education */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Education</h2>
                <div className="space-y-4">
                  {parsed.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      {edu.school && <p className="text-primary">{edu.school}</p>}
                      {edu.year && <p className="text-sm text-muted-foreground">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;