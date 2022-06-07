// 12. Use Services to Run Ongoing Side Effects

import { createMachine, interpret } from 'xstate'

const alarmClockMachine = createMachine(
  {
    id: 'alarmClock',
    initial: 'idle',
    states: {
      idle: {
        on: { ALARM: 'alarming' },
      },
      alarming: {
        invoke: { src: 'beeping' },
        on: { STOP: 'idle' },
      },
    },
  },
  {
    services: {
      beeping: (context, event) => {
        function beep() {
          console.log('beep')
        }

        const interval = setInterval(beep, 1000)

        return () => {
          clearInterval(interval)
        }
      },
    },
  }
)

const service = interpret(alarmClockMachine).start()

service.send('ALARM')

setTimeout(() => service.send('STOP'), 4000)
