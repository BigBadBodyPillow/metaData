<script lang="ts">
  import { onMount } from 'svelte';
  import Field from './Field.svelte';
  import Fade from './Fade.svelte';
  import Spacer from './Spacer.svelte';
  import metaData from '../metaData.json';

  const { fields } = metaData;
  let contentElement: HTMLDivElement;
  let placeholderCount = $state(1);

  const displayFields = $derived([
    ...fields,
    ...Array.from({ length: placeholderCount }, () => ({ name: '', value: '' }))
  ]);

  onMount(() => {
    const scrollContainer = contentElement.parentElement;
    if (!scrollContainer) return;

    function updatePlaceholderCount() {
      if (!scrollContainer) return;

      const field = contentElement.querySelector('.field');
      if (!field) return;

      const fieldHeight = field.getBoundingClientRect().height;
      const styles = getComputedStyle(contentElement);
      const spacerHeight = Number.parseFloat(styles.getPropertyValue('--border-width'));
      const borderHeight =
        Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth);
      const minheight = 37;
      const availableHeight = scrollContainer.clientHeight - borderHeight - minheight;
      const requiredFieldCount = Math.ceil(
        (availableHeight + spacerHeight) / (fieldHeight + spacerHeight)
      );

      placeholderCount = Math.max(0, requiredFieldCount - fields.length);
    }

    updatePlaceholderCount();

    const resizeObserver = new ResizeObserver(updatePlaceholderCount);
    resizeObserver.observe(scrollContainer);

    return () => resizeObserver.disconnect();
  });
</script>

<Fade>
  <div class="content" bind:this={contentElement}>
    {#each displayFields as field, index (index)}
      <Field {...field} />

      <!-- not last -->
      {#if index < displayFields.length - 1}
        <Spacer />
      {/if}
    {/each}
  </div>
</Fade>

<style>
  .content {
    --value-colour: hsl(from var(--border) h s calc(l + 5));
    --border-width: 2px;
    --field-name-width: 100px;

    position: relative;

    color: hsl(from var(--text) h s calc(l - 20));
    font-size: var(--font-16);
    font-family: var(--font-roboto-mono);

    border: 2px solid var(--value-colour);
    border-radius: var(--radius);
    @supports (corner-shape: bevel) {
      & {
        border-radius: var(--radius);
        corner-shape: bevel;
      }
    }

    background-color: var(--background);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );
  }

  /* overflow hidden doesnt work with corner shaper radius so i have to add the radius to the elements too*/
  /* the first .name  */
  .content :global(.field:first-child > .name) {
    border-top-left-radius: calc(var(--radius) - 1px);
    corner-shape: bevel;
  }

  /* the last .name  */
  .content :global(.field:last-child > .name) {
    border-bottom-left-radius: calc(var(--radius) - 1px);
    corner-shape: bevel;
  }
</style>
