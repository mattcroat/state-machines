// 08. Use Internal Transitions to Avoid State Exit and Re-Entry

import { createMachine, interpret } from 'xstate'

const idleMachine = createMachine(
  {
    id: 'idle',
    initial: 'idle',
    states: {
      idle: {
        entry: 'logEntry',
        exit: 'logExit',
      },
    },
    on: {
      DO_NOTHING: '.idle',
    },
  },
  {
    actions: {
      logEntry: () => console.log('entered'),
      logExit: () => console.log('exited'),
    },
  }
)

const service = interpret(idleMachine).start()

service.send('DO_NOTHING')
