<script>
  // @ts-nocheck

  import { onMount } from 'svelte'
  import { createMachine, interpret } from 'xstate'

  import Inspect from '$lib/inspect.svelte'

  onMount(() => {
    const boxEl = document.querySelector('#box')

    function setPoint(context, event) {
      console.log(event)
      boxEl.dataset.point = `(${event.x}, ${event.y})`
    }

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            MOUSEDOWN: {
              target: 'dragging',
              actions: setPoint,
            },
          },
        },
        dragging: {
          on: {
            MOUSEUP: { target: 'idle' },
          },
        },
      },
    })

    const service = interpret(machine, { devTools: true })

    service.start()

    service.onTransition((state) => {
      boxEl.dataset.state = state.value
    })

    boxEl.addEventListener('mousedown', (event) => {
      service.send({
        type: 'MOUSEDOWN',
        x: event.clientX,
        y: event.clientY,
      })
    })

    boxEl.addEventListener('mouseup', () => {
      service.send({ type: 'MOUSEUP' })
    })
  })
</script>

<Inspect />

<h1>Exercise 04 - Actions</h1>

<div id="box" />

<style>
  #box {
    height: 25vmin;
    width: 25vmin;
    background-color: var(--color-primary);
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  #box::before {
    content: attr(data-point);
    position: absolute;
    bottom: 100%;
    margin-bottom: 0.5rem;
    left: 0;
    background: white;
    padding: 0.25rem;
    color: black;
    font-family: monospace;
    border-radius: inherit;
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

  :global(#box[data-state='dragging']) {
    opacity: 1;
  }
</style>
