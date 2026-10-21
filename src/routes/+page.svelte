<h1>Meta Data</h1>
<p>checks meta data</p>
<div class="square"></div>

<style>
  :root {
    display: flex;
    justify-content: center;
  }

  .square {
    --stripe-width: 10px;
    --stripe1-colour: light-dark(rgb(240, 240, 240), rgb(15, 15, 15));
    --stripe2-colour: light-dark(rgb(235, 235, 235), rgb(20, 20, 20));

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
  }
</style>
