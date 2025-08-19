import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, DollarSign, Users, Clock, FileText } from 'lucide-react';

interface TripFormProps {
  trip?: any;
  onSave: (tripData: any) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    destination: trip?.destination || '',
    date: trip?.date || '',
    time: trip?.time || '',
    meetingPoint: trip?.meetingPoint || '',
    price: trip?.price || '',
    spotsLeft: trip?.spotsLeft || '',
    minParticipants: trip?.minParticipants || '',
    category: trip?.category || 'turismo',
    itinerary: trip?.itinerary || '',
    image: trip?.image || '',
    rules: trip?.rules || '',
    neighborhood: trip?.neighborhood || ''
  });

  const [imagePreview, setImagePreview] = useState(trip?.image || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      spotsLeft: parseInt(formData.spotsLeft),
      minParticipants: parseInt(formData.minParticipants),
      id: trip?.id || Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {trip ? 'Editar Viagem' : 'Nova Viagem'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Destino
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro de Saída
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Data
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Horário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Horário
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Vagas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Vagas Disponíveis
              </label>
              <input
                type="number"
                name="spotsLeft"
                value={formData.spotsLeft}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Mínimo de Participantes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mínimo de Participantes
              </label>
              <input
                type="number"
                name="minParticipants"
                value={formData.minParticipants}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="turismo">Turismo</option>
                <option value="praia">Praia</option>
                <option value="compras">Compras</option>
                <option value="aventura">Aventura</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>
          </div>

          {/* Ponto de Encontro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ponto de Encontro
            </label>
            <input
              type="text"
              name="meetingPoint"
              value={formData.meetingPoint}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Itinerário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Itinerário
            </label>
            <textarea
              name="itinerary"
              value={formData.itinerary}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Regras */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regras e Observações
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Não é permitido levar animais, pontualidade obrigatória..."
            />
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload size={16} className="inline mr-1" />
              Imagem da Viagem
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {trip ? 'Atualizar' : 'Criar'} Viagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;