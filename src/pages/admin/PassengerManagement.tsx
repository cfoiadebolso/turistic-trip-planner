import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, CheckCircle, Clock, X, Phone, Mail, MapPin, Calendar, Search, Filter } from 'lucide-react';

// Dados mockados - substituir por API calls
const passengersData = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "+55 21 99999-1111",
    tripId: 1,
    tripDestination: "Praia de Copacabana",
    tripDate: "2025-10-26",
    status: "confirmado",
    bookingDate: "2025-01-15",
    paymentStatus: "pago",
    boardingStatus: "não embarcado"
  },
  {
    id: 2,
    name: "Carlos Souza",
    email: "carlos.souza@email.com",
    phone: "+55 21 99999-2222",
    tripId: 1,
    tripDestination: "Praia de Copacabana",
    tripDate: "2025-10-26",
    status: "confirmado",
    bookingDate: "2025-01-16",
    paymentStatus: "pago",
    boardingStatus: "embarcado"
  },
  {
    id: 3,
    name: "Mariana Lima",
    email: "mariana.lima@email.com",
    phone: "+55 21 99999-3333",
    tripId: 1,
    tripDestination: "Praia de Copacabana",
    tripDate: "2025-10-26",
    status: "pendente",
    bookingDate: "2025-01-17",
    paymentStatus: "pendente",
    boardingStatus: "não embarcado"
  },
  {
    id: 4,
    name: "Ricardo Nunes",
    email: "ricardo.nunes@email.com",
    phone: "+55 21 99999-4444",
    tripId: 2,
    tripDestination: "Feirinha de Itaipava",
    tripDate: "2025-08-25",
    status: "confirmado",
    bookingDate: "2025-01-10",
    paymentStatus: "pago",
    boardingStatus: "embarcado"
  },
  {
    id: 5,
    name: "Lúcia Pereira",
    email: "lucia.pereira@email.com",
    phone: "+55 21 99999-5555",
    tripId: 2,
    tripDestination: "Feirinha de Itaipava",
    tripDate: "2025-08-25",
    status: "cancelado",
    bookingDate: "2025-01-12",
    paymentStatus: "reembolsado",
    boardingStatus: "não embarcado"
  }
];

const tripsData = [
  { id: 1, destination: "Praia de Copacabana", date: "2025-10-26" },
  { id: 2, destination: "Feirinha de Itaipava", date: "2025-08-25" },
  { id: 3, destination: "Passeio em Angra dos Reis", date: "2025-09-10" }
];

const PassengerManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [passengers, setPassengers] = useState(passengersData);
  const [selectedTrip, setSelectedTrip] = useState(location.state?.tripId || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Removido: verificação de token administrativo separado

  const updatePassengerStatus = (passengerId: number, field: string, value: string) => {
    setPassengers(passengers.map(passenger => 
      passenger.id === passengerId 
        ? { ...passenger, [field]: value }
        : passenger
    ));
  };

  const filteredPassengers = passengers.filter(passenger => {
    const matchesTrip = selectedTrip === 'all' || passenger.tripId === parseInt(selectedTrip);
    const matchesStatus = statusFilter === 'all' || passenger.status === statusFilter;
    const matchesSearch = passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         passenger.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTrip && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'reembolsado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBoardingStatusColor = (status: string) => {
    switch (status) {
      case 'embarcado': return 'bg-green-100 text-green-800';
      case 'não embarcado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Gerenciamento de Passageiros">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar passageiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por viagem */}
            <div>
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as viagens</option>
                {tripsData.map(trip => (
                  <option key={trip.id} value={trip.id}>
                    {trip.destination} - {new Date(trip.date).toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center justify-center bg-blue-50 rounded-lg p-2">
              <Users size={20} className="text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold">{filteredPassengers.length} passageiros</span>
            </div>
          </div>
        </div>

        {/* Lista de passageiros */}
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Embarque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPassengers.map((passenger) => (
                  <tr key={passenger.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{passenger.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail size={14} className="mr-1" />
                          {passenger.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone size={14} className="mr-1" />
                          {passenger.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {passenger.tripDestination}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(passenger.tripDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={passenger.status}
                        onChange={(e) => updatePassengerStatus(passenger.id, 'status', e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusColor(passenger.status)}`}
                      >
                        <option value="confirmado">Confirmado</option>
                        <option value="pendente">Pendente</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={passenger.paymentStatus}
                        onChange={(e) => updatePassengerStatus(passenger.id, 'paymentStatus', e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getPaymentStatusColor(passenger.paymentStatus)}`}
                      >
                        <option value="pago">Pago</option>
                        <option value="pendente">Pendente</option>
                        <option value="reembolsado">Reembolsado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={passenger.boardingStatus}
                        onChange={(e) => updatePassengerStatus(passenger.id, 'boardingStatus', e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getBoardingStatusColor(passenger.boardingStatus)}`}
                      >
                        <option value="não embarcado">Não Embarcado</option>
                        <option value="embarcado">Embarcado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`tel:${passenger.phone}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Ligar"
                        >
                          <Phone size={16} />
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${passenger.email}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Enviar email"
                        >
                          <Mail size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPassengers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum passageiro encontrado</h3>
            <p className="text-gray-600">Ajuste os filtros para ver mais resultados.</p>
          </div>
        )}

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={20} />
              <div>
                <p className="text-sm text-gray-600">Confirmados</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredPassengers.filter(p => p.status === 'confirmado').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Clock className="text-yellow-500 mr-2" size={20} />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredPassengers.filter(p => p.status === 'pendente').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <X className="text-red-500 mr-2" size={20} />
              <div>
                <p className="text-sm text-gray-600">Cancelados</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredPassengers.filter(p => p.status === 'cancelado').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Users className="text-blue-500 mr-2" size={20} />
              <div>
                <p className="text-sm text-gray-600">Embarcados</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredPassengers.filter(p => p.boardingStatus === 'embarcado').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PassengerManagement;