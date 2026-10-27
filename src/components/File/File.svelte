<script lang="ts">
  import { onDestroy } from 'svelte';
  // import Preview from './Preview.svelte';
  import Upload from './Upload.svelte';

  let input: HTMLInputElement;
  let previewUrl = $state<string | null>(null);
  let imageName = $state('');
  let isDragging = $state(false);

  function selectImage(file: File | undefined) {
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    imageName = file.name;

    logMetaDate(file);
  }

  function handleFileChange(event: Event) {
    selectImage((event.currentTarget as HTMLInputElement).files?.[0]);
    input.value = '';
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    selectImage(event.dataTransfer?.files[0]);
  }

  function handleDragLeave(event: DragEvent) {
    if (
      event.currentTarget instanceof HTMLElement &&
      event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      return;
    }
    isDragging = false;
  }

  function logMetaDate(file: File | undefined) {
    if (!file) return;

    const img = file;
    console.log(img);
    const name = img.name;
    const time = new Date(img.lastModified);
    const size = img.size / 1000 / 1000;
    const type = img.type;
    console.log('Name : ' + name);
    console.log('Time : ' + time);
    console.log('Size : ' + size + ' MB');
    console.log('type : ' + type.split('/').slice(1).join('/'));
  }

  onDestroy(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
</script>

<div class="container">
  {#if previewUrl}
    <div class="preview-frame">
      <img class="preview" src={previewUrl} alt={`Preview of ${imageName}`} />
    </div>
  {/if}

  <div
    class="upload-field"
    class:dragging={isDragging}
    class:has-image={previewUrl}
    role="group"
    aria-label="Image upload area"
    ondragenter={(event) => {
      event.preventDefault();
      isDragging = true;
    }}
    ondragover={(event) => event.preventDefault()}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if !previewUrl}
      <Upload />
    {/if}

    <input
      bind:this={input}
      type="file"
      id="image-upload"
      name="image"
      accept="image/*"
      onchange={handleFileChange}
      aria-label={previewUrl ? 'change image' : 'upload image'}
    />

    {#if previewUrl}
      <div class="image-details">
        <span class="image-name" title={imageName}>{imageName}</span>
        <label class="change-button" for="image-upload">Change image</label>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    flex: 1;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: var(--spacing-12);
  }

  .upload-field {
    position: relative;
    display: grid;
    place-items: center;

    width: min(100%, 250px);
    aspect-ratio: 1;

    /* background:
      radial-gradient(ellipse at center, rgb(35 35 35 / 80%), rgb(20 20 20 / 95%)), rgb(20, 20, 20); */
    border: 2px solid hsl(from var(--border) h s calc(l - 3));
    border-radius: var(--radius);
    background-color: var(--background);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );

    @supports (corner-shape: bevel) {
      & {
        border-radius: calc(var(--radius) * 3);
        corner-shape: bevel;
      }
    }

    transition: all 160ms ease;
    overflow: hidden;
  }

  .upload-field.has-image {
    width: min(100%, 360px);
    min-height: 48px;
    aspect-ratio: auto;
    overflow: visible;
    background: transparent;
    border: 0;

    transition: none;
  }

  .upload-field:not(.has-image):hover,
  .upload-field.dragging {
    border-color: var(--accent);
    background-color: rgb(35, 20, 23);
  }
  .upload-field:not(.has-image):hover,
  .upload-field.dragging {
    transform: scale(1.02);
  }

  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  /* When changing upload */
  .upload-field:has(input[type='file']:focus-visible) {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
    border-radius: var(--radius);
  }

  /* initial upload*/
  .upload-field:not(.has-image):has(input[type='file']:focus-visible) {
    border-radius: calc(var(--radius) * 3);
  }

  .preview-frame {
    width: min(100%, 960px);
    height: min(70vh, 720px);
    min-height: 0;

    display: grid;
    place-items: center;
  }

  .preview {
    max-width: 100%;
    max-height: 700px;

    object-fit: contain;

    background: var(--background);
    border: 2px solid var(--border);
    border-radius: var(--radius);

    @supports (corner-shape: bevel) {
      & {
        border-radius: calc(var(--radius) * 3);
        corner-shape: bevel;
      }
    }
  }

  .image-details {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-12);

    font-family: var(--font-space-grotesk);
    padding: var(--spacing-12);

    background: hsl(from var(--background) h s calc(l + 3));

    border: 2px solid var(--border);
    border-radius: var(--radius);

    @supports (corner-shape: bevel) {
      & {
        corner-shape: bevel;
      }
    }
  }

  .image-name {
    font-size: var(--font-12);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .change-button {
    flex: none;

    padding: var(--spacing-8) var(--spacing-12);
    font-family: var(--font-inter);
    color: var(--text);

    background: hsl(from var(--background) h s calc(l + 10));
    border: 2px dashed hsl(from var(--border) h s calc(l + 10));
    border-radius: var(--radius);

    @supports (corner-shape: bevel) {
      & {
        corner-shape: bevel;
      }
    }

    font-size: var(--font-12);
    font-weight: 600;
    cursor: pointer;

    transition: all 160ms ease;

    &:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
  }
</style>
