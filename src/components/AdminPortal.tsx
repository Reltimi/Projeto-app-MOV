import React, { useEffect, useState } from 'react';
import { getRegistrations, deleteRegistration, Registration, saveRegistration } from '../lib/firebase';

interface AdminPortalProps {
  onBackToOnboarding: () => void;
}

export default function AdminPortal({ onBackToOnboarding }: AdminPortalProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'buyer' | 'seller'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load registrations from Firestore
  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Não foi possível obter dados do Firestore. Verifique sua conexão ou se as regras de segurança estão configuradas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Delete a record
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cadastro do banco de dados?')) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Erro ao excluir o registro.');
    } finally {
      setActionLoading(null);
    }
  };

  // Seed some beautiful mock accounts to test if Firestore is empty
  const handleSeedMockData = async () => {
    setLoading(true);
    try {
      const mockUsers: Omit<Registration, 'id' | 'createdAt'>[] = [
        {
          fullName: 'Ana Claudia Mendes',
          email: 'ana.claudia@fazendaflor.com.br',
          role: 'seller',
          farmName: 'Sítio Florescer Orgânicos',
          taxId: '12.345.678/0001-90'
        },
        {
          fullName: 'Bruno Medeiros',
          email: 'bruno.medeiros@gmail.com',
          role: 'buyer'
        },
        {
          fullName: 'Carlos Alberto Ferreira',
          email: 'contato@agroferreira.com',
          role: 'seller',
          farmName: 'Agroecologia Ferreira',
          taxId: '98.765.432/0001-21'
        },
        {
          fullName: 'Diana Reis Albuquerque',
          email: 'diana.reis@outlook.com',
          role: 'buyer'
        }
      ];

      for (const user of mockUsers) {
        await saveRegistration(user);
      }
      await loadData();
    } catch (err) {
      alert('Erro ao semear registros de teste.');
    } finally {
      setLoading(false);
    }
  };

  // Filter calculations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.farmName && r.farmName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || r.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Analytics Metrics
  const totalCount = registrations.length;
  const buyersCount = registrations.filter((r) => r.role === 'buyer').length;
  const sellersCount = registrations.filter((r) => r.role === 'seller').length;
  const sellerPercentage = totalCount > 0 ? Math.round((sellersCount / totalCount) * 100) : 0;

  return (
    <div id="admin-portal-view" className="w-full space-y-8 max-w-[1200px] mx-auto px-4 md:px-16 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl select-none">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">Painel de Administração MOV</h1>
            <p className="text-xs text-on-surface-variant font-sans">
              Gerenciamento de Cadastros Ativos em Tempo Real (Integrado com Firebase Cloud Firestore).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-all flex items-center justify-center text-on-surface-variant hover:text-on-surface focus:outline-none"
            title="Atualizar dados do Firestore"
          >
            <span className={`material-symbols-outlined text-lg select-none ${loading ? 'animate-spin' : ''}`}>sync</span>
          </button>
          
          <button 
            onClick={onBackToOnboarding}
            className="px-5 py-2.5 border border-outline-variant rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container transition-all flex items-center gap-1.5 focus:outline-none"
          >
            <span className="material-symbols-outlined text-base select-none">person_add</span>
            Voltar para Cadastro
          </button>
        </div>
      </div>

      {/* Connection status banner */}
      <div className="bg-[#e8f5e9]/60 border border-[#a5d6a7]/40 px-4 py-3 rounded-xl flex items-center justify-between text-xs text-[#2e7d32]">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4caf50] animate-pulse"></span>
          Conexão Ativa: Banco de Dados sharp-density-d5xj8 (Firestore default)
        </div>
        <div className="font-mono text-[10px] bg-white/50 px-2 py-0.5 rounded border border-[#a5d6a7]/30">
          Status: Operacional
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Total de Contas</p>
            <p className="font-display text-3xl font-extrabold text-primary mt-1">{totalCount}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary/20 select-none">group</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Compradores</p>
            <p className="font-display text-3xl font-extrabold text-[#2e7d32] mt-1">{buyersCount}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-[#2e7d32]/20 select-none">shopping_basket</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Produtores</p>
            <p className="font-display text-3xl font-extrabold text-secondary mt-1">{sellersCount}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-secondary/20 select-none">storefront</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Proporção Produtores</p>
            <p className="font-display text-3xl font-extrabold text-primary mt-1">{sellerPercentage}%</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary/20 select-none">donut_large</span>
        </div>
      </div>

      {/* Main Table & Filters */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#fcf9f8]/40">
          <div>
            <h3 className="font-display text-base font-bold text-on-surface">Lista de Registros no Firestore</h3>
            <p className="text-xs text-on-surface-variant font-sans">Pesquise e gerencie dados em tempo real.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm select-none">search</span>
              <input 
                type="text" 
                placeholder="Buscar por nome, email, fazenda..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-outline-variant rounded-lg text-xs outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex border border-outline-variant rounded-lg p-0.5 bg-white select-none">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  roleFilter === 'all' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setRoleFilter('buyer')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  roleFilter === 'buyer' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Compradores
              </button>
              <button
                onClick={() => setRoleFilter('seller')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  roleFilter === 'seller' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Produtores
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 bg-error-container/15 text-error text-xs font-medium border-b border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-base select-none">error</span>
            {errorMsg}
          </div>
        )}

        {/* Data list state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="text-xs text-on-surface-variant font-sans">Carregando registros do Cloud Firestore...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 select-none">database_off</span>
            <div>
              <p className="font-display font-bold text-on-surface text-base">Nenhum registro encontrado</p>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1 font-sans leading-relaxed">
                Parece que não há dados correspondentes aos filtros ou nenhuma conta foi cadastrada ainda neste ambiente de testes do Firebase.
              </p>
            </div>
            
            {registrations.length === 0 && (
              <button
                onClick={handleSeedMockData}
                className="px-5 py-2.5 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-secondary-container transition-all flex items-center gap-1.5 mx-auto squishy"
              >
                <span className="material-symbols-outlined text-base select-none">add_moderator</span>
                Semear Contas de Teste no Firestore
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#fcf9f8] border-b border-outline-variant/30 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4">Nome & Perfil</th>
                  <th className="p-4">Contato / E-mail</th>
                  <th className="p-4">Informação Profissional</th>
                  <th className="p-4">Documento (CNPJ/CPF)</th>
                  <th className="p-4">Data de Cadastro</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 font-sans">
                {filteredRegistrations.map((user) => (
                  <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                    {/* Name & Role Badge */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          user.role === 'seller' ? 'bg-secondary/15 text-secondary' : 'bg-[#e8f5e9] text-[#2e7d32]'
                        }`}>
                          <span className="material-symbols-outlined text-base select-none">
                            {user.role === 'seller' ? 'storefront' : 'shopping_basket'}
                          </span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-on-surface text-sm">{user.fullName}</p>
                          <span className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[9px] font-bold font-label uppercase tracking-wider ${
                            user.role === 'seller' 
                              ? 'bg-secondary/10 text-secondary' 
                              : 'bg-[#e8f5e9] text-[#2e7d32]'
                          }`}>
                            {user.role === 'seller' ? 'Produtor' : 'Comprador'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-on-surface font-medium">
                      {user.email}
                    </td>

                    {/* Professional Info */}
                    <td className="p-4 text-on-surface-variant">
                      {user.role === 'seller' ? (
                        <div className="flex items-center gap-1.5 font-medium text-on-surface">
                          <span className="material-symbols-outlined text-sm select-none text-secondary">agriculture</span>
                          {user.farmName}
                        </div>
                      ) : (
                        <span className="text-on-surface-variant opacity-60 font-sans italic">Consumidor Urbano</span>
                      )}
                    </td>

                    {/* Tax ID */}
                    <td className="p-4 font-mono text-on-surface-variant">
                      {user.role === 'seller' ? (
                        user.taxId
                      ) : (
                        <span className="text-on-surface-variant opacity-40 font-sans">-</span>
                      )}
                    </td>

                    {/* Registration Date */}
                    <td className="p-4 text-on-surface-variant">
                      {user.createdAt ? (
                        new Date(user.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ) : (
                        <span className="text-on-surface-variant opacity-40 font-sans">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => user.id && handleDelete(user.id)}
                        disabled={actionLoading === user.id}
                        className="p-1.5 border border-outline-variant/40 rounded hover:border-error hover:bg-error-container/15 text-on-surface-variant hover:text-error transition-all focus:outline-none"
                        title="Remover cadastro do Firestore"
                      >
                        {actionLoading === user.id ? (
                          <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="material-symbols-outlined text-base select-none">delete</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guide/Information Footer */}
      <div className="bg-[#fff3e0]/40 border border-[#ffe0b2]/45 p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ef6c00] select-none">info</span>
          <h4 className="font-display text-sm font-bold text-[#ef6c00]">Como testar a integração do protótipo?</h4>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed font-sans max-w-4xl">
          1. Vá para a tela de <strong>Onboarding (Cadastro)</strong> usando o menu inferior ou o botão acima.<br />
          2. Cadastre uma nova conta preenchendo todos os dados necessários (Nome, Email, Senha). Se escolher "Produtor", preencha também o nome da Fazenda e o CPF/CNPJ.<br />
          3. Ao clicar em <strong>"Criar minha conta"</strong>, o aplicativo salvará as informações diretamente na coleção <code>registrations</code> no Google Cloud Firestore.<br />
          4. Retorne a este <strong>Painel Admin</strong> para constatar que o novo cadastro aparece aqui imediatamente, demonstrando o funcionamento total da arquitetura Serverless.
        </p>
      </div>
    </div>
  );
}
