// 14. Simplify State Explosion Through Hierarchical States

import { createMachine, interpret } from 'xstate'

const door = createMachine({
  id: 'door',
  initial: 'locked',
  states: {
    // locked: {},
    // unlocked: {},
    // closed: {},
    // opened: {},
    locked: {
      id: 'locked',
      on: {
        UNLOCK: 'unlocked',
      },
    },
    unlocked: {
      initial: 'closed',
      states: {
        closed: {
          // on: { LOCK: '#door.locked', OPEN: 'opened' },
          on: { LOCK: '#locked', OPEN: 'opened' },
        },
        opened: {
          on: { CLOSE: 'closed' },
        },
      },
    },
  },
})

const service = interpret(door).start()

service.onTransition((state) => {
  console.log(state.value)
})

service.send('UNLOCK')
service.send('OPEN')
service.send('CLOSE')
service.send('LOCK')
