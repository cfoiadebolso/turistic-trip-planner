import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DollarSign, TrendingUp, Users, Calendar, Download } from 'lucide-react';

interface PaymentRecord {
  method: 'pix' | 'credit' | 'debit';
  amount: number;
  organizerAmount: number;
  platformAmount: number;
  status: string;
  transactionId: string;
  tripTitle: string;
  organizerName: string;
  timestamp: string;
}

interface SplitSummary {
  totalRevenue: number;
  organizerTotal: number;
  platformTotal: number;
  transactionCount: number;
  averageTicket: number;
}

export const PaymentSplitDashboard: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<SplitSummary>({
    totalRevenue: 0,
    organizerTotal: 0,
    platformTotal: 0,
    transactionCount: 0,
    averageTicket: 0
  });
  const [viewMode, setViewMode] = useState<'organizer' | 'platform'>('organizer');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(storedPayments);
    calculateSummary(storedPayments);
  };

  const calculateSummary = (paymentList: PaymentRecord[]) => {
    const totalRevenue = paymentList.reduce((sum, p) => sum + p.amount, 0);
    const organizerTotal = paymentList.reduce((sum, p) => sum + p.organizerAmount, 0);
    const platformTotal = paymentList.reduce((sum, p) => sum + p.platformAmount, 0);
    const transactionCount = paymentList.length;
    const averageTicket = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    setSummary({
      totalRevenue,
      organizerTotal,
      platformTotal,
      transactionCount,
      averageTicket
    });
  };

  const simulateWithdrawal = (amount: number, type: 'organizer' | 'platform') => {
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const withdrawal = {
      id: Date.now(),
      amount,
      type,
      status: 'completed',
      timestamp: new Date().toISOString(),
      bankAccount: type === 'organizer' ? 'Conta do Organizador' : 'Conta da Plataforma'
    };
    
    withdrawals.push(withdrawal);
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
    
    alert(`Saque de R$ ${amount.toFixed(2)} realizado com sucesso!\nProcessamento: 1-2 dias úteis`);
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      pix: 'bg-green-100 text-green-800',
      credit: 'bg-blue-100 text-blue-800',
      debit: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      pix: 'PIX',
      credit: 'Crédito',
      debit: 'Débito'
    };
    
    return (
      <Badge className={colors[method as keyof typeof colors]}>
        {labels[method as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Pagamentos</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'organizer' ? 'default' : 'outline'}
            onClick={() => setViewMode('organizer')}
            size="sm"
          >
            Organizador
          </Button>
          <Button
            variant={viewMode === 'platform' ? 'default' : 'outline'}
            onClick={() => setViewMode('platform')}
            size="sm"
          >
            Plataforma
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">R$ {summary.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Para Organizadores</p>
                <p className="text-2xl font-bold text-blue-600">R$ {summary.organizerTotal.toFixed(2)}</p>
                <p className="text-xs text-gray-500">85% do total</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Plataforma</p>
                <p className="text-2xl font-bold text-purple-600">R$ {summary.platformTotal.toFixed(2)}</p>
                <p className="text-xs text-gray-500">15% do total</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transações</p>
                <p className="text-2xl font-bold">{summary.transactionCount}</p>
                <p className="text-xs text-gray-500">Ticket médio: R$ {summary.averageTicket.toFixed(2)}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações de Saque */}
      {viewMode === 'organizer' && summary.organizerTotal > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Saque para Organizadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Valor disponível: R$ {summary.organizerTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Processamento automático em 7 dias após a viagem</p>
              </div>
              <Button 
                onClick={() => simulateWithdrawal(summary.organizerTotal, 'organizer')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Simular Saque
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'platform' && summary.platformTotal > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Receita da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Valor disponível: R$ {summary.platformTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Taxa de 15% sobre todas as transações</p>
              </div>
              <Button 
                onClick={() => simulateWithdrawal(summary.platformTotal, 'platform')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Simular Saque
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma transação encontrada</p>
              <p className="text-sm">Faça um pagamento para ver os dados aqui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{payment.tripTitle}</h4>
                      <p className="text-sm text-gray-600">Organizador: {payment.organizerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {payment.amount.toFixed(2)}</p>
                      {getMethodBadge(payment.method)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Para organizador:</span>
                      <span className="ml-2 font-medium text-blue-600">
                        R$ {payment.organizerAmount.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Taxa plataforma:</span>
                      <span className="ml-2 font-medium text-purple-600">
                        R$ {payment.platformAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    <span>ID: {payment.transactionId}</span>
                    <span className="ml-4">
                      {new Date(payment.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSplitDashboard;