import { create } from "zustand";
import { modules as initialModules } from "./mock-data";
import type { Module } from "./mock-data";

export interface ModuleStore {
  modules: Module[];
  toggleModule: (id: string) => void;
  getEnabledModules: () => Module[];
  setModules: (modules: Module[]) => void;
}

export const useModuleStore = create<ModuleStore>((set, get) => ({
  modules: [...initialModules],

  toggleModule: (id: string) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      ),
    }));
  },

  getEnabledModules: () => {
    return get().modules.filter((m) => m.enabled);
  },

  setModules: (modules: Module[]) => {
    set({ modules });
  },
}));
