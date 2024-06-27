import { atomWithStorage } from "jotai/utils";
import { User } from "../../server/src/routes/auth/schema";

export const AuthorizationAtom = atomWithStorage<string | null>(
  "Authorization",
  null
);
export interface UserState extends User {
  groups: { groupId: number; name: string }[];
}
export const UserAtom = atomWithStorage<UserState | null>("User", null);
