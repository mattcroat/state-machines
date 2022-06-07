// 17. Null Events And Transient Transitions to Immediately Transition States

import { assign, createMachine, interpret } from 'xstate'

const ifAtFirstYouDontSucceed = createMachine(
  {
    id: 'tryAgain',
    initial: 'idle',
    context: {
      tries: 0,
    },
    states: {
      idle: {
        on: { TRY: 'trying' },
      },
      trying: {
        entry: 'incTries',
        on: {
          '': [{ target: 'success', cond: 'triedEnough' }, { target: 'idle' }],
        },
      },
      success: {},
    },
  },
  {
    actions: {
      incTries: assign({ tries: (context) => context.tries + 1 }),
    },
    guards: {
      triedEnough: (context) => context.tries > 2,
    },
  }
)

const service = interpret(ifAtFirstYouDontSucceed).start()
