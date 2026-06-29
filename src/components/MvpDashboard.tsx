import React, { useState } from 'react';
import { USER_STORIES, MVP_MATRIX } from '../data';
import { UserStory } from '../types';

export default function MvpDashboard() {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(USER_STORIES[0]);

  return (
    <div id="mvp-dashboard-view" className="w-full space-y-8 max-w-[1200px] mx-auto px-4 md:px-16 py-6">
      
      {/* View Header */}
      <div className="pb-4 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl select-none">analytics</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">Painel de Alinhamento de Escopo & MVP</h1>
            <p className="text-xs text-on-surface-variant font-sans">Compare as prioridades da matriz GxUxT (Gravidade, Urgência e Tendência) com as telas desenvolvidas.</p>
          </div>
        </div>
      </div>

      {/* Grid: Prioritization Table + Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Prioritization Table Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant/20">
            <h3 className="font-display text-base font-bold text-primary">Tabela de Priorização de Requisitos (Matriz GxUxT)</h3>
            <p className="text-xs text-on-surface-variant font-sans">Fórmula de Classificação: Total = Gravidade (G) × Urgência (U) × Tendência (T)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#fcf9f8] border-b border-outline-variant/30 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="p-3">ID</th>
                  <th className="p-3">História de Usuário</th>
                  <th className="p-3 text-center">G</th>
                  <th className="p-3 text-center">U</th>
                  <th className="p-3 text-center">T</th>
                  <th className="p-3 text-center font-bold">Total</th>
                  <th className="p-3 text-center font-bold text-secondary">Prioridade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {USER_STORIES.map((story) => (
                  <tr 
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className={`cursor-pointer transition-colors ${
                      selectedStory?.id === story.id 
                        ? 'bg-secondary/10 border-l-4 border-secondary' 
                        : 'hover:bg-primary/5'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-on-surface">{story.id}</td>
                    <td className="p-3">
                      <p className="font-display font-semibold text-on-surface">{story.title}</p>
                    </td>
                    <td className="p-3 text-center font-sans">{story.gravity}</td>
                    <td className="p-3 text-center font-sans">{story.urgency}</td>
                    <td className="p-3 text-center font-sans">{story.trend}</td>
                    <td className="p-3 text-center font-bold font-mono">{story.total}</td>
                    <td className="p-3 text-center font-label font-bold text-secondary">{story.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Requirements interactive Details Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-lg select-none">verified_user</span>
            <h4 className="font-display text-sm font-bold text-secondary">Validação de Escopo do MVP</h4>
          </div>

          {selectedStory ? (
            <div className="space-y-4 animate-fade-in text-xs">
              <div>
                <span className="inline-block px-2 py-0.5 bg-secondary text-white font-mono font-bold rounded text-[10px] mb-2">
                  {selectedStory.id} - {selectedStory.priority} Prioridade
                </span>
                <h5 className="font-display text-sm font-bold text-primary">{selectedStory.title}</h5>
              </div>

              <p className="text-on-surface-variant font-sans leading-relaxed">
                {selectedStory.description}
              </p>

              {/* Implementation details mapping requirements to features */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                <p className="font-label text-[10px] text-primary uppercase tracking-wider font-bold flex items-center gap-1 select-none">
                  <span className="material-symbols-outlined text-xs">done_all</span>
                  Como foi resolvido na aplicação:
                </p>
                <p className="text-on-surface font-sans leading-relaxed text-[11px]">
                  {selectedStory.id === 'H1' && 'Desenvolvido no cabeçalho com categorias clicáveis, barra de busca por digitação e sidebar interativa com filtros de dieta (Orgânico, Vegano, Sem Glúten) e preços.'}
                  {selectedStory.id === 'H3' && 'Resolvido na tela de Checkout. Criou-se abas de pagamentos criptografados (Pix, Cartão, Boleto) com aviso de conformidade LGPD e não armazenamento de dados confidenciais.'}
                  {selectedStory.id === 'H7' && 'Cumprido no fluxo inicial de Onboarding, permitindo ao usuário selecionar o perfil de "Produtor", preencher dados específicos da fazenda e liberar o Portal correspondente.'}
                  {selectedStory.id === 'H4' && 'Funciona plenamente no Portal do Produtor através do painel de cadastro de produtos manuais, permitindo colocar nome, foto, categoria, preço e quantidade disponível.'}
                  {selectedStory.id === 'H2' && 'Disponível no Checkout. O comprador insere o CEP e o sistema simula em tempo real a distância física do sítio, estimando o custo de entrega e o prazo em horas.'}
                  {selectedStory.id === 'H6' && 'Implementado no Portal do Produtor como um guia dinâmico ilustrado (passo-a-passo) ensinando regras de iluminação, enquadramento rústico e precisão de pesos.'}
                  {selectedStory.id === 'H5' && 'Mock de status integrado nos logs de transação e recibos finais de pedido.'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant text-center py-10 font-sans">Selecione uma história de usuário na tabela ao lado para ver a conformidade com o escopo.</p>
          )}
        </div>
      </div>

      {/* É / NÃO É / FAZ / NÃO FAZ 2x2 Matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary select-none">grid_view</span>
          <h3 className="font-display text-lg font-bold text-primary">Matriz de Definição de Escopo (É / Não É / Faz / Não Faz)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* É */}
          <div className="bg-white p-5 rounded-2xl border-t-4 border-primary shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-display font-bold text-sm">
              <span className="material-symbols-outlined select-none text-base">check_circle</span>
              O que o MOV É
            </div>
            <ul className="space-y-2 text-xs text-on-surface-variant font-sans list-disc list-inside">
              {MVP_MATRIX.e.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* NÃO É */}
          <div className="bg-white p-5 rounded-2xl border-t-4 border-[#7a2f15] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#7a2f15] font-display font-bold text-sm">
              <span className="material-symbols-outlined select-none text-base">cancel</span>
              O que o MOV NÃO É
            </div>
            <ul className="space-y-2 text-xs text-on-surface-variant font-sans list-disc list-inside">
              {MVP_MATRIX.nao_e.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* FAZ */}
          <div className="bg-white p-5 rounded-2xl border-t-4 border-[#2d5a27] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#2d5a27] font-display font-bold text-sm">
              <span className="material-symbols-outlined select-none text-base">bolt</span>
              O que o MOV FAZ
            </div>
            <ul className="space-y-2 text-xs text-on-surface-variant font-sans list-disc list-inside">
              {MVP_MATRIX.faz.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* NÃO FAZ */}
          <div className="bg-white p-5 rounded-2xl border-t-4 border-error shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-error font-display font-bold text-sm">
              <span className="material-symbols-outlined select-none text-base">block</span>
              O que o MOV NÃO FAZ
            </div>
            <ul className="space-y-2 text-xs text-on-surface-variant font-sans list-disc list-inside">
              {MVP_MATRIX.nao_faz.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
