                                         AI Interview Platform
AI Interview Platform is a comprehensive Java full-stack web application designed specifically for software engineering aspirants preparing for technical interviews at top IT companies like Infosys, TCS, and Cognizant. Built with Spring Boot, React, and MySQL, it provides AI-powered mock interviews with personalized Java, DSA, SQL questions, real-time feedback, and performance analytics to help you ace your coding interviews.

✨ Features
AI-Powered Questions: Context-aware interview questions on Java, Data Structures, Algorithms, SQL, and System Design

Mock Interview Mode: Timed sessions simulating real interview pressure

Smart Feedback: Detailed code reviews and improvement suggestions

Progress Tracking: Performance analytics and weak area identification

Role-Specific: Tailored questions for SDE-1, SDE-2, Backend Developer roles

Responsive Design: Works perfectly on desktop and mobile

Live Link: https://ai-interview-platform-ten-gray.vercel.app/login

🛠 Tech Stack
Component	Technologies
Frontend	React.js, Tailwind CSS, Axios
Backend	Spring Boot, Hibernate/JPA, Spring Security
Database	MySQL 8.0
AI/ML	Google Gemini API / Ollama
Build Tools	Maven, Vite/NPM
Authentication	JWT Tokens
Deployment	Docker (optional)
🚀 Quick Start
Clone the repository

bash
git clone https://github.com/saiadvaith2004/AI-Interview-Platform.git
cd AI-Interview-Platform
Backend Setup

bash
cd backend
# Copy example config
cp src/main/resources/application-example.properties src/main/resources/application.properties
# Update database credentials in application.properties
mvn clean install
mvn spring-boot:run
Database Setup

sql
CREATE DATABASE interview_platform;
# Run schema.sql if provided
Frontend Setup

bash
cd ../frontend
npm install
npm run dev
Access the platform

Backend API: http://localhost:<backend-port-number>
Frontend: http://localhost:<frontend-port-number>

📁 Project Structure
text
AI-Interview-Platform/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   │   └── com/interview/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/                # React App
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/                    # API Documentation
└── README.md
🔧 Environment Variables
Create .env files in both frontend and backend:

Backend application.properties:

text
spring.datasource.url=jdbc:mysql://localhost:<port_number>/interview_platform
spring.datasource.username=your_username
spring.datasource.password=your_password
gemini.api.key=your_gemini_api_key
jwt.secret=your_jwt_secret
🎯 For Contributors
Fork the repository

Create feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open Pull Request

📄 License
This project is licensed under the MIT License.


## Deployment

- **Backend Deployment**: Render
- **Frontend Deployment**: Vercel
- **Database Deployment**: Railway

