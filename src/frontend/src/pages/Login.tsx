import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Login() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card className="border-2">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-chart-1/10 flex items-center justify-center mb-2">
              <User className="h-8 w-8 text-chart-1" />
            </div>
            <CardTitle className="text-3xl">
              {isAuthenticated ? 'Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isAuthenticated
                ? 'You are currently signed in'
                : 'Sign in with Internet Identity to access your portfolio'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Principal ID</p>
                  <p className="text-xs font-mono break-all">{identity.getPrincipal().toString()}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="flex-1"
                    variant="outline"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={handleAuth}
                    variant="destructive"
                    className="flex-1"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="w-full"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In with Internet Identity
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
