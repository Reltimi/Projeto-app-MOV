import React, { useState, useMemo } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onNavigateToMarketplace: () => void;
  onClearCart: () => void;
}

export default function Checkout({ cart, onNavigateToMarketplace, onClearCart }: CheckoutProps) {
  // Zip/CEP and delivery state
  const [cep, setCep] = useState('');
  const [isCalculatingCep, setIsCalculatingCep] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [distance, setDistance] = useState(0);

  // Form Fields
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [buyerName, setBuyerName] = useState('');
  const [phone, setPhone] = useState('');

  // Payment Tabs
  const [activePaymentTab, setActivePaymentTab] = useState<'pix' | 'card' | 'boleto'>('pix');
  
  // Card payment inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCardChecked, setSaveCardChecked] = useState(false);

  // Checkout process simulation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Calculate cart subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  // Calculate freight estimation (H2 User Story)
  const handleCepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep || cep.length < 8) return;
    setIsCalculatingCep(true);

    // Simulate smart calculation based on digits
    setTimeout(() => {
      setIsCalculatingCep(false);
      setShippingCalculated(true);
      
      const parsedCep = parseInt(cep.replace(/\D/g, ''), 10) || 12345678;
      // deterministic mock values
      const calculatedDistance = (parsedCep % 45) + 3.5;
      const calculatedCost = calculatedDistance * 0.75;
      const timeInHours = calculatedDistance < 10 ? '12 horas' : '24 a 48 horas';

      setDistance(calculatedDistance);
      setShippingCost(calculatedCost);
      setDeliveryTime(timeInHours);

      // Fill in city based on zip
      if (parsedCep < 20000000) {
        setCity('São Paulo');
        setStreet('Alameda das Flores');
      } else if (parsedCep < 40000000) {
        setCity('Belo Horizonte');
        setStreet('Avenida do Contorno');
        setState('MG');
      } else {
        setCity('Rio de Janeiro');
        setStreet('Avenida Atlântica');
        setState('RJ');
      }
    }, 1000);
  };

  const total = useMemo(() => {
    return subtotal + (shippingCalculated ? shippingCost : 0);
  }, [subtotal, shippingCalculated, shippingCost]);

  // Handle finalize order (H3 User Story: Security, LGPD compliance)
  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !phone || !city || !street || !number) {
      alert('Por favor, preencha os dados de entrega antes de finalizar.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setOrderId('MOV-' + Math.floor(Math.random() * 900000 + 100000));
      onClearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div id="checkout-success-view" className="max-w-[700px] mx-auto bg-white p-8 md:p-12 rounded-3xl border border-outline-variant/30 shadow-xl text-center space-y-6 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
          <span className="material-symbols-outlined text-5xl select-none">check_circle</span>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold text-primary">Pedido Finalizado com Sucesso!</h2>
          <p className="text-sm text-on-surface-variant font-sans">
            Obrigado por apoiar a agricultura familiar local e o consumo consciente.
          </p>
        </div>

        {/* Order specs receipt */}
        <div className="bg-[#fcf9f8] p-6 rounded-2xl border border-outline-variant/20 text-left space-y-4 max-w-md mx-auto">
          <div className="flex justify-between border-b border-outline-variant/30 pb-2 text-xs">
            <span className="font-label text-on-surface-variant uppercase tracking-wider">Número do Pedido</span>
            <span className="font-mono font-bold text-primary">{orderId}</span>
          </div>

          <div className="flex justify-between border-b border-outline-variant/30 pb-2 text-xs">
            <span className="font-label text-on-surface-variant uppercase tracking-wider">Forma de Pagamento</span>
            <span className="font-sans font-semibold text-on-surface">
              {activePaymentTab === 'pix' ? 'Pix Criptografado' : activePaymentTab === 'card' ? 'Cartão Gateway Secure' : 'Boleto Bancário'}
            </span>
          </div>

          <div className="flex justify-between border-b border-outline-variant/30 pb-2 text-xs">
            <span className="font-label text-on-surface-variant uppercase tracking-wider">Destinatário</span>
            <span className="font-sans font-semibold text-on-surface">{buyerName}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="font-label text-on-surface-variant uppercase tracking-wider font-bold text-primary">Total Pago</span>
            <span className="font-display font-bold text-primary text-sm">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Info Box detailing LGPD / Security compliance */}
        <div className="p-4 bg-primary/5 text-primary rounded-xl border border-primary/15 text-xs text-left max-w-md mx-auto flex items-start gap-3">
          <span className="material-symbols-outlined text-base mt-0.5 select-none">security</span>
          <p className="font-sans leading-relaxed">
            <strong>Privacidade Garantida (LGPD):</strong> Todos os seus dados pessoais e fiscais foram processados de acordo com os critérios da LGPD. Nenhuma informação bancária sensível foi guardada nos servidores da MOV.
          </p>
        </div>

        <div className="pt-4">
          <button 
            onClick={onNavigateToMarketplace}
            className="px-8 py-3 bg-primary text-white rounded-full font-sans font-bold text-sm shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all squishy"
          >
            Voltar ao Mercado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Columns - Delivery details and payment selection */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Step Header */}
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onNavigateToMarketplace}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-lg select-none">arrow_back</span>
          </button>
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">Finalizar Pedido</h2>
            <p className="text-xs text-on-surface-variant font-sans">Siga os passos para concluir sua compra segura.</p>
          </div>
        </div>

        {/* Deliver info (H2 Zip calculator) */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-xl select-none">local_shipping</span>
            <h3 className="font-display text-base font-bold text-primary">1. Endereço e Frete</h3>
          </div>

          {/* CEP Input Form for interactive calculation */}
          <form onSubmit={handleCepSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2 flex flex-col space-y-1">
              <label htmlFor="cep" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">CEP para Cálculo de Frete</label>
              <input 
                id="cep"
                type="text" 
                maxLength={8}
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 01311000 (apenas números)"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isCalculatingCep || !cep}
              className="w-full bg-secondary text-white py-2.5 px-4 rounded-lg font-sans font-bold text-xs shadow-md transition-all hover:bg-secondary-container hover:text-on-secondary-container disabled:opacity-50 squishy flex items-center justify-center gap-1.5"
            >
              {isCalculatingCep ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm select-none">calculate</span>
                  Calcular Frete
                </>
              )}
            </button>
          </form>

          {/* CEP calculation feedback */}
          {shippingCalculated && (
            <div id="freight-calculation-feedback" className="p-4 bg-primary/5 rounded-xl border border-primary/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-on-surface animate-fade-in">
              <div>
                <p className="font-label text-on-surface-variant uppercase tracking-widest text-[9px] font-semibold mb-0.5">Distância</p>
                <p className="font-bold text-primary">{distance.toFixed(1)} km do Produtor</p>
              </div>
              <div>
                <p className="font-label text-on-surface-variant uppercase tracking-widest text-[9px] font-semibold mb-0.5">Frete Estimado</p>
                <p className="font-bold text-primary">R$ {shippingCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-label text-on-surface-variant uppercase tracking-widest text-[9px] font-semibold mb-0.5">Prazo de Entrega</p>
                <p className="font-bold text-primary">Em até {deliveryTime}</p>
              </div>
            </div>
          )}

          {/* Address form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 flex flex-col space-y-1">
              <label htmlFor="street" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Rua / Logradouro</label>
              <input 
                id="street"
                type="text" 
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ex: Avenida Paulista"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              />
            </div>
            <div className="sm:col-span-4 flex flex-col space-y-1">
              <label htmlFor="number" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Número</label>
              <input 
                id="number"
                type="text" 
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: 1500"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 flex flex-col space-y-1">
              <label htmlFor="city" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Cidade</label>
              <input 
                id="city"
                type="text" 
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              />
            </div>
            <div className="sm:col-span-4 flex flex-col space-y-1">
              <label htmlFor="state" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Estado</label>
              <select 
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              >
                <option value="SP">São Paulo (SP)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="buyerName" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Nome Completo do Destinatário</label>
              <input 
                id="buyerName"
                type="text" 
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Ex: Pedro Alvares"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="phone" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Telefone de Contato</label>
              <input 
                id="phone"
                type="text" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Secure payment section (H3 User Story: Compliances & Encryptions) */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-xl select-none">security</span>
            <h3 className="font-display text-base font-bold text-primary">2. Pagamento Criptografado Seguro</h3>
          </div>

          {/* Payment Tabs selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#fcf9f8] rounded-xl border border-outline-variant/30">
            <button
              type="button"
              id="payment-tab-pix"
              onClick={() => setActivePaymentTab('pix')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold font-label uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activePaymentTab === 'pix' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm select-none">qr_code</span>
              Pix
            </button>
            <button
              type="button"
              id="payment-tab-card"
              onClick={() => setActivePaymentTab('card')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold font-label uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activePaymentTab === 'card' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm select-none">credit_card</span>
              Cartão
            </button>
            <button
              type="button"
              id="payment-tab-boleto"
              onClick={() => setActivePaymentTab('boleto')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold font-label uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activePaymentTab === 'boleto' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm select-none">barcode</span>
              Boleto
            </button>
          </div>

          {/* Tab content 1 - Pix */}
          {activePaymentTab === 'pix' && (
            <div id="payment-pix-body" className="space-y-4 text-center py-4 bg-primary/5 rounded-2xl border border-primary/10 animate-fade-in p-6">
              <div className="max-w-[120px] mx-auto bg-white p-3 rounded-xl shadow-inner border border-outline-variant/30">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9E9b51-r8Y9I4W7N3BfN0hA-eI3P4H6_gJ5U8eG-Qf3c5D8J_u-9r0H8X" 
                  alt="QR Code Pix" 
                  className="w-full h-full object-contain filter grayscale"
                  style={{ content: 'url("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014br.gov.bcb.pix0136mov-mercado-organicos-veganos-pix-key")' }}
                />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <p className="font-display text-sm font-bold text-primary">Pague instantaneamente via Pix</p>
                <p className="text-xs text-on-surface-variant font-sans">
                  Escaneie o QR Code ou copie a chave Pix abaixo. O status será atualizado e liberado em segundos.
                </p>
                
                <div className="flex items-center gap-2 mt-3 bg-white p-2 rounded-lg border border-outline-variant">
                  <span className="font-mono text-[10px] text-on-surface truncate flex-grow text-left">
                    00020126580014br.gov.bcb.pix0136mov-mercado-organicos-veganos-pix-key
                  </span>
                  <button 
                    type="button"
                    onClick={() => alert('Chave Pix copiada para a área de transferência!')}
                    className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded text-[10px] font-bold flex-shrink-0 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab content 2 - Card (No persistence layout H3) */}
          {activePaymentTab === 'card' && (
            <div id="payment-card-body" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="cardNumber" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Número do Cartão</label>
                  <input 
                    id="cardNumber"
                    type="text" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    placeholder="4532 1100 2341 0092"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="cardHolder" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Nome Impresso no Cartão</label>
                  <input 
                    id="cardHolder"
                    type="text" 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="PEDRO S ALVARES"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="cardExpiry" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Data de Vencimento</label>
                  <input 
                    id="cardExpiry"
                    type="text" 
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="cardCvv" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Código CVV</label>
                  <input 
                    id="cardCvv"
                    type="password" 
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Secure explanation showing LGPD / No credit card persistence */}
              <div className="p-3.5 bg-secondary-container/10 border border-secondary/15 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-lg mt-0.5 select-none">gpp_maybe</span>
                <div className="text-xs text-[#762c12] font-sans space-y-1">
                  <p className="font-bold uppercase tracking-wider">Aviso de Conformidade LGPD</p>
                  <p className="leading-relaxed">
                    Por conformidade com a LGPD e segurança, não armazenamos dados confidenciais do seu cartão em nossos servidores. Todas as transações são transmitidas de forma criptografada diretamente para o gateway parceiro.
                  </p>
                </div>
              </div>

              {/* Simulated Save Card Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={saveCardChecked}
                  onChange={(e) => setSaveCardChecked(e.target.checked)}
                  className="rounded text-primary focus:ring-primary border-outline-variant h-5 w-5 cursor-pointer accent-primary"
                />
                <span className="text-xs font-sans text-on-surface-variant">
                  Salvar cartão tokenizado de forma segura para compras futuras.
                </span>
              </label>
            </div>
          )}

          {/* Tab content 3 - Boleto */}
          {activePaymentTab === 'boleto' && (
            <div id="payment-boleto-body" className="space-y-4 text-center py-4 bg-[#fcf9f8] rounded-2xl border border-outline-variant/30 p-6 animate-fade-in">
              <div className="bg-white p-3 rounded-xl border border-outline-variant/30 flex items-center justify-center">
                {/* Simulated barcode */}
                <div className="h-10 w-full bg-repeating-linear max-w-sm flex items-center justify-around overflow-hidden select-none opacity-80">
                  <div className="h-full w-2 bg-black"></div>
                  <div className="h-full w-1 bg-black"></div>
                  <div className="h-full w-3 bg-black"></div>
                  <div className="h-full w-1 bg-black"></div>
                  <div className="h-full w-4 bg-black"></div>
                  <div className="h-full w-2 bg-black"></div>
                  <div className="h-full w-1 bg-black"></div>
                  <div className="h-full w-3 bg-black"></div>
                  <div className="h-full w-1 bg-black"></div>
                  <div className="h-full w-2 bg-black"></div>
                  <div className="h-full w-4 bg-black"></div>
                  <div className="h-full w-1 bg-black"></div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-display text-sm font-bold text-on-surface">Boleto gerado automaticamente após finalizar</p>
                <p className="text-xs text-on-surface-variant font-sans">
                  O boleto tem vencimento de 3 dias úteis e pode ser pago em qualquer banco ou aplicativo de pagamentos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Order details summary */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
        <h3 className="font-display text-lg font-bold text-primary pb-3 border-b border-outline-variant/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg select-none">receipt_long</span>
          Resumo do Pedido
        </h3>

        {/* Cart Item Row List */}
        <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-display text-xs font-bold text-on-surface truncate">{item.product.name}</h4>
                <p className="text-[10px] text-on-surface-variant font-sans">Qtd: {item.quantity} x R$ {item.product.price.toFixed(2)}</p>
              </div>
              <span className="text-xs font-display font-bold text-primary flex-shrink-0">
                R$ {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t border-outline-variant/20 text-xs font-sans text-on-surface-variant">
          <div className="flex justify-between">
            <span>Subtotal dos Produtos</span>
            <span className="font-bold text-on-surface">R$ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Custo de Entrega</span>
            <span className="font-bold text-on-surface">
              {shippingCalculated ? (shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2)}`) : 'Pendente de cálculo'}
            </span>
          </div>

          {shippingCalculated && (
            <div className="flex justify-between text-primary font-bold">
              <span>Desconto Sazonal</span>
              <span>- R$ 0,00</span>
            </div>
          )}

          <div className="flex justify-between text-base font-display font-bold text-primary pt-3 border-t border-outline-variant/20">
            <span>Total Geral</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout finalize button */}
        <div className="pt-4">
          <button 
            onClick={handleFinalizeOrder}
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-primary text-white py-3 rounded-xl font-sans font-bold text-sm shadow-md hover:bg-primary-container transition-all squishy flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finalizando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm select-none">gavel</span>
                Finalizar Pedido com Segurança
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-on-surface-variant mt-3 select-none">
            <span className="material-symbols-outlined text-xs text-primary select-none">lock</span>
            Criptografia de ponta-a-ponta SSL de 256 bits.
          </div>
        </div>
      </div>
    </div>
  );
}
