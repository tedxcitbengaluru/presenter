import { User } from "@prisma/client";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
  session: Session | null;
  dbUser: User | null;
  setSignIn: (newSession: Session, dbUser: User) => void;
  setSignOut: () => void;
};
export const SessionStore = create<SessionStore>()((set) => ({
  session: null,
  dbUser: null,
  setSignIn: (newSession, dbUser) =>
    set((state) => ({ ...state, session: newSession, dbUser })),
  setSignOut: () => set(() => ({ session: null, dbUser: null })),
}));
