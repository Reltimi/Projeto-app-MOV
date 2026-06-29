import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Marketplace from './components/Marketplace';
import Checkout from './components/Checkout';
import ProducerPortal from './components/ProducerPortal';
import MvpDashboard from './components/MvpDashboard';
import AdminPortal from './components/AdminPortal';
import { ActiveScreen, Product, CartItem, UserRole } from './types';
import { INITIAL_PRODUCTS } from './data';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('onboarding');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState<string>('Visitante Consciente');
  const [userRole, setUserRole] = useState<UserRole>('buyer');

  // Handle Cart logic
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.quantity) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.min(qty, item.product.quantity) }
          : item
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Handle Onboarding success
  const handleOnboardingSuccess = (fullName: string, role: UserRole) => {
    setUserName(fullName);
    setUserRole(role);
    if (role === 'seller') {
      setActiveScreen('producer');
    } else {
      setActiveScreen('marketplace');
    }
  };

  // Handle Producer Actions
  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const id = (products.length + 1).toString();
    const productWithMeta: Product = {
      ...newProduct,
      id,
      rating: 4.8,
      reviewsCount: 1
    };
    setProducts(prev => [productWithMeta, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleLogout = () => {
    setUserName('Visitante Consciente');
    setUserRole('buyer');
    setActiveScreen('onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcf9f8] text-[#1b1b1c] font-sans">
      
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none -z-10"></div>
      
      {/* Primary content area */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8 pb-32">
        {activeScreen === 'onboarding' && (
          <Onboarding 
            onSuccess={handleOnboardingSuccess} 
          />
        )}

        {activeScreen === 'marketplace' && (
          <Marketplace 
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onNavigateToCheckout={() => setActiveScreen('checkout')}
            userName={userName}
            onLogout={handleLogout}
            onNavigateToProducer={() => setActiveScreen('producer')}
          />
        )}

        {activeScreen === 'checkout' && (
          <Checkout 
            cart={cart}
            onNavigateToMarketplace={() => setActiveScreen('marketplace')}
            onClearCart={handleClearCart}
          />
        )}

        {activeScreen === 'producer' && (
          <ProducerPortal 
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            onNavigateToMarketplace={() => setActiveScreen('marketplace')}
          />
        )}

        {activeScreen === 'mvp' && (
          <MvpDashboard />
        )}

        {activeScreen === 'admin' && (
          <AdminPortal 
            onBackToOnboarding={() => setActiveScreen('onboarding')}
          />
        )}
      </div>

      {/* Persistent floating dashboard switcher pill (Ensures immediate discovery of all requested screens) */}
      <div 
        id="demo-screen-navigator" 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-outline-variant/50 shadow-2xl rounded-full px-4 py-2 flex items-center gap-1.5 z-50 max-w-[95vw] overflow-x-auto select-none"
      >
        <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant px-2 hidden md:inline-block">
          Telas do MVP:
        </span>

        <button 
          onClick={() => setActiveScreen('onboarding')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-1 focus:outline-none cursor-pointer ${
            activeScreen === 'onboarding' 
              ? 'bg-primary text-white' 
              : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
          }`}
        >
          <span className="material-symbols-outlined text-xs select-none">person_add</span>
          Onboarding
        </button>

        <button 
          onClick={() => setActiveScreen('marketplace')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-1 focus:outline-none cursor-pointer ${
            activeScreen === 'marketplace' 
              ? 'bg-primary text-white' 
              : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
          }`}
        >
          <span className="material-symbols-outlined text-xs select-none">shopping_basket</span>
          Catálogo / Feira
        </button>

        <button 
          onClick={() => setActiveScreen('checkout')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-1 focus:outline-none cursor-pointer ${
            activeScreen === 'checkout' 
              ? 'bg-primary text-white' 
              : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
          }`}
        >
          <span className="material-symbols-outlined text-xs select-none">credit_card</span>
          Pagamento
        </button>

        <button 
          onClick={() => setActiveScreen('producer')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-1 focus:outline-none cursor-pointer ${
            activeScreen === 'producer' 
              ? 'bg-primary text-white' 
              : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
          }`}
        >
          <span className="material-symbols-outlined text-xs select-none">storefront</span>
          Portal Produtor
        </button>

        <div className="w-px h-5 bg-outline-variant/30 mx-1 hidden sm:block"></div>

        <button 
          onClick={() => setActiveScreen('mvp')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-1 focus:outline-none cursor-pointer ${
            activeScreen === 'mvp' 
              ? 'bg-secondary text-white' 
              : 'text-[#99462a] hover:bg-secondary/5'
          }`}
        >
          <span className="material-symbols-outlined text-xs select-none">analytics</span>
          Tabela GxUxT
        </button>

        <div className="w-px h-5 bg-outline-variant/30 mx-1 hidden sm:block"></div>

        <button 
          onClick={() => setActiveScreen('admin')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all flex items-center gap-1 focus:outline-none cursor-pointer ${
            activeScreen === 'admin' 
              ? 'bg-secondary text-white' 
              : 'text-secondary hover:bg-secondary/5'
          }`}
        >
          <span className="material-symbols-outlined text-xs select-none">admin_panel_settings</span>
          Painel Admin
        </button>
      </div>
    </div>
  );
}
