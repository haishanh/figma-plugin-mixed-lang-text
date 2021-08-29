<script lang="ts">
  import { onMount } from "svelte";
  import "$lib/components/figma/base.scss";

  import PresetEdit from "$lib/components/PresetEdit.svelte";
  import PresetList from "$lib/components/PresetList.svelte";

  import { router, font, presets, hasInit, presetEditingIdx } from "$lib/ui/store";
  import type { PresetData } from "$lib/ui/types";

  window.onmessage = (event: MessageEvent<{ pluginMessage: { type: string; payload: any } }>) => {
    const { type, payload } = event.data.pluginMessage;
    if (type === "ui:init:res") {
      font.set(payload.font);
      presets.set(payload.presets);
      hasInit.set(true);
    } else if (type === "ui:sync:res") {
      presets.set(payload.presets);
    }
  };

  function screen(node: HTMLDivElement) {
    router.set({
      forward() {
        node.style.transform = "translateX(-100vw)";
      },
      back() {
        node.style.transform = "translateX(0)";
      },
    });

    return {
      destroy() {
        router.set({ back: () => {}, forward: () => {} });
      },
    };
  }

  function savePreset(preset: PresetData) {
    parent.postMessage(
      { pluginMessage: { type: "main:save-preset:req", payload: { preset } } },
      "*"
    );
  }

  function onClickAddPreset() {
    $presetEditingIdx = -1;
    $router.forward();
  }

  onMount(() => {
    parent.postMessage({ pluginMessage: { type: "main:init:req" } }, "*");
  });
</script>

<div class="container">
  <div class="screen" use:screen>
    <div class="screen-item">
      <PresetList {onClickAddPreset} />
    </div>
    <div class="screen-item">
      <PresetEdit save={savePreset} />
    </div>
  </div>
</div>

<style>
  :root {
    --font-sans: "Inter", sans-serif;
    font-family: var(--font-sans);
  }
  .container {
    position: relative;
    height: 360px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .screen {
    transition: all 0.2s ease-out;
  }
  .screen-item {
    position: absolute;
    left: 0;
    width: 100%;
  }
  .screen-item:nth-child(2) {
    left: 100%;
  }
</style>
