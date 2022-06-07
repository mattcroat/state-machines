// 04. Use an Interpreter to Instantiate a Machine

import { createMachine, interpret } from 'xstate'

const lit = {
  on: {
    BREAK: 'broken',
    TOGGLE: 'unlit',
  },
}
const unlit = {
  on: {
    BREAK: 'broken',
    TOGGLE: 'lit',
  },
}
const broken = {}

const states = { lit, unlit, broken }

const initial = 'unlit'

const config = {
  id: 'lightBulb',
  initial,
  states,
  strict: true,
}

const lightBulbMachine = createMachine(config)

const service = interpret(lightBulbMachine).start()

// const nextState = service.send('TOGGLE')
// console.log(nextState)

// service.send('TOGGLE')
// console.log(service.state)

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value)
  }

  if (state.matches('broken')) {
    console.log(`this is why we can't have nice things`)
  }
})

service.send('TOGGLE')
service.send('TOGGLE')
service.send('BREAK')
service.send('BREAK')
