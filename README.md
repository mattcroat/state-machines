# State Machines

## Bottom-up Code

bottom-up code technique

- app logic inside event handlers or wherever the pertinent user action occurs
- you could have a button fire events that shouldn't be fired after it's clicked once so you maybe disable it
- problem is now the application logic lives inside the event handler and is spread out through the app as you add more code instead of properly - modeling application logic
- lack of flexible, maintainable, reusable logic
- difficult to test
- difficult to understand
- combinatorial explosion

## Why Use State Machines and Statecharts

- visualized modeling
- precise diagrams
- automatic code generation
- comprehensive test coverage
- accomodation of late-breaking requirements changes
- reducing logic and event handlers to one thing

## Finite State Machines

- state is one mode or status at a time (sleeping and awake but not both)
- transitions is how you go between states (idle to pending, pending to resolved or pending to rejected) where you can't go back
- events describe how one state can go to another state (idle state can - only go to the pending state when a fetch event happens) which is considered a transition between those states
- every state machine starts with a single state (pseudo-transition)
- final states represent when your state machine is done

## Using Switch Statements

- instead of doing the bottom-up approach or event-action approach we don't start with the event but what the finite state is (behavior of your app)

## Using Objects

- each transition is going to be an object where the key is the event and the value is the next state that's going to happen

## Interpreting State Machines

- interpreter takes a state machine and keeps track of state

## Modeling States

- how would we design or model the state machine in the first place
- there's an initial state
- first you want to add what states, modes or behaviors should the application be in at one given time only one state at a time
- after that start filling events
- set up machine and interpret events

## Adding Transitions

- in order to transition we can say when this event happens and give it a key of the sibling using the shorthand `EVENT: 'target'` instead of saying `EVENT: { target: 'target' }`
- an event is something that we send to the machine can be a plain string or it can be an event object if you want to pass a payload

## Interpreting Machines and Creating a Service

- keeping track of state is fragile
- xstate provides an `interpret` function that creates a service
- a service is a running instance of a machine
- machine is like a blueprint for your logic and a service is a single - instance of that machine
- when you create a machine it's a stateless pure object where a service holds state (fancy JSON object)
- you can add listeners to it but you have to start the service
- when you're done using a service you can invoke stop to cleanup everything
- think of it as a singleton

## Visualizing State Machines

- [https://stately.ai/viz](https://stately.ai/viz)
- there's also the [Stately editor](https://stately.ai/editor?source=landing-page)
- [XState VS Code](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode) plugin

## Actions

- an action is a side-effect, fire and forget, something that happens, output of the state machine
- as you're moving through the state machine things might happen and we want to keep track of those things in a transition between states
- three locations where actions happens include transition actions, entry and exit actions
- action order is exit, transition, entry
- transitions added in the actions property that takes a context and event
  state node can have an entry and exit property
- you can specify a single action or an array of actions
- specify actions inside an options objects

## Statecharts

- statecharts solve finite state machines scaling problem because of many states that have many connections between the states and no way of grouping them or representing that more than one state can be active at one time
- [Statecharts: A visual formalism for complex systems](https://vdoc.pub/documents/statecharts-a-visual-formalism-for-complex-systems-7df6cgthbgk0)
- better way of representing state machines that could have many states
- finite state is qualitative data such as on or off
- extended state describes quantitative data that's potentially infinite
- xstate calls this context for contextual state
- assignment is a side-effect (action) used to change the contextual state
- two ways of writing an assign action using an object or a function but prefer the object syntax

## Guarded Transitions

- transitions that have a conditional guard which is called `cond` and that guards tells us whether or not the transition is allowed

## Transient Transitions

- automatically taken once you enter a state
- most useful when used with conditionals
- if you have a guarded transition you can immediately choose where to go next
- transition guards are inside brackets
- in XState the property key is an empty string

## Delayed Transition

- transitions happen in zero time so they're never asynchronous

## Hierarchical States

- primary feature of statecharts is that you can nest states in each other

## History States

- once the machine is off it doesn't remember the last state
  lets you go to the last visited child state of a parent state

## Parallel States

- orthogonal states
- representing a combination of states in a much simpler way
- simplifying the combinatorial explosion of states which are otherwise orthogonal to each other

## The Actor Model

- actor is a thing that can send a message to another actor, have child actors, change its behavior in response to a message
- in general when you are invoking something that might call the machine back with an event you want to invoke it instead
- special property of invocations is that anything inside is going to get cleaned up after you leave the state
