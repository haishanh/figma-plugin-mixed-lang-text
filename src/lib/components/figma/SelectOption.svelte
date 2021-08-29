<script lang="ts">
  import SelectOptionIcon from "./SelectOptionIcon.svelte";

  export let options = ["light", "dark"];
  export let selected = "";

  /* let select: HTMLSelectElement; */
</script>

<div class="container">
  <select bind:value={selected}>
    {#each options as o}
      <option value={o} selected={selected === o}>{o}</option>
    {/each}
  </select>
  <span class="suffix"><SelectOptionIcon /></span>
</div>

<style lang="scss">
  .container {
    display: flex;
    align-items: center;
    position: relative;
    select {
      width: 100%;
      height: 30px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: none;
      background: var(--white);
      border-radius: var(--border-radius-small);
      border: 1px solid transparent;
      padding: 0px var(--size-xxsmall) 0px var(--size-xxsmall);
      padding-right: 30px;
      font-size: var(--font-size-xsmall);
      font-weight: var(--font-weight-normal);
      font-family: var(--font-stack);
    }
    .suffix {
      width: 30px;
      height: 30px;
      pointer-events: none;
      opacity: 0.3;
      position: absolute;
      right: 0;
    }

    &:hover select {
      border-color: var(--black1);
      flex: 1;
    }
    &:hover .suffix {
      opacity: 1;
    }
    select:focus {
      border-color: var(--blue);
    }
    select:focus ~ .suffix {
      display: 1;
    }
  }
</style>
