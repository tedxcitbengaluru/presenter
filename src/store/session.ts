import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
  session: Session | null;
  setSignIn: (newSession: Session) => void;
  setSignOut: () => void;
};
export const SessionStore = create<SessionStore>()((set) => ({
  session: null,
  setSignIn: (newSession) =>
    set((state) => ({ ...state, session: newSession })),
  setSignOut: () => set(() => ({ session: null })),
}));
