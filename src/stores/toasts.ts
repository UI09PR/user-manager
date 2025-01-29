import { defineStore } from "pinia";

export type ToastType = "info" | "error" | "success";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  fadeOut: boolean;
  time: number;
}

export const useToastsStore = defineStore("toasts", {
  state: () => ({
    toasts: [] as Toast[],
  }),
  actions: {
    addToast(message: string, type: ToastType = "info", time?: number) {
      const id = Date.now() + 1;
      this.toasts.push({ id, message, type, fadeOut: false, time: time || 3000 });
      setTimeout(() => {
        const toast = this.toasts.find((toast) => toast.id === id);
        if (!!toast) {
        toast.fadeOut = true;
          
        }
      }, time ? time - 200 : 2800);

      setTimeout(() => {
        const index = this.toasts.findIndex((toast) => toast.id === id);
        if (index !== -1) {
          this.toasts.splice(index, 1);
        }
      }, time ?? 3000);
    },
    removeToast(index: number) {
      this.toasts.splice(index, 1);
    },
  },
});
