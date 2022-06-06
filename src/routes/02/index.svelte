<script>
  // @ts-nocheck

  import { onMount } from 'svelte'

  onMount(() => {
    const boxEl = document.querySelector('#box')

    // 01. using a switch statement

    /*
    function transition(state, event) {
      switch (state) {
        case 'active':
          switch (event) {
            case 'TOGGLE':
              return 'inactive'
            default:
              return state
          }
        case 'inactive':
          switch (event) {
            case 'TOGGLE':
              return 'active'
            default:
              return state
          }
      }
    }

    let currentState = 'inactive'

    function transition(state, event) {
      const nextState = transition(currentState, event)
      currentState = nextState
      boxEl.dataset.state = nextState
    }
    */

    // 02. Using an object

    const machine = {
      initial: 'inactive',
      states: {
        active: {
          on: { TOGGLE: 'inactive' },
        },
        inactive: {
          on: { TOGGLE: 'active' },
        },
      },
    }

    function transition(state, event) {
      return machine.states[state].on[event] || state
    }

    let currentState = machine.initial

    function send(event) {
      const nextState = transition(currentState, event)
      currentState = nextState
      boxEl.dataset.state = currentState
    }

    // extra
    /*
    function interpret(machine) {
      let currentState = machine.initial

      function send(event) {
        const nextState = transition(currentState, event)
        currentState = nextState
      }

      return { send }
    }
    */

    boxEl.addEventListener('click', () => {
      send('TOGGLE')
    })
  })
</script>

<h1>Exercise 02 - XState</h1>

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
