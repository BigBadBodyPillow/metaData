<script lang="ts">
  import { onDestroy } from 'svelte';
  import exifr from 'exifr';
  import type { MetadataField } from '#lib';
  // import Preview from './Preview.svelte';
  import Upload from './Upload.svelte';

  let { onMetadata }: { onMetadata: (fields: MetadataField[]) => void } = $props();
  let input: HTMLInputElement;
  let previewUrl = $state<string | null>(null);
  let imageName = $state('');
  let isDragging = $state(false);
  let metadataRequestId = 0;

  function selectImage(file: File | undefined) {
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    imageName = file.name;
    const requestId = ++metadataRequestId;
    void readMetadata(file, requestId);
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

  function readImageDimensions(file: File) {
    const imageUrl = URL.createObjectURL(file);

    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error('The image could not be decoded.'));
      image.src = imageUrl;
    }).finally(() => URL.revokeObjectURL(imageUrl));
  }

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  function formatValue(value: unknown): string {
    if (value instanceof Date) return value.toLocaleString();
    if (Array.isArray(value)) return value.map(formatValue).join(', ');
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return '';
  }

  function formatExifName(name: string): string {
    return name
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/^Exif\b/, 'EXIF');
  }

  function formatFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  async function readMetadata(file: File, requestId: number) {
    const dimensionsPromise = readImageDimensions(file).then(
      (dimensions) => ({ dimensions, failed: false }),
      () => ({ dimensions: undefined, failed: true })
    );
    const exifPromise = exifr.parse(file).then(
      (metadata) => ({ metadata, failed: false }),
      () => ({ metadata: undefined, failed: true })
    );
    const gpsPromise = exifr.gps(file).then(
      (location) => ({ location, failed: false }),
      () => ({ location: undefined, failed: true })
    );

    const [dimensionResult, exifResult, gpsResult] = await Promise.all([
      dimensionsPromise,
      exifPromise,
      gpsPromise
    ]);

    if (requestId !== metadataRequestId) return;

    const { dimensions } = dimensionResult;
    const metadata = exifResult.metadata;
    const fields: MetadataField[] = [
      { name: 'Name', value: file.name },
      { name: 'File size', value: formatFileSize(file.size) },
      { name: 'Format', value: file.type || 'Unknown' },
      {
        name: 'Modified',
        value: file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Unknown'
      },
      {
        name: 'Dimensions',
        value: dimensions ? `${dimensions.width} × ${dimensions.height} px` : ''
      }
    ];

    if (dimensions) {
      const divisor = gcd(dimensions.width, dimensions.height);
      fields.push(
        {
          name: 'Aspect ratio',
          value: `${dimensions.width / divisor}:${dimensions.height / divisor}`
        },
        {
          name: 'Megapixels',
          value: `${((dimensions.width * dimensions.height) / 1_000_000).toFixed(2)} MP`
        }
      );
    }

    const camera = [metadata?.Make, metadata?.Model].filter(Boolean).map(formatValue).join(' ');
    if (camera) fields.push({ name: 'Camera', value: camera });

    const capturedAt = formatValue(metadata?.DateTimeOriginal ?? metadata?.CreateDate);
    if (capturedAt) fields.push({ name: 'Captured', value: capturedAt });

    const descriptiveExifFields: [string, unknown][] = [
      ['Description', metadata?.ImageDescription],
      ['Creator', metadata?.Artist],
      ['Copyright', metadata?.Copyright],
      ['Software', metadata?.Software]
    ];

    for (const [name, rawValue] of descriptiveExifFields) {
      const value = formatValue(rawValue);
      if (value) fields.push({ name, value });
    }

    const optionalExifFields: [string, unknown, (value: string) => string][] = [
      ['Lens', metadata?.LensModel, (value) => value],
      ['Exposure', metadata?.ExposureTime, (value) => `${value} sec`],
      ['Aperture', metadata?.FNumber, (value) => `f/${value}`],
      ['ISO', metadata?.ISO, (value) => value],
      ['Focal length', metadata?.FocalLength, (value) => `${value} mm`],
      ['Orientation', metadata?.Orientation, (value) => value],
      ['Color space', metadata?.ColorSpace, (value) => value],
      ['Flash', metadata?.Flash, (value) => value],
      ['White balance', metadata?.WhiteBalance, (value) => value]
    ];

    for (const [name, rawValue, format] of optionalExifFields) {
      const value = formatValue(rawValue);
      if (value) fields.push({ name, value: format(value) });
    }

    const displayedExifTags = new Set([
      'Make',
      'Model',
      'ImageDescription',
      'Artist',
      'Copyright',
      'Software',
      'DateTimeOriginal',
      'CreateDate',
      'ExposureTime',
      'FNumber',
      'ISO',
      'FocalLength',
      'LensModel',
      'Orientation',
      'ColorSpace',
      'Flash',
      'WhiteBalance'
    ]);

    for (const [name, rawValue] of Object.entries(metadata ?? {})) {
      if (displayedExifTags.has(name)) continue;

      const value = formatValue(rawValue);
      if (value) fields.push({ name: formatExifName(name), value });
    }

    const { location } = gpsResult;
    if (location && Number.isFinite(location.latitude) && Number.isFinite(location.longitude)) {
      fields.push({
        name: 'GPS location',
        value: `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
      });
    }

    onMetadata(fields);
  }

  onDestroy(() => {
    metadataRequestId += 1;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
</script>

<div class="container">
  {#if previewUrl}
    <div class="preview-frame">
      <img class="preview" draggable="false" src={previewUrl} alt={`Preview of ${imageName}`} />
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
    user-select: none;
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
