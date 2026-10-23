<script>
  import { onMount } from 'svelte';
  import Field from './Field.svelte';

  /** @type {HTMLDivElement | undefined} */
  let scrollContainer;
  let isAtTop = $state(true);
  let isAtBottom = $state(false);

  const fields = [
    { name: 'Width', value: '100px' },
    { name: 'Height', value: '100px' },
    { name: 'a' },
    { name: 'b' },
    { name: 'c' },
    { name: 'd' },
    { name: 'e' },
    { name: 'f' },
    { name: 'g' },
    { name: 'h' },
    { name: 'i' },
    { name: 'j' },
    { name: 'k' },
    { name: 'l' },
    { name: 'm' },
    { name: 'n' },
    { name: 'o' },
    { name: 'p' },
    { name: 'q' },
    { name: 'r' },
    { name: 's' },
    { name: 't' },
    { name: 'u' },
    { name: 'v' },
    { name: 'w' },
    { name: 'x' },
    { name: 'y' },
    { name: 'z' },
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
    { name: '7' },
    { name: '8' },
    { name: '9' },
    { name: '10' },
    { name: '11' },
    { name: '12' },
    { name: '13' }
  ];

  function updateScrollState() {
    if (!scrollContainer) return;

    isAtTop = scrollContainer.scrollTop <= 0;
    isAtBottom =
      scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1;
  }

  onMount(() => {
    const container = scrollContainer;
    if (!container) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  });
</script>

<div class="meta-info-wrapper">
  <div class="meta-info" bind:this={scrollContainer} onscroll={updateScrollState}>
    <div class="content">
      {#each fields as field, index (field.name)}
        <Field {...field} />

        {#if index < fields.length - 1}
          <div class="spacer"></div>
        {/if}
      {/each}
    </div>
  </div>

  {#if !isAtTop}
    <div class="scroll-fade fade-top" aria-hidden="true"></div>
  {/if}
  {#if !isAtBottom}
    <div class="scroll-fade fade-bottom" aria-hidden="true"></div>
  {/if}
</div>

<style>
  .meta-info {
    --stripe-width: 10px;
    --stripe1-colour: rgb(15, 15, 15);
    --stripe2-colour: rgb(20, 20, 20);
    --value-colour: hsl(from var(--border) h s calc(l + 5));
    --border-width: 2px;
    --field-name-width: 100px;

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    font-family: var(--font-roboto-mono);
    border: none;
    background: transparent;
    position: relative;

    overflow-y: auto;
    scrollbar-width: thin;
  }

  .meta-info-wrapper {
    position: relative;
    width: 400px;
    height: 100%;
    min-height: 0;
  }

  .content {
    color: hsl(from var(--text) h s calc(l - 20));
    font-size: var(--font-16);

    background-color: var(--background);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );
    backdrop-filter: blur(4px);
    border: 2px solid var(--value-colour);

    @supports (corner-shape: bevel) {
      & {
        border-radius: var(--radius);
        corner-shape: bevel;
      }
    }
  }

  .scroll-fade {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    height: 56px;
    pointer-events: none;
  }

  .fade-top {
    top: 0;
    background: linear-gradient(to bottom, var(--background) 15%, transparent 100%);
  }

  .fade-bottom {
    bottom: 0;
    background: linear-gradient(to top, var(--background) 15%, transparent 100%);
  }

  .content :global(.field:first-child > .name) {
    border-top-left-radius: calc(var(--radius) - 1px);
    corner-shape: bevel;
  }

  .content :global(.field:last-child > .name) {
    border-bottom-left-radius: calc(var(--radius) - 1px);
    corner-shape: bevel;
  }

  .spacer {
    position: relative;

    height: var(--border-width);
    background-color: var(--value-colour);
    width: 100%;
  }

  .spacer::before,
  .spacer::after {
    --height: 10px;
    --width: 5px;

    content: '';
    position: absolute;
    top: 0;

    width: var(--width);
    height: var(--height);

    background-color: var(--value-colour);
    margin-top: calc(-1 * var(--height) / 2.5);
  }

  .spacer::before {
    left: 0;
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  }

  .spacer::after {
    right: 0;
    clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
  }
</style>
