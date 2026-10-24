<script lang="ts">
  import Field from '../Field.svelte';
  import Fade from './Fade.svelte';
  import Spacer from './Spacer.svelte';

  const fields = [
    { name: 'Width', value: '100px' },
    { name: 'Height', value: '100px' },
    { name: 'a', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { name: 'b' },
    { name: 'c' },
    { name: 'd' },
    { name: 'e' },
    { name: 'f' },
    { name: 'g' },
    { name: 'h' },
    { name: 'i' },
    { name: 'j' },
    { name: 'k' },
    { name: 'l' },
    { name: 'm' },
    { name: 'n' },
    { name: 'o' },
    { name: 'p' },
    { name: 'q' },
    { name: 'r' },
    { name: 's' },
    { name: 't' },
    { name: 'u' },
    { name: 'v' },
    { name: 'w' },
    { name: 'x' },
    { name: 'y' },
    { name: 'z' },
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
    { name: '7' },
    { name: '8' },
    { name: '9' },
    { name: '10' },
    { name: '11' },
    { name: '12' },
    { name: '13' }
  ];
</script>

<Fade>
  <div class="content">
    {#each fields as field, index (field.name)}
      <Field {...field} />

      <!-- not last -->
      {#if index < fields.length - 1}
        <Spacer />
      {/if}
    {/each}
  </div>
</Fade>

<style>
  .content {
    --stripe-width: 10px;
    --stripe1-colour: rgb(15, 15, 15);
    --stripe2-colour: rgb(20, 20, 20);
    --value-colour: hsl(from var(--border) h s calc(l + 5));
    --border-width: 2px;
    --field-name-width: 100px;

    position: relative;

    color: hsl(from var(--text) h s calc(l - 20));
    font-size: var(--font-16);
    font-family: var(--font-roboto-mono);

    border: 2px solid var(--value-colour);
    @supports (corner-shape: bevel) {
      & {
        border-radius: var(--radius);
        corner-shape: bevel;
      }
    }

    background-color: var(--background);
    backdrop-filter: blur(4px);
    background: repeating-linear-gradient(
      135deg,
      var(--stripe1-colour),
      var(--stripe1-colour) var(--stripe-width),
      var(--stripe2-colour) var(--stripe-width),
      var(--stripe2-colour) calc(var(--stripe-width) * 2)
    );
  }

  /* overflow hidden doesnt work with corner shaper radius so i have to add the radius to the elements too*/
  /* the first .name  */
  .content :global(.field:first-child > .name) {
    border-top-left-radius: calc(var(--radius) - 1px);
    corner-shape: bevel;
  }

  /* the last .name  */
  .content :global(.field:last-child > .name) {
    border-bottom-left-radius: calc(var(--radius) - 1px);
    corner-shape: bevel;
  }
</style>
