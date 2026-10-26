<script>
  import Image from '../components/Image.svelte';
  import Info from '../components/Info/Info.svelte';
</script>

<main>
  <Image />
  <Info />
</main>

<style>
  main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-16);
    gap: var(--spacing-16);
    height: 100%;
    width: 100%;
    z-index: 1;
  }
</style>
