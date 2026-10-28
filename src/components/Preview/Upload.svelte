<label class="drop" for="image-upload">
  <span class="upload-icon" aria-hidden="true">↑</span>
  <span class="title">Drop an image</span>
</label>

<style>
  .drop {
    width: 100%;
    height: 100%;

    color: hsl(from var(--text) h s calc(l - 40));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-32);

    cursor: pointer;
  }

  .upload-icon {
    width: 6rem;
    height: 6rem;

    display: grid;
    place-items: center;

    font-size: var(--font-24);
    background: var(--background);

    border: 2px dashed var(--border);
    border-radius: 100000vh;

    @supports (corner-shape: bevel) {
      & {
        border-radius: calc(var(--radius) * 2.3);
        corner-shape: bevel;
      }
    }

    margin-bottom: var(--spacing-8);
    padding-top: 2px; /* Magic Number */

    transition: all 160ms ease;
  }

  :global(
    .upload-field:not(.has-image):hover .upload-icon,
    .upload-field:not(.has-image):hover .title,
    .upload-field.dragging .upload-icon,
    .upload-field.dragging .title
  ) {
    color: var(--accent);
    border-color: var(--accent);
  }

  .title {
    font-family: var(--font-space-grotesk);
    font-size: var(--font-18);
    font-weight: 600;
  }
</style>
