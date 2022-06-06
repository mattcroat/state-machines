<script>
  // @ts-nocheck

  import { createMachine, interpret } from 'xstate'

  const feedbackMachine = createMachine({
    initial: 'question',
    states: {
      question: {
        on: {
          CLICK_GOOD: {
            target: 'thanks',
          },
        },
      },
      form: {},
      thanks: {},
      closed: {},
    },
  })

  /*
    console.log(feedbackMachine.initialState)

    const clickGoodEvent = {
      type: 'CLICK_GOOD',
      time: Date.now(),
    }

    const nextState = feedbackMachine.transition(
      feedbackMachine.initialState,
      clickGoodEvent
    )

    console.log(nextState)
    */

  const feedbackService = interpret(feedbackMachine)

  feedbackService.onTransition((state) => {
    console.log(state.value)
  })

  feedbackService.start()

  // window.send = feedbackService.send

  feedbackService.send({
    type: 'CLICK_GOOD',
  })
</script>

<h1>Exercise 01 - Creating a state machine</h1>
