// 10. Track Infinite States With Context

import { assign, createMachine, interpret } from 'xstate'

const multiColoredBulb = createMachine(
  {
    id: 'multiColoredBulb',
    initial: 'unlit',
    context: {
      color: '#fff',
    },
    states: {
      lit: {
        on: {
          BREAK: 'broken',
          TOGGLE: 'unlit',
          CHANGE_COLOR: {
            // actions: assign({ color: '#f00' }),
            // actions: assign({
            //   color: (context, event) => event.color,
            // }),
            // actions: assign((context, event) => ({
            //   color: event.color,
            // })),
            actions: 'changeColor',
          },
        },
      },
      unlit: {
        on: {
          BREAK: 'broken',
          TOGGLE: 'lit',
        },
      },
      broken: {},
    },
  },
  {
    actions: {
      changeColor: assign((context, event) => ({
        color: event.color,
      })),
    },
  }
)

const service = interpret(multiColoredBulb).start()

service.onTransition((state) => {
  console.log(state.value, state.context)
})

service.send('TOGGLE')
service.send({ type: 'CHANGE_COLOR', color: '#0f0' })
