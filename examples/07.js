// 07. Replace Inline Functions With String Shorthands

import { createMachine, interpret } from 'xstate'

// const logLocation = (context, event) => {
//   console.log(event.location)
// }

// const buyANewBulb = () => {
//   console.log('buy a new bulb')
// }

const lightBulbMachine = createMachine(
  {
    id: 'lightBulb',
    initial: 'unlit',
    states: {
      lit: {
        on: {
          BREAK: 'broken',
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
        // entry: [logLocation, buyANewBulb],
        entry: ['logLocation', 'buyANewBulb'],
      },
    },
  },
  {
    actions: {
      logLocation: (context, event) => {
        console.log(event.location)
      },
      buyANewBulb: () => {
        console.log('buy a new bulb')
      },
    },
  }
)

const service = interpret(lightBulbMachine).start()

service.send({
  type: 'BREAK',
  location: 'office',
})
