import { Organization, User } from "@prisma/client";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
  session: Session | null;
  dbUser: User | null;
  orgSlug: string | null;
  setSignIn: (newSession: Session, dbUser: User, orgSlug: string) => void;
  setSignOut: () => void;
};
export const SessionStore = create<SessionStore>()((set) => ({
  session: null,
  dbUser: null,
  orgSlug: null,
  setSignIn: (newSession, dbUser, orgSlug) =>
    set((state) => ({ ...state, session: newSession, dbUser, orgSlug })),
  setSignOut: () => set(() => ({ session: null, dbUser: null, orgSlug: null })),
}));
