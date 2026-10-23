<main>
  <div class="image">
    <label for="image-upload">
      <span>Choose a profile picture: </span>
      <input type="file" id="image-upload" name="image" accept="image/*" />
    </label>
  </div>
  <div class="meta-info">
    <div class="title">
      <h2>Meta Data</h2>
    </div>

    <div class="content">
      <div class="field">
        <p>Width: 100px</p>
      </div>
      <div class="spacer"></div>
      <div class="field">
        <p>Height: 100px</p>
      </div>
      <div class="spacer"></div>
      <div class="field">
        <p>a</p>
      </div>
      <div class="spacer"></div>
      <div class="field">
        <p>b</p>
      </div>
      <div class="spacer"></div>
      <div class="field">
        <p>c</p>
      </div>
    </div>
  </div>
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

  .meta-info {
    --stripe-width: 10px;
    --stripe1-colour: rgb(15, 15, 15);
    --stripe2-colour: rgb(20, 20, 20);

    width: 400px;
    height: 100%;
    display: flex;
    flex-direction: column;

    background-color: var(--background);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );
    /* border-radius: var(--radius); */
    border: 1px solid white;

    /* padding: var(--spacing-12); */
    gap: var(--spacing-12);
    font-family: var(--font-roboto-mono);
  }

  .meta-info > div:not(:first-child) {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    border: inherit;
    padding: var(--spacing-8);
    color: hsl(from var(--text) h s calc(l - 20));
    font-size: var(--font-16);
    margin-inline: var(--spacing-12);
    padding: 0;

    @supports (corner-shape: bevel) {
      & {
        border-radius: var(--radius);
        corner-shape: bevel;
      }
    }
  }

  .meta-info .title {
    font-family: var(--font-space-grotesk);
    padding: var(--spacing-12);
  }
  .meta-info .field {
    padding: var(--spacing-8);
  }

  .spacer {
    position: relative;

    height: 1px;
    /* background-color: hsl(from var(--text) h s calc(l - 70)); */
    background-color: white;
    width: 100%;
    margin-block: var(--spacing-4);
  }

  .spacer::before,
  .spacer::after {
    --height: 5px;
    --width: 5px;

    content: '';
    position: absolute;

    width: var(--width);
    height: var(--height);

    background-color: white;
    margin-top: calc(-1 * var(--height) / 2.5);
  }

  .spacer::before {
    left: 0;
    top: 0;
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  }

  .spacer::after {
    right: 0;
    top: 0;
    clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
  }
</style>
