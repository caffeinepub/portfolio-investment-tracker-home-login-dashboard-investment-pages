import { useState } from 'react';
import { useListInvestments, useDeleteInvestment } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Wallet } from 'lucide-react';
import InvestmentForm from '../components/InvestmentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Investment } from '../backend';

export default function Investment() {
  const { data: investments = [], isLoading } = useListInvestments();
  const deleteInvestment = useDeleteInvestment();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deletingId !== null) {
      await deleteInvestment.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingInvestment(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="mt-4 text-muted-foreground">Loading investments...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Investments</h1>
          <p className="text-muted-foreground">Manage your investment portfolio</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </div>

      {investments.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Investments Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start tracking your portfolio by adding your first investment. You can add stocks, bonds, real estate, crypto, and cash holdings.
            </p>
            <Button onClick={() => setIsFormOpen(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Investment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Investments</CardTitle>
            <CardDescription>
              {investments.length} {investments.length === 1 ? 'investment' : 'investments'} in your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id.toString()}>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold capitalize">
                          {investment.type === 'realEstate' ? 'Real Estate' : investment.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${investment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(investment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(investment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <InvestmentForm
        open={isFormOpen}
        onClose={handleFormClose}
        investment={editingInvestment}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Investment"
        description="Are you sure you want to delete this investment? This action cannot be undone."
        isLoading={deleteInvestment.isPending}
      />
    </div>
  );
}
