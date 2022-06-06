<script>
  // @ts-nocheck

  import { onMount } from 'svelte'
  import { createMachine, interpret } from 'xstate'

  import Inspect from '$lib/inspect.svelte'

  onMount(() => {
    const boxEl = document.querySelector('#box')
    const cancelEl = document.querySelector('#cancel')

    function randomFetch() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          if (Math.random() < 0.5) {
            rej('Fetch failed!')
          } else {
            res('Fetch succeded!')
          }
        }, 2000)
      })
    }

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: { FETCH: 'pending' },
        },
        pending: {
          on: {
            RESOLVE: 'resolved',
            CANCEL: 'idle',
          },
          invoke: {
            src: (context, event) => {
              return randomFetch()
            },
            onDone: {
              target: 'resolved',
              actions: (_, event) => console.log(event),
            },
            onError: { target: 'rejected' },
          },
        },
        resolved: { on: { FETCH: 'pending' } },
        rejected: { on: { FETCH: 'pending' } },
      },
    })

    const service = interpret(machine, { devTools: true })

    service.onTransition((state) => {
      boxEl.dataset.state = state.toStrings().join(' ')
    })

    service.start()

    boxEl.addEventListener('click', (event) => {
      service.send('FETCH')
    })

    cancelEl.addEventListener('click', (event) => {
      service.send('CANCEL')
    })
  })
</script>

<Inspect />

<h1>Exercise 12 - Actor Model</h1>

<div id="box">
  <span>Click to fetch!</span>
</div>
<button id="cancel">Cancel</button>

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
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  #box:global([data-state='pending']) {
    background: orange;
  }

  #box:global([data-state='pending']) > span {
    opacity: 0;
  }

  #box:global([data-state='resolved']) {
    background: green;
  }

  #box:global([data-state='rejected']) {
    background: red;
  }
</style>
