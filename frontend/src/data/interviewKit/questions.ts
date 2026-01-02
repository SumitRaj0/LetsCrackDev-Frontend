/**
 * JavaScript Interview Mastery Kit - Questions Data
 * Add questions here phase by phase
 */

import { InterviewQuestion } from '@/types/interviewKit'

// Note: Data intentionally starts from question1 below (no unused sample objects)

/**
 * All interview questions for JavaScript Interview Mastery Kit
 * Questions 1-10: Core JavaScript Concepts
 */

// Question 1: What is an Execution Context?
const question1: InterviewQuestion = {
  id: '1',
  title: 'What is an Execution Context?',
  coreConcept: {
    content:
      'An Execution Context is an environment where JavaScript code is evaluated and executed. Every time JavaScript runs code, it does so inside an execution context. There are three types: Global Execution Context (GEC), Function Execution Context (FEC), and Eval Execution Context (rarely used).',
  },
  howItWorks: {
    items: [
      'JavaScript executes code in two phases: Creation Phase and Execution Phase',
      'Creation Phase: Memory is allocated for variables (undefined), functions are stored with full definitions, this value is determined, scope chain is created',
      'Execution Phase: Code runs line by line, variables get actual values, function calls create new execution contexts',
    ],
  },
  interviewReadyAnswer: {
    content:
      'In JavaScript, an execution context is the environment in which code is executed. When a program runs, JavaScript first creates the global execution context. Execution happens in two phases: the creation phase and the execution phase. In the creation phase, memory is allocated for variables and functions, with variables initialized as undefined. In the execution phase, code runs line by line and values are assigned. Every time a function is called, a new execution context is created and pushed onto the call stack.',
  },
  visualUnderstanding: {
    description: 'Call Stack visualization showing execution contexts',
    diagram: `Call Stack
-----------
|  func()  |
|  Global  |
-----------

Global context is created first
Each function call adds a new context
Finished contexts are removed from the stack`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the difference between execution context and scope?',
      'What happens to an execution context when a function returns?',
      'Where does this get its value inside an execution context?',
    ],
    edgeCases: [
      'Nested function calls creating multiple contexts on the call stack',
      'Arrow functions: lexical this but still executed inside a function context',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying execution context and call stack are the same',
      'Saying variables are created in execution phase',
      'Jumping into event loop unnecessarily',
    ],
    redFlagAnswers: [
      'Explaining only “call stack” and not the creation/execution phases',
      'Mixing execution context with async/event loop concepts',
    ],
  },
}

// Question 2: What is the Global Execution Context?
const question2: InterviewQuestion = {
  id: '2',
  title: 'What is the Global Execution Context?',
  coreConcept: {
    content:
      'The Global Execution Context is the default execution context created when JavaScript starts running.',
  },
  howItWorks: {
    items: [
      'Created before any code executes',
      'Attaches variables and functions to the global scope',
      'Determines the global this value',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The global execution context is the first execution context created when a JavaScript program runs. It creates the global scope, sets up memory for variables and functions, and determines the global this value. All other execution contexts are created inside the global execution context.',
  },
  visualUnderstanding: {
    description: 'Global Execution Context structure',
    diagram: `Global Execution Context (GEC)
    │
    ├── Global Scope
    │   ├── Variables
    │   └── Functions
    │
    ├── this → window (browser) / global (Node)
    │
    └── All other contexts created inside GEC`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the value of this in the global context in browser vs Node?',
      'What does “global scope” mean in modules vs scripts?',
    ],
    edgeCases: [
      'Top-level variables in ES modules do not attach to window',
      'Strict mode changes some global this behaviors',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Saying GEC is created multiple times', 'Confusing browser global object with Node.js global'],
    redFlagAnswers: ['Assuming window and global are the same environment'],
  },
}

// Question 3: Explain Hoisting in JavaScript
const question3: InterviewQuestion = {
  id: '3',
  title: 'Explain Hoisting in JavaScript',
  coreConcept: {
    content:
      'Hoisting is JavaScript\'s behavior of allocating memory for declarations before code execution.',
  },
  howItWorks: {
    items: [
      'Happens during the creation phase',
      'var → hoisted and initialized as undefined',
      'let / const → hoisted but uninitialized (TDZ)',
      'Function declarations → fully hoisted',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Hoisting happens because JavaScript allocates memory for variables and functions before executing code. Function declarations are fully hoisted, var variables are hoisted and initialized as undefined, while let and const are hoisted but not initialized, which leads to the temporal dead zone.',
  },
  visualUnderstanding: {
    description: 'Hoisting affects declarations, not assignments',
    diagram: `Creation Phase (memory setup)
  var x        -> undefined
  function fn  -> stored fully
  let y        -> uninitialized (TDZ)

Execution Phase (runs line-by-line)
  x = 10
  y = 20`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Are function expressions hoisted the same way as function declarations?',
      'What is the Temporal Dead Zone and why does it exist?',
      'What exactly is hoisted: declarations or assignments?',
    ],
    edgeCases: [
      'Block-scoped function declarations in strict mode',
      'Accessing let/const before initialization throws ReferenceError',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying JavaScript moves code to the top',
      'Treating var and let the same',
    ],
    redFlagAnswers: ['Explaining hoisting without mentioning the creation phase / memory allocation'],
  },
}

// Question 4: What is the Temporal Dead Zone (TDZ)?
const question4: InterviewQuestion = {
  id: '4',
  title: 'What is the Temporal Dead Zone (TDZ)?',
  coreConcept: {
    content:
      'The Temporal Dead Zone is the time between entering a scope and initializing a let or const variable.',
  },
  howItWorks: {
    items: [
      'Variable exists but is inaccessible',
      'Accessing it throws a ReferenceError',
      'Prevents usage before declaration',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The temporal dead zone is the period between entering a scope and initializing a let or const variable. Although the variable is hoisted, accessing it before initialization results in a ReferenceError. TDZ helps prevent bugs caused by using variables too early.',
  },
  visualUnderstanding: {
    description: 'Temporal Dead Zone timeline',
    diagram: `Timeline:
    │
    ├── Enter Scope
    │   └── Variable hoisted (exists but uninitialized)
    │
    ├── TDZ (Temporal Dead Zone) [DO NOT ACCESS]
    │   └── Accessing → ReferenceError
    │
    └── Variable Initialization
        └── Variable accessible ✓`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why does accessing let/const before initialization throw ReferenceError instead of undefined?',
      'Does TDZ apply to function declarations?',
    ],
    edgeCases: [
      'Shadowing a variable name can create a TDZ in an inner block',
      'Default parameter expressions can create TDZ-like behavior for later params',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying the variable doesn\'t exist',
      'Thinking TDZ applies to var',
    ],
    redFlagAnswers: ['Saying “let/const are not hoisted” (they are hoisted but uninitialized)'],
  },
}

// Question 5: What is Lexical Scope?
const question5: InterviewQuestion = {
  id: '5',
  title: 'What is Lexical Scope?',
  coreConcept: {
    content:
      'Lexical scope means variables are resolved based on where they are written in the code, not how or when functions are called.',
  },
  howItWorks: {
    items: [
      'Scope is determined at compile time',
      'Inner functions can access outer scope variables',
      'Outer scopes cannot access inner scope variables',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Lexical scope means that variable access is determined by the physical structure of the code. Inner functions can access variables from their outer scopes, but not the other way around. This scope behavior is fixed at compile time and enables features like closures.',
  },
  visualUnderstanding: {
    description: 'Lexical scope chain visualization',
    diagram: `Global Scope
    │
    ├── var globalVar
    │
    └── Function Scope (Outer)
        │
        ├── var outerVar
        │
        └── Function Scope (Inner)
            │
            ├── var innerVar
            │
            └── Can access: globalVar, outerVar, innerVar
            └── Outer cannot access: innerVar`,
  },
  interviewerLens: {
    followUpQuestions: [
      'How does lexical scope enable closures?',
      'What is the difference between scope and execution context?',
    ],
    edgeCases: [
      'Variable shadowing in nested scopes',
      'Accessing identifiers declared later with let/const (TDZ)',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Explaining scope using runtime behavior only',
      'Mixing scope with execution context',
    ],
    redFlagAnswers: ['Explaining scope by “how functions are called” (dynamic scope)'],
  },
}

// Question 6: What is a Closure?
const question6: InterviewQuestion = {
  id: '6',
  title: 'What is a Closure?',
  coreConcept: {
    content:
      'A closure is created when a function remembers variables from its lexical scope, even after the outer function has finished executing.',
  },
  howItWorks: {
    items: [
      'Functions capture variables from their surrounding scope',
      'References are retained, not copies',
      'Variables stay in memory as long as the closure exists',
    ],
  },
  interviewReadyAnswer: {
    content:
      'A closure is formed when an inner function retains access to variables from its outer function\'s scope, even after the outer function has finished executing. This happens because JavaScript uses lexical scoping, allowing functions to remember the environment in which they were created. Closures are commonly used for data encapsulation, state management, and callbacks.',
  },
  visualUnderstanding: {
    description: 'Closure maintains access to outer scope variables',
    diagram: `Outer Function
---------------
let count = 0

Inner Function
---------------
uses count

The inner function keeps access to count even after the outer function completes.`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Do closures capture values or references?',
      'How do closures behave in loops with var vs let?',
      'When can closures cause memory retention?',
    ],
    edgeCases: [
      'Closures inside loops causing the “same value” bug with var',
      'Closures captured by long-lived listeners/timers',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying closures store copies of values',
      'Thinking closures only exist in callbacks',
    ],
    redFlagAnswers: ['Defining closure without mentioning lexical scope retention'],
  },
}

// Question 7: What is the Call Stack?
const question7: InterviewQuestion = {
  id: '7',
  title: 'What is the Call Stack?',
  coreConcept: {
    content:
      'The call stack is a LIFO (Last In, First Out) structure that tracks function execution in JavaScript.',
  },
  howItWorks: {
    items: [
      'Each function call is pushed onto the stack',
      'When a function finishes, it is popped off',
      'Stack overflow occurs with uncontrolled recursion',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The call stack is a data structure that manages function execution in JavaScript. Each time a function is called, it is added to the top of the stack, and once it finishes executing, it is removed. Because JavaScript is single-threaded, the call stack ensures that only one function runs at a time.',
  },
  visualUnderstanding: {
    description: 'Call Stack structure showing function execution order',
    diagram: `Call Stack
-----------
| funcB() |
| funcA() |
| Global  |
-----------`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What causes “Maximum call stack size exceeded”?',
      'How does recursion relate to stack overflow?',
      'Where do Promise callbacks execute relative to the call stack?',
    ],
    edgeCases: [
      'Deep recursion vs iterative loops',
      'Long synchronous tasks blocking the UI thread',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Confusing call stack with event loop',
      'Saying async code runs in the stack directly',
    ],
    redFlagAnswers: [
      'Saying “async functions run on a different stack” (they still resume on the same thread)',
      'Mixing call stack with microtask queue concepts',
    ],
  },
}

// Question 8: How does `this` work in JavaScript?
const question8: InterviewQuestion = {
  id: '8',
  title: 'How does `this` work in JavaScript?',
  coreConcept: {
    content:
      'this refers to the execution context of a function, determined by how the function is called, not where it is written.',
  },
  howItWorks: {
    items: [
      'Method call → object reference',
      'Function call → global or undefined (strict mode)',
      'Constructor → new instance',
      'Arrow functions → inherit this lexically',
    ],
  },
  interviewReadyAnswer: {
    content:
      'In JavaScript, the value of this depends on how a function is invoked. For object methods, it refers to the object. For constructors, it refers to the newly created instance. Arrow functions do not have their own this and instead inherit it from the surrounding scope.',
  },
  visualUnderstanding: {
    description: 'Different `this` binding contexts',
    diagram: `this Binding:
    │
    ├── Method Call: obj.method()
    │   └── this → obj
    │
    ├── Function Call: func()
    │   └── this → window (or undefined in strict)
    │
    ├── Constructor: new Func()
    │   └── this → new instance
    │
    └── Arrow Function: () => {}
        └── this → inherited from outer scope`,
  },
  interviewerLens: {
    followUpQuestions: [
      'How do call/apply/bind change this?',
      'What is this inside event handlers in the browser?',
      'Why is using arrow functions as object methods sometimes a bug?',
    ],
    edgeCases: [
      'Losing this when passing a method as a callback (this becomes undefined/global)',
      'Class methods needing binding when used as callbacks',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Assuming this is static',
      'Using arrow functions as object methods blindly',
    ],
    redFlagAnswers: ['Explaining this based on where the function is written (it depends on call-site)'],
  },
}

// Question 9: Explain the Event Loop
const question9: InterviewQuestion = {
  id: '9',
  title: 'Explain the Event Loop',
  coreConcept: {
    content:
      'The event loop enables JavaScript to handle asynchronous operations without blocking the main thread.',
  },
  howItWorks: {
    items: [
      'Synchronous code runs first on the call stack',
      'Microtasks (Promises) run next',
      'Macrotasks (timers, I/O) run after',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The event loop is responsible for executing asynchronous code in JavaScript. It continuously checks whether the call stack is empty, then processes pending microtasks first, followed by macrotasks. This is why Promise callbacks execute before setTimeout.',
  },
  visualUnderstanding: {
    description: 'Event Loop processing order',
    diagram: `Call Stack → Microtask Queue → Task Queue

Synchronous code runs first
Then microtasks (Promises)
Finally macrotasks (setTimeout, I/O)`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why do Promise callbacks run before setTimeout?',
      'What is a microtask starvation scenario?',
    ],
    edgeCases: [
      'Long-running synchronous code blocks the event loop',
      'Too many microtasks can delay rendering and timers',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying JavaScript is multithreaded',
      'Ignoring microtask priority',
    ],
    redFlagAnswers: ['Mixing call stack, event loop, and Web APIs as the same thing'],
  },
}

// Question 10: Promises vs async/await
const question10: InterviewQuestion = {
  id: '10',
  title: 'Promises vs async/await — what\'s the real difference?',
  coreConcept: {
    content:
      'Both are ways to handle asynchronous operations, but async/await improves readability, not performance.',
  },
  howItWorks: {
    items: [
      'Promises use .then() chaining',
      'async/await pauses function execution logically',
      'Both rely on the same Promise mechanism',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Promises represent future values and use .then() for chaining, while async/await is syntax sugar that makes Promise-based code easier to read and maintain. Async/await improves error handling with try/catch, but it does not make code execute in parallel by default.',
  },
  visualUnderstanding: {
    description: 'Promises vs async/await comparison',
    diagram: `Promises:
    fetch().then().then().catch()
    
    async/await:
    async function() {
      const data = await fetch()
      return data
    }
    
    Both compile to the same Promise mechanism`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Does async/await run in parallel by default?',
      'How do you run multiple awaits concurrently?',
      'How does try/catch behave with awaited Promises?',
    ],
    edgeCases: [
      'Sequential awaits inside loops causing slow execution',
      'Forgetting to return a Promise in a then chain',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying await makes code faster',
      'Forgetting Promise.all for parallel work',
    ],
    redFlagAnswers: ['Saying “async/await is different from Promises internally” without explaining it is syntax sugar'],
  },
}

// Question 11: Hoisting in practice (declarations vs initialization)
const question11: InterviewQuestion = {
  id: '11',
  title: 'Hoisting in practice: declarations vs initialization',
  coreConcept: {
    content:
      'Hoisting is about what the engine prepares in memory during the creation phase. The key interview point is: declarations are hoisted, but initialization depends on the keyword and form.',
  },
  howItWorks: {
    items: [
      'Function declarations are fully hoisted with their body',
      'var declarations are hoisted and initialized to undefined',
      'let/const declarations are hoisted but left uninitialized (TDZ) until the declaration runs',
      'Function expressions behave like variables: only the variable is hoisted, not the function value',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Hoisting is the result of JavaScript setting up memory in the creation phase before executing code. Function declarations are hoisted with their full definition, so you can call them before they appear. var is hoisted and initialized to undefined, which is why accessing it early gives undefined. let and const are also hoisted, but they are uninitialized until the declaration runs, which creates the temporal dead zone and throws a ReferenceError if accessed early. Function expressions follow variable rules: the variable is hoisted, but the function value is assigned later.',
  },
  visualUnderstanding: {
    description: 'Hoisting during creation phase',
    diagram: `Creation Phase
--------------
var a → undefined
function fn() → stored fully`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What is hoisted for a function expression like const f = function() {}?',
      'Why does let/const throw ReferenceError instead of undefined?',
    ],
    edgeCases: [
      'Calling a function expression before assignment',
      'Shadowing with let can create TDZ inside a block',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying code is "moved to the top"',
      'Ignoring creation vs execution phases',
    ],
    redFlagAnswers: ['Treating “hoisting” as a text transformation instead of memory setup'],
  },
}

// Question 12: TDZ in real code (shadowing + practical pitfalls)
const question12: InterviewQuestion = {
  id: '12',
  title: 'TDZ in real code: shadowing and common pitfalls',
  coreConcept: {
    content:
      'TDZ is the window where a let/const binding exists but is uninitialized. In real code, TDZ bugs often show up due to shadowing or accessing a name too early in a block.',
  },
  howItWorks: {
    items: [
      'Entering a block creates bindings for let/const declarations in that block',
      'Until the declaration line executes, the binding is in TDZ',
      'Any access during TDZ throws ReferenceError (even typeof)',
      'Shadowing an outer variable name can create TDZ unexpectedly inside the inner scope',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The temporal dead zone is the time between entering a scope and the moment a let or const declaration is initialized. During this window the binding exists, but it is uninitialized, and accessing it throws a ReferenceError. In real code, TDZ issues commonly happen due to shadowing, where an inner block declares a let with the same name as an outer variable and you accidentally access it before the declaration runs. TDZ exists to prevent subtle bugs by making “use before initialization” a hard error instead of silently returning undefined.',
  },
  visualUnderstanding: {
    description: 'Shadowing can trigger TDZ',
    diagram: `let x = 10
{
  // TDZ for inner x starts here
  // console.log(x) -> ReferenceError
  let x = 20
}`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Does typeof protect you from TDZ?',
      'How can shadowing create TDZ unexpectedly?',
    ],
    edgeCases: [
      'Accessing a let/const in a block before its declaration',
      'Using the same identifier name in nested blocks',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying the variable does not exist',
      'Confusing TDZ with hoisting absence',
    ],
    redFlagAnswers: ['Saying “TDZ means hoisting doesn’t happen”'],
  },
}

// Question 13: What is Scope in JavaScript?
const question13: InterviewQuestion = {
  id: '13',
  title: 'What is Scope in JavaScript?',
  coreConcept: {
    content:
      'Scope defines where a variable can be accessed in your code. In JavaScript, scope is determined lexically (by where code is written) and organized as a chain of nested environments.',
  },
  howItWorks: {
    items: [
      'Global scope: accessible anywhere (use carefully)',
      'Function scope: variables declared with var are scoped to the function',
      'Block scope: let/const are scoped to blocks like if/for',
      'Nested scopes form a scope chain used for identifier lookup',
      'Shadowing happens when an inner scope declares a variable with the same name',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Scope defines where a variable is accessible in JavaScript. JavaScript uses lexical scoping, so the scope is decided by the structure of the code, not by runtime call order. You mainly deal with global scope, function scope, and block scope. When code tries to use an identifier, JavaScript looks in the current scope first and then walks outward through the scope chain until it finds it or reaches the global scope. Understanding scope is critical for predicting behavior in closures, avoiding accidental globals, and writing bug-free async code.',
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the difference between scope and execution context?',
      'What is shadowing and why can it be dangerous?',
      'Why does var behave differently inside blocks?',
    ],
    edgeCases: [
      'Function declarations inside blocks and strict mode differences',
      'Accidental globals created by missing declarations (non-strict code)',
    ],
    whatIfScenarios: [
      'What happens when a variable is not found in any scope?',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Explaining scope only at runtime',
      'Ignoring block scope',
    ],
    redFlagAnswers: ['Mixing scope with call stack or event loop concepts'],
    overEngineeringMistakes: ['Overusing global variables instead of passing data explicitly'],
  },
}

// Question 14: What is Lexical Scope? (Note: Similar to Q5 but with different focus)
const question14: InterviewQuestion = {
  id: '14',
  title: 'Lexical scope vs dynamic scope (what JS actually does)',
  coreConcept: {
    content:
      'Lexical scope means identifier lookup is based on where code is written. A function “remembers” the scope it was defined in, which is why closures work reliably.',
  },
  howItWorks: {
    items: [
      'Scopes are created during compilation/creation (before execution)',
      'Inner scopes can access outer bindings via the scope chain',
      'Outer scopes cannot access identifiers defined only inside inner scopes',
      'This is different from dynamic scope (which JavaScript does not use)',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Lexical scope means variable access is determined by the physical structure of the source code. When you define a function inside another function, the inner function can access variables from the outer function because of the lexical scope chain. This relationship is fixed based on where the code is written, not on how it is called at runtime. That’s exactly why closures work: a function can still access bindings from its defining scope even after the outer function has returned.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How is lexical scope different from execution context?',
      'How does lexical scope enable closures?',
    ],
    edgeCases: [
      'Lexical scope inside modules vs scripts',
      'Shadowing variables in nested scopes',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Mixing lexical scope with dynamic scope',
    ],
    redFlagAnswers: ['Explaining scope only using “when the function is called”'],
  },
}

// Question 15: Difference between var, let, and const
const question15: InterviewQuestion = {
  id: '15',
  title: 'Difference between `var`, `let`, and `const`',
  coreConcept: {
    content:
      'var, let, and const differ in scope rules, initialization/hoisting behavior, and reassignment. In modern code, let/const are preferred for predictable block scoping.',
  },
  howItWorks: {
    items: [
      'var → function-scoped, hoisted as undefined',
      'let → block-scoped, TDZ',
      'const → block-scoped, cannot be reassigned',
      'var allows redeclaration; let/const do not in the same scope',
      'In browsers, top-level var attaches to window; let/const do not',
    ],
  },
  interviewReadyAnswer: {
    content:
      'var is function-scoped and hoisted with an initial value of undefined, which can create subtle bugs. let and const are block-scoped, and they are hoisted too, but remain uninitialized until the declaration runs, which is the temporal dead zone. const prevents reassignment, but it does not make objects immutable — it only locks the binding. In practice, use const by default, use let when reassignment is required, and avoid var in modern code.',
  },
  interviewerLens: {
    followUpQuestions: [
      'Why does let/const have a TDZ?',
      'Does const make objects immutable?',
      'What happens with top-level declarations in the browser?',
    ],
    edgeCases: [
      'Re-declaration errors in the same scope',
      'Mutating a const object vs reassigning it',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying const means constant value',
    ],
    redFlagAnswers: ['Treating var and let as the same thing'],
  },
}

// Question 16: What is an IIFE?
const question16: InterviewQuestion = {
  id: '16',
  title: 'What is an IIFE?',
  coreConcept: {
    content:
      'An IIFE (Immediately Invoked Function Expression) is a function expression that runs immediately to create a private scope and avoid leaking variables into the outer scope.',
  },
  howItWorks: {
    items: [
      'Written as a function expression wrapped in parentheses, then invoked',
      'Creates a new scope for variables (useful before ES modules existed)',
      'Common in older codebases for encapsulation and module-like patterns',
      'Today, ES modules and block scope reduce the need, but IIFEs still appear',
    ],
  },
  interviewReadyAnswer: {
    content:
      'An IIFE is a function that is defined and immediately executed. Historically, it was used to create an isolated scope before let/const and ES modules were common, so variables wouldn’t leak into the global namespace. You wrap the function as an expression and invoke it right away. Today it’s less common because modules and block scope solve the same problem, but you still see IIFEs in legacy libraries and when you want a one-time setup with private state.',
  },
  visualUnderstanding: {
    description: 'IIFE creates an isolated scope',
    diagram: `(function () {
  // private scope
  const secret = 42
})();

// secret is not accessible here`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why do we need parentheses around the function?',
      'What problems do ES modules solve that IIFEs used to solve?',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying IIFEs are obsolete (they\'re less common, not useless)',
    ],
    redFlagAnswers: ['Calling it “a function that runs automatically” without explaining the scope benefit'],
  },
}

// Question 17: What is arguments object?
const question17: InterviewQuestion = {
  id: '17',
  title: 'What is `arguments` object?',
  coreConcept: {
    content:
      'arguments is an array-like object available in non-arrow functions that contains the values passed to that function call.',
  },
  howItWorks: {
    items: [
      'Available in regular functions',
      'Not available in arrow functions',
      'Not a real array',
      'In non-strict mode, arguments can alias named parameters; in strict mode it does not',
      'Modern alternative: rest parameters (...args) which gives a real array',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The arguments object contains all values passed to a regular function call. It looks like an array but it is not a real array, so you don’t get array methods directly. Arrow functions don’t have their own arguments. In modern JavaScript, you usually prefer rest parameters like (...args) because they produce a real array, are clearer, and work well with TypeScript.',
  },
  interviewerLens: {
    followUpQuestions: [
      'Why don’t arrow functions have arguments?',
      'What is the difference between arguments and ...args?',
      'What happens in strict mode with parameter aliasing?',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Treating arguments as an array',
    ],
    redFlagAnswers: ['Using arguments in modern code without mentioning rest parameters'],
  },
}

// Question 18: What are Default Parameters?
const question18: InterviewQuestion = {
  id: '18',
  title: 'What are Default Parameters?',
  coreConcept: {
    content:
      'Default parameters let you define fallback values for parameters when the passed argument is undefined, improving safety and readability.',
  },
  howItWorks: {
    items: [
      'Defaults apply at call time, only when the argument is undefined',
      'Evaluated left-to-right, so earlier params can be referenced by later defaults',
      'Cleaner and safer than using x = x || default (which breaks for 0, false, "")',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Default parameters let a function use a fallback value when the caller passes undefined or omits the argument. They are evaluated at runtime when the function is called, and they work left-to-right. This is cleaner than using the logical OR pattern because OR treats values like 0 or empty string as falsey and can accidentally override valid inputs. Defaults make function APIs clearer and reduce defensive code.',
  },
  interviewerLens: {
    followUpQuestions: [
      'Does default apply when the argument is null?',
      'Why is x = x || default sometimes wrong?',
      'Can defaults reference earlier parameters?',
    ],
    edgeCases: [
      'Default expressions that are expensive (evaluated per call)',
      'Using defaults with destructuring parameters',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Confusing undefined with null',
    ],
    redFlagAnswers: ['Saying defaults trigger for any “falsy” value'],
  },
}

// Question 19: What is Destructuring?
const question19: InterviewQuestion = {
  id: '19',
  title: 'What is Destructuring?',
  coreConcept: {
    content:
      'Destructuring is a concise syntax to unpack values from objects or arrays into variables, improving readability and reducing repetitive property access.',
  },
  howItWorks: {
    items: [
      'Object destructuring by key',
      'Array destructuring by position',
      'Supports defaults and renaming',
      'Supports nested patterns, but deep destructuring can reduce clarity',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Destructuring lets you extract values from objects and arrays into variables in a clean way. For objects, it matches by property name and supports renaming and default values. For arrays, it extracts by position. It reduces repeated code like obj.user.name and makes function parameters cleaner. The key is to use it where it improves clarity and avoid overly deep destructuring that makes code harder to read.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How do you rename a destructured property?',
      'What happens if a property is undefined?',
      'How does destructuring work in function parameters?',
    ],
    edgeCases: [
      'Destructuring nested objects when intermediate keys are undefined',
      'Overusing destructuring leading to unclear code',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Overusing destructuring and hurting readability',
    ],
    redFlagAnswers: ['Deep destructuring without handling missing intermediate properties'],
  },
}

// Question 20: What is the Spread vs Rest operator?
const question20: InterviewQuestion = {
  id: '20',
  title: 'What is the Spread vs Rest operator?',
  coreConcept: {
    content:
      'Spread and rest share the same syntax (...) but are opposite in meaning: spread expands a value, rest collects multiple values into one variable.',
  },
  howItWorks: {
    items: [
      'Spread in calls: fn(...args) expands an array into arguments',
      'Spread in literals: [...arr], { ...obj } creates a shallow copy',
      'Rest in parameters: function f(...args) collects arguments into an array',
      'Rest in destructuring: const { a, ...rest } = obj collects remaining props',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Spread and rest use the same ... syntax, but the meaning depends on where you use it. Spread expands a value, like passing an array as individual arguments or copying arrays/objects. Rest collects remaining values into a new array or object, like collecting function arguments or the remaining properties in object destructuring. Both are shallow, so nested objects are still shared by reference.',
  },
  visualUnderstanding: {
    description: 'Spread expands, rest collects',
    diagram: `Spread:
  fn(...[1, 2, 3])  -> fn(1, 2, 3)
  {...obj}         -> shallow copy

Rest:
  function f(...args) { }  -> args is an array
  const {a, ...rest} = obj -> rest is remaining props`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why is {...obj} only a shallow copy?',
      'Why must rest be the last parameter?',
    ],
    edgeCases: [
      'Mutating nested objects after a shallow spread copy',
      'Using rest with large objects (memory overhead)',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying they are different operators',
    ],
    redFlagAnswers: ['Claiming spread/rest performs a deep copy'],
  },
}

// Question 21: How does the JavaScript Event Loop work?
const question21: InterviewQuestion = {
  id: '21',
  title: 'How does the JavaScript Event Loop work?',
  coreConcept: {
    content:
      'The event loop coordinates the single call stack with queued async work. In browsers, async work runs in Web APIs and is scheduled back to JavaScript via microtask and macrotask queues.',
  },
  howItWorks: {
    items: [
      'Synchronous code runs on the call stack (single-threaded execution)',
      'Async work happens outside the stack (Web APIs like timers, network, DOM events)',
      'When ready, callbacks are queued: microtasks first (Promises), macrotasks next (timers/events)',
      'After the stack is empty, the runtime drains microtasks, then runs the next macrotask',
      'Too many microtasks can delay timers and even delay rendering (starvation)',
    ],
  },
  interviewReadyAnswer: {
    content:
      'The event loop is how JavaScript stays single-threaded but still handles async code. Synchronous code runs on the call stack. Async operations like timers, network requests, and DOM events are handled by browser Web APIs, and when they complete, their callbacks are queued. When the call stack becomes empty, the runtime drains the microtask queue first — mainly Promise continuations — and then runs the next macrotask like setTimeout callbacks or event handlers. This ordering explains why Promises run before timers, and it also explains starvation scenarios where heavy microtasks delay timers and UI updates.',
  },
  visualUnderstanding: {
    description: 'Event Loop processing order',
    diagram: `Browser Runtime
  │
  ├── Call Stack (sync)
  │
  ├── Web APIs (timers, fetch, DOM events)
  │
  └── Queues
      ├── Microtasks (Promises)  [runs first]
      └── Macrotasks (timers/events)

Rule:
  Stack empty -> drain microtasks -> run next macrotask`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why do microtasks run before macrotasks?',
      'What is a starvation scenario and how would you fix it?',
      'Where does rendering fit in between tasks?',
    ],
    edgeCases: [
      'Long synchronous tasks blocking the loop',
      'Promise-heavy code delaying timers and UI updates',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying JavaScript is multithreaded',
      'Ignoring microtasks',
    ],
    redFlagAnswers: ['Explaining async behavior without mentioning microtask priority'],
  },
}

// Question 22: Difference between Microtasks and Macrotasks?
const question22: InterviewQuestion = {
  id: '22',
  title: 'Difference between Microtasks and Macrotasks?',
  coreConcept: {
    content:
      'Microtasks and macrotasks are two scheduling queues used by the event loop. Microtasks have higher priority and run before the next macrotask.',
  },
  howItWorks: {
    items: [
      'Microtasks: Promise.then, async/await',
      'Macrotasks: setTimeout, setInterval',
      'Microtasks always run first',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Microtasks and macrotasks are two categories of queued work in the event loop. After the current call stack finishes, the engine drains the microtask queue first — which includes Promise.then and async/await continuations — before it runs the next macrotask like setTimeout or I/O callbacks. This priority is why Promises resolve before timers and why microtask-heavy code can starve timers. In practice, understanding this helps you predict execution order and avoid subtle async bugs.',
  },
  visualUnderstanding: {
    description: 'Microtasks vs Macrotasks queue structure',
    diagram: `Event Loop Priority:
    │
    ├── 1. Call Stack (synchronous)
    │
    ├── 2. Microtask Queue (HIGH PRIORITY)
    │   ├── Promise.then()
    │   └── async/await
    │
    └── 3. Macrotask Queue (LOW PRIORITY)
        ├── setTimeout()
        └── setInterval()
    
    Microtasks always run before macrotasks`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why do microtasks run before timers?',
      'Can microtasks delay rendering or timers?',
    ],
    edgeCases: [
      'Microtask starvation (a long chain of Promises delaying macrotasks)',
      'Scheduling UI updates with requestAnimationFrame vs microtasks',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Treating both queues equally',
    ],
    redFlagAnswers: ['Saying “they are the same, just different names”'],
  },
}

// Question 23: How does async/await work internally?
const question23: InterviewQuestion = {
  id: '23',
  title: 'How does `async/await` work internally?',
  coreConcept: {
    content:
      'async/await is syntax sugar over Promises. It pauses the async function and resumes it later without blocking the main thread.',
  },
  howItWorks: {
    items: [
      'async always returns a Promise',
      'await pauses function execution',
      'Resumes via microtask queue',
    ],
  },
  interviewReadyAnswer: {
    content:
      'async/await is built on Promises. An async function always returns a Promise, and await pauses that async function until the awaited Promise settles. This pause does not block the main thread — it just yields control back to the event loop, and the function continues later via the microtask queue when the Promise resolves or rejects. Internally, you can think of it as Promise chaining generated by the runtime. This is why error handling uses try/catch naturally and why await inside a loop becomes sequential unless you explicitly run tasks in parallel.',
  },
  visualUnderstanding: {
    description: 'async/await internal transformation',
    diagram: `async function example() {
      const data = await fetch()
      return data
    }
    
    Internally becomes:
    
    function example() {
      return fetch().then(data => {
        return data
      })
    }
    
    await pauses function, doesn't block thread`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Does await run operations in parallel by default?',
      'How do you run multiple awaits concurrently?',
      'How does try/catch behave with awaited Promises?',
    ],
    edgeCases: [
      'Using await inside loops causing sequential execution',
      'Forgetting to return a Promise from an async helper and breaking control flow',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying await blocks JavaScript',
    ],
    redFlagAnswers: ['Claiming await makes code “multithreaded”'],
  },
}

// Question 24: Why does setTimeout(fn, 0) not run immediately?
const question24: InterviewQuestion = {
  id: '24',
  title: 'Why does `setTimeout(fn, 0)` not run immediately?',
  coreConcept: {
    content:
      'setTimeout schedules a macrotask. Even with a 0ms delay, it cannot run until the current call stack completes and higher-priority microtasks are drained.',
  },
  howItWorks: {
    items: [
      'setTimeout callbacks wait until call stack is empty',
      'Event loop schedules them as macrotasks',
      'Zero delay does not mean immediate execution',
    ],
  },
  interviewReadyAnswer: {
    content:
      'setTimeout with 0ms does not mean “run now” — it means “queue this callback as soon as possible.” The callback is scheduled as a macrotask, so it will only run after the current synchronous code finishes and after the runtime drains the microtask queue. That’s why Promise callbacks typically run before setTimeout, even with 0ms. There is also timer clamping and scheduling overhead, so the actual delay is not guaranteed to be exactly zero.',
  },
  visualUnderstanding: {
    description: 'Why setTimeout(0) runs later',
    diagram: `Current Call Stack
  ↓ (finishes)
Microtasks (Promises)
  ↓ (drain)
Macrotasks (setTimeout callbacks)
  ↓
setTimeout(fn, 0) runs here`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Why do Promises run before setTimeout?',
      'What happens if the call stack is busy for a long time?',
    ],
    edgeCases: [
      'Microtask starvation delaying timers',
      'Timer clamping in browsers',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying delay means execution time',
    ],
    redFlagAnswers: ['“0ms means it runs immediately”'],
  },
}

// Question 25: What happens when a Promise resolves and rejects?
const question25: InterviewQuestion = {
  id: '25',
  title: 'What happens when a Promise resolves and rejects?',
  coreConcept: {
    content:
      'A Promise has three states: pending, fulfilled, or rejected. It can settle only once, and after that its state is immutable.',
  },
  howItWorks: {
    items: [
      'Only the first call—resolve or reject—matters',
      'Once settled, the Promise state becomes immutable',
      'Subsequent calls are ignored',
    ],
  },
  interviewReadyAnswer: {
    content:
      'A Promise starts in the pending state, and then it can transition exactly once to either fulfilled or rejected. Only the first settle call matters — resolve or reject — and after that the state and result are immutable. Any subsequent resolve/reject calls are ignored. This is important in real code because it guarantees a stable outcome for async flows and makes chaining predictable: then runs on fulfillment, catch runs on rejection, and finally runs in both cases.',
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the difference between resolve(value) and resolve(Promise)?',
      'How does finally behave on resolve vs reject?',
    ],
    edgeCases: [
      'Throwing inside then turns the chain into a rejection',
      'Returning a Promise from then flattens the chain',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Expecting both handlers to run',
    ],
    redFlagAnswers: ['Thinking a Promise can resolve and then reject later'],
  },
}

// Question 26: What is Promise chaining and why is return important?
const question26: InterviewQuestion = {
  id: '26',
  title: 'What is Promise chaining and why is return important?',
  coreConcept: {
    content:
      'Promise chaining works because each then returns a new Promise. Returning a value or a Promise from then determines what the next then receives.',
  },
  howItWorks: {
    items: [
      'Returning a Promise from .then() passes value to next .then()',
      'Not returning results in undefined',
      'Breaking the chain prevents proper async flow',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Promise chaining works because each .then() returns a new Promise. Whatever you return from a then callback becomes the input for the next then. If you return a plain value, the next then receives that value. If you return a Promise, the chain waits for it and unwraps its result. If you forget to return, the next then gets undefined, and you often break the intended async flow. Also, if you throw inside then, the chain becomes a rejection and should be handled with catch.',
  },
  interviewerLens: {
    followUpQuestions: [
      'What happens if you return a Promise inside then?',
      'What happens if you throw inside then?',
    ],
    edgeCases: [
      'Accidentally creating nested Promises by not returning',
      'Mixing async/await with then chains',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Forgetting return inside .then()',
    ],
    redFlagAnswers: ['Saying “then just runs the next function” without explaining return propagation'],
  },
}

// Question 27: How do you run async tasks in parallel?
const question27: InterviewQuestion = {
  id: '27',
  title: 'How do you run async tasks in parallel?',
  coreConcept: {
    content:
      'To run independent async tasks concurrently, start them first and await them together, typically with Promise.all.',
  },
  howItWorks: {
    items: [
      'Use Promise.all for parallel execution',
      'Sequential await slows execution unnecessarily',
      'Promise.allSettled for handling failures',
    ],
  },
  interviewReadyAnswer: {
    content:
      'If tasks are independent, you can run them in parallel by starting them first and awaiting them together with Promise.all. This avoids the common mistake of sequential awaits that slow down total time unnecessarily. Promise.all resolves when all succeed, and rejects fast if any fail; if you need “wait for all outcomes,” use Promise.allSettled. In real apps you might also add concurrency limits to avoid flooding the network or the backend.',
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the difference between Promise.all and Promise.allSettled?',
      'How do you limit concurrency when making many requests?',
    ],
    edgeCases: [
      'Promise.all fails fast and cancels the aggregate result (individual tasks still run)',
      'Awaiting inside loops causing accidental sequential behavior',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Awaiting inside loops blindly',
    ],
    redFlagAnswers: ['Using Promise.all for dependent tasks where ordering matters'],
  },
}

// Question 28: What is a Closure and where is it used in real apps?
const question28: InterviewQuestion = {
  id: '28',
  title: 'What is a Closure and where is it used in real apps?',
  coreConcept: {
    content:
      'A closure is when a function retains access to variables from its lexical scope even after the outer function has finished executing. This enables private state and function factories.',
  },
  howItWorks: {
    items: [
      'Debouncing user input',
      'Memoization for performance',
      'Data privacy and encapsulation',
    ],
  },
  interviewReadyAnswer: {
    content:
      'A closure happens when an inner function retains access to variables from its outer lexical scope, even after the outer function returns. This is powerful in real applications because it enables private state and controlled access. Common uses include debouncing and throttling utilities, memoization caches, and encapsulating state in modules without exposing it globally. The key detail is that closures retain references, not copies, so you must also manage lifetime to avoid holding unnecessary memory.',
  },
  visualUnderstanding: {
    description: 'Closure retains outer bindings',
    diagram: `function outer() {
  let count = 0
  return function inner() {
    count++
    return count
  }
}

inner() retains access to count via closure`,
  },
  interviewerLens: {
    followUpQuestions: [
      'Do closures capture values or references?',
      'Why can closures lead to memory retention?',
      'How does closure behave in loops?',
    ],
    edgeCases: [
      'Closures in for-loops with var vs let',
      'Closures holding DOM references through event handlers',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying closures store copies of values',
    ],
    redFlagAnswers: ['Defining closure as only “a function inside a function”'],
  },
}

// Question 29: Can closures cause memory leaks?
const question29: InterviewQuestion = {
  id: '29',
  title: 'Can closures cause memory leaks?',
  coreConcept: {
    content:
      'Closures keep references to captured variables. If those references keep large objects alive longer than needed, memory usage can grow and look like a leak.',
  },
  howItWorks: {
    items: [
      'Closures hold references to outer scope variables',
      'If unused objects are referenced, garbage collection is prevented',
      'Large objects in closures can cause memory issues',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Yes — closures can contribute to memory leaks if they retain references to objects that the application no longer needs. The leak is not the closure itself; it is the long-lived reference. For example, an event handler closure that captures a large object or a DOM node can prevent garbage collection if the listener is never removed. The fix is to manage lifetime: remove listeners, clear timers, avoid capturing heavy objects unnecessarily, and keep closures as small and short-lived as possible.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How would you detect a leak caused by a closure?',
      'What cleanup would you add in a component to prevent it?',
    ],
    edgeCases: [
      'Intervals that keep closures alive forever',
      'Caching closures that never evict entries',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Avoiding closures entirely',
    ],
    redFlagAnswers: ['Saying “closures always cause leaks” (too absolute)'],
  },
}

// Question 30: What is Prototypal Inheritance?
const question30: InterviewQuestion = {
  id: '30',
  title: 'What is Prototypal Inheritance?',
  coreConcept: {
    content:
      'Objects inherit from other objects via prototype chains.',
  },
  howItWorks: {
    items: [
      'Property lookup travels up the prototype chain',
      'Objects link to prototypes via __proto__',
      'Functions have a prototype property',
    ],
  },
  interviewReadyAnswer: {
    content:
      'JavaScript uses prototype-based inheritance, where property lookup travels up the prototype chain.',
  },
  visualUnderstanding: {
    description: 'Prototype chain lookup',
    diagram: `Object Instance
    │
    ├── __proto__ → Constructor.prototype
    │
    └── Constructor.prototype
        │
        ├── __proto__ → Object.prototype
        │
        └── Object.prototype
            │
            └── __proto__ → null
    
    Property lookup travels up this chain`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the difference between prototype and __proto__?',
      'What does Object.create do in terms of prototypes?',
      'How does method lookup work when a property is missing?',
    ],
    edgeCases: [
      'Shadowing a property on the instance vs prototype',
      'Changing prototype at runtime and its effect on performance',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Confusing __proto__ and prototype',
    ],
    redFlagAnswers: ['Using __proto__ in production code instead of standard APIs'],
  },
}

// Question 31: What causes memory leaks in JavaScript?
const question31: InterviewQuestion = {
  id: '31',
  title: 'What causes memory leaks in JavaScript?',
  coreConcept: {
    content:
      'A memory leak happens when objects stay reachable (referenced) even though the app no longer needs them, so garbage collection cannot reclaim that memory.',
  },
  howItWorks: {
    items: [
      'Accidental long-lived references: globals, module singletons, caches that never evict',
      'Closures that keep references to large objects longer than intended',
      'Event listeners / subscriptions not removed on unmount or cleanup',
      'Detached DOM nodes still referenced by code (or by listeners)',
      'Timers/intervals that keep callbacks alive',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Memory leaks in JavaScript happen when objects remain reachable even after we stop needing them, so the garbage collector cannot free them. The most common causes are long-lived references like globals or unbounded caches, event listeners or subscriptions that are never cleaned up, and closures that accidentally hold onto large data. In the browser, detached DOM nodes are another classic leak if something still references them. In practice, you detect leaks by watching memory grow over time and using heap snapshots to find what is retaining objects, then you fix it by removing references, cleaning up listeners, and adding cache eviction.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How would you confirm a leak vs normal memory growth?',
      'How do you find what is retaining an object in DevTools?',
      'What cleanup patterns do you use in React/Vue?',
    ],
    edgeCases: [
      'A cache is required for performance — how do you prevent it from growing forever?',
      'A listener is attached to window/document — where should cleanup live?',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Assuming garbage collection will fix leaks automatically without removing references'],
    redFlagAnswers: ['“JavaScript has GC so memory leaks can’t happen”'],
    overEngineeringMistakes: ['Avoiding closures/caching entirely instead of using them correctly with cleanup/eviction'],
  },
}

// Question 32: How does JavaScript garbage collection work?
const question32: InterviewQuestion = {
  id: '32',
  title: 'How does JavaScript garbage collection work?',
  coreConcept: {
    content:
      'Garbage collection is automatic memory management: the runtime frees objects that are no longer reachable from “root” references.',
  },
  howItWorks: {
    items: [
      'Starts from roots (global scope, current call stack, active closures, DOM references)',
      'Marks everything reachable by following references',
      'Sweeps (reclaims) objects that were not marked',
      'Runs when the engine decides (memory pressure), not immediately after a value goes out of scope',
    ],
  },
  interviewReadyAnswer: {
    content:
      'JavaScript engines use automatic garbage collection, typically a mark-and-sweep style approach. The engine starts from root references like globals and currently executing stack frames, marks all reachable objects by following references, and then frees anything unreachable. This is why “leaks” are really about references: if something still points to an object, GC will not collect it. GC also runs when the engine decides, so memory is not reclaimed instantly when you drop a variable.',
  },
  visualUnderstanding: {
    description: 'Reachability from roots determines what gets collected',
    diagram: `Roots
  │
  ├── window/global ──► objA ──► objB
  │
  └── stack/frame  ──► objC

Unreachable:
  objX ──► objY

GC collects unreachable objects (objX, objY).`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What does “reachable” mean in GC terms?',
      'Why can memory still look high even after objects become unreachable?',
    ],
    edgeCases: [
      'Long-lived references in closures and event listeners',
      'Large arrays/typed arrays that cause memory pressure',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Assuming memory is freed immediately when a variable goes out of scope'],
    redFlagAnswers: ['“GC frees memory when it feels like it, so leaks are unavoidable” (misses reachability)'],
  },
}

// Question 33: What is debouncing vs throttling?
const question33: InterviewQuestion = {
  id: '33',
  title: 'What is debouncing vs throttling?',
  coreConcept: {
    content:
      'Debouncing and throttling are rate-limiting techniques for high-frequency events. Debounce waits for a pause; throttle limits how often a handler can run.',
  },
  howItWorks: {
    items: [
      'Debounce: reset a timer on every event and run only after the events stop for N ms',
      'Throttle: allow execution at most once per N ms (drop or delay intermediate events)',
      'Debounce is best for “final intent” events (search input, resize end)',
      'Throttle is best for continuous events (scroll, mousemove) to protect the main thread',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Debouncing and throttling both control how often a function runs during frequent events. Debouncing waits until the events stop for a specified time and then runs once, which is ideal for search inputs or resize handling where you care about the final value. Throttling runs the handler at most once per interval, which is useful for scroll or mousemove so the UI stays responsive. The key difference is: debounce runs after a pause, throttle runs at a fixed rate.',
  },
  visualUnderstanding: {
    description: 'Debouncing vs Throttling timeline',
    diagram: `Debouncing:
    Event → Wait → Event → Wait → Execute
    (waits for pause)
    
    Throttling:
    Event → Execute → Wait → Event → Execute
    (executes at intervals)
    
    Debounce: Search input
    Throttle: Scroll events`,
  },
  interviewerLens: {
    followUpQuestions: [
      'How do you implement debounce with setTimeout?',
      'What are leading vs trailing calls in throttle/debounce?',
      'What problems happen if you throttle too aggressively?',
    ],
    edgeCases: [
      'Debounce with trailing call can delay UX if the user keeps typing',
      'Throttle can cause skipped intermediate states (must choose carefully)',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Using them interchangeably',
    ],
    redFlagAnswers: [
      'Explaining only definitions without any use-case',
      'Using debounce for scroll and causing a “laggy” UI',
    ],
  },
}

// Question 34: How do you optimize JavaScript performance?
const question34: InterviewQuestion = {
  id: '34',
  title: 'How do you optimize JavaScript performance?',
  coreConcept: {
    content:
      'Performance optimization is about measuring bottlenecks and reducing wasted work: fewer expensive operations, less main-thread blocking, and smoother rendering.',
  },
  howItWorks: {
    items: [
      'Measure first: DevTools Performance/Profiler, Lighthouse, real-user metrics',
      'Reduce main-thread work: avoid heavy loops, JSON parsing, excessive allocations',
      'Avoid layout thrash: batch DOM reads/writes, use CSS transforms for animations',
      'Control frequency: debounce/throttle, requestAnimationFrame for UI updates',
      'Split long tasks: chunk work, idle callbacks, offload to Web Workers when appropriate',
    ],
  },
  interviewReadyAnswer: {
    content:
      'I optimize JavaScript performance by measuring first and then targeting the biggest bottleneck. In the browser, most issues come from too much main-thread work or too many expensive rendering operations. So I reduce unnecessary DOM updates, avoid forced synchronous layouts by batching reads and writes, and debounce or throttle high-frequency events like scroll and input. For heavy computations, I split long tasks into chunks or offload work to a Web Worker. The key is to validate improvement with profiling and metrics, not guess.',
  },
  interviewerLens: {
    followUpQuestions: [
      'What tools do you use to measure performance?',
      'What is a long task and why does it matter?',
      'When would you choose a Web Worker?',
    ],
    edgeCases: [
      'Optimizing one metric but hurting UX elsewhere (tradeoffs)',
      'Premature optimization without a baseline',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Optimizing without measuring and hoping it improves performance'],
    redFlagAnswers: ['Only listing techniques (debounce, memoize) without saying “measure first”'],
    overEngineeringMistakes: ['Complex caching/memoization everywhere that increases memory and bugs'],
  },
}

// Question 35: What causes reflow and repaint?
const question35: InterviewQuestion = {
  id: '35',
  title: 'What causes reflow and repaint?',
  coreConcept: {
    content:
      'Reflow (layout) happens when the browser recalculates element sizes/positions; repaint happens when it redraws pixels. Layout work is typically more expensive.',
  },
  howItWorks: {
    items: [
      'Style changes can trigger layout (width/height/margin/font changes) and then paint',
      'Reading layout after writing styles can force synchronous layout (“layout thrash”)',
      'Repaint happens when visual styling changes without layout (color/background/shadow)',
      'Some changes can be composited cheaply (transform/opacity) without layout',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Reflow, also called layout, is when the browser recalculates the geometry of elements — their size and position — and it can be triggered by changes like width, height, fonts, or DOM insertion. Repaint is when the browser redraws pixels, for example when colors or shadows change. Reflow is usually more expensive because it can affect many elements. In real apps, the big trap is layout thrashing: repeatedly reading layout properties like offsetWidth right after writing styles, which forces synchronous layout. The fix is batching DOM reads and writes and preferring transform/opacity for animations.',
  },
  visualUnderstanding: {
    description: 'Rendering pipeline stages',
    diagram: `Pipeline:
  JS → Style → Layout (Reflow) → Paint (Repaint) → Composite

Layout triggers: size/position changes
Paint triggers: visual-only changes
Cheapest animations: transform, opacity (often composite-only)`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What is layout thrashing and how do you avoid it?',
      'Which CSS properties are safest for animations?',
    ],
    edgeCases: [
      'Reading getBoundingClientRect in a loop after changing styles',
      'Large DOM trees where one layout change cascades',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Treating reflow and repaint as the same thing'],
    redFlagAnswers: ['Suggesting “optimize by using setTimeout” instead of fixing layout thrash'],
  },
}

// Question 36: Why does typeof null return "object"?
const question36: InterviewQuestion = {
  id: '36',
  title: 'Why does `typeof null` return "object"?',
  coreConcept: {
    content:
      'It is a historical bug in JavaScript: null is a primitive, but typeof reports it as "object" for legacy reasons.',
  },
  howItWorks: {
    items: [
      'null is a primitive value',
      'Early implementation bug',
      'Cannot be fixed without breaking existing code',
    ],
  },
  interviewReadyAnswer: {
    content:
      'null is a primitive value in JavaScript, but typeof null returns "object" because of a long-standing historical bug from early implementations. It has remained for backward compatibility — fixing it would break a lot of existing code. In interviews, the key point is: null is not an object, typeof is misleading here, and you should use strict checks like value === null.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How do you reliably check for null?',
      'What is the difference between null and undefined?',
    ],
    edgeCases: [
      'Using typeof for type checks where null is a special case',
      'Optional chaining with null/undefined values',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying null is an object',
    ],
    redFlagAnswers: ['Explaining it as “because null is an object”'],
  },
}

// Question 37: Why does [] == ![] return true?
const question37: InterviewQuestion = {
  id: '37',
  title: 'Why does `[] == ![]` return true?',
  coreConcept: {
    content:
      'It is true due to type coercion rules: both sides get converted to primitives and then compared.',
  },
  howItWorks: {
    items: [
      '![] becomes false',
      '[] converts to 0',
      '0 == 0 is true',
    ],
  },
  interviewReadyAnswer: {
    content:
      'This is true because of coercion. ![] becomes false because arrays are truthy. Then [] == false triggers loose equality rules: false becomes 0, and [] becomes an empty string, which then becomes 0. So it becomes 0 == 0, which is true. The interview takeaway is: avoid == in real code and prefer strict equality to avoid these coercion traps.',
  },
  visualUnderstanding: {
    description: 'Coercion steps for [] == ![]',
    diagram: `Step-by-step:
  []        is truthy
  ![]       → false

  [] == false
  false     → 0
  []        → ''  → 0

  0 == 0    → true`,
  },
  interviewerLens: {
    followUpQuestions: [
      'What is the difference between == and ===?',
      'What happens with other tricky cases like \"0\" == 0 or [] == 0?',
    ],
    edgeCases: [
      'Loose equality with objects triggers ToPrimitive conversions',
      'Using == in validation code can create security/logic bugs',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Not understanding type coercion',
    ],
    redFlagAnswers: ['Memorizing the answer without explaining the coercion steps'],
  },
}

// Question 38: When should you avoid arrow functions?
const question38: InterviewQuestion = {
  id: '38',
  title: 'When should you avoid arrow functions?',
  coreConcept: {
    content:
      'Arrow functions are great for callbacks, but you should avoid them when you need a real function with its own this, arguments, or constructor behavior.',
  },
  howItWorks: {
    items: [
      'When you need your own this',
      'When you need arguments object',
      'When creating constructors',
    ],
  },
  interviewReadyAnswer: {
    content:
      'I avoid arrow functions when I need a normal function\'s behavior. Arrow functions do not have their own this or arguments, and they cannot be used as constructors with new. So for object methods that rely on dynamic this, or for constructors, I use function declarations or function expressions. For callbacks and functional code where lexical this is desired, arrows are perfect.',
  },
  interviewerLens: {
    followUpQuestions: [
      'Why is using an arrow as an object method sometimes a bug?',
      'Can you bind this to an arrow function?',
    ],
    edgeCases: [
      'Using arrow functions in event handlers where this is expected',
      'Class methods and this binding in React components',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Using arrow functions everywhere blindly',
    ],
    redFlagAnswers: ['“Arrow functions are always better”'],
  },
}

// Question 39: Why is object mutation dangerous?
const question39: InterviewQuestion = {
  id: '39',
  title: 'Why is object mutation dangerous?',
  coreConcept: {
    content:
      'Mutation is dangerous because objects are shared by reference — changing one place can silently affect other parts of the program.',
  },
  howItWorks: {
    items: [
      'Mutating objects causes side effects',
      'Unpredictable bugs due to shared references',
      'Hard to track changes',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Object mutation is dangerous because multiple variables can reference the same object. If you mutate it in one place, every other reference sees the change, which creates hidden side effects and makes bugs hard to reproduce. In UI frameworks, mutation also breaks predictable state updates because change detection often relies on new references. A safer pattern is to treat state as immutable: create a new object for changes and keep updates explicit.',
  },
  interviewerLens: {
    followUpQuestions: [
      'Why does mutation cause bugs in React state updates?',
      'What is shallow copy vs deep copy, and when do you need each?',
    ],
    edgeCases: [
      'Mutating nested objects after making a shallow copy',
      'Using shared objects as cache keys',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Assuming mutation is safe because “it works in small examples”'],
    redFlagAnswers: ['Mutating state directly in React and expecting re-render'],
  },
}

// Question 40: How do frameworks avoid mutation bugs?
const question40: InterviewQuestion = {
  id: '40',
  title: 'How do frameworks avoid mutation bugs?',
  coreConcept: {
    content:
      'Frameworks avoid mutation bugs by encouraging immutable updates and using reference checks to detect changes reliably.',
  },
  howItWorks: {
    items: [
      'Use immutability',
      'Shallow copies',
      'State updates instead of direct mutation',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Frameworks avoid mutation bugs by making state updates explicit and immutable. Instead of mutating an existing object, you create a new reference — often with shallow copies — so change detection can use fast equality checks. In React, for example, new references help reconciliation and memoization work correctly. Many ecosystems also use patterns like reducers, structural sharing, and libraries like Immer to make immutable updates easier while keeping performance reasonable.',
  },
  interviewerLens: {
    followUpQuestions: [
      'Why do shallow comparisons matter for performance?',
      'How does Immer help and what is its tradeoff?',
    ],
    edgeCases: [
      'Accidentally mutating nested state after a shallow copy',
      'Overusing deep clones causing performance regressions',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Thinking immutability is just a preference',
    ],
    redFlagAnswers: ['“Immutability is only for Redux” (misses rendering/change detection benefits)'],
  },
}

// Question 41: What is event delegation?
const question41: InterviewQuestion = {
  id: '41',
  title: 'What is event delegation?',
  coreConcept: {
    content:
      'Event delegation is a pattern where you attach one listener to a parent and handle events for many children using event bubbling.',
  },
  howItWorks: {
    items: [
      'Uses event bubbling to handle multiple elements',
      'Single listener on parent element',
      'Reduces memory usage',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Event delegation means attaching a single event listener to a parent element and handling events for child elements through bubbling. It improves performance and memory usage because you avoid adding listeners to every child, and it also works well when children are added dynamically. In the handler, you check event.target (or closest) to decide which child triggered the event.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How do you implement delegation safely with event.target vs closest?',
      'When does delegation not work (which events)?',
    ],
    edgeCases: [
      'stopPropagation preventing delegation',
      'Events that do not bubble in some contexts',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Attaching listeners to every element',
    ],
    redFlagAnswers: ['Delegating without filtering targets (handler runs for everything)'],
  },
}

// Question 42: How does bubbling differ from capturing?
const question42: InterviewQuestion = {
  id: '42',
  title: 'How does bubbling differ from capturing?',
  coreConcept: {
    content:
      'Event propagation phases.',
  },
  howItWorks: {
    items: [
      'Capturing goes top-down',
      'Bubbling goes bottom-up',
      'Events have both phases',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Event propagation has phases. In the capturing phase, the event travels from the root down to the target element. Then the event fires on the target. After that, in the bubbling phase, it travels back up from the target to the root. Most event listeners use bubbling by default, and event delegation relies on bubbling so a parent can handle events from many children.',
  },
  visualUnderstanding: {
    description: 'Event propagation phases',
    diagram: `Capturing Phase (Top-Down):
    Window → Document → <div> → <button>
    
    Target Phase:
    <button> (event fires)
    
    Bubbling Phase (Bottom-Up):
    <button> → <div> → Document → Window
    
    Most listeners use bubbling phase`,
  },
  interviewerLens: {
    followUpQuestions: [
      'How do you register a listener in the capture phase?',
      'How does stopPropagation affect delegation?',
    ],
    edgeCases: [
      'Some events don’t bubble in all contexts',
      'stopImmediatePropagation prevents other handlers on the same element',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Confusing the two phases',
    ],
    redFlagAnswers: ['Not mentioning that delegation relies on bubbling'],
  },
}

// Question 43: What is a Web Worker?
const question43: InterviewQuestion = {
  id: '43',
  title: 'What is a Web Worker?',
  coreConcept: {
    content:
      'A Web Worker runs JavaScript in a separate background thread to avoid blocking the main UI thread.',
  },
  howItWorks: {
    items: [
      'Runs JavaScript in a separate thread',
      'Prevents UI blocking',
      'Communicates via messages',
    ],
  },
  interviewReadyAnswer: {
    content:
      'A Web Worker lets you run JavaScript on a separate thread from the main UI thread. This is useful for CPU-heavy tasks like parsing large data, image processing, or complex computations, because it keeps the UI responsive. Workers communicate with the main thread using postMessage, and data is passed via structured cloning or transferables for better performance.',
  },
  interviewerLens: {
    followUpQuestions: [
      'What kind of tasks are ideal for workers?',
      'What are transferables and why do they matter?',
    ],
    edgeCases: [
      'Large data copies causing overhead if not using transferables',
      'Worker lifecycle management and cancellation',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Thinking workers share memory with main thread',
    ],
    redFlagAnswers: ['Treating workers as “free performance” without considering message overhead'],
  },
}

// Question 44: Why can't Web Workers access the DOM?
const question44: InterviewQuestion = {
  id: '44',
  title: 'Why can\'t Web Workers access the DOM?',
  coreConcept: {
    content:
      'Workers cannot access the DOM because the DOM is not thread-safe; direct access would create race conditions and inconsistent UI state.',
  },
  howItWorks: {
    items: [
      'Direct DOM access could cause race conditions',
      'Workers communicate via messages',
      'Main thread handles DOM updates',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Web Workers cannot access the DOM because the DOM is managed by the main thread and is not designed for concurrent access. If multiple threads could manipulate the DOM directly, it could cause race conditions and inconsistent rendering. Instead, workers communicate through message passing, and the main thread performs the actual DOM updates based on worker results.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How do workers communicate results back to the UI?',
      'What is structured cloning and what types does it support?',
    ],
    edgeCases: [
      'Passing functions/DOM nodes to workers (not supported)',
      'Large payloads causing UI jank due to copying',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Expecting workers to manipulate DOM directly',
    ],
    redFlagAnswers: ['“Workers can’t access DOM because they are sandboxed” (too vague; misses thread-safety)'],
  },
}

// Question 45: What happens if you forget await?
const question45: InterviewQuestion = {
  id: '45',
  title: 'What happens if you forget `await`?',
  coreConcept: {
    content:
      'Forgetting await means you keep a Promise, not the resolved value — so your code continues before the async work completes.',
  },
  howItWorks: {
    items: [
      'Execution continues immediately; the async operation is still pending',
      'You may pass a Promise into logic that expects real data (undefined fields, wrong branching)',
      'Errors may escape your try/catch and become unhandled rejections if not chained',
      'Bugs show up as race conditions: “works locally, fails sometimes”',
    ],
  },
  interviewReadyAnswer: {
    content:
      'If you forget await, you are not waiting for the async result — you are working with a Promise. So the function continues executing, and any code that depends on the result may run with incomplete data, causing subtle race-condition bugs. It also affects error handling: a try/catch won’t catch a rejected Promise unless it’s awaited or returned. The fix is to await the call when you need the value, or return the Promise and let the caller await it, and for parallel work use Promise.all instead of sequential awaits.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How would you detect this bug quickly in a code review?',
      'When is it correct to not await an async function?',
      'How do you run independent awaits in parallel safely?',
    ],
    edgeCases: [
      'Forgetting await inside loops (causes accidental concurrency or wrong ordering)',
      'Forgetting to return the Promise in a helper function',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Thinking an async function “returns the data” instead of “returns a Promise”'],
    redFlagAnswers: ['“Nothing happens, it just runs a bit later” (misses Promise/value distinction)'],
    overEngineeringMistakes: ['Wrapping everything in new Promise instead of awaiting/returning correctly'],
  },
}

// Question 46: Why do good developers fail JS interviews?
const question46: InterviewQuestion = {
  id: '46',
  title: 'Why do good developers fail JS interviews?',
  coreConcept: {
    content:
      'Interviews reward clear mental models and structured communication — not just “I’ve used it before”.',
  },
  howItWorks: {
    items: [
      'They answer “what” but can’t explain “why” or handle follow-ups',
      'They jump into details without a clean structure (definition → mechanism → example → edge case)',
      'They confuse related concepts (scope vs execution context, event loop vs call stack)',
      'They don’t communicate tradeoffs or real-world impact (performance, bugs, correctness)',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Good developers fail JavaScript interviews mainly because interviews test explanation under pressure. Many people know the concept, but they can’t articulate a crisp definition, the mechanism, and a small example — and then they collapse on follow-up questions. Interviewers also look for clean mental models: if you mix scope with execution context or event loop with concurrency, it signals shaky fundamentals. The fix is to practice structured answers, anticipate follow-ups, and focus on correctness and real-world implications, not just writing code.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How would you improve your answers without “cramming”?',
      'What does an interviewer mean by “walk me through it”?',
    ],
    whatIfScenarios: [
      'You know the concept but blank out — what structure do you fall back to?',
    ],
  },
  mistakes: {
    wrongMentalModels: ['Thinking interviews are only coding problems and syntax'],
    redFlagAnswers: ['Overconfident but vague answers with no mechanism or example'],
  },
}

// Question 47: How do you explain a production bug you fixed?
const question47: InterviewQuestion = {
  id: '47',
  title: 'How do you explain a production bug you fixed?',
  coreConcept: {
    content:
      'A production bug answer should show how you think: impact → root cause → fix → prevention.',
  },
  howItWorks: {
    items: [
      'Problem: what users saw + impact (who/where/how often)',
      'Root cause: what exactly failed and why (not “it was a bug”)',
      'Fix: the minimal safe change + how you validated it',
      'Prevention: tests, monitoring, guardrails, and what you’d do differently',
    ],
  },
  interviewReadyAnswer: {
    content:
      'I explain a production bug in four steps: impact, root cause, fix, and prevention. First, I describe what the user experienced and the measurable impact. Then I explain the root cause precisely — what condition triggered it and why our code allowed it. Next, I describe the fix as the smallest safe change, and how I validated it using logs, a reproduction, tests, and a staged rollout. Finally, I close with prevention: adding a regression test, improving monitoring/alerts, and the guideline we adopted so the same class of bug doesn’t return.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How did you reproduce it locally?',
      'How did you verify the fix without breaking other flows?',
      'What monitoring did you add after the fix?',
    ],
    edgeCases: [
      'Bug is intermittent (race condition) — how did you prove the root cause?',
      'Bug is data-dependent — how did you create a safe repro dataset?',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Jumping straight to the fix without context',
    ],
    redFlagAnswers: [
      '“I just changed something and it worked” (no root cause, no verification)',
      'Blaming “production” without explaining conditions and evidence',
    ],
  },
}

// Question 48: What makes JavaScript single-threaded but non-blocking?
const question48: InterviewQuestion = {
  id: '48',
  title: 'What makes JavaScript single-threaded but non-blocking?',
  coreConcept: {
    content:
      'JavaScript executes code on a single call stack, but it stays non-blocking by delegating async work to the environment (browser/Node) and scheduling callbacks back through the event loop.',
  },
  howItWorks: {
    items: [
      'Single call stack for execution',
      'Offloads async work to Web APIs',
      'Event loop manages async callbacks',
    ],
  },
  interviewReadyAnswer: {
    content:
      'JavaScript is single-threaded in the sense that your JS code runs on one call stack. It is non-blocking because the runtime environment handles asynchronous operations outside the stack — like timers, network, and file I/O — and then schedules their callbacks to run later via the event loop. When the call stack is free, queued callbacks and Promise continuations execute in a predictable order. So the “non-blocking” part is not because JavaScript runs multiple stacks, but because the environment and event loop coordinate work around the single thread.',
  },
  visualUnderstanding: {
    description: 'Single-threaded but non-blocking architecture',
    diagram: `JavaScript Runtime:
    │
    ├── Call Stack (Single Thread)
    │   └── Synchronous code
    │
    ├── Web APIs (Browser)
    │   ├── setTimeout
    │   ├── fetch
    │   └── DOM APIs
    │
    └── Event Loop
        ├── Microtask Queue
        └── Macrotask Queue
    
    Async work handled by Web APIs, not JS thread`,
  },
  interviewerLens: {
    followUpQuestions: [
      'If JS is single-threaded, what exactly runs in parallel?',
      'Why do Promises run before setTimeout?',
      'What creates UI freezes in JavaScript apps?',
    ],
    edgeCases: [
      'CPU-heavy synchronous loops block rendering and input',
      'Microtask starvation delaying timers and UI updates',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Saying JavaScript is multithreaded',
    ],
    redFlagAnswers: [
      'Explaining non-blocking without mentioning the environment (Web APIs / Node APIs)',
      'Saying “async runs on another thread” without clarifying it’s the environment, not JS execution',
    ],
  },
}

// Question 49: Why is console.log unreliable for async debugging?
const question49: InterviewQuestion = {
  id: '49',
  title: 'Why is `console.log` unreliable for async debugging?',
  coreConcept: {
    content:
      'Console logs can mislead you in async code because timing, batching, and reference printing don’t reflect the real execution order.',
  },
  howItWorks: {
    items: [
      'Async callbacks run later (microtasks/macrotasks), so log order can differ from mental order',
      'DevTools may print object references “live”, not the snapshot at log time',
      'Logs can be batched or delayed under heavy load, giving false confidence',
      'Better tools: debugger breakpoints, timestamps, structured logs, and tracing IDs',
    ],
  },
  interviewReadyAnswer: {
    content:
      'Console.log is unreliable for async debugging because log order is not a guarantee of execution order. Async callbacks run later through microtask and macrotask queues, and DevTools can also show objects by reference, so what you see might be the updated state, not the state at log time. In production-like issues, logs may be batched or delayed. A better approach is to use debugger breakpoints, add timestamps and correlation IDs, log primitives or deep-cloned snapshots when needed, and trace the async flow end-to-end.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How do you log a stable snapshot of an object?',
      'What’s your preferred debugging workflow for async bugs?',
    ],
    edgeCases: [
      'Logging objects that mutate later (console shows updated state)',
      'Race conditions that disappear with extra logs (timing changes)',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Relying solely on console.log for async debugging',
    ],
    redFlagAnswers: ['“Console.log is always correct” (ignores timing/reference behavior)'],
  },
}

// Question 50: Why does this kit exist?
const question50: InterviewQuestion = {
  id: '50',
  title: 'Why does this kit exist?',
  coreConcept: {
    content:
      'Knowing JavaScript and clearing JavaScript interviews are different skills — interviews test clarity, mental models, and follow-up handling.',
  },
  howItWorks: {
    items: [
      'Turns scattered knowledge into a repeatable answer structure',
      'Trains you for follow-ups, edge cases, and interviewer traps',
      'Focuses on what gets candidates rejected: vague answers, wrong mental models, and missing tradeoffs',
    ],
  },
  interviewReadyAnswer: {
    content:
      'This kit exists because interviews don’t reward raw knowledge — they reward how clearly you explain core concepts under pressure. Most candidates fail not on the first answer, but on follow-ups, edge cases, and small traps that expose weak mental models. The goal of this kit is to give you a consistent structure to answer any JavaScript question: define it, explain the mechanism, mention a real-world implication, and avoid common red flags. That’s how you sound confident and experienced in a real interview.',
  },
  interviewerLens: {
    followUpQuestions: [
      'How should a learner use this kit daily for maximum results?',
      'What should you practice after reading the answer once?',
    ],
    whatIfScenarios: [
      'If an interviewer pushes a follow-up, what structure do you use to stay calm?',
    ],
  },
  mistakes: {
    wrongMentalModels: [
      'Thinking knowledge alone is enough',
    ],
    redFlagAnswers: ['Trying to memorize without understanding the mechanism and follow-ups'],
  },
}

/**
 * All interview questions for JavaScript Interview Mastery Kit
 * Questions 1-10: Core JavaScript Concepts (COMPLETE)
 * Questions 11-20: Core + Practical JavaScript (COMPLETE)
 * Questions 21-30: Advanced & Async (COMPLETE)
 * Questions 31-35: Performance & Debugging (COMPLETE)
 * Questions 36-50: Interview Traps & Scenarios (COMPLETE)
 * 
 * TOTAL: 50 PREMIUM-GRADE INTERVIEW QUESTIONS
 */
export const interviewKitQuestions: InterviewQuestion[] = [
  question1,
  question2,
  question3,
  question4,
  question5,
  question6,
  question7,
  question8,
  question9,
  question10,
  question11,
  question12,
  question13,
  question14,
  question15,
  question16,
  question17,
  question18,
  question19,
  question20,
  question21,
  question22,
  question23,
  question24,
  question25,
  question26,
  question27,
  question28,
  question29,
  question30,
  question31,
  question32,
  question33,
  question34,
  question35,
  question36,
  question37,
  question38,
  question39,
  question40,
  question41,
  question42,
  question43,
  question44,
  question45,
  question46,
  question47,
  question48,
  question49,
  question50,
]

