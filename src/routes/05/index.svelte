<script>
  // @ts-nocheck

  import { onMount } from 'svelte'
  import { createMachine, assign, interpret } from 'xstate'

  import Inspect from '$lib/inspect.svelte'

  onMount(() => {
    const boxEl = document.querySelector('#box')
    const bodyEl = document.body

    const assignPoint = assign({
      px: (context, event) => event.x,
      py: (context, event) => event.y,
    })

    const assignDelta = assign({
      dx: (context, event) => event.x - context.px,
      dy: (context, event) => event.y - context.py,
    })

    const assignPosition = assign({
      x: (context, event) => context.x + context.dx,
      y: (context, event) => context.y + context.dy,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    })

    const showDelta = (context) => {
      boxEl.dataset.delta = `delta: ${context.dx}, ${context.dy}`
    }

    const resetPosition = assign({
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    })

    const machine = createMachine({
      initial: 'idle',
      context: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        px: 0,
        py: 0,
      },
      states: {
        idle: {
          on: {
            MOUSEDOWN: {
              target: 'dragging',
              actions: assignPoint,
            },
          },
        },
        dragging: {
          on: {
            MOUSEMOVE: {
              actions: [assignDelta, showDelta],
            },
            MOUSEUP: {
              target: 'idle',
              actions: assignPosition,
            },
            'keyup.cancel': {
              target: 'idle',
              actions: resetPosition,
            },
          },
        },
      },
    })

    const service = interpret(machine, { devTools: true })

    service.onTransition((state) => {
      if (state.changed) {
        console.log(state.context)

        boxEl.dataset.state = state.value

        boxEl.style.setProperty('--dx', state.context.dx)
        boxEl.style.setProperty('--dy', state.context.dy)
        boxEl.style.setProperty('--x', state.context.x)
        boxEl.style.setProperty('--y', state.context.y)
      }
    })

    service.start()

    boxEl.addEventListener('mousedown', (event) => {
      service.send({
        type: 'MOUSEDOWN',
        x: event.clientX,
        y: event.clientY,
      })
    })

    bodyEl.addEventListener('mousemove', (event) => {
      service.send({
        type: 'MOUSEMOVE',
        x: event.clientX,
        y: event.clientY,
      })
    })

    bodyEl.addEventListener('mouseup', (event) => {
      service.send({
        type: 'MOUSEUP',
        x: event.clientX,
        y: event.clientY,
      })
    })

    bodyEl.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        service.send('keyup.cancel')
      }
    })
  })
</script>

<Inspect />

<h1>Exercise 05 - Context</h1>

<div id="box" />

<style>
  #box {
    height: 25vmin;
    width: 25vmin;
    background-color: var(--color-primary);
    left: calc(var(--x) * 1px);
    top: calc(var(--y) * 1px);
    transform: translate(calc(var(--dx) * 1px), calc(var(--dy) * 1px));
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  #box::before {
    content: attr(data-delta);
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
    opacity: 0.8;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.4);
  }
</style>
