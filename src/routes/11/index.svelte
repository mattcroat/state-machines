<script>
  // @ts-nocheck

  import { onMount } from 'svelte'
  import { createMachine, interpret } from 'xstate'

  import Inspect from '$lib/inspect.svelte'

  onMount(() => {
    const appEl = document.querySelector('#app')
    const offButtonEl = document.querySelector('#offButton')
    const onButtonEl = document.querySelector('#onButton')
    const modeButtonEl = document.querySelector('#modeButton')

    const displayMachine = createMachine({
      initial: 'hidden',
      states: {
        hidden: {
          on: {
            TURN_ON: 'visible.hist',
          },
        },
        visible: {
          type: 'parallel',
          on: { TURN_OFF: 'hidden' },
          states: {
            hist: { type: 'history', history: 'deep' },
            mode: {
              initial: 'light',
              states: {
                light: { on: { SWITCH: 'dark' } },
                dark: { on: { SWITCH: 'light' } },
              },
            },
            brightness: {
              initial: 'bright',
              states: {
                bright: {
                  after: { 2000: 'dim' },
                },
                dim: {
                  on: { SWITCH: 'bright' },
                },
              },
            },
          },
        },
      },
    })

    const service = interpret(displayMachine, { devTools: true })

    service
      .onTransition((state) => {
        appEl.dataset.state = state.toStrings().join(' ')
      })
      .start()

    onButtonEl.addEventListener('click', (event) => {
      service.send('TURN_ON')
    })

    offButtonEl.addEventListener('click', (event) => {
      service.send('TURN_OFF')
    })

    modeButtonEl.addEventListener('click', (event) => {
      service.send('SWITCH')
    })
  })
</script>

<Inspect />

<h1>Exercise 11 - Parallel States</h1>

<main id="app">
  <div>
    <button id="onButton">Turn on</button>
    <button id="offButton">Turn off</button>
  </div>
  <div id="display">
    <button id="modeButton">Switch mode</button>
  </div>
</main>

<style>
  #app {
    --color-bg: white;
    --color-fg: black;
    --brightness: 1;
  }

  #app::before {
    content: attr(data-state);
    position: absolute;
    top: -20px;
    left: 0;
    margin-top: 0.5rem;
    background: white;
    font-family: monospace;
    color: black;
    padding: 0.25rem;
    border-radius: inherit;
    white-space: nowrap;
  }

  #app:not([data-state]) #display,
  #app:global([data-state~='hidden']) #display {
    opacity: 0;
    transform: translateY(50%);
  }

  #app:global([data-state~='visible']) #display {
    transform: none;
  }

  #app:global([data-state~='visible.mode.dark']) {
    --color-bg: black;
    --color-fg: white;
  }

  #app:global([data-state~='visible.brightness.dim']) {
    --brightness: 0.5;
  }

  #display {
    padding: 2rem;
    border-radius: 1rem;
    background: var(--color-bg);
    color: var(--color-fg);
    border: 2px solid var(--color-fg);
    opacity: var(--brightness);
    transition: all 0.6s ease;
  }

  button {
    --color: blue;
    appearance: none;
    background: var(--color);
    color: white;
    font-weight: bold;
    padding: 1rem;
    border: none;
    cursor: pointer;
    margin: 1rem;
  }
</style>
