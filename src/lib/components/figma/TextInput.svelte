<script lang="ts">
  export let value = "input";
</script>

<input type="text" bind:value />

<style lang="scss">
  input {
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
    height: 32px;
    width: 100%;
    margin: 1px 0;
    padding: 8px 4px 8px 7px;
    outline: none;
    border-radius: var(--border-radius-small);
    border: 1px solid transparent;
    &:hover {
      border-color: var(--black1);
    }
    &:focus {
      border-color: var(--blue);
    }
  }
</style>
