import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, BarChart3, Wallet } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-medium bg-card">
                  <TrendingUp className="mr-2 h-4 w-4 text-chart-1" />
                  Track Your Wealth Journey
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Smart Portfolio
                <span className="block text-chart-1 mt-2">Management</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Take control of your investments with our intuitive portfolio tracker. Monitor performance, analyze trends, and make informed decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/login' })}
                  className="text-base px-8"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="text-base px-8"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
                <img
                  src="/assets/generated/home-hero-illustration.dim_1400x800.png"
                  alt="Portfolio dashboard illustration showing investment charts and analytics"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Manage Your Portfolio
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you track, analyze, and grow your investments.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-chart-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Asset Support</h3>
              <p className="text-muted-foreground">
                Track stocks, bonds, real estate, crypto, and cash holdings all in one place.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Get instant insights into your portfolio performance and asset allocation.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and stored securely on the Internet Computer blockchain.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your investment growth and track returns across different asset classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-3/10 rounded-2xl border border-border p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Take Control of Your Investments?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust our platform to manage their portfolios.
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/login' })}
              className="text-base px-8"
            >
              Start Tracking Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
