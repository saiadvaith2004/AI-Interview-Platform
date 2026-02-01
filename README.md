# 🎯 AI-Powered Mock Interview Platform

A sophisticated interview simulation system that adapts to candidate performance in real-time, providing objective evaluation and actionable feedback - just like a real interviewer.

## 🌟 Features

### Core Capabilities

- **📄 Intelligent Resume & JD Analysis**
  - Extracts skills, experience, and projects from resume
  - Identifies role requirements and technical stack from job description
  - Aligns questions with candidate profile and job needs

- **🎲 Adaptive Question System**
  - 4 Question Categories: Technical, Behavioral, Scenario-based, Conceptual
  - 3 Difficulty Levels: Easy → Medium → Hard
  - Dynamic difficulty adjustment based on performance
  - 40+ diverse questions across all categories

- **⏱️ Strict Time Management**
  - Fixed time limits per question (90-180 seconds)
  - Real-time countdown timer
  - Automatic submission on timeout
  - Time efficiency scoring with penalties/bonuses

- **📊 Objective Evaluation System**
  - Quality scoring based on depth, relevance, and structure
  - Keyword matching for technical accuracy
  - Response structure analysis (examples, explanations)
  - Time efficiency metrics

- **🚨 Early Termination Logic**
  - Monitors performance after minimum 3 questions
  - Terminates if average score < 30%
  - Clear feedback on termination reasons

- **📈 Comprehensive Final Report**
  - Interview Readiness Score (0-100)
  - Skill area breakdown (Technical, Behavioral, etc.)
  - Strengths and weaknesses identification
  - Actionable improvement feedback
  - Hiring readiness indicator

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Extract the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📖 How to Use

### Step 1: Setup
1. Paste your resume in the first text area
2. Paste the target job description in the second text area
3. Or click "Load Sample Resume & Job Description" to try with demo data
4. Click "Start Interview"

### Step 2: Interview
1. Read each question carefully
2. Type your answer in the text area
3. Watch the timer - you have 90-180 seconds per question
4. Click "Submit Answer" or let it auto-submit on timeout
5. Review your evaluation feedback
6. Proceed to the next question

### Step 3: Results
1. View your overall Interview Readiness Score
2. Analyze performance by skill area
3. Review strengths and weaknesses
4. Read actionable feedback for improvement
5. Check hiring readiness indicator

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

### Architecture
- **Client-side only** - No backend required
- **Pure JavaScript algorithms** - All evaluation logic runs in browser
- **Rule-based AI** - Sophisticated scoring without API calls

## 📁 Project Structure

```
ai-mock-interview-platform/
├── src/
│   ├── components/
│   │   └── MockInterviewPlatform.jsx    # Main component
│   ├── utils/
│   │   └── InterviewEngine.js           # Core interview logic
│   ├── App.jsx                           # App wrapper
│   ├── main.jsx                          # Entry point
│   └── index.css                         # Global styles
├── index.html                            # HTML template
├── package.json                          # Dependencies
├── vite.config.js                        # Vite configuration
├── tailwind.config.js                    # Tailwind configuration
├── postcss.config.js                     # PostCSS configuration
└── README.md                             # This file
```

## 🎯 Interview Engine Logic

### Resume Parser
- Extracts skills using keyword matching
- Identifies years of experience with regex
- Finds projects and accomplishments

### Job Description Parser
- Determines role type (Frontend, Backend, Full Stack, etc.)
- Extracts required skills and technologies
- Identifies experience level (Junior, Mid, Senior)

### Question Selection
- Chooses from 40+ pre-defined questions
- Balances categories across interview
- Adjusts difficulty based on performance

### Evaluation Algorithm
```javascript
Quality Score (0-100%) = 
  Base Score (50%) +
  Word Count Assessment (±20%) +
  Keyword Relevance (20%) +
  Structure Indicators (20%) +
  Technical/Behavioral Depth (15%)

Final Score = Quality × Base Points × Time Efficiency
```

### Adaptive Difficulty
- **Increase**: Average score > 75% → next difficulty level
- **Decrease**: Average score < 50% → previous difficulty level
- **Maintain**: Average score 50-75% → same difficulty level

### Early Termination
- Triggers after 3+ questions
- Average score < 30% threshold
- Provides clear improvement recommendations

## 🎨 Customization

### Modify Questions
Edit `src/utils/InterviewEngine.js` → `selectQuestion()` method

### Change Difficulty Thresholds
Edit `src/utils/InterviewEngine.js` → `adaptDifficulty()` method

### Adjust Time Limits
Modify the `time` property in question objects

### Update Scoring Logic
Edit `src/utils/InterviewEngine.js` → `evaluateQuality()` method

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📊 Evaluation Criteria

### Quality Metrics
- **Depth**: Comprehensive explanations
- **Relevance**: Keyword matching with question
- **Structure**: Examples, explanations, logical flow
- **Technical Accuracy**: Appropriate terminology usage

### Time Efficiency
- **On-time**: Full score (100%)
- **Quick & Quality**: Bonus (120%)
- **Overtime**: Penalty (50%)

### Performance Categories
- **Strong (75-100%)**: Ready to Hire
- **Average (50-74%)**: Conditional - Needs Development
- **Needs Improvement (<50%)**: Not Ready

## 🎓 Best Practices for Candidates

1. **Be Specific**: Use concrete examples from your experience
2. **Structure Your Answers**: Problem → Approach → Solution → Result
3. **Manage Time**: Aim for 60-80% of allocated time
4. **Show Depth**: Explain the "why" behind your decisions
5. **Stay Relevant**: Address all parts of the question

## 🐛 Troubleshooting

### Issue: App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Styling not applied
```bash
# Rebuild Tailwind
npm run dev
```

### Issue: Timer not working
- Check browser console for errors
- Ensure JavaScript is enabled

## 📝 License

MIT License - Free to use and modify

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 💡 Future Enhancements

Potential additions:
- Real AI integration (Claude/GPT APIs)
- User authentication and history
- Database storage for interviews
- Analytics dashboard
- Custom question banks
- Video/audio interview mode
- Multi-language support

## 📧 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ to help candidates ace their interviews!**

<video controls src="Screen Recording 2026-02-01 181002-1.mp4" title="Recorded Video"></video>