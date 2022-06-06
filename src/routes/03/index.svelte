<script>
  // @ts-nocheck

  import { onMount } from 'svelte'
  import { createMachine, interpret } from 'xstate'

  onMount(() => {
    const boxEl = document.querySelector('#box')

    const machine = createMachine({
      initial: 'inactive',
      states: {
        active: {
          on: { MOUSEUP: 'inactive' },
        },
        inactive: {
          on: { MOUSEDOWN: 'active' },
        },
      },
    })

    const service = interpret(machine)

    service.start()

    service.onTransition((state) => {
      console.log(state.value)
      boxEl.dataset.state = state.value
    })

    boxEl.addEventListener('mousedown', () => {
      service.send('MOUSEDOWN')

      // service.send({ type: 'MOUSEDOWN' })
      // service.send(event)
    })

    boxEl.addEventListener('mouseup', () => {
      service.send('MOUSEUP')
    })
  })
</script>

<h1>Exercise 03 - Interpreter</h1>

<div id="box" />

<style>
  #box {
    height: 25vmin;
    width: 25vmin;
    background-color: var(--color-primary);
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  #box::after {
    content: 'state: ' attr(data-state);
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    background: white;
    font-family: monospace;
    color: black;
    padding: 0.25rem;
    border-radius: inherit;
    white-space: nowrap;
  }

  #box {
    opacity: 0.5;
  }

  :global(#box[data-state='active']) {
    opacity: 1;
  }
</style>
