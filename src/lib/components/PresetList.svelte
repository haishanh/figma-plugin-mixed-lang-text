<script lang="ts">
  import IconButton from "$lib/components/figma/IconButton.svelte";
  import Plus from "$lib/components/icons/Plus.svelte";
  import { presets, hasInit } from "$lib/ui/store";
  import PresetItem from "$lib/components/PresetItem.svelte";

  export let onClickAddPreset = () => {};
</script>

<div class="panel-title">
  <div class="title">Presets</div>
  <IconButton on:click={onClickAddPreset}><Plus /></IconButton>
</div>

{#if $presets.length > 0}
  <ul>
    {#each $presets as item, idx (item.id)}
      <li><PresetItem preset={item} {idx} /></li>
    {/each}
  </ul>
{:else if $hasInit}
  <p class="empty text">There is no preset here yet.</p>
{/if}

<style lang="scss">
  .panel-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;

    position: sticky;
    top: 0;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;

    .title {
      font-size: var(--font-size-xsmall);
      font-weight: var(--font-weight-bold);
    }
  }

  .text {
    font-size: var(--font-size-xsmall);
    line-height: var(--font-line-height);
    font-weight: var(--font-weight-normal);
  }

  .empty {
    padding: 30px 0;
    margin: 0;
    text-align: center;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    margin: 0;
    padding: 0;
  }
</style>
