import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';

interface ProducerPortalProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProduct: (product: Product) => void;
  onNavigateToMarketplace: () => void;
}

export default function ProducerPortal({
  products,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onNavigateToMarketplace
}: ProducerPortalProps) {
  // Stats
  const stats = useMemo(() => {
    const active = products.length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 8).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    return { active, lowStock, outOfStock };
  }, [products]);

  // Image upload tutorial state (H6)
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [category, setCategory] = useState<ProductCategory>('vegetais');
  const [image, setImage] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [tag, setTag] = useState('Orgânico');

  // Open form for adding
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setPrice(0);
    setUnit('unidade');
    setQuantity(10);
    setCategory('vegetais');
    setImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600');
    setIsOrganic(true);
    setIsVegan(false);
    setIsGlutenFree(false);
    setTag('Orgânico');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setUnit(product.unit);
    setQuantity(product.quantity);
    setCategory(product.category);
    setImage(product.image);
    setIsOrganic(!!product.isOrganic);
    setIsVegan(!!product.isVegan);
    setIsGlutenFree(!!product.isGlutenFree);
    setTag(product.tag || 'Orgânico');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || !unit) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    if (editingProduct) {
      // Update existing
      onUpdateProduct({
        ...editingProduct,
        name,
        price,
        unit,
        quantity,
        category,
        image,
        isOrganic,
        isVegan,
        isGlutenFree,
        tag
      });
    } else {
      // Add new
      onAddProduct({
        name,
        price,
        unit,
        quantity,
        category,
        image,
        isOrganic,
        isVegan,
        isGlutenFree,
        tag
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div id="producer-portal-view" className="w-full space-y-8 max-w-[1200px] mx-auto px-4 md:px-16 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl select-none">storefront</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">Portal do Produtor MOV</h1>
            <p className="text-xs text-on-surface-variant font-sans">Gerencie seus produtos, estoque e visualize o guia de vendas.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateToMarketplace}
            className="px-5 py-2.5 border border-outline-variant rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container transition-all flex items-center gap-1.5 focus:outline-none"
          >
            <span className="material-symbols-outlined text-base select-none">shopping_basket</span>
            Ir para a Feira
          </button>
          <button 
            onClick={handleOpenAdd}
            id="producer-add-product-btn"
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 squishy focus:outline-none"
          >
            <span className="material-symbols-outlined text-base select-none">add_circle</span>
            Cadastrar Novo Produto
          </button>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Itens Cadastrados</p>
            <p className="font-display text-3xl font-extrabold text-primary mt-1">{stats.active}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary/25 select-none">inventory</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Estoque Crítico</p>
            <p className="font-display text-3xl font-extrabold text-[#7a2f15] mt-1">{stats.lowStock}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-[#7a2f15]/25 select-none">warning</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Sem Estoque</p>
            <p className="font-display text-3xl font-extrabold text-error mt-1">{stats.outOfStock}</p>
          </div>
          <span className="material-symbols-outlined text-4xl text-error/25 select-none">production_quantity_limits</span>
        </div>
      </div>

      {/* Seller Tutorial Guide Panel (H6: Tutorial para Lojista wizard) */}
      {showTutorial && (
        <div id="producer-tutorial-panel" className="bg-[#ffdbd0]/15 border border-[#fe9572]/30 p-6 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary select-none">menu_book</span>
              <h3 className="font-display text-base font-bold text-secondary">Guia do Lojista: Como tirar fotos corretas e organizar seu catálogo</h3>
            </div>
            <button 
              onClick={() => setShowTutorial(false)}
              className="text-on-surface-variant hover:text-on-surface"
              title="Ocultar guia"
            >
              <span className="material-symbols-outlined text-lg select-none">close</span>
            </button>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed max-w-3xl">
            Um catálogo atraente vende mais! Siga estes 3 passos simples sugeridos por nossos especialistas para fazer com que seus produtos colhidos pareçam frescos e saborosos aos olhos do cliente urbano.
          </p>

          {/* Interactive Steps indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {[
              {
                step: 1,
                title: '1. Iluminação e Foco',
                desc: 'Evite tirar fotos de noite ou sob luz artificial amarela. Prefira a luz da manhã em áreas abertas da sua própria horta.'
              },
              {
                step: 2,
                title: '2. Enquadramento e Fundo',
                desc: 'Centralize o produto (ex: alface ou rabanetes) e mantenha um fundo rústico (madeira, terra ou grama) para ressaltar a origem orgânica.'
              },
              {
                step: 3,
                title: '3. Medidas e Descrições',
                desc: 'Sempre defina se a venda é por "Maço (300g)", "Bandeja (250g)" ou "Quilo", dando clareza total ao consumidor.'
              }
            ].map((s) => (
              <div 
                key={s.step} 
                onClick={() => setTutorialStep(s.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  tutorialStep === s.step 
                    ? 'bg-white border-[#fe9572] shadow-sm' 
                    : 'bg-transparent border-outline-variant/20 hover:border-outline-variant'
                }`}
              >
                <h4 className={`font-display text-xs font-bold mb-1 ${tutorialStep === s.step ? 'text-secondary' : 'text-on-surface'}`}>
                  {s.title}
                </h4>
                <p className="text-[11px] text-on-surface-variant leading-normal">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Preview depending on Tutorial step */}
          <div className="bg-white p-4 rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-4 text-xs animate-fade-in">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              <img 
                src={
                  tutorialStep === 1 
                    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9phTr7dlQzJtpCCKvVMLke5ZYP4_wCNtEnjwcRpaRIEVsvIgKUYRQr4LmfColZG6MP2pH5FEzq3zD6K-V95OcytoAfj7kogWEQ9BZgy1Ipoyzlelgwg4jrQdDGAz125NTNybT7sCtplCmgbvA-PwOmraJyxOSOmugk7utTR3MzPi52E6hivlB6Bq7Yao4rWM3pRW7-PbJhXbNz6rcxrsyPZmop_Y6yj3CoSG3rdcG9SaUHSM7lZHP-DGlR3vUjx1XPTGftXAZShTH'
                    : tutorialStep === 2
                    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWCm8Je2wUksjDqBkHcMM7_e2OVMDZfbjkevSe_Wgizc47UJduXm1gWl1YC2HA-fLJeVg2HinZA5adMes0k3nt1N9N4chwS-a8w9VTcXZDuasWvaseyzxxaBe6faGh4-fvAYt8XC2Nzgqk_u4UTMU91hCu1pajAtwGCZWZc4cHlfN3AExLVYPZPcNX-V48w9DydBcPt7FRO75XzK_UlBXC6Xg2PIrgbHtjp4FkIretAKli0oeytadYMzGw6BbOcmqCGVlyg0xEfcZ-'
                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ik66OMIQZoz07HqU3eGJ0TTEFOeoPgQUoaMltFI3qvRE6Yb6q4OReHcFSBneJN-IeuJRsmBIqoH2V8iCzQ8ugbzB07MUatMYj2ze9PYIEiygDxdSgWn3oBhdIxyt0Be6nmnoBlIjFVvjLwI6ZgE8td_s-5RtkF-xtY6MZ4lTVaIUVkibIAT8cFbmmbiw6bSt0UzIoi-iqvY_k5BhX2KuG4NZPVS-KchTfkKIieRW_ToqMOdKjm5Q3o6_8_Bbnfutd-3GSNo29hLt'
                } 
                alt="Tutorial asset" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-secondary uppercase tracking-wider text-[10px]">Preview da foto do catálogo</p>
              <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                {tutorialStep === 1 
                  ? 'Note como as cores das folhas do Alface Manteiga sobressaem quando expostas à luz natural matinal.'
                  : tutorialStep === 2
                  ? 'Foco centralizado com rabanetes sobre fundo orgânico rústico em cor contrastante.'
                  : 'Exemplo de pote medidor artesanal indicando precisamente 350g por embalagem comercial.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Catalog items Table */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-on-surface">Seu Catálogo de Vendas</h3>
            <p className="text-xs text-on-surface-variant font-sans">Cadastre, edite e acompanhe os seus produtos ofertados.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm select-none">search</span>
            <input 
              type="text" 
              placeholder="Filtrar seu catálogo..." 
              className="w-full pl-9 pr-4 py-2 bg-[#fcf9f8] border border-outline-variant rounded-lg text-xs outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcf9f8] border-b border-outline-variant/30 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="p-4">Produto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-center">Dietas/Selos</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-on-surface">{product.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-sans">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-0.5 bg-[#f0eded] text-on-surface-variant font-label text-[10px] font-bold rounded-md uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-primary font-display">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    {product.quantity === 0 ? (
                      <span className="text-error font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm select-none">cancel</span>
                        Sem Estoque
                      </span>
                    ) : product.quantity <= 8 ? (
                      <span className="text-[#7a2f15] font-semibold flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-sm select-none">report_problem</span>
                        Crítico ({product.quantity})
                      </span>
                    ) : (
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm select-none">check_circle</span>
                        {product.quantity} unidades
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {product.isOrganic && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded" title="Orgânico">ORG</span>
                      )}
                      {product.isVegan && (
                        <span className="px-1.5 py-0.5 bg-secondary-container/20 text-[#762c12] text-[9px] font-bold rounded" title="Vegano">VEG</span>
                      )}
                      {product.isGlutenFree && (
                        <span className="px-1.5 py-0.5 bg-[#ffdbd0] text-secondary text-[9px] font-bold rounded" title="Sem Glúten">GLU</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 border border-outline-variant/40 rounded hover:border-primary hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-base select-none">edit</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Tem certeza de que deseja excluir o produto ${product.name}?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="p-2 border border-outline-variant/40 rounded hover:border-error hover:bg-error-container/15 text-on-surface-variant hover:text-error transition-all"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-base select-none">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide Form/Modal Overlay for Add/Edit product (H4) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="producer-form-modal">
          <div 
            onClick={() => setIsFormOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between">
              
              <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-primary text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl select-none">inventory_2</span>
                  <h3 className="font-display text-lg font-bold">
                    {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl select-none">close</span>
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                
                <div className="flex flex-col space-y-1">
                  <label htmlFor="prod-name" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Nome do Produto</label>
                  <input 
                    id="prod-name"
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Espinafre Orgânico"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="prod-price" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Preço Comercial (R$)</label>
                    <input 
                      id="prod-price"
                      type="number" 
                      step="0.01"
                      required
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="Ex: 5.50"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="prod-unit" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Unidade Comercial</label>
                    <input 
                      id="prod-unit"
                      type="text" 
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="Ex: Maço (300g) ou un"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="prod-quantity" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Quantidade Inicial em Estoque</label>
                    <input 
                      id="prod-quantity"
                      type="number" 
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      placeholder="10"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="prod-category" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Categoria</label>
                    <select 
                      id="prod-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                    >
                      <option value="vegetais">Vegetais e Folhas</option>
                      <option value="frutas">Frutas Frescas</option>
                      <option value="graos">Grãos e Cereais</option>
                      <option value="despensa">Despensa Vegana</option>
                    </select>
                  </div>
                </div>

                {/* Photo URL selection (Direct Links) */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="prod-image" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">URL da Imagem do Produto</label>
                  <input 
                    id="prod-image"
                    type="text" 
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                  />
                  
                  {/* Preset quick image loaders for the producer convenience */}
                  <div className="pt-1.5 flex flex-wrap gap-2">
                    <span className="text-[10px] text-on-surface-variant font-medium select-none">Presets de teste:</span>
                    {[
                      { label: 'Brócolis', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600' },
                      { label: 'Cenoura', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600' },
                      { label: 'Maçã', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600' },
                      { label: 'Pantry Pote', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=600' }
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setImage(p.url)}
                        className="px-2 py-0.5 border border-outline-variant/50 hover:border-primary rounded text-[9px] text-on-surface font-semibold bg-white transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Tags Checkboxes */}
                <div className="space-y-3 pt-3 border-t border-outline-variant/30">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Dietas e Selos Corporativos</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-outline-variant/30 bg-[#fcf9f8] hover:border-primary/45">
                      <input 
                        type="checkbox" 
                        checked={isOrganic}
                        onChange={(e) => {
                          setIsOrganic(e.target.checked);
                          if (e.target.checked) setTag('Orgânico');
                        }}
                        className="accent-primary"
                      />
                      <span className="text-[10px] font-sans text-on-surface">Orgânico</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-outline-variant/30 bg-[#fcf9f8] hover:border-primary/45">
                      <input 
                        type="checkbox" 
                        checked={isVegan}
                        onChange={(e) => {
                          setIsVegan(e.target.checked);
                          if (e.target.checked) setTag('Vegano');
                        }}
                        className="accent-primary"
                      />
                      <span className="text-[10px] font-sans text-on-surface">Vegano</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-outline-variant/30 bg-[#fcf9f8] hover:border-primary/45">
                      <input 
                        type="checkbox" 
                        checked={isGlutenFree}
                        onChange={(e) => {
                          setIsGlutenFree(e.target.checked);
                          if (e.target.checked) setTag('Glúten-Free');
                        }}
                        className="accent-primary"
                      />
                      <span className="text-[10px] font-sans text-on-surface">Glúten-Free</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col space-y-1 pt-2">
                  <label htmlFor="prod-tag" className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Selo em Destaque (Tag)</label>
                  <input 
                    id="prod-tag"
                    type="text" 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Ex: Orgânico, Sazonal, Novidade"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm bg-white"
                  />
                </div>
              </form>

              {/* Form footer */}
              <div className="p-6 border-t border-outline-variant/30 bg-[#fcf9f8] flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-3 border border-outline-variant/60 rounded-xl font-sans font-bold text-xs text-on-surface hover:bg-white transition-all focus:outline-none"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleFormSubmit}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-sans font-bold text-xs shadow-md hover:bg-primary-container transition-all squishy focus:outline-none"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
