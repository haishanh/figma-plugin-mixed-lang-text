export function removePreset(id: string) {
  parent.postMessage({ pluginMessage: { type: "main:remove-preset:req", payload: { id } } }, "*");
}
