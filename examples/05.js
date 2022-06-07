// 05. Add Actions to Transitions to Fire Side Effects

import { createMachine, interpret } from 'xstate'

const lightBulbMachine = createMachine(
  {
    id: 'lightBulb',
    initial: 'unlit',
    states: {
      lit: {
        on: {
          BREAK: {
            target: 'broken',
            actions: 'logBroken',
          },
          TOGGLE: 'unlit',
        },
      },
      unlit: {
        on: {
          BREAK: {
            target: 'broken',
            // actions: (context, state) => console.log(context, state),
            actions: 'logBroken',
          },
          TOGGLE: 'lit',
        },
      },
      broken: {},
    },
  },
  {
    actions: {
      logBroken: (context, event) => console.log(`broke in ${event.location}`),
    },
  }
)

const service = interpret(lightBulbMachine).start()

service.onTransition((state) => {
  console.log(state.value)
})

service.send({
  type: 'BREAK',
  location: 'office',
})
