// 13. Conditionally Transition to States With Guards

import { assign, createMachine, interpret } from 'xstate'

const vendingMachine = createMachine(
  {
    id: 'vendingMachine',
    initial: 'idle',
    context: {
      deposited: 0,
    },
    states: {
      idle: {
        on: {
          // SELECT_ITEM: 'vending',
          SELECT_ITEM: {
            target: 'vending',
            // cond: (context) => context.deposited >= 100,
            cond: 'depositedEnough',
          },
          DEPOSIT_QUARTER: { actions: 'addQuarter' },
        },
      },
      vending: {},
    },
  },
  {
    actions: {
      addQuarter: assign({
        deposited: (context) => context.deposited + 25,
      }),
    },
    guards: {
      depositedEnough: (context) => context.deposited >= 100,
    },
  }
)

const service = interpret(vendingMachine).start()

service.onTransition((state) => {
  console.log(state.value, state.context)
})

service.send('SELECT_ITEM')

service.send('DEPOSIT_QUARTER')
service.send('DEPOSIT_QUARTER')
service.send('DEPOSIT_QUARTER')
service.send('DEPOSIT_QUARTER')

service.send('SELECT_ITEM')
