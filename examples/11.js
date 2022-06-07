// 11. How Action Order Affects Assigns to Context

import { assign, createMachine, interpret } from 'xstate'

const doubleCounterMachine = createMachine(
  {
    initial: 'idle',
    context: {
      count: 0,
      previousCount: undefined,
    },
    states: {
      idle: {
        on: {
          INC_COUNT_TWICE: {
            actions: [
              // (context) => console.log('before', context.count),
              (context) => console.log('before', context.previousCount),
              'setPreviousCount',
              'incCount',
              'incCount',
              (context) => console.log('after', context.count),
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      incCount: assign({
        count: (context) => context.count + 1,
      }),
      setPreviousCount: assign({
        previousCount: (context) => context.count,
      }),
    },
  }
)

const service = interpret(doubleCounterMachine).start()

service.send('INC_COUNT_TWICE')
