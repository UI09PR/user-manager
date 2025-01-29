import { defineStore } from "pinia";

export type CurrentPageType = "main" | "users" | "edit" | "error" | "modal";

export const useKeyboardStore = defineStore("keyboard", {
  state: () => ({
    current: "main" as CurrentPageType,
    currentIndexY: 1,
    currentIndexYMax: 1,

    currentIndexX: 1,
    currentIndexXMax: 2,

    currentFunction: null as (() => void) | null,
    currentFunctionEsc: null as (() => void) | null,

    focusTarget: false,
  }),
  actions: {
    setFunction(fn: () => void) {
      this.currentFunction = fn;
    },
    setFunctionEsc(fn: () => void) {
      this.currentFunctionEsc = fn;
    },
    setCurrent(newCurrent: CurrentPageType) {
      this.current = newCurrent;
    },
    handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Enter":
          this.handleEnter();
          break;
        case "ArrowRight":
          this.handleRight();
          break;
        case "ArrowLeft":
          this.handleLeft();
          break;
        case "ArrowUp":
          this.handleUp();
          break;
        case "ArrowDown":
          this.handleDown();
          break;
        case "Escape":
          this.handleEsc();
          break;
        default:
          break;
      }
    },
    handleEnter() {
      if (this.currentFunction && !this.focusTarget) {
        if (this.current === "main") {
          this.currentFunction();
        } else {
          this.currentFunction();
        }
      }
    },

    handleRight() {
      this.currentIndexX = Math.min(this.currentIndexX + 1, this.currentIndexXMax);
    },

    handleLeft() {
      if (this.currentIndexX - 1 < 2) this.currentIndexX = 2;
      this.currentIndexX = this.currentIndexX - 1;
    },

    handleUp() {
      if (this.currentIndexY - 1 < 2) this.currentIndexY = 2;
      this.currentIndexY = this.currentIndexY - 1;
    },

    handleDown() {
      this.currentIndexY = Math.min(this.currentIndexY + 1, this.currentIndexYMax);
    },

    handleEsc() {
      if (this.currentFunctionEsc) {
        if (this.current !== "main") {
          this.currentFunctionEsc();
        }
      }
    },
  },
});
