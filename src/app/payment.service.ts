import { Injectable, signal, computed } from '@angular/core';

export interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Flagged';
  category: 'Wire' | 'ACH' | 'Internal';
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  // Master state
  private transactions = signal<Transaction[]>([
    { id: 'TXN-001', recipient: 'Global Tech Corp', amount: 45000, date: '2024-03-20', status: 'Pending', category: 'Wire' },
    { id: 'TXN-002', recipient: 'Blue Sky Energy', amount: 1250.50, date: '2024-03-21', status: 'Pending', category: 'ACH' },
    { id: 'TXN-003', recipient: 'Internal Transfer', amount: 5000, date: '2024-03-22', status: 'Flagged', category: 'Internal' },
    { id: 'TXN-004', recipient: 'Vertex Solutions', amount: 89000, date: '2024-03-22', status: 'Pending', category: 'Wire' }
  ]);

  readonly allTransactions = this.transactions.asReadonly();

  readonly pendingCount = computed(() => 
    this.transactions().filter(t => t.status === 'Pending').length
  );

  readonly totalVolume = computed(() => 
    this.transactions().reduce((sum, t) => sum + t.amount, 0)
  );

  approve(id: string) {
    this.transactions.update(items => 
      items.map(t => t.id === id ? { ...t, status: 'Approved' as const } : t)
    );
  }

  reject(id: string) {
    this.transactions.update(items => items.filter(t => t.id !== id));
  }
}
