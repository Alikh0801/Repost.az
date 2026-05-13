import type { AppMessages } from "./schema";

type SectionKeys = keyof AppMessages;

type LeafKeys<S extends SectionKeys> = keyof AppMessages[S] & string;

/** Mətn açarları — `schema` dəyişəndə avtomatik yenilənir */
export type AppMessagePath = {
  [S in SectionKeys]: `${S & string}.${LeafKeys<S>}`;
}[SectionKeys];
