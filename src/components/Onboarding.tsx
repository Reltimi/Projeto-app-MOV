import React, { useState } from 'react';
import { UserRole } from '../types';
import { saveRegistration } from '../lib/firebase';

interface OnboardingProps {
  onSuccess: (fullName: string, role: UserRole) => void;
  onNavigateToLogin?: () => void;
}

export default function Onboarding({ onSuccess }: OnboardingProps) {
  const [role, setRole] = useState<UserRole>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Producer fields
  const [farmName, setFarmName] = useState('');
  const [taxId, setTaxId] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    if (role === 'seller' && (!farmName || !taxId)) {
      setErrorMsg('Por favor, insira as informações profissionais do produtor.');
      return;
    }

    setLoading(true);

    try {
      // Save registration directly to Cloud Firestore
      await saveRegistration({
        fullName,
        email,
        role,
        ...(role === 'seller' ? { farmName, taxId } : {})
      });

      setLoading(false);
      onSuccess(fullName, role);
    } catch (error: any) {
      console.error(error);
      setErrorMsg('Erro ao salvar no banco de dados Firestore. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div id="onboarding-flow" className="max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#fcf9f8] p-4 rounded-2xl">
      {/* Left side - Welcome Banner */}
      <div id="onboarding-welcome-panel" className="hidden md:flex flex-col space-y-6">
        <div className="space-y-3">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary leading-tight">
            Bem-vindo à nossa feira digital.
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-md">
            Conectando produtores locais a consumidores conscientes. Juntos, estamos cultivando um futuro mais saudável e sustentável.
          </p>
        </div>
        
        {/* Farm Graphic overlay */}
        <div id="onboarding-hero-image" className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg border border-outline-variant/30 group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6w-QORRPcw5rBQxGXsumWOpgn6OhJAud58E-4GC1gmnEjUhei6E1B9CXYmm2DCnp-LorEMfRn0cpNOMw9z7Tp8kUEsDpKsgSACyS-83fmga2R-nY-WYzAOi6vfYz7iVxb9QQF1ITFmwb1iQzgnPPNgZ_QyrRLGlQGoOC2dhlFiMByIJfGCN1rl1SDZKk7TDHJOZ-9zxJzR8Y5rJ1mxzg5YhJ_ite3s6rL4D6IlKGGoYuDpZ9gzdOdONLD4Gi7476EVZoofudZpGSl" 
            alt="Lush organic farm at sunrise" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <p className="font-label text-xs uppercase tracking-wider opacity-85">Impacto Positivo</p>
            <p className="font-display text-2xl font-semibold">|15.000 Famílias alimentadas</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div id="registration-card" className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-xl shadow-primary/5">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-primary mb-1">Crie sua conta</h2>
          <p className="text-on-surface-variant text-sm font-sans">Como você deseja usar o MOV?</p>
        </div>

        {/* Role Selectors */}
        <div id="role-selector-container" className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            id="role-buyer-btn"
            onClick={() => setRole('buyer')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
              role === 'buyer'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-outline-variant hover:border-primary/40 text-on-surface-variant bg-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-3xl mb-1 select-none">shopping_basket</span>
            <span className="font-label text-xs uppercase tracking-wider font-semibold">Comprador</span>
          </button>

          <button
            type="button"
            id="role-seller-btn"
            onClick={() => setRole('seller')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
              role === 'seller'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-outline-variant hover:border-primary/40 text-on-surface-variant bg-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-3xl mb-1 select-none">storefront</span>
            <span className="font-label text-xs uppercase tracking-wider font-semibold">Produtor</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div id="error-message" className="p-3 text-xs font-medium text-error bg-error-container/20 border border-error/20 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <label htmlFor="fullName" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Nome Completo</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Maria Silva"
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all text-sm outline-none font-sans"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@exemplo.com"
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all text-sm outline-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Senha</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all text-sm outline-none font-sans"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="confirmPassword" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Confirmar Senha</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all text-sm outline-none font-sans"
              />
            </div>
          </div>

          {/* Conditional Professional Fields if Seller is selected */}
          {role === 'seller' && (
            <div id="producer-details-section" className="pt-4 border-t border-outline-variant/30 space-y-4 animate-fade-in">
              <p className="font-label text-xs text-secondary font-bold uppercase tracking-wider">Dados Profissionais</p>
              
              <div className="flex flex-col space-y-1">
                <label htmlFor="farmName" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Nome da Fazenda ou Loja</label>
                <input
                  id="farmName"
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Ex: Sítio Vale Verde"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all text-sm outline-none font-sans"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="taxId" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">CNPJ / CPF</label>
                <input
                  id="taxId"
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all text-sm outline-none font-sans"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 px-6 rounded-full font-sans font-semibold text-base shadow-md transition-all hover:bg-primary-container focus:ring-2 focus:ring-offset-2 focus:ring-primary squishy flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                <>
                  Criar minha conta
                  <span className="material-symbols-outlined text-xl select-none">arrow_forward</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant">
              Já possui uma conta?{' '}
              <button
                type="button"
                id="fake-login-btn"
                onClick={() => onSuccess('Simulação Comprador', 'buyer')}
                className="text-secondary font-bold hover:underline transition-all"
              >
                Entre aqui
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
