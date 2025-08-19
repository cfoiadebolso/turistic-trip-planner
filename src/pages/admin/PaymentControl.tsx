import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { DollarSign, TrendingUp, TrendingDown, Calendar, User, MapPin, RefreshCw, Download, Filter, Search } from 'lucide-react';

// Dados mockados - substituir por API calls
const paymentsData = [
  {
    id: 1,
    passengerName: "Ana Silva",
    passengerEmail: "ana.silva@email.com",
    tripDestination: "Praia de Copacabana",
    tripDate: "2025-10-26",
    amount: 95.50,
    status: "pago",
    paymentDate: "2025-01-15",
    paymentMethod: "cartão",
    transactionId: "TXN001"
  },
  {
    id: 2,
    passengerName: "Carlos Souza",
    passengerEmail: "carlos.souza@email.com",
    tripDestination: "Praia de Copacabana",
    tripDate: "2025-10-26",
    amount: 95.50,
    status: "pago",
    paymentDate: "2025-01-16",
    paymentMethod: "pix",
    transactionId: "TXN002"
  },
  {
    id: 3,
    passengerName: "Mariana Lima",
    passengerEmail: "mariana.lima@email.com",
    tripDestination: "Praia de Copacabana",
    tripDate: "2025-10-26",
    amount: 95.50,
    status: "pendente",
    paymentDate: null,
    paymentMethod: null,
    transactionId: "TXN003"
  },
  {
    id: 4,
    passengerName: "Ricardo Nunes",
    passengerEmail: "ricardo.nunes@email.com",
    tripDestination: "Feirinha de Itaipava",
    tripDate: "2025-08-25",
    amount: 70.00,
    status: "pago",
    paymentDate: "2025-01-10",
    paymentMethod: "cartão",
    transactionId: "TXN004"
  },
  {
    id: 5,
    passengerName: "Lúcia Pereira",
    passengerEmail: "lucia.pereira@email.com",
    tripDestination: "Feirinha de Itaipava",
    tripDate: "2025-08-25",
    amount: 70.00,
    status: "reembolsado",
    paymentDate: "2025-01-12",
    paymentMethod: "cartão",
    transactionId: "TXN005",
    refundDate: "2025-01-18",
    refundReason: "Cancelamento por motivo pessoal"
  },
  {
    id: 6,
    passengerName: "Pedro Costa",
    passengerEmail: "pedro.costa@email.com",
    tripDestination: "Passeio em Angra dos Reis",
    tripDate: "2025-09-10",
    amount: 180.00,
    status: "pago",
    paymentDate: "2025-01-20",
    paymentMethod: "pix",
    transactionId: "TXN006"
  }
];

const PaymentControl = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState(paymentsData);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Removido: verificação de token administrativo separado

  const handleRefund = (paymentId: number) => {
    const reason = prompt('Motivo do reembolso:');
    if (reason) {
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: 'reembolsado', 
              refundDate: new Date().toISOString().split('T')[0],
              refundReason: reason
            }
          : payment
      ));
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSearch = payment.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.tripDestination.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all' && payment.paymentDate) {
      const paymentDate = new Date(payment.paymentDate);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = paymentDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= weekAgo;
          break;
        case 'month':
          matchesDate = paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'reembolsado': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'pix': return 'bg-purple-100 text-purple-800';
      case 'cartão': return 'bg-blue-100 text-blue-800';
      case 'dinheiro': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Cálculos financeiros
  const totalReceived = payments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pendente').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'reembolsado').reduce((sum, p) => sum + p.amount, 0);
  const netRevenue = totalReceived - totalRefunded;

  return (
    <AdminLayout title="Controle de Pagamentos">
      <div className="space-y-6">
        {/* Cards de resumo financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Líquida</p>
                <p className="text-2xl font-bold text-green-600">R$ {netRevenue.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recebido</p>
                <p className="text-2xl font-bold text-blue-600">R$ {totalReceived.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">R$ {totalPending.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Calendar size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reembolsado</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalRefunded.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pagamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="reembolsado">Reembolsado</option>
              </select>
            </div>

            {/* Filtro por data */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as datas</option>
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>

            {/* Botão de exportar */}
            <div>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Download size={20} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de pagamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passageiro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Viagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User size={16} className="mr-2" />
                          {payment.passengerName}
                        </div>
                        <div className="text-sm text-gray-500">{payment.passengerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <MapPin size={16} className="mr-2" />
                          {payment.tripDestination}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.tripDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        R$ {payment.amount.toFixed(2).replace('.', ',')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.paymentMethod && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(payment.paymentMethod)}`}>
                          {payment.paymentMethod.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {payment.status === 'pago' && (
                          <button
                            onClick={() => handleRefund(payment.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title="Reembolsar"
                          >
                            <RefreshCw size={16} />
                            Reembolsar
                          </button>
                        )}
                        {payment.status === 'reembolsado' && payment.refundReason && (
                          <span className="text-xs text-gray-500" title={payment.refundReason}>
                            Motivo: {payment.refundReason.substring(0, 20)}...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
            <p className="text-gray-600">Ajuste os filtros para ver mais resultados.</p>
          </div>
        )}

        {/* Resumo por método de pagamento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Método de Pagamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['pix', 'cartão', 'dinheiro'].map(method => {
              const methodPayments = payments.filter(p => p.paymentMethod === method && p.status === 'pago');
              const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
              return (
                <div key={method} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(method)}`}>
                      {method.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      R$ {methodTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {methodPayments.length} transações
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentControl;