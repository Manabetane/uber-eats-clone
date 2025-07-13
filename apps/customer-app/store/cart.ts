import {create} from 'zustand';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  restaurant_id: string
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item) => {
    set(state => {
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },
  removeFromCart: (id) => {
    set(state => ({ items: state.items.filter(i => i.id !== id) }));
  },
  clearCart: () => set({ items: [] }),
}));
