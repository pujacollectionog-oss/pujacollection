'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MeasurementProfile {
  id: string;
  name: string;
  unit: 'IN' | 'CM';
  bust: string;
  waist: string;
  hip?: string;
  shoulder: string;
  frontNeckDepth: string;
  backNeckDepth: string;
  blouseLength: string;
  sleeveLength: string;
  armhole: string;
  bicep: string;
  lehengaLength?: string;
  notes?: string;
  isDefault: boolean;
  updatedAt: string;
}

const INITIAL_PROFILES: MeasurementProfile[] = [
  {
    id: 'prof-bridal-01',
    name: 'My Bridal Fit (Aayusha)',
    unit: 'IN',
    bust: '34',
    waist: '28',
    hip: '38',
    shoulder: '14.5',
    frontNeckDepth: '7',
    backNeckDepth: '9.5',
    blouseLength: '14',
    sleeveLength: '11',
    armhole: '16',
    bicep: '11.5',
    lehengaLength: '42',
    notes: 'Please leave 2 inches of inner margin for future alteration.',
    isDefault: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prof-festive-02',
    name: 'Festive Saree Blouse (Comfort Fit)',
    unit: 'IN',
    bust: '35',
    waist: '29',
    hip: '39',
    shoulder: '15',
    frontNeckDepth: '6.5',
    backNeckDepth: '8',
    blouseLength: '14.5',
    sleeveLength: '16',
    armhole: '16.5',
    bicep: '12',
    notes: 'Slightly relaxed armhole for long festival days.',
    isDefault: false,
    updatedAt: new Date().toISOString(),
  },
];

interface MeasurementStore {
  profiles: MeasurementProfile[];
  activeProfileId: string | null;
  addProfile: (profile: Omit<MeasurementProfile, 'id' | 'updatedAt'>) => void;
  updateProfile: (id: string, updates: Partial<MeasurementProfile>) => void;
  deleteProfile: (id: string) => void;
  setDefaultProfile: (id: string) => void;
  setActiveProfileId: (id: string | null) => void;
  getDefaultProfile: () => MeasurementProfile | undefined;
}

export const useMeasurementStore = create<MeasurementStore>()(
  persist(
    (set, get) => ({
      profiles: INITIAL_PROFILES,
      activeProfileId: 'prof-bridal-01',

      addProfile: (profileData) => {
        const id = `prof-${Date.now()}`;
        const newProfile: MeasurementProfile = {
          ...profileData,
          id,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          profiles: profileData.isDefault
            ? [...state.profiles.map((p) => ({ ...p, isDefault: false })), newProfile]
            : [...state.profiles, newProfile],
          activeProfileId: id,
        }));
      },

      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) => {
            if (p.id !== id) {
              return updates.isDefault ? { ...p, isDefault: false } : p;
            }
            return {
              ...p,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteProfile: (id) => {
        set((state) => {
          const remaining = state.profiles.filter((p) => p.id !== id);
          return {
            profiles: remaining,
            activeProfileId:
              state.activeProfileId === id
                ? remaining[0]?.id || null
                : state.activeProfileId,
          };
        });
      },

      setDefaultProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.map((p) => ({
            ...p,
            isDefault: p.id === id,
          })),
        }));
      },

      setActiveProfileId: (id) => set({ activeProfileId: id }),

      getDefaultProfile: () => {
        const state = get();
        return state.profiles.find((p) => p.isDefault) || state.profiles[0];
      },
    }),
    { name: 'puja-measurement-vault' }
  )
);
