<main>
  <div class="image"></div>
  <div class="meta-info"></div>
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

  /* main {
    --stripe-width: 10px;
    --stripe1-colour: rgb(15, 15, 15);
    --stripe2-colour: rgb(20, 20, 20);

    width: 200px;
    aspect-ratio: 1/1;

    background-color: var(--background);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );
    border-radius: var(--radius);
    border: 1px solid var(--border);
  } */

  .image {
    background-color: rgb(27, 27, 27);
    flex: 1;
    height: 100%;

    border-radius: var(--radius);
    border: 1px solid var(--border);
  }

  .meta-info {
    --stripe-width: 10px;
    --stripe1-colour: rgb(15, 15, 15);
    --stripe2-colour: rgb(20, 20, 20);

    width: 400px;
    height: 100%;

    background-color: var(--background);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
</style>
