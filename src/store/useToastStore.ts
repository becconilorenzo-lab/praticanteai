import { create } from 'zustand';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type: 'success' | 'error') => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type) => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
