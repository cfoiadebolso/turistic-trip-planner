import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { CreditCard, Smartphone, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from './NotificationSystem';

interface PaymentComponentProps {
  tripPrice: number;
  organizerName: string;
  tripTitle: string;
  onPaymentSuccess?: (paymentData: any) => void;
}

interface PaymentData {
  method: 'pix' | 'credit' | 'debit';
  amount: number;
  organizerAmount: number;
  platformAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId: string;
}

export const PaymentComponent: React.FC<PaymentComponentProps> = ({
  tripPrice,
  organizerName,
  tripTitle,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'credit' | 'debit' | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const { sendNotification } = useNotifications();

  // Cálculo do split (85% organizador, 15% plataforma)
  const organizerAmount = Math.round(tripPrice * 0.85);
  const platformAmount = tripPrice - organizerAmount;

  const generateTransactionId = () => {
    return 'MP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const simulatePayment = async (method: 'pix' | 'credit' | 'debit') => {
    setIsProcessing(true);
    
    // Simula processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const payment: PaymentData = {
      method,
      amount: tripPrice,
      organizerAmount,
      platformAmount,
      status: 'completed',
      transactionId: generateTransactionId()
    };
    
    setPaymentData(payment);
    setIsProcessing(false);
    
    // Envia notificação de pagamento aprovado
    sendNotification({
      type: 'success',
      title: 'Pagamento Aprovado!',
      message: `Seu pagamento de R$ ${tripPrice.toFixed(2)} para "${tripTitle}" foi processado com sucesso.`,
      // Remove duration since it's not in the notification type
    });
    
    // Salva no localStorage para demonstração
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    payments.push({
      ...payment,
      tripTitle,
      organizerName,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('payments', JSON.stringify(payments));
    
    onPaymentSuccess?.(payment);
  };

  const handlePixPayment = () => {
    simulatePayment('pix');
  };

  const handleCardPayment = () => {
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      alert('Preencha todos os dados do cartão');
      return;
    }
    simulatePayment(selectedMethod as 'credit' | 'debit');
  };

  if (paymentData?.status === 'completed') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-green-600">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">ID da Transação:</p>
            <p className="font-mono text-sm">{paymentData.transactionId}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Pago:</span>
              <span className="font-semibold">R$ {tripPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Para {organizerName}:</span>
              <span>R$ {organizerAmount.toFixed(2)} (85%)</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxa da Plataforma:</span>
              <span>R$ {platformAmount.toFixed(2)} (15%)</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Método: {paymentData.method === 'pix' ? 'PIX' : 
                     paymentData.method === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processando pagamento...</p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedMethod === 'pix' ? 'Aguardando confirmação do PIX' : 'Validando dados do cartão'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Pagamento Seguro
        </CardTitle>
        <div className="text-sm text-gray-600">
          <p>{tripTitle}</p>
          <p>Organizador: {organizerName}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumo do Valor */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">R$ {tripPrice.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Organizador recebe:</span>
              <span>R$ {organizerAmount.toFixed(2)} (85%)</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa da plataforma:</span>
              <span>R$ {platformAmount.toFixed(2)} (15%)</span>
            </div>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div className="space-y-3">
          <h3 className="font-medium">Escolha o método de pagamento:</h3>
          
          {/* PIX */}
          <Button
            variant={selectedMethod === 'pix' ? 'default' : 'outline'}
            className="w-full justify-start h-auto p-4"
            onClick={() => setSelectedMethod('pix')}
          >
            <Smartphone className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">PIX</div>
              <div className="text-sm text-gray-500">Instantâneo • Taxa: 0,99%</div>
            </div>
            <Badge variant="secondary" className="ml-auto">Recomendado</Badge>
          </Button>

          {/* Cartão de Crédito */}
          <Button
            variant={selectedMethod === 'credit' ? 'default' : 'outline'}
            className="w-full justify-start h-auto p-4"
            onClick={() => setSelectedMethod('credit')}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Cartão de Crédito</div>
              <div className="text-sm text-gray-500">Parcelamento • Taxa: 4,99%</div>
            </div>
          </Button>

          {/* Cartão de Débito */}
          <Button
            variant={selectedMethod === 'debit' ? 'default' : 'outline'}
            className="w-full justify-start h-auto p-4"
            onClick={() => setSelectedMethod('debit')}
          >
            <FileText className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Cartão de Débito</div>
              <div className="text-sm text-gray-500">À vista • Taxa: 2,99%</div>
            </div>
          </Button>
        </div>

        {/* Formulário PIX */}
        {selectedMethod === 'pix' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Pagamento via PIX</p>
              <p className="text-xs text-gray-600 mt-1">
                Você será redirecionado para o app do seu banco
              </p>
            </div>
            <Button onClick={handlePixPayment} className="w-full">
              Pagar com PIX - R$ {tripPrice.toFixed(2)}
            </Button>
          </div>
        )}

        {/* Formulário Cartão */}
        {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Número do cartão"
                value={cardData.number}
                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                maxLength={19}
              />
              <Input
                placeholder="Nome no cartão"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="MM/AA"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                  maxLength={5}
                />
                <Input
                  placeholder="CVV"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                  maxLength={4}
                />
              </div>
            </div>
            <Button onClick={handleCardPayment} className="w-full">
              Pagar - R$ {tripPrice.toFixed(2)}
            </Button>
          </div>
        )}

        {/* Segurança */}
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <AlertCircle className="w-4 h-4" />
          <span>Pagamento processado pelo Mercado Pago</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentComponent;