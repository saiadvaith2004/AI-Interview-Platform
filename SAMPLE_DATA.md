# Sample Resume and Job Description for Testing

## Sample Resume

```
JOHN DOE
Full Stack Developer

PROFESSIONAL SUMMARY
Results-driven Full Stack Developer with 4+ years of experience building scalable web applications. 
Proficient in React, Node.js, Python, and AWS cloud services. Strong background in system design 
and microservices architecture.

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Python, Java, SQL
- Frontend: React, Redux, HTML, CSS, Tailwind CSS
- Backend: Node.js, Express, Django, REST API, GraphQL
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD, Git
- Other: Agile, Test-Driven Development, Microservices, System Design

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Solutions Inc. | 2021 - Present
- Led development of microservices-based e-commerce platform serving 100K+ users
- Implemented Redis caching layer reducing API response time by 60%
- Designed and built RESTful APIs using Node.js and Express
- Mentored junior developers and conducted code reviews
- Technologies: React, Node.js, PostgreSQL, AWS, Docker

Software Developer | Digital Innovations | 2020 - 2021
- Developed responsive web applications using React and TypeScript
- Built automated testing pipeline using Jest and Cypress
- Optimized database queries improving application performance by 40%
- Collaborated with cross-functional teams in Agile environment
- Technologies: React, Python, Django, MongoDB

PROJECTS

Real-Time Chat Application
- Built scalable chat app using WebSocket, Node.js, and React
- Implemented JWT authentication and authorization
- Deployed on AWS using Docker containers
- Handled 10,000+ concurrent connections

Task Management System
- Designed full-stack application with React frontend and Python backend
- Integrated third-party APIs for notifications
- Implemented comprehensive test coverage (85%+)

EDUCATION
Bachelor of Science in Computer Science | State University | 2019
```

## Sample Job Description

```
SENIOR FULL STACK ENGINEER

About the Role:
We are seeking an experienced Senior Full Stack Engineer to join our growing engineering team. 
You will work on building and scaling our cloud-native SaaS platform used by thousands of 
enterprise customers.

Required Skills:
- 5+ years of professional software development experience
- Strong proficiency in JavaScript/TypeScript and React
- Experience with Node.js and building RESTful APIs
- Deep understanding of data structures and algorithms
- Experience with SQL databases (PostgreSQL preferred)
- Knowledge of AWS cloud services and Docker
- Strong system design and architecture skills
- Experience with microservices architecture
- Proficiency with Git and CI/CD pipelines

Preferred Skills:
- Experience with GraphQL
- Knowledge of Redis or other caching solutions
- Experience with Kubernetes
- Background in Test-Driven Development
- Understanding of distributed systems

Responsibilities:
- Design and implement scalable backend services
- Build responsive, high-performance frontend applications
- Participate in system architecture and design decisions
- Write clean, maintainable, well-tested code
- Mentor junior engineers and conduct code reviews
- Collaborate with product and design teams
- Optimize application performance and scalability
- Debug production issues and implement fixes

Qualifications:
- Bachelor's degree in Computer Science or related field
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities
- Experience working in Agile/Scrum environments
- Passion for learning new technologies

What We Offer:
- Competitive salary and equity
- Comprehensive health benefits
- Remote-friendly culture
- Professional development opportunities
- Cutting-edge technology stack
```

## Testing Instructions

### Test Case 1: Strong Match
1. Copy the sample resume above
2. Copy the sample job description above
3. Paste both into the platform
4. Expected outcome: Questions aligned with candidate's experience, adaptive difficulty increases for strong responses

### Test Case 2: Partial Match
Modify the resume to remove some skills like GraphQL, Kubernetes, Redis:
- Expected outcome: Questions probe knowledge gaps, difficulty may stabilize at medium

### Test Case 3: Weak Performance Simulation
When answering questions, provide brief, incomplete answers:
- Expected outcome: Difficulty decreases or stabilizes, potential early termination if performance < 30%

### Test Case 4: Time Management Test
Take the full allocated time or exceed it for answers:
- Expected outcome: Time penalty reflected in scores, feedback on time management

### Sample Answers for Testing

#### Good Answer Example (for "Explain difference between sync/async programming"):
```
Synchronous programming executes code sequentially, where each operation must complete before 
the next one begins. This can block the execution thread, making it inefficient for I/O operations. 

Asynchronous programming allows operations to run concurrently without blocking. It uses callbacks, 
promises, or async/await in JavaScript to handle operations that take time, like network requests 
or file I/O.

I would use synchronous code for simple, fast operations that don't involve waiting, like basic 
calculations. For operations involving external resources like API calls, database queries, or 
file operations, asynchronous code is essential to maintain application responsiveness and handle 
multiple requests efficiently.

In my previous project, I used async/await with Node.js to handle thousands of concurrent user 
requests without blocking, improving our application's throughput significantly.
```
Score estimate: 75-85% (good keyword coverage, sufficient depth, well-structured)

#### Weak Answer Example:
```
Synchronous is when code runs one after another. Asynchronous is when code runs at the same time. 
Use async for faster code.
```
Score estimate: 20-30% (minimal depth, lacks key concepts, too brief)
