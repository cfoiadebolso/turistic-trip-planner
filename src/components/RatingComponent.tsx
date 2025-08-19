import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface RatingComponentProps {
  onSubmit: (rating: number, comment: string) => void;
  organizerName?: string;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ onSubmit, organizerName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Selecione uma avaliação!');
      return;
    }
    setIsSubmitting(true);
    onSubmit(rating, comment);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">
          Avaliar {organizerName || 'Organizador'}
        </h3>
        <div className="flex justify-center space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>
      </div>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentário (opcional)"
        className="w-full p-3 border rounded-lg resize-none"
        rows={3}
      />
      
      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
      </button>
    </form>
  );
};

export default RatingComponent;