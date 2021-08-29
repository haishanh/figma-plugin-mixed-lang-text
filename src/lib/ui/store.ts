// import type { NormalizedFontFamily } from "$lib/shared/types";
import type { PresetData, Router } from "$lib/ui/types";

import { writable } from "svelte/store";

export const font = writable<{
  families: string[];
  familyStylesLookup: Record<string, string[]>;
}>(null);
export const presets = writable<PresetData[]>([]);
export const presetEditing = writable<PresetData>({
  id: "",
  updatedAt: 0,
  name: "",
  cjkFontName: { family: "", style: "" },
  latinFontName: { family: "", style: "" },
  spacing: true,
});
export const hasInit = writable<boolean>(false);
export const router = writable<Router>({ forward() {}, back() {} });

export const formPresetName = writable("");
export const formSpacing = writable(true);
export const formCjkFontFamily = writable("");
export const formCjkFontStyle = writable("");
export const formLatinFontFamily = writable("");
export const formLatinFontStyle = writable("");
export const presetEditingIdx = writable(-1);

// export const formCjkFontFamilyIdx = writable(-1);
// export const formCjkFontStyleIdx = writable(-1);
// export const formLatinFontFamilyIdx = writable(-1);
// export const formLatinFontStyleIdx = writable(-1);
