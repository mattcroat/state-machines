// 06. Trigger Actions When Entering and Exiting State

import { createMachine, interpret } from 'xstate'

const lightBulbMachine = createMachine(
  {
    id: 'lightBulb',
    initial: 'unlit',
    states: {
      lit: {
        exit: () => {
          console.log('so dark and so cold')
        },
        on: {
          BREAK: {
            target: 'broken',
            actions: () => {
              console.log('transitioning to broken')
            },
          },
          TOGGLE: 'unlit',
        },
      },
      unlit: {
        on: {
          BREAK: 'broken',
          TOGGLE: 'lit',
        },
      },
      broken: {
        entry: 'logBroken',
      },
    },
  },
  {
    actions: {
      logBroken: (context, event) => console.log(`broke in ${event.location}`),
    },
  }
)

const service = interpret(lightBulbMachine).start()

service.send('TOGGLE')

service.send({
  type: 'BREAK',
  location: 'office',
})
