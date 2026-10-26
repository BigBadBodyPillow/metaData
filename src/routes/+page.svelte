<script>
  import File from '../components/File/File.svelte';
  import Info from '../components/Info/Info.svelte';
</script>

<main>
  <File />
  <Info />
</main>

<style>
  :root {
    --stripe-width: 10px;
    --stripe1-colour: rgb(15, 15, 15);
    --stripe2-colour: rgb(20, 20, 20);
  }

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
