import type { PresetData } from "$lib/shared/types";

type SimplePreset = { id: string; updatedAt: number; name: string };

const STORAGE_KEY = {
  Presets: "presets:1",
};

figma.showUI(__html__, { width: 300, height: 360 });

let listAllFontsPromise: ReturnType<typeof listAllFonts>;
let loadStoragePromise: ReturnType<typeof loadStorage>;
let presets: SimplePreset[] = [];

setTimeout(() => {
  loadStoragePromise = loadStorage().then((x) => {
    if (x) {
      presets = x;

      // const list = [];
      // for (let i = 0; i < 15; i++) {
      //   list.push(x[0]);
      // }
      // presets = list;
    }
  });
}, 1);

setTimeout(() => {
  listAllFontsPromise = listAllFonts();
}, 16);

const messageHandler = {
  "main:save-preset:req": async <P extends SimplePreset>(msg: {
    type: string;
    payload: { preset: P };
  }) => {
    await loadStoragePromise;
    const preset = msg.payload.preset;

    const nextPresets: SimplePreset[] = [preset];
    for (const p of presets) {
      if (p.id !== preset.id) {
        nextPresets.push(p);
      }
    }
    presets = nextPresets;
    savePresets(presets);
    figma.ui.postMessage({ type: "ui:sync:res", payload: { presets } });
  },

  "main:init:req": async (msg: { type: string; payload: any }) => {
    const [font] = await Promise.all([listAllFontsPromise, loadStoragePromise]);
    // note `presets` is a module global variable
    // it will be reassigned in loadStoragePromise
    figma.ui.postMessage({ type: "ui:init:res", payload: { font, presets } });
  },

  "main:remove-preset:req": async (msg: { type: string; payload: { id: string } }) => {
    const idToRemove = msg.payload.id;
    presets = removeItem(presets, (p) => p.id === idToRemove);
    savePresets(presets);
    figma.ui.postMessage({ type: "ui:sync:res", payload: { presets } });
  },

  "main:apply-preset:req": async (msg: { type: string; payload: { preset: PresetData } }) => {
    assert(msg.payload.preset, "preset should be in the the msg.payload");
    const preset = msg.payload.preset;
    await Promise.all([
      figma.loadFontAsync(preset.cjkFontName),
      figma.loadFontAsync(preset.latinFontName),
    ]);

    for (const node of figma.currentPage.selection) {
      traverse(node, 0, (node) => {
        if (node.type === "TEXT") {
          applyFont(node, preset);
          figma.notify("done", { timeout: 1000 });
        }
      });
    }
  },
};

figma.ui.onmessage = async (msg) => {
  const handler = messageHandler[msg.type];
  if (handler) {
    return handler(msg);
  } else {
    figma.notify(`Message ${msg.type} not handled`);
  }

  // figma.closePlugin();
};

function traverse(node: BaseNode, depth: number, callback?: (node: BaseNode) => unknown) {
  callback && callback(node);

  if ("children" in node) {
    if (node.type !== "INSTANCE") {
      for (const child of node.children) {
        traverse(child, depth + 1, callback);
      }
    }
  }
}

async function loadFontsOfTextNode(node: TextNode) {
  if (node.fontName !== figma.mixed) {
    await figma.loadFontAsync(node.fontName);
  }
  // @ts-expect-error getRangeAllFontNames actually exists but not in typing
  // see also https://github.com/figma/plugin-typings/issues/56
  // should remove this directive after above issue is fixed
  const fonts = node.getRangeAllFontNames(0, node.characters.length);
  for (const font of fonts) {
    await figma.loadFontAsync(font);
  }
}

async function listAllFonts() {
  const availableFonts = await figma.listAvailableFontsAsync();

  const families: string[] = [];
  const familyStylesLookup: Record<string, string[]> = {};

  for (const font of availableFonts) {
    const f = font.fontName.family;
    const s = font.fontName.style;
    let styles = familyStylesLookup[f];
    if (styles) {
      styles.push(s);
    } else {
      familyStylesLookup[f] = [s];
      families.push(f);
    }
  }
  return { families, familyStylesLookup };
}

function applyFont(
  node: TextNode,
  opts: { cjkFontName: FontName; latinFontName: FontName; spacing: boolean }
) {
  let chars = node.characters;

  node.fontName = opts.cjkFontName;

  if (opts.spacing) {
    const str = spacing(chars);
    chars = str;
    node.characters = str;
  }

  const ranges = findLatinChars(node.characters);
  for (const r of ranges) {
    console.log(chars.slice(r[0], r[1]));
    node.setRangeFontName(r[0], r[1], opts.latinFontName);
  }
}

function spacing(chars: string) {
  let str = "";
  let c: string;
  let prevCharType = "";
  for (c of chars) {
    const cp = c.codePointAt(0);
    const t = isLatinChar(cp) ? "latin" : isCjkChar(cp) ? "cjk" : "";
    if ((prevCharType === "cjk" && t === "latin") || (prevCharType === "latin" && t === "cjk")) {
      str += " ";
    }
    str += c;
    prevCharType = t;
  }
  return str;
}

function findLatinChars(chars: string) {
  const len = chars.length;
  let start = -1;
  const ranges = [];
  for (let i = 0; i < len; i++) {
    if (isLatinChar(chars.charCodeAt(i), true)) {
      if (start < 0) {
        start = i;
      }
    } else if (start >= 0) {
      ranges.push([start, i]);
      start = -1;
    }
  }

  if (start >= 0) {
    ranges.push([start, len]);
  }
  return ranges;
}

function isCjkChar(cp: number) {
  if (cp < 0x3400) return false;
  if (cp > 0x4dbf && cp < 0x4e00) return false;
  if (cp > 0x9fef && cp < 0x20000) return false;
  if (cp > 0x2ebff) return false;
  return true;
}

function isLatinChar(cp: number, considerControlCode = false) {
  // exclude control code   [0,31]
  // and
  // space                  [32]
  if (cp <= 32) return considerControlCode;

  // latin extened-f 0x10780-0x107bf
  // latin extened-g 0x1df00-0x1dfff
  // are not considered here
  return (
    cp <= 0x02ff ||
    (cp >= 0x1d00 && cp <= 0x1dbf) ||
    (cp >= 0x1e00 && cp <= 0x1eff) ||
    (cp >= 0x2070 && cp <= 0x209f) ||
    (cp >= 0x2100 && cp <= 0x214f) ||
    (cp >= 0x2150 && cp <= 0x218f) ||
    (cp >= 0x2c60 && cp <= 0x2c7f) ||
    (cp >= 0xa720 && cp <= 0xa7ff) ||
    (cp >= 0xab30 && cp <= 0xab6f) ||
    (cp >= 0xfb00 && cp <= 0xfb4f) ||
    (cp >= 0xff00 && cp <= 0xffef)
  );
}

async function loadStorage() {
  return await figma.clientStorage.getAsync(STORAGE_KEY.Presets);
}

async function savePresets(p: SimplePreset[]) {
  return await figma.clientStorage.setAsync(STORAGE_KEY.Presets, p);
}

function removeItem<T>(items: T[], predicate: (item: T) => boolean) {
  const nextItems: T[] = [];
  for (const item of items) {
    if (!predicate(item)) {
      nextItems.push(item);
    }
  }
  return nextItems;
}

function assert(condition: any, message: string) {
  if (!condition) {
    console.log(message);
    throw new Error(message);
  }
}
