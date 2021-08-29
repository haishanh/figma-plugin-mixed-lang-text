<script lang="ts">
  export let id = "test-id";
  export let checked = true;
  export let label = "label";
</script>

<div class="checkbox">
  <label class="wrap-input" tabindex="-1">
    <input class="input" {id} type="checkbox" bind:checked />
  </label>
  <label class="label" for={id}>{label}</label>
</div>

<style lang="scss">
  .checkbox {
    align-items: center;
    cursor: default;
    display: flex;
    /* height: var(--size-medium); */
    position: relative;
  }

  .wrap-input,
  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0;
    flex: 0 0 32px;
  }

  .wrap-input {
    height: 32px;
    width: 32px;
  }

  .input {
    width: 14px;
    height: 14px;

    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  .input:after {
    content: "";
    display: inline-flex;
    margin: 1px;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #333;
  }

  .input:checked:after {
    border: 1px solid #18a0fb;
    background-color: #18a0fb;
    /* background-image: url(https://www.figma.com/images/checkbox_check.svg); */
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEuMTc2NDcgMi44MjM3N0wzLjA1ODgyIDQuNzA2MTNMNi44MjM1MyAwLjk0MTQwNkw4IDIuMTE3ODhMMy4wNTg4MiA3LjA1OTA4TDAgNC4wMDAyNEwxLjE3NjQ3IDIuODIzNzdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K);
    background-position: 50%;
    background-repeat: no-repeat;
  }

  .input:focus:after {
    box-shadow: 0 0 0 1px #18a0fb;
    border: 1px solid #18a0fb;
  }

  .input:checked:focus:after {
    border: 1px solid #fff;
  }

  .label {
    color: var(--black8);
    font-family: var(--font-stack);
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
    line-height: var(--font-line-height);
    letter-spacing: var(--font-letter-spacing-pos-xsmall);
    height: 100%;
    user-select: none;
  }
</style>
