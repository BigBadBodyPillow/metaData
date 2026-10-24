<script>
  import Info from '../components/Info/Info.svelte';
</script>

<main>
  <div class="image">
    <label for="image-upload">
      <span>Choose a profile picture: </span>
      <input type="file" id="image-upload" name="image" accept="image/*" />
    </label>
  </div>

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

  .image {
    background-color: rgb(27, 27, 27);
    flex: 1;
    height: 100%;

    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
</style>
