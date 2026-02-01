# 📁 Project Structure

Complete file organization for the AI Mock Interview Platform

## Directory Tree

```
ai-mock-interview-platform/
│
├── 📄 index.html                          # Entry HTML file
├── 📄 package.json                        # Dependencies & scripts
├── 📄 vite.config.js                      # Vite build configuration
├── 📄 tailwind.config.js                  # Tailwind CSS config
├── 📄 postcss.config.js                   # PostCSS config
├── 📄 .gitignore                          # Git ignore rules
│
├── 📚 Documentation Files
│   ├── 📄 README.md                       # Main documentation
│   ├── 📄 QUICK_START.md                  # Quick setup guide
│   ├── 📄 DOCUMENTATION.md                # Detailed technical docs
│   └── 📄 PROJECT_STRUCTURE.md            # This file
│
└── 📁 src/                                # Source code
    ├── 📄 main.jsx                        # React entry point
    ├── 📄 App.jsx                         # App wrapper component
    ├── 📄 index.css                       # Global styles + Tailwind
    │
    ├── 📁 components/
    │   └── 📄 MockInterviewPlatform.jsx   # Main interview component
    │
    └── 📁 utils/
        └── 📄 InterviewEngine.js          # Core interview logic
```

## File Descriptions

### Root Configuration Files

#### `index.html`
- Entry point HTML template
- Contains root div for React mounting
- Imports main.jsx module

#### `package.json`
- Project dependencies (React, Tailwind, Lucide, Vite)
- NPM scripts (dev, build, preview)
- Project metadata

#### `vite.config.js`
- Vite development server configuration
- React plugin setup
- Port configuration (3000)
- Auto-open browser setting

#### `tailwind.config.js`
- Tailwind CSS configuration
- Content paths for purging
- Theme customization (if any)

#### `postcss.config.js`
- PostCSS plugins configuration
- Tailwind CSS processing
- Autoprefixer setup

#### `.gitignore`
- Git ignore patterns
- Excludes node_modules, build outputs
- Excludes environment files

### Documentation Files

#### `README.md` (Main Documentation)
**Purpose:** Primary project documentation
**Contents:**
- Feature overview
- Quick start guide
- Technology stack
- Usage instructions
- Customization guide
- Troubleshooting

**Audience:** All users (developers, users, contributors)

#### `QUICK_START.md`
**Purpose:** Get users running quickly
**Contents:**
- Minimal setup steps
- First interview walkthrough
- Common commands
- Quick tips

**Audience:** New users wanting to try quickly

#### `DOCUMENTATION.md`
**Purpose:** Comprehensive technical documentation
**Contents:**
- System architecture
- Algorithm details
- API reference
- Customization guide
- Performance optimization

**Audience:** Developers, contributors, advanced users

#### `PROJECT_STRUCTURE.md`
**Purpose:** Understand project organization
**Contents:**
- Directory tree
- File descriptions
- Dependencies explained

**Audience:** Developers exploring the codebase

### Source Code Files

#### `src/main.jsx`
**Purpose:** React application entry point
**Responsibilities:**
- Import React and ReactDOM
- Mount App component to DOM
- Import global styles
**Lines of Code:** ~10

#### `src/App.jsx`
**Purpose:** Root application component
**Responsibilities:**
- Wrap MockInterviewPlatform component
- Could add routing or global providers (future)
**Lines of Code:** ~10

#### `src/index.css`
**Purpose:** Global styles and Tailwind directives
**Contents:**
- Tailwind base, components, utilities imports
- Global CSS resets
- Font configurations
**Lines of Code:** ~20

#### `src/components/MockInterviewPlatform.jsx`
**Purpose:** Main UI component for interview platform
**Responsibilities:**
- Manage interview stages (setup, interview, results)
- Handle user interactions
- Display questions and evaluations
- Render final report
- Timer management
**Key Features:**
- 3 stage views (Setup, Interview, Results)
- Real-time countdown timer
- Sample data loading
- Responsive design
**Lines of Code:** ~450

**Component Structure:**
```
MockInterviewPlatform
├── Setup Stage
│   ├── Resume input
│   ├── Job description input
│   └── Start button
│
├── Interview Stage
│   ├── Question header (number, category, difficulty, timer)
│   ├── Progress bar
│   ├── Question display
│   ├── Evaluation feedback (after submission)
│   └── Answer textarea + submit button
│
└── Results Stage
    ├── Overall score card
    ├── Skill area breakdown
    ├── Strengths & weaknesses
    ├── Actionable feedback
    ├── Statistics
    └── Reset button
```

#### `src/utils/InterviewEngine.js`
**Purpose:** Core interview logic and algorithms
**Responsibilities:**
- Parse resume and job description
- Generate questions based on difficulty
- Evaluate responses objectively
- Adapt difficulty dynamically
- Determine early termination
- Generate final report

**Class Structure:**
```
InterviewEngine
├── Constructor
│   ├── Initialize state
│   ├── Parse resume
│   └── Parse job description
│
├── Parsing Methods
│   ├── parseResume()
│   └── parseJobDescription()
│
├── Question Management
│   ├── generateQuestion()
│   └── selectQuestion()
│
├── Evaluation Methods
│   ├── evaluateResponse()
│   ├── evaluateQuality()
│   ├── extractKeywords()
│   └── generateFeedback()
│
├── Adaptive Logic
│   ├── adaptDifficulty()
│   ├── getAverageScore()
│   └── shouldTerminateEarly()
│
└── Reporting Methods
    ├── generateFinalReport()
    ├── analyzeSkillAreas()
    ├── identifyStrengths()
    ├── identifyWeaknesses()
    └── generateActionableFeedback()
```

**Lines of Code:** ~700

**Key Features:**
- 40+ questions across 4 categories and 3 difficulties
- Advanced text analysis for resume parsing
- Multi-factor quality evaluation algorithm
- Adaptive difficulty system
- Early termination logic
- Comprehensive reporting

## Dependencies

### Production Dependencies

#### `react` (^18.2.0)
- Core React library
- Used for: UI components, state management, lifecycle

#### `react-dom` (^18.2.0)
- React DOM renderer
- Used for: Mounting React to HTML DOM

#### `lucide-react` (^0.263.1)
- Icon library
- Used for: All UI icons (Upload, Play, Clock, Award, etc.)
- Icons used: ~10 different icons

### Development Dependencies

#### `@vitejs/plugin-react` (^4.2.1)
- Vite plugin for React
- Used for: Fast HMR, JSX transformation

#### `autoprefixer` (^10.4.16)
- PostCSS plugin
- Used for: CSS vendor prefixing

#### `postcss` (^8.4.32)
- CSS processor
- Used for: Tailwind CSS processing

#### `tailwindcss` (^3.4.0)
- Utility-first CSS framework
- Used for: All styling in the application

#### `vite` (^5.0.8)
- Build tool and dev server
- Used for: Development server, production builds

## Build Outputs

### Development Mode (`npm run dev`)
```
No build files - runs from memory
Hot Module Replacement (HMR) enabled
Accessible at: http://localhost:3000
```

### Production Build (`npm run build`)
```
dist/
├── index.html              # Optimized HTML
├── assets/
│   ├── index-[hash].js     # Bundled JavaScript
│   └── index-[hash].css    # Bundled CSS
└── ...
```

**Optimizations:**
- Code splitting
- Tree shaking
- Minification
- Asset hashing for cache busting

## Code Statistics

### Total Lines of Code
```
Main Application:      ~1,150 lines
├── InterviewEngine:      ~700 lines
├── MockInterviewPlatform: ~450 lines
└── Other files:          ~50 lines

Configuration:         ~100 lines
Documentation:         ~1,500 lines
──────────────────────────────────
Total Project:         ~2,750 lines
```

### File Size (Uncompressed)
```
Source Code:           ~85 KB
Dependencies:          ~500 KB (node_modules)
Documentation:         ~50 KB
```

### Bundle Size (Production Build)
```
JavaScript:            ~150 KB (gzipped: ~50 KB)
CSS:                   ~10 KB (gzipped: ~3 KB)
Total:                 ~160 KB (gzipped: ~53 KB)
```

## Development Workflow

### 1. Setup
```bash
npm install              # Install dependencies
```

### 2. Development
```bash
npm run dev              # Start dev server
# Make changes → Hot reload automatically
```

### 3. Testing
```bash
# Manual testing in browser
# Check console for errors
```

### 4. Build
```bash
npm run build            # Create production build
npm run preview          # Preview production build
```

### 5. Deployment
```bash
# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - Any static host
```

## Extension Points

### Easy Customizations
1. **Add Questions**: Edit `InterviewEngine.js` → `selectQuestion()`
2. **Change Styling**: Edit Tailwind classes in `MockInterviewPlatform.jsx`
3. **Modify Thresholds**: Edit constants in `InterviewEngine.js`
4. **Add Analytics**: Insert tracking code in `App.jsx`

### Medium Customizations
1. **New Question Categories**: Update question bank + skill areas
2. **Custom Scoring**: Modify `evaluateQuality()` algorithm
3. **Different Reports**: Extend `generateFinalReport()`
4. **Multi-language**: Add translation files

### Advanced Customizations
1. **Backend Integration**: Add API calls for question storage
2. **Real AI Evaluation**: Integrate Claude/GPT API
3. **User Authentication**: Add login/signup flows
4. **Database**: Store interview history
5. **Analytics Dashboard**: Track progress over time

## Best Practices

### Code Organization
✅ Separation of concerns (UI vs Logic)
✅ Single responsibility principle
✅ Clear naming conventions
✅ Comprehensive comments

### State Management
✅ React hooks for local state
✅ useRef for timers and DOM refs
✅ Minimal prop drilling

### Performance
✅ No unnecessary re-renders
✅ Efficient algorithms
✅ Lazy evaluation where possible

### Maintainability
✅ Clear file structure
✅ Extensive documentation
✅ Easy to extend
✅ Configuration constants

---

**Need to find something specific?**
- Config issue? → Check root `.js` files
- UI component? → Check `src/components/`
- Interview logic? → Check `src/utils/InterviewEngine.js`
- Setup help? → Check `QUICK_START.md`
- Technical details? → Check `DOCUMENTATION.md`
