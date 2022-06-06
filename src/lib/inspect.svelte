<script>
  import { onMount } from 'svelte'
  import { inspect } from '@xstate/inspect'

  onMount(() => inspect())
</script>

<iframe title="XState visualizer" data-xstate />

<style>
  iframe {
    width: 100%;
    height: 50vh;
    border: 0;
  }
</style>
