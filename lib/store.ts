// lib/store.ts
import { create } from 'zustand'
import { Nursery } from '@/types'

interface SearchState {
  postcode: string
  dob: string
  results: Nursery[]
  hasSearched: boolean
  setPostcode: (v: string) => void
  setDob: (v: string) => void
  setResults: (r: Nursery[]) => void
  setHasSearched: (v: boolean) => void
  reset: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  postcode: '',
  dob: '',
  results: [],
  hasSearched: false,
  setPostcode: (postcode) => set({ postcode }),
  setDob: (dob) => set({ dob }),
  setResults: (results) => set({ results }),
  setHasSearched: (hasSearched) => set({ hasSearched }),
  reset: () => set({ postcode: '', dob: '', results: [], hasSearched: false }),
}))

interface AdminState {
  nurseries: Nursery[]
  setNurseries: (n: Nursery[]) => void
  updateNursery: (id: string, updates: Partial<Nursery>) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  nurseries: [],
  setNurseries: (nurseries) => set({ nurseries }),
  updateNursery: (id, updates) =>
    set((state) => ({
      nurseries: state.nurseries.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),
}))
