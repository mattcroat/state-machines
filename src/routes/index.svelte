<script>
  // @ts-nocheck

  import { onMount } from 'svelte'

  onMount(() => {
    function output(object) {
      document.querySelector('#app').innerHTML = JSON.stringify(object, null, 2)
    }

    const user = {
      name: 'Matia',
      company: 'Joy of Code',
      interests: ['code', 'noodles'],
    }

    output(user)

    document.querySelector('#button').addEventListener('click', (event) => {
      event.target.setAttribute('disabled', true)
      console.log('Loading data...', Date.now())
    })

    const machine = {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FETCH: 'pending',
          },
        },
        pending: {
          on: {
            RESOLVE: 'resolved',
            REJECT: 'rejected',
          },
        },
        resolved: {},
        rejected: {},
      },
    }

    function transition(state, event) {
      return machine.states[state]?.on?.[event] || state
    }

    let currentState = machine.initial

    function send(event) {
      const nextState = transition(currentState, event)
      currentState = nextState
    }

    window.send = send
  })
</script>

<h1>XState</h1>

<div id="app" />
<button id="button">Click</button>

<style>
  :global(#button[disabled]) {
    opacity: 0.5;
  }
</style>
