# Celonis Programming Challenge

Dear applicant,

Congratulations, you made it to the Celonis Programming Challenge!

The challenge can be completed in less than 6 hours but feel free to work at your own pace.

Why do we ask you to complete this challenge?

First of all, we need to have some way of comparing different applicants, and we try to answer certain questions which we can not out-right ask in an interview - also we don't want to ask too many technical questions in a face-to-face interview to not be personally biased in a potentially stressful situation. To be as transparent as possible, we want to give you some insights into what we look at and how we evaluate. This challenge gives you the possibility to shine :)

The challenge is divided into three modules: the backend and the frontend module. The frontend module should be completed using Angular whereas the backend module using Java 8/11 with Spring Boot. You are able to finish the backend module without finishing the frontend module but not the other way around.

Note that there is nothing wrong with googling when you have certain questions or are unsure about some APIs, but you should not outright copy code. If you decide to copy code, please mark it as copied citing the source.

## Backend module

### Challenge 1: API Design

This challenge is about designing the API for MarsGate. MarsGate is an Application Management Tool which allows humans to apply for the "Free ticket to planet Mars" lottery.

In MarsGate, users are able to:
- List his/her applications (including unfinished ones)
- Create a new application
- The application process has those steps
    - Step 1: Add a CV
    - Step 2: Add personal details
    - Step 3: Write an essay
    - Step 4: Summary showing data from the previous steps in a read-only form
- Submit an application
- Cancel/delete an application

The user will be able to start multiple applications at the same time and is not required to finish the whole application at once. So, he can start by filling a few steps and come back later to complete and submit the application, or cancel/delete it. In the list of applications that he/she created, the user will see the progress of each application.

The deliverable for this challenge is the documentation of the API which can be used by another team to build the web client. For designing and documenting the API, https://swagger.io/ can be used.

What we are looking into:
- Problem understanding skills
- API design principles
- Knowledge regarding HTTP protocol

Note: There is no implementation needed for this challenge

### Challenge 2: Completing and extending the java application

In this challenge, you have to download the base project which has a few problems. After downloading, you have to fix those problems to get the application running and then you should extend it with the requirements specified below.

What we are looking into:
- Understanding and implementation of a specification
- Java implementation skills (Java 8/11, Spring Boot)
- Understanding of scheduling jobs that run in background
- Multithreading / Locking execution
- Debugging and code analysis

#### Task 1: Use the provided API to download the base project

We provided the API documentation as a swagger yaml specification that you can open in https://editor.swagger.io/. The application that implements this documentation is currently running on heroku at https://pure-plains-73336.herokuapp.com/. You should use the app (e.g. via swagger editor) to create a task, execute it and get the result. The result is a zip file that contains the base project for the upcoming tasks. The header authentication secret (named Celonis-Auth) is "totally_secret".

#### Task 2: Dependency injection

The project that you downloaded in Task 1 fails to start correctly due to a problem in the dependency injection.
Identify that problem and fix it.

#### Task 3: Packaging

The packaging of the project is incorrect. The expected result of the maven packaging phase
would be a standalone runnable jar containing every dependency (runnable via java -jar challenge.jar).
Your frontend application should also be packed into the jar.

Note: you are able to continue with the next task also before packaging is finished.

#### Task 4: Extending the application

The task in this challenge is to extend the current functionality of the backend by
- implementing a new task type and
- show the progress of the task execution
- implement task cancellation mechanism.

The new task type is a simple counter which is configured with two input parameters, `x` and `y` of type `integer`. When the task is executed, counter should start in the background and progress should be monitored. Counting should start from `x` and get increased by one every second. When counting reaches `y`, the task should finish successfully.

The progress of the task should be exposed via the API so that the web client can monitor it. Canceling a task that is being executed should be possible, in which case the execution should stop.

#### Task 5: Periodically cleaning up the tasks

The API can be used to create tasks but the user is not required to execute those tasks. The tasks that are not executed after an extended period of time (e.g. a week) should be periodically cleaned up (deleted).

## Frontend module

### Challenge 1: Web client

This challenge is about building the web client for the resulting application from challenge 2. The requirements of this web client are demonstrated with the Figma mockup - [Link to mockup](https://www.figma.com/proto/QU16smviKOMZek8twvbxw1ap/Full-stack---challenge-02).

The application consists of a dashboard which lists all the tasks (including the tasks that are never executed). From the list of tasks, the user can:
- create new tasks
- open an existing task
- cancel tasks that are being executed and
- delete tasks

For creating new tasks, a wizard should be implemented which has multiple steps. The steps are:
1. Choose the type of the scheduled task
2. Configure the chosen scheduled task
3. Execute and monitor progress
4. Summary with results

The user might leave the wizard at any step but he/she should still be able to continue later and finish it. The user should be able to refresh the browser tab and continue from the step where he left.

What we are looking into:
- Technical understanding of a provided API
- Ability to execute / implement
- Frontend project setup and API usage
- Frontend implementation skills (Javascript, Typescript, HTML/CSS)
- Frontend component structure and routing
