import { useEffect, useState } from 'react';
import { useCreateInvestment, useUpdateInvestment } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestmentType, type Investment } from '../backend';

interface InvestmentFormProps {
  open: boolean;
  onClose: () => void;
  investment?: Investment | null;
}

export default function InvestmentForm({ open, onClose, investment }: InvestmentFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<InvestmentType>(InvestmentType.stock);
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  const createInvestment = useCreateInvestment();
  const updateInvestment = useUpdateInvestment();

  const isEditing = !!investment;
  const isLoading = createInvestment.isPending || updateInvestment.isPending;

  useEffect(() => {
    if (investment) {
      setName(investment.name);
      setAmount(investment.amount.toString());
      setType(investment.type);
    } else {
      setName('');
      setAmount('');
      setType(InvestmentType.stock);
    }
    setErrors({});
  }, [investment, open]);

  const validate = () => {
    const newErrors: { name?: string; amount?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Investment name is required';
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const amountNum = parseFloat(amount);

    try {
      if (isEditing) {
        await updateInvestment.mutateAsync({
          id: investment.id,
          name: name.trim(),
          amount: amountNum,
          type,
        });
      } else {
        await createInvestment.mutateAsync({
          name: name.trim(),
          amount: amountNum,
          type,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save investment:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Investment' : 'Add New Investment'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the details of your investment.'
                : 'Enter the details of your new investment.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Investment Name</Label>
              <Input
                id="name"
                placeholder="e.g., Apple Stock, Bitcoin, Rental Property"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Investment Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as InvestmentType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InvestmentType.stock}>Stock</SelectItem>
                  <SelectItem value={InvestmentType.bond}>Bond</SelectItem>
                  <SelectItem value={InvestmentType.realEstate}>Real Estate</SelectItem>
                  <SelectItem value={InvestmentType.crypto}>Crypto</SelectItem>
                  <SelectItem value={InvestmentType.cash}>Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                  Saving...
                </>
              ) : (
                <>{isEditing ? 'Update' : 'Add'} Investment</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
