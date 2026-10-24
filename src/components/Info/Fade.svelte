<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let scrollContainer: HTMLDivElement | undefined;
  let isAtTop = $state(true);
  let isAtBottom = $state(false);

  function updateScrollState() {
    const container = scrollContainer;
    if (!container) return;

    isAtTop = container.scrollTop <= 0;
    isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
  }

  onMount(() => {
    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scrollContainer!);

    return () => resizeObserver.disconnect();
  });
</script>

<div class="fade-wrapper">
  <div class="fade-scroll" bind:this={scrollContainer} onscroll={updateScrollState}>
    {@render children()}
  </div>

  <div class="fade top" aria-hidden="true" style:opacity={isAtTop ? '0' : '1'}></div>
  <div class="fade bottom" aria-hidden="true" style:opacity={isAtBottom ? '0' : '1'}></div>
</div>

<style>
  .fade-wrapper {
    position: relative;
    width: 400px;
    height: 100%;
    min-height: 0;
  }

  .fade-scroll {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    /* the fade indicates scroll.. maybe*/
    overflow-y: auto;
    scrollbar-width: none;
  }

  .fade {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    height: 86px;
    pointer-events: none;
    transition: opacity ease 1000ms;
  }

  .top {
    top: 0;
    background: linear-gradient(to bottom, var(--background) 15%, transparent 100%);
  }

  .bottom {
    bottom: 0;
    background: linear-gradient(to top, var(--background) 15%, transparent 100%);
  }
</style>
