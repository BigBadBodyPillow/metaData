<script lang="ts">
  import favicon from '#lib/assets/favicon.svg';
  import type { LayoutProps } from './$types';
  import Rainbowline from '../components/Rainbowline.svelte';
  import '../reset.css';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Rainbowline />
{@render children()}
