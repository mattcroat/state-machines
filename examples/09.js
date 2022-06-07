// 09. Send Events to the Machine With Send Action Creator

import { createMachine, interpret, send } from 'xstate'

const echoMachine = createMachine({
  id: 'echo',
  initial: 'listening',
  states: {
    listening: {
      on: {
        SPEAK: {
          actions: send({ type: 'ECHO' }),
        },
        ECHO: {
          actions: () => console.log('echo, echo'),
        },
      },
    },
  },
})

const service = interpret(echoMachine).start()

service.send({ type: 'ECHO' })
