import { useMemo } from 'react';
import { useListInvestments } from './useQueries';
import type { InvestmentType } from '../backend';

interface TypeSummary {
  type: InvestmentType;
  count: number;
  amount: number;
}

interface DashboardSummary {
  totalCount: number;
  totalAmount: number;
  byType: TypeSummary[];
}

export function useDashboardSummary() {
  const { data: investments = [], isLoading } = useListInvestments();

  const summary = useMemo<DashboardSummary>(() => {
    const totalCount = investments.length;
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);

    const typeMap = new Map<InvestmentType, TypeSummary>();

    investments.forEach((inv) => {
      const existing = typeMap.get(inv.type);
      if (existing) {
        existing.count += 1;
        existing.amount += inv.amount;
      } else {
        typeMap.set(inv.type, {
          type: inv.type,
          count: 1,
          amount: inv.amount,
        });
      }
    });

    const byType = Array.from(typeMap.values()).sort((a, b) => b.amount - a.amount);

    return {
      totalCount,
      totalAmount,
      byType,
    };
  }, [investments]);

  return {
    summary,
    isLoading,
  };
}
