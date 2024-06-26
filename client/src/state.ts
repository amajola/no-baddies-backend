import { atomWithStorage } from 'jotai/utils'

export const AuthorizationAtom = atomWithStorage<string | null>("Authorization", null)