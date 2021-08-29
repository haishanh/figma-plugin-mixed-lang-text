<script lang="ts">
  import Label from "$lib/components/figma/Label.svelte";
  import SelectOption from "$lib/components/figma/SelectOption.svelte";
  import Checkbox from "$lib/components/figma/Checkbox.svelte";
  import TextInput from "$lib/components/figma/TextInput.svelte";
  import Button from "$lib/components/figma/Button.svelte";
  import { formatDate } from "$lib/ui/util";
  import type { PresetData } from "$lib/ui/types";
  import {
    font,
    router,
    presets,
    formSpacing,
    formPresetName,
    presetEditingIdx,
    presetEditing,
    formCjkFontFamily,
    formCjkFontStyle,
    formLatinFontFamily,
    formLatinFontStyle,
  } from "$lib/ui/store";

  export let save: (d: PresetData) => any;

  function onClickSave() {
    const t = new Date().getTime();
    const toSave = {
      // ...$presetEditing,
      updatedAt: t,
      cjkFontName: { family: $formCjkFontFamily, style: $formCjkFontStyle },
      latinFontName: { family: $formLatinFontFamily, style: $formLatinFontStyle },
      name: $formPresetName,
      spacing: $formSpacing,
      id: $presetEditingIdx >= 0 ? $presets[$presetEditingIdx].id : "",
    };
    if (!toSave.id) toSave.id = t + "";
    save(toSave);
    $router.back();
  }

  let cjkFontStyleOptions: string[] = [];
  let latinFontStyleOptions: string[] = [];

  $: {
    if ($formCjkFontFamily && $font) {
      cjkFontStyleOptions = $font.familyStylesLookup[$formCjkFontFamily];
      if (cjkFontStyleOptions.indexOf($formCjkFontStyle) < 0) {
        $formCjkFontStyle = cjkFontStyleOptions[0];
      }
    }
  }

  $: {
    if ($formLatinFontFamily && $font) {
      latinFontStyleOptions = $font.familyStylesLookup[$formLatinFontFamily];
      if (latinFontStyleOptions.indexOf($formLatinFontStyle) < 0) {
        $formLatinFontStyle = latinFontStyleOptions[0];
      }
    }
  }

  $: {
    const presetsNotEmpty = $presets.length > 0;
    if ($presetEditingIdx >= 0 && presetsNotEmpty) {
      $formCjkFontFamily = $presets[$presetEditingIdx].cjkFontName.family;
      $formCjkFontStyle = $presets[$presetEditingIdx].cjkFontName.style;
      $formLatinFontFamily = $presets[$presetEditingIdx].latinFontName.family;
      $formLatinFontStyle = $presets[$presetEditingIdx].latinFontName.style;
      $formPresetName = $presets[$presetEditingIdx].name;
      $formSpacing = $presets[$presetEditingIdx].spacing;
    } else if (presetsNotEmpty) {
      $formCjkFontFamily = $presets[0].cjkFontName.family;
      $formCjkFontStyle = $presets[0].cjkFontName.style;
      $formLatinFontFamily = $presets[0].latinFontName.family;
      $formLatinFontStyle = $presets[0].latinFontName.style;
      $formPresetName = "Preset " + formatDate();
    } else if ($font) {
      const f = $font.families[0];
      $formCjkFontFamily = f;
      $formCjkFontStyle = $font.familyStylesLookup[f][0];
      $formLatinFontFamily = f;
      $formLatinFontStyle = $font.familyStylesLookup[f][0];
      $formPresetName = "Preset " + formatDate();
    }
  }
</script>

<div class="container">
  <Label label="Preset Name" />
  <TextInput bind:value={$formPresetName} />
  <Label label="CJK Font" />
  <div class="combo">
    <SelectOption options={$font ? $font.families : []} bind:selected={$formCjkFontFamily} />
    <SelectOption options={cjkFontStyleOptions} bind:selected={$formCjkFontStyle} />
  </div>
  <Label label="Latin Font" />
  <div class="combo">
    <SelectOption options={$font ? $font.families : []} bind:selected={$formLatinFontFamily} />
    <SelectOption options={latinFontStyleOptions} bind:selected={$formLatinFontStyle} />
  </div>
  <section>
    <Checkbox
      id="spacing"
      label="Add space between CJK and Latin words"
      bind:checked={$formSpacing}
    />
  </section>
  <div class="action-bar">
    <Button type="secondary" on:click={$router.back}>Cancel</Button>
    <Button on:click={onClickSave}>Save</Button>
  </div>
</div>

<style lang="scss">
  .container {
    padding: 8px;
  }
  .combo {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 90px;
  }
  section {
    margin: 10px 0;
  }
  .action-bar {
    display: grid;
    justify-content: end;
    grid-template-columns: repeat(2, auto);
    grid-gap: 10px;
    margin-top: 10px;
  }
</style>
