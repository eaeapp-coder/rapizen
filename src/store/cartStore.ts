import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'product' | 'combo';
  selectedAroma?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, selectedAroma?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedAroma?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  appliedPromo: { code: string; discount: number; type: 'fixed' | 'percent' } | null;
  setAppliedPromo: (promo: { code: string; discount: number; type: 'fixed' | 'percent' } | null) => void;
  getCartTotal: () => number;
  getDiscountedTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedPromo: null,
      addItem: (newItem) => {
        set((state) => {
          const qtyToAdd = newItem.quantity || 1;
          const existingItem = state.items.find(
            (item) => item.id === newItem.id && item.selectedAroma === newItem.selectedAroma
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && item.selectedAroma === newItem.selectedAroma
                  ? { ...item, quantity: item.quantity + qtyToAdd }
                  : item
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...newItem, quantity: qtyToAdd }], isOpen: true };
        });
      },
      removeItem: (id, selectedAroma?: string) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.selectedAroma === selectedAroma)),
        }));
      },
      updateQuantity: (id, quantity, selectedAroma?: string) => {
        set((state) => ({
          items: quantity > 0 
            ? state.items.map((item) => (item.id === id && item.selectedAroma === selectedAroma) ? { ...item, quantity } : item)
            : state.items.filter((item) => !(item.id === id && item.selectedAroma === selectedAroma))
        }));
      },
      clearCart: () => set({ items: [], appliedPromo: null }),
      setAppliedPromo: (promo) => set({ appliedPromo: promo }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getDiscountedTotal: () => {
        const total = get().getCartTotal();
        const promo = get().appliedPromo;
        if (!promo) return total;
        
        if (promo.type === 'percent') {
          return Math.max(0, total * (1 - promo.discount / 100));
        }
        return Math.max(0, total - promo.discount);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'rapizen-cart',
    }
  )
);
