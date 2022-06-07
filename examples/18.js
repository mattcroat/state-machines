// 18. Delay Events And Transitions

import { assign, createMachine, interpret } from 'xstate'

const stoplightMachine = createMachine(
  {
    id: 'stoplight',
    initial: 'red',
    context: {
      rushHourMultiplier: 1,
    },
    on: {
      INC_RUSH_HOUR: {
        actions: 'incRushHour',
      },
    },
    states: {
      green: { after: { GREEN_TIMER: 'yellow' } },
      yellow: { after: { YELLOW_TIMER: 'red' } },
      red: { after: { RED_TIMER: 'green' } },
    },
  },
  {
    actions: {
      incRushHour: assign({
        rushHourMultiplier: (context) => context.rushHourMultiplier + 1,
      }),
    },
    delays: {
      GREEN_TIMER: (context) => context.rushHourMultiplier * 3000,
      YELLOW_TIMER: (context) => context.rushHourMultiplier * 1000,
      RED_TIMER: (context) => context.rushHourMultiplier * 4000,
    },
  }
)

const service = interpret(stoplightMachine).start()
