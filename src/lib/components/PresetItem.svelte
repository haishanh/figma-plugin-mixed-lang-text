<script lang="ts">
  import IconButton from "$lib/components/figma/IconButton.svelte";
  import Adjust from "$lib/components/icons/Adjust.svelte";
  import Minus from "$lib/components/icons/Minus.svelte";
  import { presetEditingIdx, router } from "$lib/ui/store";
  import * as action from "$lib/ui/action";
  import type { PresetData } from "$lib/ui/types";

  export let idx: number;
  export let preset: PresetData;

  function onClickAdjust(e: MouseEvent) {
    e.stopPropagation();
    $presetEditingIdx = idx;
    $router.forward();
  }

  function onClickRemove(e: MouseEvent) {
    e.stopPropagation();
    action.removePreset(preset.id);
  }

  function apply() {
    parent.postMessage(
      {
        pluginMessage: {
          type: "main:apply-preset:req",
          payload: { preset },
        },
      },
      "*"
    );
  }
</script>

<div class="container" on:click={apply}>
  <div class="left">
    <div class="name">{preset.name}</div>
    <div class="detail">
      {preset.latinFontName.family}
      {preset.latinFontName.style} / {preset.cjkFontName.family}
      {preset.cjkFontName.style}
    </div>
  </div>
  <div class="right">
    <IconButton on:click={onClickAdjust}>
      <Adjust />
    </IconButton>
    <IconButton on:click={onClickRemove}>
      <Minus />
    </IconButton>
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    cursor: pointer;
    &:hover {
      background: var(--hover-fill);
      .right {
        opacity: 1;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    opacity: 0;
  }
  .name {
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
  }
  .detail {
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
    color: #b3b3b3;
  }
</style>
