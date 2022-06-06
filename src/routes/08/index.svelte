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

    const dragDropMachine = createMachine(
      {
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
            after: {
              TIMEOUT: {
                target: 'idle',
                actions: resetPosition,
              },
            },
          },
        },
      },
      {
        delays: {
          TIMEOUT: 2000,
        },
      }
    )

    const service = interpret(dragDropMachine, { devTools: true })

    service.onTransition((state) => {
      boxEl.dataset.state = state.value

      console.log(state.actions)

      if (state.changed) {
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

<h1>Exercise 08 - Delayed Transitions</h1>

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
</style>
