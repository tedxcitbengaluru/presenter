import { Organization, User } from "@prisma/client";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
  setLoadedFalse: () => void;
  setSignIn: (newSession: Session, dbUser: User, orgSlug: string) => void;
  setSignOut: () => void;
} & (SessionStoreLoadedVars | SessionStoreNullVars);

type SessionStoreLoadedVars = {
  isSessionLoaded: true;
  session: Session;
  dbUser: User;
  orgSlug: string;
};

type SessionStoreNullVars = {
  isSessionLoaded: false | null;
  session: null;
  dbUser: null;
  orgSlug: null;
};

export const SessionStore = create<SessionStore>()((set) => ({
  session: null,
  dbUser: null,
  orgSlug: null,
  isSessionLoaded: null,
  setLoadedFalse: () =>
    set(() => ({
      session: null,
      dbUser: null,
      orgSlug: null,
      isSessionLoaded: false,
    })),
  setSignIn: (newSession, dbUser, orgSlug) =>
    set((state) => ({
      ...state,
      session: newSession,
      dbUser,
      orgSlug,
      isSessionLoaded: true,
    })),
  setSignOut: () =>
    set(() => ({
      session: null,
      dbUser: null,
      orgSlug: null,
      isSessionLoaded: null,
    })),
}));
