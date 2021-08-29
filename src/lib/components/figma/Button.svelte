<script lang="ts">
  export let type = "primary";
</script>

<button class={type} on:click>
  <slot>hello</slot>
</button>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
    border-radius: var(--border-radius-large);
    color: var(--white);
    flex-shrink: 0;
    font-family: var(--font-stack);
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--font-letter-spacing-neg-small);
    line-height: var(--font-line-height);
    height: var(--size-medium);
    padding: 0 var(--size-xsmall) 0 var(--size-xsmall);
    text-decoration: none;
    outline: none;
    border: 2px solid transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .primary {
    background-color: var(--blue);
  }

  .secondary {
    background-color: var(--white);
    border: 1px solid var(--black8);
    color: var(--black8);
    padding: 0 calc(var(--size-xsmall) + 1px) 0 calc(var(--size-xsmall) + 1px);
    letter-spacing: var(--font-letter-spacing-pos-small);
  }
</style>
