<script lang="ts">
  import ArrowLeft from "$lib/components/icons/ArrowLeft.svelte";
</script>

<button class="btn" on:click><slot><ArrowLeft /></slot></button>

<style lang="scss">
  .btn {
    --color-outline: #888;

    appearance: none;
    outline: none;
    background: none;
    /* cursor: pointer; */
    cursor: inherit;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 2px solid transparent;
    border-radius: 2px;

    /* color: var(--color-outline); */
  }
  .btn:hover {
    background: var(--hover-fill);
  }
</style>
