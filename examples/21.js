// 21. Invoke Child Machines From a Parent Machine

import { createMachine, interpret, send } from 'xstate'

const parentMachine = createMachine({
  id: 'parent',
  initial: 'idle',
  states: {
    idle: {
      on: { ACTIVATE: 'active' },
    },
    active: {
      invoke: {
        id: 'child',
        src: childMachine,
        onDone: 'done',
      },
      on: {
        STEP: {
          actions: send('STEP', { to: 'child' }),
        },
      },
    },
    done: {},
  },
})

const childMachine = createMachine({
  id: 'child',
  initial: 'step1',
  states: {
    step1: { on: { STEP: 'step2' } },
    step2: { on: { STEP: 'step3' } },
    step3: { type: 'final' },
  },
})

const service = interpret(parentMachine).start()

service.send('ACTIVATE')
