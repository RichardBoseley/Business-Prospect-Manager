"use client";

/**
 * Global client-side store. Holds everything the prototype kept in component
 * state — CRM session state, search criteria, selections, approvals and
 * workspace settings — initialised from the seed repository so persistence can
 * replace it behind the same shapes.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  seedApprovedIds,
  seedBusinesses,
  seedDetailedNotes,
  seedDncEntries,
  seedIndustries,
  seedBusinessTypes,
  seedPromotions,
  seedSelectedAreas,
  seedSelectedIds,
  seedSuggestedAudiences,
  seedSuggestedSellingPoints,
  seedWorkspace,
} from "./data/seed";
import { draftingService } from "./services/drafting";
import type {
  Business,
  Contact,
  DNCEntry,
  EmailDraft,
  Note,
  Promotion,
  Reminder,
  SizeBand,
  Stage,
  Venue,
} from "./types";

export interface SellingPointChip {
  label: string;
  on: boolean;
  ai: boolean;
}

export interface AudienceChip {
  label: string;
  hint: string;
  on: boolean;
}

export interface AppState {
  promotions: Promotion[];
  currentPromoId: string;

  // Lead drawer + per-lead CRM session state
  drawerId: string | null;
  drawerTab: "timeline" | "docs";
  noteMode: "quick" | "detailed";
  noteDraft: string;
  noteHead: string;
  noteBody: string;
  expandedNotes: Record<string, boolean>;
  stageOverrides: Record<string, Stage>;
  quickNotes: Record<string, string[]>;
  detailedNotes: Record<string, Note[]>;
  reminders: Record<string, Reminder>;
  remOpen: boolean;
  remDate: string;
  remTime: string;
  dncConfirm: boolean;
  dncAdded: Record<string, boolean>;
  addedContacts: Record<string, Contact[]>;
  primaryOverride: Record<string, string>;
  addContactOpen: boolean;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;

  // Promotion wizard
  wizOpen: boolean;
  wizStep: number;
  wizEditId: string | null;
  wizName: string;
  wizDesc: string;
  wizPointInput: string;
  audInput: string;
  wizPoints: SellingPointChip[];
  wizAud: AudienceChip[];

  // Find businesses criteria
  locMode: "distance" | "areas";
  dist: number;
  venueSel: number | null;
  areas: Record<string, boolean>;
  areaInput: string;
  typeQ: string;
  types: Record<string, boolean>;
  inds: Record<string, boolean>;
  sizes: Record<SizeBand, boolean>;
  sizeMode: "bands" | "range";
  staffMin: number;
  staffMax: number;
  sizeInfo: boolean;
  searching: boolean;

  // Shortlist
  selected: Record<string, boolean>;
  shortSort: "name" | "type" | "size" | "fit";
  shortDir: 1 | -1;
  fType: string;
  fSize: string;
  fContact: string;

  // Campaign copy
  approved: Record<string, boolean>;
  copySel: string | null;
  editing: boolean;
  editSub: string;
  editText: string;
  overrides: Record<string, EmailDraft>;
  regen: Record<string, number>;
  queued: boolean;

  // Pipeline
  stageFilter: Stage | null;
  listFilter: string | null;
  pipeSel: Record<string, Record<string, boolean>>;
  openFilter: string | null;

  // Workspace settings
  venues: Venue[];
  primaryVen: number;
  venName: string;
  venAddr: string;
  dailyLimit: number;
  showRationale: boolean;
}

export const EMPTY_PIPE_SEL: Record<string, Record<string, boolean>> = {
  promo: {},
  ind: {},
  area: {},
  size: {},
  act: {},
};

function initialState(): AppState {
  const selected: Record<string, boolean> = {};
  seedSelectedIds.forEach((id) => (selected[id] = true));
  const approved: Record<string, boolean> = {};
  seedApprovedIds.forEach((id) => (approved[id] = true));
  const areas: Record<string, boolean> = {};
  seedWorkspace.namedAreas.forEach(
    (a) => (areas[a] = seedSelectedAreas.includes(a)),
  );
  return {
    promotions: seedPromotions,
    currentPromoId: "xmas",
    drawerId: null,
    drawerTab: "timeline",
    noteMode: "quick",
    noteDraft: "",
    noteHead: "",
    noteBody: "",
    expandedNotes: {},
    stageOverrides: {},
    quickNotes: {},
    detailedNotes: seedDetailedNotes,
    reminders: {},
    remOpen: false,
    remDate: "",
    remTime: "",
    dncConfirm: false,
    dncAdded: {},
    addedContacts: {},
    primaryOverride: {},
    addContactOpen: false,
    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    wizOpen: false,
    wizStep: 1,
    wizEditId: null,
    wizName: "",
    wizDesc: "",
    wizPointInput: "",
    audInput: "",
    wizPoints: seedSuggestedSellingPoints.map((p) => ({ ...p })),
    wizAud: seedSuggestedAudiences.map((a) => ({ ...a })),
    locMode: "distance",
    dist: 20,
    venueSel: null,
    areas,
    areaInput: "",
    typeQ: "",
    types: { ...seedBusinessTypes },
    inds: { ...seedIndustries },
    sizes: { S: true, M: true, L: true },
    sizeMode: "bands",
    staffMin: 5,
    staffMax: 50,
    sizeInfo: false,
    searching: false,
    selected,
    shortSort: "fit",
    shortDir: -1,
    fType: "All",
    fSize: "All",
    fContact: "All",
    approved,
    copySel: "stepz",
    editing: false,
    editSub: "",
    editText: "",
    overrides: {},
    regen: {},
    queued: false,
    stageFilter: null,
    listFilter: null,
    pipeSel: EMPTY_PIPE_SEL,
    openFilter: null,
    venues: seedWorkspace.venues.map((v) => ({ ...v })),
    primaryVen: 0,
    venName: "",
    venAddr: "",
    dailyLimit: seedWorkspace.dailySendLimit,
    showRationale: seedWorkspace.showRationale,
  };
}

interface AppContextValue {
  state: AppState;
  /** Shallow-merge a partial state, like the prototype's setState. */
  patch: (partial: Partial<AppState>) => void;
  /** Shallow-merge computed from the latest state. */
  update: (fn: (s: AppState) => Partial<AppState>) => void;
  businesses: Business[];
  stageOf: (b: Business) => Stage;
  draftOf: (b: Business) => EmailDraft;
  contactsOf: (b: Business) => Contact[];
  primaryNameOf: (b: Business) => string | undefined;
  openLead: (id: string) => void;
  closeDrawer: () => void;
  dncEntries: DNCEntry[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const update = useCallback(
    (fn: (s: AppState) => Partial<AppState>) =>
      setState((s) => ({ ...s, ...fn(s) })),
    [],
  );
  const patch = useCallback(
    (partial: Partial<AppState>) => update(() => partial),
    [update],
  );

  const value = useMemo<AppContextValue>(() => {
    const stageOf = (b: Business) => state.stageOverrides[b.id] ?? b.stage;
    const contactsOf = (b: Business) => [
      ...b.contacts,
      ...(state.addedContacts[b.id] ?? []),
    ];
    return {
      state,
      patch,
      update,
      businesses: seedBusinesses,
      stageOf,
      draftOf: (b) =>
        state.overrides[b.id] ?? draftingService.draft(b, state.regen[b.id] ?? 0),
      contactsOf,
      primaryNameOf: (b) =>
        state.primaryOverride[b.id] ?? contactsOf(b)[0]?.name,
      openLead: (id) =>
        patch({
          drawerId: id,
          drawerTab: "timeline",
          noteMode: "quick",
          noteDraft: "",
          noteHead: "",
          noteBody: "",
          remOpen: false,
          dncConfirm: false,
          contactName: "",
          contactRole: "",
          contactEmail: "",
          contactPhone: "",
          addContactOpen: false,
        }),
      closeDrawer: () => patch({ drawerId: null }),
      dncEntries: seedDncEntries,
    };
  }, [state, patch, update]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
