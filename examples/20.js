// 20. Invoke Callbacks to Send and Receive Events From a Parent Machine

import { createMachine, interpret, send } from 'xstate'

function echoCallbackHandler(context, event) {
  return (callback, onEvent) => {
    onEvent((event) => {
      if (event.type === 'HEAR') {
        callback('ECHO')
      }
    })
  }
}

const echoMachine = createMachine({
  id: 'echo',
  initial: 'listening',
  states: {
    listening: {
      invoke: {
        id: 'echoCallback',
        src: echoCallbackHandler,
      },
      on: {
        SPEAK: {
          actions: send('HEAR', { to: 'echoCallback' }),
        },
        ECHO: {
          actions: () => console.log('echo, echo'),
        },
      },
    },
  },
})

const service = interpret(echoMachine).start()
