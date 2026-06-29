import React, { useState, useMemo } from 'react';
import { Product, CartItem, ProductCategory } from '../types';

interface MarketplaceProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateCartQuantity: (productId: string, qty: number) => void;
  onNavigateToCheckout: () => void;
  userName: string;
  onLogout: () => void;
  onNavigateToProducer: () => void;
}

export default function Marketplace({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onNavigateToCheckout,
  userName,
  onLogout,
  onNavigateToProducer
}: MarketplaceProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  
  // Sidebar states
  const [dietaryOrganic, setDietaryOrganic] = useState(false);
  const [dietaryVegan, setDietaryVegan] = useState(false);
  const [dietaryGlutenFree, setDietaryGlutenFree] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(100);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Cart Panel toggle
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quick categories navigation
  const handleCategoryNavClick = (cat: string) => {
    setSelectedCategory(cat);
  };

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search term match
      if (searchTerm) {
        const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = product.category.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesName && !matchesCat) return false;
      }

      // 2. Main Category select match
      if (selectedCategory !== 'All' && selectedCategory !== 'Todas') {
        const catMap: Record<string, string> = {
          'Vegetables': 'vegetais',
          'Vegetais': 'vegetais',
          'Fruits': 'frutas',
          'Frutas': 'frutas',
          'Grains': 'graos',
          'Grãos': 'graos',
          'Vegan Pantry': 'despensa',
          'Despensa Vegana': 'despensa'
        };
        const target = catMap[selectedCategory] || selectedCategory.toLowerCase();
        if (product.category !== target) return false;
      }

      // 3. Price dropdown filter match
      if (selectedPriceRange !== 'All' && selectedPriceRange !== 'Faixa de Preço' && selectedPriceRange !== 'Price Range') {
        const price = product.price;
        if (selectedPriceRange.includes('0 - 20') || selectedPriceRange.includes('0 - R$20')) {
          if (price > 20) return false;
        } else if (selectedPriceRange.includes('20 - 50') || selectedPriceRange.includes('20 - R$50')) {
          if (price <= 20 || price > 50) return false;
        } else if (selectedPriceRange.includes('50+')) {
          if (price <= 50) return false;
        }
      }

      // 4. Dietary checkboxes (logical AND)
      if (dietaryOrganic && !product.isOrganic) return false;
      if (dietaryVegan && !product.isVegan) return false;
      if (dietaryGlutenFree && !product.isGlutenFree) return false;

      // 5. Price Max slider
      if (product.price > priceMax) return false;

      // 6. Popular Tag match
      if (selectedTag) {
        const tagMap: Record<string, string> = {
          'Fresh Harvest': 'Fresco',
          'Colheita Fresca': 'Fresco',
          'Zero Waste': 'Glúten-Free',
          'Lixo Zero': 'Glúten-Free',
          'Local Farm': 'Orgânico',
          'Fazenda Local': 'Orgânico'
        };
        const targetTag = tagMap[selectedTag] || selectedTag;
        if (product.tag !== targetTag && product.name.toLowerCase().indexOf(targetTag.toLowerCase()) === -1) {
          // let organic/vegan trigger tags
          if (targetTag === 'Orgânico' && !product.isOrganic) return false;
        }
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedPriceRange, dietaryOrganic, dietaryVegan, dietaryGlutenFree, priceMax, selectedTag]);

  // Cart total sum
  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <div id="marketplace-screen" className="w-full">
      {/* Header element */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 transition-shadow">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              alt="Logo MOV" 
              className="h-10 w-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj7Z2RMtad2lLHVJMQabuBek2tocjhb7TeDB5XNh8b82BMqI33UZnQOBa71q_u4DWr3OT_j3hGz-CFB7cWokOYsVpyjqfSiB0pO768rEji9745tBuQJWxkMzNsrDidSrUANj94fcWNRwgI-s0cBxQ32xCj0udn2aW2HcCL_Eozx15bl-InjoJrXbFCvSbSuqZu79lnIK69T7yuodHNE1VQU9oxpqD44ERhndzXNAxAqO3nuhDiC9DQonpIFIX3rq2eeGn2D5xoxG5Z" 
            />
            <span className="font-display text-2xl text-primary font-bold tracking-tight">MOV</span>
          </div>

          {/* Navigation link tags */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleCategoryNavClick('All')}
              className={`font-sans text-sm pb-1 transition-colors ${selectedCategory === 'All' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => handleCategoryNavClick('Vegetables')}
              className={`font-sans text-sm pb-1 transition-colors ${selectedCategory === 'Vegetables' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Vegetais
            </button>
            <button 
              onClick={() => handleCategoryNavClick('Fruits')}
              className={`font-sans text-sm pb-1 transition-colors ${selectedCategory === 'Fruits' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Frutas
            </button>
            <button 
              onClick={() => handleCategoryNavClick('Grains')}
              className={`font-sans text-sm pb-1 transition-colors ${selectedCategory === 'Grains' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Grãos
            </button>
            <button 
              onClick={() => handleCategoryNavClick('Vegan Pantry')}
              className={`font-sans text-sm pb-1 transition-colors ${selectedCategory === 'Vegan Pantry' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Despensa Vegana
            </button>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              id="header-cart-btn"
              className="relative p-2.5 hover:bg-surface-container-low rounded-full transition-colors flex items-center justify-center text-on-surface-variant focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl select-none">shopping_cart</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Toggle Menu */}
            <div className="flex items-center gap-2 group relative">
              <button className="flex items-center gap-2 p-1.5 hover:bg-surface-container-low rounded-full transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-primary text-2xl select-none">account_circle</span>
                <span className="hidden lg:inline text-sm font-semibold text-primary">{userName}</span>
              </button>
              
              {/* Context menu for demo simulation */}
              <div className="absolute right-0 top-full mt-1 bg-white border border-outline-variant/30 rounded-xl shadow-lg p-2 w-48 hidden group-hover:block z-50 animate-fade-in">
                <button 
                  onClick={onNavigateToProducer}
                  className="w-full flex items-center gap-2 text-left p-2 hover:bg-primary-container/10 text-primary text-xs font-semibold rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm select-none">storefront</span>
                  Portal do Produtor
                </button>
                <div className="h-px bg-outline-variant/20 my-1"></div>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 text-left p-2 hover:bg-error-container/20 text-error text-xs font-semibold rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm select-none">logout</span>
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-16 pb-16">
        
        {/* Hero Section */}
        <section id="hero-banner" className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-[#ffdbd0] text-[#390b00] rounded-full text-[11px] font-label font-bold uppercase tracking-widest">
              Da Fazenda para a Mesa
            </span>
            <h1 className="font-display text-4xl lg:text-5xl text-primary font-bold leading-tight">
              Vida saudável de forma fácil e sustentável.
            </h1>
            <p className="text-base lg:text-lg text-on-surface-variant max-w-lg font-sans">
              Conectando produtores orgânicos rurais ao consumo consciente urbano. Descubra produtos frescos e da estação colhidos com cuidado.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('search-filters-bar');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-primary text-white rounded-lg font-sans font-bold shadow-md transition-all hover:bg-primary-container hover:text-on-primary-container squishy"
              >
                Comprar Agora
              </button>
              <button 
                onClick={onNavigateToProducer}
                className="px-8 py-3 border-2 border-secondary text-secondary rounded-lg font-sans font-bold transition-all hover:bg-secondary-fixed/20 squishy"
              >
                Ver Vendedores
              </button>
            </div>
          </div>

          <div className="relative h-[300px] md:h-[420px] rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3_-WFgND9UDKqOz8fwL7RjB88Xn5m897ilrxKa2MKZXMrcI-bJeQgEqJeQEQmGsRO82SIRlo2j5NIYrzhhzTEzpgRWaW46AJRubG0ZM7zEpGXaDtNQ3jTo9-zSlf2ZhSPPVs4nvZ_obcJDzwHyupYymsSR1Ami9l4oUF1Z3Xzda9khkMA6zmv-RX6bMjZAG-K_xrsqs0UsHDN8TxvXpL5GcD8BHM_a6i-jSi6zOjZBIt3meEj9bJBxEGQr3wBZ1C1tlDDcPE7hoMO')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
          </div>
        </section>

        {/* Search & Filters Bar */}
        <section id="search-filters-bar" className="mb-12 scroll-mt-24">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-outline-variant/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Search input */}
              <div className="lg:col-span-5 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline select-none">search</span>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos orgânicos..." 
                  className="w-full pl-12 pr-4 py-3 bg-[#fcf9f8] border border-outline-variant rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-sans text-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm select-none">close</span>
                  </button>
                )}
              </div>

              {/* Category selector dropdown */}
              <div className="lg:col-span-5 flex flex-wrap items-center gap-3">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#fcf9f8] border border-outline-variant rounded-xl text-xs font-sans text-on-surface-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="All">Categoria: Todas</option>
                  <option value="Vegetables">Vegetais</option>
                  <option value="Fruits">Frutas</option>
                  <option value="Grains">Grãos</option>
                  <option value="Vegan Pantry">Despensa Vegana</option>
                </select>

                <select 
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#fcf9f8] border border-outline-variant rounded-xl text-xs font-sans text-on-surface-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="All">Faixa de Preço</option>
                  <option value="0 - 20">Até R$ 20,00</option>
                  <option value="20 - 50">R$ 20,00 a R$ 50,00</option>
                </select>

                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#fcf9f8] border border-outline-variant rounded-xl text-xs font-sans text-on-surface-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="All">Região: Todas</option>
                  <option value="SP">São Paulo</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RJ">Rio de Janeiro</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <button 
                  onClick={() => {
                    // reset filters
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedPriceRange('All');
                    setSelectedRegion('All');
                    setDietaryOrganic(false);
                    setDietaryVegan(false);
                    setDietaryGlutenFree(false);
                    setPriceMax(100);
                    setSelectedTag('');
                  }}
                  className="w-full bg-primary-container/15 hover:bg-primary-container/25 text-primary py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 squishy"
                >
                  <span className="material-symbols-outlined text-sm select-none">filter_list_off</span>
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section: Sidebar + Product Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-60 flex-shrink-0 space-y-8">
            {/* Dietary Checkbox Section */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-outline-variant/25 shadow-sm">
              <h3 className="font-display text-lg text-primary font-bold">Filtros</h3>
              
              <div className="space-y-3">
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">Dieta</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={dietaryOrganic}
                      onChange={(e) => setDietaryOrganic(e.target.checked)}
                      className="rounded text-primary focus:ring-primary border-outline-variant h-5 w-5 cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors select-none">Orgânico</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={dietaryVegan}
                      onChange={(e) => setDietaryVegan(e.target.checked)}
                      className="rounded text-primary focus:ring-primary border-outline-variant h-5 w-5 cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors select-none">Vegano</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={dietaryGlutenFree}
                      onChange={(e) => setDietaryGlutenFree(e.target.checked)}
                      className="rounded text-primary focus:ring-primary border-outline-variant h-5 w-5 cursor-pointer accent-primary"
                    />
                    <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors select-none">Sem Glúten</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Price slider */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-outline-variant/25 shadow-sm">
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">Preço Máximo</p>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs font-label text-on-surface-variant font-medium">
                <span>R$ 0</span>
                <span className="text-primary font-bold">R$ {priceMax.toFixed(2)}</span>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-outline-variant/25 shadow-sm">
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold block">Tags Populares</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: 'Colheita Fresca', label: 'Colheita Fresca' },
                  { tag: 'Lixo Zero', label: 'Lixo Zero' },
                  { tag: 'Fazenda Local', label: 'Fazenda Local' }
                ].map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => setSelectedTag(selectedTag === item.tag ? '' : item.tag)}
                    className={`px-3 py-1 rounded-full text-[11px] font-label font-bold tracking-wider cursor-pointer transition-all ${
                      selectedTag === item.tag 
                        ? 'bg-secondary text-white' 
                        : 'bg-[#ffdbd0]/40 text-[#7a2f15] hover:bg-[#ffdbd0]/75'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-on-surface">Novidades Frescas</h2>
                <p className="text-sm text-on-surface-variant">Mostrando {filteredProducts.length} produtos em Orgânicos & Veganos</p>
              </div>
              <div className="flex items-center gap-2 self-end">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-wide">Visualização:</span>
                <button className="p-2 border border-outline-variant/50 rounded-lg bg-white hover:bg-surface-container transition-colors text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm select-none">grid_view</span>
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-outline-variant/50 rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-outline select-none mb-2">search_off</span>
                <p className="text-base text-on-surface-variant font-medium">Nenhum produto atende aos filtros aplicados.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedPriceRange('All');
                    setDietaryOrganic(false);
                    setDietaryVegan(false);
                    setDietaryGlutenFree(false);
                    setPriceMax(100);
                    setSelectedTag('');
                  }}
                  className="mt-4 px-6 py-2 bg-primary text-white text-sm font-semibold rounded-full squishy"
                >
                  Resetar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const productInCart = cart.find(item => item.product.id === product.id);
                  const isLowStock = product.quantity <= 8;

                  return (
                    <div 
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="h-48 relative overflow-hidden bg-surface-container">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Organic / Vegan Label */}
                        {product.tag && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[10px] font-label font-bold uppercase tracking-wider rounded-full select-none shadow-sm">
                            {product.tag}
                          </span>
                        )}
                        {isLowStock && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-error text-white text-[9px] font-label font-bold uppercase rounded select-none shadow-sm animate-pulse">
                            Baixo Estoque ({product.quantity})
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h3 className="font-display text-sm font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <span className="text-primary font-display font-bold text-base flex-shrink-0">
                              R$ {product.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant font-sans mt-1">
                            {product.unit}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {/* Rating and reviews */}
                          <div className="flex items-center gap-1.5 py-0.5">
                            <span className="material-symbols-outlined text-secondary text-base select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-[11px] font-label font-bold text-on-surface select-none">
                              {product.rating.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-on-surface-variant font-sans">
                              ({product.reviewsCount} avaliações)
                            </span>
                          </div>

                          {/* Dynamic Add / Quantity select button */}
                          {productInCart ? (
                            <div className="flex items-center justify-between border-2 border-primary rounded-lg overflow-hidden h-10 bg-[#fcf9f8]">
                              <button 
                                onClick={() => onUpdateCartQuantity(product.id, productInCart.quantity - 1)}
                                className="w-10 h-full flex items-center justify-center hover:bg-primary-container/10 text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm select-none">remove</span>
                              </button>
                              <span className="text-sm font-bold text-primary font-sans">
                                {productInCart.quantity}
                              </span>
                              <button 
                                onClick={() => onUpdateCartQuantity(product.id, productInCart.quantity + 1)}
                                disabled={productInCart.quantity >= product.quantity}
                                className="w-10 h-full flex items-center justify-center hover:bg-primary-container/10 text-primary transition-colors disabled:opacity-30"
                              >
                                <span className="material-symbols-outlined text-sm select-none">add</span>
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => onAddToCart(product)}
                              disabled={product.quantity === 0}
                              className="w-full squishy h-10 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-lg font-sans font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-sm select-none">add_shopping_cart</span>
                              {product.quantity === 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Slide-over Cart Panel Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
          {/* Backdrop blur */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Cart Header */}
              <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-primary text-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl select-none">shopping_cart</span>
                  <h3 className="font-display text-lg font-bold">Seu Carrinho</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white"
                >
                  <span className="material-symbols-outlined text-xl select-none">close</span>
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-on-surface-variant flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl select-none mb-3 opacity-40">shopping_cart_off</span>
                    <p className="font-sans font-medium text-sm">Seu carrinho está vazio.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2 border border-primary text-primary text-xs font-semibold rounded-full"
                    >
                      Voltar às compras
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="flex items-center gap-4 p-3 bg-[#fcf9f8] rounded-xl border border-outline-variant/20 animate-fade-in"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h4 className="font-display text-xs font-bold text-on-surface truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                          R$ {item.product.price.toFixed(2)} / {item.product.unit.split(' ')[0]}
                        </p>
                        
                        {/* Quantity managers */}
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs select-none">remove</span>
                          </button>
                          <span className="text-xs font-bold text-on-surface font-sans">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.quantity}
                            className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors disabled:opacity-30"
                          >
                            <span className="material-symbols-outlined text-xs select-none">add</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 flex flex-col justify-between items-end h-full">
                        <button 
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="text-on-surface-variant hover:text-error transition-colors p-1"
                          title="Remover"
                        >
                          <span className="material-symbols-outlined text-base select-none">delete</span>
                        </button>
                        <span className="text-xs font-display font-bold text-primary mt-4">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-outline-variant/30 bg-[#fcf9f8] space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-sans">Subtotal</span>
                    <span className="font-display font-bold text-primary text-base">
                      R$ {cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>Taxa de Entrega</span>
                    <span className="text-primary font-bold">GRÁTIS</span>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigateToCheckout();
                      }}
                      className="w-full bg-primary text-white py-3 rounded-xl font-sans font-bold text-sm shadow-md transition-all hover:bg-primary-container squishy flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm select-none">lock</span>
                      Prosseguir para o Checkout
                    </button>
                    <p className="text-[10px] text-center text-on-surface-variant mt-2">
                      Sua compra está em um ambiente totalmente protegido e seguro.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
