import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CabinetSelection {
  height: string;
  widthQuantities: Record<string, number>;
}

export interface ProjectState {
  jobName: string;
  doorStyle: string;
  finish: string;

  // Cabinet selections
  wallCabinets: CabinetSelection[];
  tallCabinets: CabinetSelection[];
  baseCabinets: CabinetSelection[];
  drawers: CabinetSelection[];
  plainPanels: CabinetSelection[];
  appliedPanels: CabinetSelection[];

  // Pricing
  subtotal: number;
  discountCode: string;
  discountAmount: number;
  referralCode: string;
  referralDiscount: number;
  grandTotal: number;

  // Customer information
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Signatures and approval
  customerSignature: string;
  salesRepSignature: string;
  salesRepName: string;
  agreementSigned: boolean;

  // Navigation
  currentStep: number;
  completedSteps: number[];
}

interface AppActions {
  // Project setup
  setJobName: (name: string) => void;
  setDoorStyle: (style: string) => void;
  setFinish: (finish: string) => void;

  // Cabinet selections
  updateWallCabinets: (selections: CabinetSelection[]) => void;
  updateTallCabinets: (selections: CabinetSelection[]) => void;
  updateBaseCabinets: (selections: CabinetSelection[]) => void;
  updateDrawers: (selections: CabinetSelection[]) => void;
  updatePlainPanels: (selections: CabinetSelection[]) => void;
  updateAppliedPanels: (selections: CabinetSelection[]) => void;

  // Pricing
  applyDiscountCode: (code: string) => void;
  applyReferralCode: (code: string) => void;
  calculateTotal: () => void;

  // Customer information
  updateCustomerInfo: (info: Partial<ProjectState['customer']>) => void;

  // Signatures
  setCustomerSignature: (signature: string) => void;
  setSalesRepSignature: (signature: string, name: string) => void;

  // Navigation
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;

  // Reset
  resetProject: () => void;
}

const initialState: ProjectState = {
  jobName: '',
  doorStyle: '',
  finish: '',

  wallCabinets: [],
  tallCabinets: [],
  baseCabinets: [],
  drawers: [],
  plainPanels: [],
  appliedPanels: [],

  subtotal: 0,
  discountCode: '',
  discountAmount: 0,
  referralCode: '',
  referralDiscount: 0,
  grandTotal: 0,

  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },

  customerSignature: '',
  salesRepSignature: '',
  salesRepName: '',
  agreementSigned: false,

  currentStep: 0,
  completedSteps: [],
};

export const useAppStore = create<ProjectState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Project setup actions
      setJobName: (name) => set({ jobName: name }),
      setDoorStyle: (style) => set({ doorStyle: style }),
      setFinish: (finish) => set({ finish: finish }),

      // Cabinet selection actions
      updateWallCabinets: (selections) => set({ wallCabinets: selections }),
      updateTallCabinets: (selections) => set({ tallCabinets: selections }),
      updateBaseCabinets: (selections) => set({ baseCabinets: selections }),
      updateDrawers: (selections) => set({ drawers: selections }),
      updatePlainPanels: (selections) => set({ plainPanels: selections }),
      updateAppliedPanels: (selections) => set({ appliedPanels: selections }),

      // Pricing actions
      applyDiscountCode: (code) => {
        // Mock discount validation - would integrate with backend
        const discountAmount = code === 'SAVE10' ? 0.10 : 0;
        set({ discountCode: code, discountAmount });
        get().calculateTotal();
      },

      applyReferralCode: (code) => {
        // Mock referral validation - would integrate with backend
        const referralDiscount = code === 'REF2024' ? 0.05 : 0;
        set({ referralCode: code, referralDiscount });
        get().calculateTotal();
      },

      calculateTotal: () => {
        const state = get();
        // Mock pricing calculation - would use real pricing engine
        let subtotal = 0;

        // Calculate based on selections (mock pricing)
        subtotal += state.wallCabinets.length * 150;
        subtotal += state.tallCabinets.length * 200;
        subtotal += state.baseCabinets.length * 175;
        subtotal += state.drawers.length * 100;
        subtotal += state.plainPanels.length * 80;
        subtotal += state.appliedPanels.length * 120;

        const discountedAmount = subtotal * (1 - state.discountAmount - state.referralDiscount);

        set({
          subtotal,
          grandTotal: Math.max(0, discountedAmount)
        });
      },

      // Customer information actions
      updateCustomerInfo: (info) => set((state) => ({
        customer: { ...state.customer, ...info }
      })),

      // Signature actions
      setCustomerSignature: (signature) => set({ customerSignature: signature }),
      setSalesRepSignature: (signature, name) => set({
        salesRepSignature: signature,
        salesRepName: name
      }),

      // Navigation actions
      setCurrentStep: (step) => set({ currentStep: step }),
      markStepCompleted: (step) => set((state) => ({
        completedSteps: [...new Set([...state.completedSteps, step])]
      })),

      // Reset action
      resetProject: () => set(initialState),
    }),
    {
      name: 'cabinet-refacing-storage',
      version: 1,
    }
  )
);
