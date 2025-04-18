import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Database, FileText, Gavel, Scale, Shield, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Courtroom Navigator</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  Welcome back, {profile?.first_name || 'User'}
                </span>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button onClick={() => navigate("/cases")}>
                  My Cases
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {user ? 'Welcome Back to Your Legal Workspace' : 'Modern Case Management for Legal Professionals'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {user 
                ? 'Continue managing your cases, hearings, and documents with our powerful digital tools.'
                : 'Streamline your court proceedings, manage cases efficiently, and improve access to justice with our comprehensive digital solution.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {user ? (
                <>
                  <Button size="lg" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/calendar")}>
                    View Calendar
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate("/register")}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/demo")}>
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border rounded-lg p-8 shadow-lg h-[380px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Gavel className="h-24 w-24 mx-auto mb-4 text-primary/60" />
              <p className="text-lg font-medium">Interactive Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Powerful Tools for the Modern Courtroom
            </h2>
            <p className="text-muted-foreground text-lg">
              Our comprehensive platform brings together everything you need to manage court cases efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-primary" />}
              title="Case Management"
              description="Organize, track and manage all your cases in one centralized system with powerful search and filtering capabilities."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Court Calendar"
              description="Schedule and manage hearings, appointments, and deadlines with automated reminders and conflict detection."
            />
            <FeatureCard 
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Document Repository"
              description="Securely store, organize and access all case-related documents with version control and search functionality."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Client Portal"
              description="Provide clients with secure access to their case information, documents, and upcoming court dates."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Secure & Compliant"
              description="Bank-level security with role-based access controls and compliance with legal data protection regulations."
            />
            <FeatureCard 
              icon={<Gavel className="h-10 w-10 text-primary" />}
              title="Judicial Tools"
              description="Special features for judges to review cases, manage dockets, and issue orders directly from the platform."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">
              Trusted by Legal Professionals
            </h2>
            <blockquote className="text-xl italic text-muted-foreground mb-6">
              "The Courtroom Navigator System has revolutionized how we manage our caseload. What used to take hours now takes minutes, allowing us to focus on serving our clients better."
            </blockquote>
            <div className="font-medium">
              Sarah Johnson
              <span className="block text-muted-foreground">Senior Partner, Johnson & Associates</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary/10 border rounded-lg p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {user ? 'Ready to Continue Your Work?' : 'Ready to Transform Your Legal Practice?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {user 
                ? 'Return to your workspace and manage your legal cases efficiently.'
                : 'Join thousands of legal professionals who have streamlined their workflow with Courtroom Navigator.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/documents")}>
                    View Documents
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate("/register")}>
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                    Schedule a Demo
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-bold">Courtroom Navigator</span>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Courtroom Navigator System. All rights reserved.</p>
              <p>Privacy Policy • Terms of Service • Contact</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
} 