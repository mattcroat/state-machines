// 19. Invoking A Promise For Asynchronous State Transitions

import { assign, createMachine, interpret } from 'xstate'

async function fetchCuteAnimals() {
  const response = await fetch('https://www.reddit.com/r/aww.json')
  const { data } = await response.json()

  // return Promise.reject()
  return data.children.map((child) => child.data)
}

const cuteAnimalsMachine = createMachine({
  id: 'cuteAnimals',
  initial: 'idle',
  context: {
    cuteAnimals: null,
    error: null,
  },
  states: {
    idle: {
      on: { FETCH: 'loading' },
    },
    loading: {
      invoke: {
        id: 'fetchCuteAnimals',
        src: fetchCuteAnimals,
        onDone: {
          target: 'success',
          actions: assign({ cuteAnimals: (context, event) => event.data }),
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (context, event) => event.data }),
        },
      },
    },
    success: { type: 'final' },
    failure: { on: { RETRY: 'loading' } },
  },
})

const service = interpret(cuteAnimalsMachine).start()
