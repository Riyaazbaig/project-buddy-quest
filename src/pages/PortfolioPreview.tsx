import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Download, ExternalLink, Github, Linkedin } from "lucide-react";

const PortfolioPreview = () => {
  // Sample data - in real app, this would come from resume parsing
  const portfolioData = {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.",
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL"],
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "TechCorp Inc.",
        duration: "2022 - Present",
        description: "Led development of customer-facing web applications serving 100k+ users. Implemented microservices architecture and improved performance by 40%."
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        duration: "2020 - 2022",
        description: "Built and maintained e-commerce platform. Developed REST APIs and implemented CI/CD pipelines."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        year: "2020"
      }
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with payment integration",
        tech: ["React", "Node.js", "Stripe API"]
      },
      {
        name: "Task Management App",
        description: "Real-time collaborative task management application",
        tech: ["React", "Socket.io", "MongoDB"]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Actions */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Portfolio Preview</h1>
              <p className="text-muted-foreground">Your portfolio is ready!</p>
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
                  {portfolioData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{portfolioData.name}</h1>
              <p className="text-xl text-primary font-semibold mb-4">{portfolioData.title}</p>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                {portfolioData.summary}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {portfolioData.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {portfolioData.phone}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {portfolioData.location}
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
                  {portfolioData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Projects */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">Projects</h2>
                <div className="grid gap-6">
                  {portfolioData.projects.map((project, index) => (
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.map((skill, index) => (
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
                  {portfolioData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-primary">{edu.school}</p>
                      <p className="text-sm text-muted-foreground">{edu.year}</p>
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