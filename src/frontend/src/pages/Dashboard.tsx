import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Wallet, PieChart, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Dashboard() {
  const navigate = useNavigate();
  const { summary, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const hasInvestments = summary.totalCount > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your investment portfolio</p>
      </div>

      {!hasInvestments ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Investments Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start building your portfolio by adding your first investment. Track stocks, bonds, real estate, crypto, and more.
            </p>
            <Button onClick={() => navigate({ to: '/investment' })} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Investment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active investment positions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${summary.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Combined portfolio value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Asset Classes</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.byType.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Different investment types
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Breakdown</CardTitle>
              <CardDescription>Investment allocation by asset type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.byType.map((item) => {
                  const percentage = (item.amount / summary.totalAmount) * 100;
                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {item.type === 'realEstate' ? 'Real Estate' : item.type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({item.count} {item.count === 1 ? 'position' : 'positions'})
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-1 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex justify-center">
            <Button onClick={() => navigate({ to: '/investment' })} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add New Investment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
