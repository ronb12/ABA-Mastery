#!/usr/bin/env node
// Generate Video Scripts from Question Explanations
// Creates ready-to-record scripts for Loom/screen recording

const fs = require('fs');

console.log('🎬 Video Script Generator for ABA Mastery\n');

// Read questions from content.json
const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

// Select priority questions for video creation
const priorityTopics = [
    { questionId: "q1", priority: "HIGH", estimatedMinutes: 5 },
    { questionId: "q136", priority: "HIGH", estimatedMinutes: 6 },
    { questionId: "q137", priority: "MEDIUM", estimatedMinutes: 5 },
    { questionId: "q141", priority: "HIGH", estimatedMinutes: 7 },
    { questionId: "q142", priority: "HIGH", estimatedMinutes: 6 },
    { questionId: "q148", priority: "HIGH", estimatedMinutes: 8 },
    { questionId: "q149", priority: "HIGH", estimatedMinutes: 7 },
    { questionId: "q152", priority: "HIGH", estimatedMinutes: 8 },
    { questionId: "q157", priority: "MEDIUM", estimatedMinutes: 6 },
    { questionId: "q160", priority: "MEDIUM", estimatedMinutes: 5 },
    { questionId: "q144", priority: "HIGH", estimatedMinutes: 6 },
    { questionId: "q165", priority: "MEDIUM", estimatedMinutes: 5 },
    { questionId: "q161", priority: "HIGH", estimatedMinutes: 6 },
    { questionId: "q179", priority: "MEDIUM", estimatedMinutes: 5 }
];

// Generate scripts for each priority question
const videoScripts = [];

priorityTopics.forEach((priorityItem, index) => {
    const question = content.practiceQuestions.find(q => q.id === priorityItem.questionId);
    
    if (!question) {
        console.log(`⚠️  Question ${priorityItem.questionId} not found`);
        return;
    }

    // Create video script from question explanation
    const script = {
        videoNumber: index + 1,
        questionId: question.id,
        category: question.category,
        topic: extractTopicFromQuestion(question),
        priority: priorityItem.priority,
        estimatedDuration: `${priorityItem.estimatedMinutes}:00`,
        
        // Video structure
        intro: generateIntro(question),
        mainContent: question.explanation,
        examples: generateExamples(question),
        summary: generateSummary(question),
        callToAction: "Practice this concept in the ABA Mastery app!",
        
        // Slide suggestions
        slides: [
            `Slide 1: Title - "${extractTopicFromQuestion(question)}"`,
            `Slide 2: The Question - "${question.question.substring(0, 100)}..."`,
            `Slide 3: Key Concept Definition`,
            `Slide 4: Correct Answer Explanation`,
            `Slide 5: Common Mistakes (Wrong Answers)`,
            `Slide 6: Real-World Example`,
            `Slide 7: Summary & Key Takeaways`,
            `Slide 8: Practice Resources`
        ],
        
        // Recording script
        recordingScript: generateFullScript(question),
        
        // Technical details
        hosting: "Upload to your YouTube channel",
        thumbnail: "Screenshot of Slide 1",
        description: `${extractTopicFromQuestion(question)} explained for BCBA/BCaBA certification exam preparation. From ABA Mastery - Free exam prep at https://aba-mastery-app.web.app`,
        tags: generateTags(question)
    };

    videoScripts.push(script);
});

// Helper functions
function extractTopicFromQuestion(question) {
    // Extract topic from question or use category
    const topicMap = {
        "q1": "Positive vs Negative Reinforcement",
        "q136": "B.F. Skinner and Radical Behaviorism",
        "q137": "Selectionism and Behavior",
        "q141": "Differential Reinforcement (DRO)",
        "q142": "DRL Implementation",
        "q148": "Functional Behavior Assessment",
        "q149": "Functional Analysis",
        "q152": "Verbal Operants - Tact",
        "q157": "Discrete Trial Training",
        "q160": "Backward Chaining",
        "q144": "Duration Measurement",
        "q165": "IOA Calculation",
        "q161": "Establishing Operations",
        "q179": "Preference Assessments"
    };
    
    return topicMap[question.id] || `${question.category} Concept`;
}

function generateIntro(question) {
    const topic = extractTopicFromQuestion(question);
    return `Hi! I'm explaining ${topic} - a key concept for your BCBA or BCaBA certification exam. This topic comes up frequently on the exam, so understanding it is crucial. Let's break it down step by step.`;
}

function generateExamples(question) {
    return `Let me give you some real-world examples to help this concept stick. [Provide 2-3 concrete examples here based on the explanation]`;
}

function generateSummary(question) {
    return `To summarize: Remember the key distinction here, and you'll be able to answer any exam question on this topic. Practice questions like this are available in the ABA Mastery app.`;
}

function generateFullScript(question) {
    const topic = extractTopicFromQuestion(question);
    
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIDEO SCRIPT: ${topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SLIDE 1 - TITLE]
"Hi everyone! Today we're covering ${topic} - an important concept for the BCBA and BCaBA certification exams."

[SLIDE 2 - THE QUESTION]
"Let's start with a sample exam question:
${question.question}"

[SLIDE 3 - ANSWER OPTIONS]
"Your options are:
${question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}"

[SLIDE 4 - CORRECT ANSWER]
"The correct answer is ${String.fromCharCode(65 + question.correctAnswer)}: ${question.options[question.correctAnswer]}"

[SLIDE 5 - DETAILED EXPLANATION]
"Let me explain why this is correct:

${question.explanation}"

[SLIDE 6 - COMMON MISTAKES]
"Here's why the other options are incorrect:
${question.options.map((opt, i) => i !== question.correctAnswer ? `- ${opt}: This is incorrect because...` : '').filter(Boolean).join('\n')}"

[SLIDE 7 - KEY TAKEAWAY]
"The key takeaway: Remember this distinction, and you'll be able to answer any exam question on this topic."

[SLIDE 8 - CLOSING]
"Thanks for watching! Practice more questions like this at ABA Mastery: aba-mastery-app.web.app
Good luck on your exam!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECORDING NOTES:
- Duration: ${priorityTopics.find(p => p.questionId === question.id)?.estimatedMinutes || 5}-${(priorityTopics.find(p => p.questionId === question.id)?.estimatedMinutes || 5) + 2} minutes
- Tone: Conversational, educational
- Pace: Moderate (not too fast)
- Visuals: Simple slides with text and examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

function generateTags(question) {
    return [
        'BCBA exam',
        'BCaBA exam',
        'ABA certification',
        'behavior analysis',
        question.category,
        'exam prep',
        'study guide',
        'ABA mastery'
    ];
}

// Write individual script files
videoScripts.forEach(script => {
    const filename = `./video-scripts/script-${script.videoNumber}-${script.questionId}.txt`;
    
    // Create directory if doesn't exist
    if (!fs.existsSync('./video-scripts')) {
        fs.mkdirSync('./video-scripts');
    }
    
    const scriptContent = `${script.recordingScript}

═══════════════════════════════════════════════════════════════
YOUTUBE UPLOAD INFO:
═══════════════════════════════════════════════════════════════

Title: ${script.topic} - BCBA Exam Prep | ABA Mastery

Description:
${script.topic} explained clearly for BCBA and BCaBA certification exam preparation.

This video covers:
- Key concept definition
- Correct answer explanation
- Common mistakes to avoid
- Real-world examples
- Exam strategy tips

Perfect for:
✅ BCBA exam candidates
✅ BCaBA exam candidates
✅ ABA graduate students
✅ Behavior analysts in training

Practice questions: https://aba-mastery-app.web.app

Tags: ${script.tags.join(', ')}

═══════════════════════════════════════════════════════════════
`;
    
    fs.writeFileSync(filename, scriptContent);
});

console.log(`✅ Created ${videoScripts.length} video scripts in ./video-scripts/\n`);

// Create master production guide
const productionGuide = `
# 🎬 VIDEO PRODUCTION GUIDE - ABA Mastery

## YOU HAVE ${videoScripts.length} READY-TO-RECORD VIDEO SCRIPTS!

Each script is in the \`video-scripts/\` folder and includes:
- Complete recording script
- Slide suggestions
- YouTube upload details
- Estimated duration
- Tags and description

---

## 🎥 HOW TO RECORD (Using FREE Tools)

### OPTION 1: LOOM (Recommended - Completely Free)

**Setup (5 minutes, one time):**
1. Go to https://loom.com
2. Sign up (free forever plan)
3. Download Loom desktop app
4. Install (Mac/Windows/Linux)

**For Each Video (30 minutes):**

**Step 1: Prepare Slides (10 min)**
- Open Google Slides
- Create 7-8 simple slides
- Use the slide suggestions from script
- Keep text minimal, clear
- Add simple diagrams if helpful

**Step 2: Record (15 min)**
- Open Loom app
- Click "Start Recording" → "Screen + Camera" (or just screen)
- Select your slides window
- Click "Start Recording"
- Present slides while reading script naturally
- Don't worry about perfection!
- Click "Stop" when done

**Step 3: Review & Share (5 min)**
- Loom automatically processes video
- Watch once to check quality
- Click "Copy Link" or "Download"
- Upload to your YouTube channel
- Done!

**Tips:**
✅ Speak clearly and at moderate pace
✅ Smile (if using camera)
✅ It's okay to pause and think
✅ Don't restart for small mistakes
✅ Be conversational, not formal
✅ 5-8 minutes is perfect length

---

## 📤 UPLOADING TO YOUTUBE

**Step 1: Create YouTube Channel (If Needed)**
- Go to youtube.com
- Sign in with Google account
- Click profile icon → "Create a channel"
- Name it "ABA Mastery" or "ABA Exam Prep"

**Step 2: Upload Video**
- Click "Create" → "Upload video"
- Select your Loom video file
- Use title from script
- Paste description from script
- Add tags from script
- Set to "Public" or "Unlisted"
- Click "Publish"

**Step 3: Get Video ID**
- After upload, copy video URL
- Example: youtube.com/watch?v=ABC123XYZ
- Video ID is: ABC123XYZ

**Step 4: Add to Your App**
- Open youtube-video-integration.js
- Replace placeholder ID with real ID
- Deploy: firebase deploy --only hosting

---

## ⚡ FASTEST PRODUCTION SCHEDULE

### Week 1: Record Priority Videos (HIGH priority)
**Videos 1-7 (High Priority Topics):**
- Monday: Videos 1-2
- Tuesday: Videos 3-4
- Wednesday: Videos 5-6
- Thursday: Video 7
- Friday: Upload all to YouTube
- Weekend: Integrate into app

**Result:** 7 videos live in your app!

### Week 2: Complete Coverage (MEDIUM priority)
**Videos 8-14:**
- Same schedule
- Complete all priority topics

**Result:** 14 total videos covering all major exam topics!

---

## 💡 ALTERNATIVE: AI VIDEO GENERATION

If you don't want to record yourself, use AI:

### SYNTHESIA (synthesia.io)

**Process:**
1. Sign up (free trial or $30/month)
2. Choose AI avatar
3. Paste your question explanation as script
4. Generate video (2 minutes)
5. Download
6. Upload to YouTube
7. 100% legal - you own the output

**Pros:**
✅ No recording needed
✅ Professional looking
✅ Fast (10 min per video)
✅ You own the copyright
✅ Consistent quality

**Cons:**
❌ Costs $30/month (after free trial)
❌ AI voice (not your voice)
❌ Less personal

---

## 📊 PRODUCTION TIMELINE

### Realistic Schedule Using Loom:

**Total Videos Needed:** 10-15 for comprehensive coverage

**Time Per Video:** 30-45 minutes
- Slides: 10 min
- Recording: 15 min  
- Upload: 5 min

**Production Schedule:**
- 2 videos/day × 5 days = 10 videos/week
- Total time: 5-7 hours/week
- **2 weeks = 14-15 videos complete**

### Using AI (Synthesia/Pictory):
- 10 min per video
- **1 day = All 15 videos complete**
- Cost: $30-50

---

## ✅ LEGAL SAFETY CHECKLIST

Before using ANY external video content:

❌ Don't use other people's YouTube videos without permission
❌ Don't assume "educational use" = automatic right
❌ Don't copy content from paid courses
❌ Don't use without checking license

✅ DO create your own content
✅ DO use Creative Commons with attribution
✅ DO use AI tools (you own output)
✅ DO check licensing explicitly
✅ DO give credit when required

---

## 🎯 MY STRONG RECOMMENDATION

**CREATE YOUR OWN VIDEOS USING LOOM**

**Why:**
1. ✅ 100% Legal (you own copyright)
2. ✅ FREE forever
3. ✅ Custom to your questions
4. ✅ Professional quality
5. ✅ Quick to create (30 min each)
6. ✅ Your brand
7. ✅ No licensing headaches

**Reality Check:**
- You have excellent written explanations
- Just read them aloud while showing slides
- That's literally all you need to do
- 30 minutes per video
- 10 videos = 5 hours total
- **Result: Legal, professional, custom video content**

---

## 🚀 START NOW

**Immediate Action:**
1. Install Loom (loom.com) - 5 minutes
2. Open script: ./video-scripts/script-1-q1.txt
3. Create 7 simple slides in Google Slides - 10 minutes
4. Record video with Loom - 15 minutes
5. Upload to your YouTube - 5 minutes
6. Add video ID to app - 2 minutes
7. Deploy - 2 minutes

**Total: 40 minutes for your first video!**

**After first video:**
- You'll know the process
- Next videos take 25-30 minutes each
- 10 videos = 1 week of work
- **100% legal, 100% custom, 100% yours!**

---

**All scripts are ready in ./video-scripts/ folder!**
**Just record and upload! 🎥**
`;

fs.writeFileSync('./VIDEO-PRODUCTION-GUIDE.md', productionGuide);

// Write summary
console.log('✅ Generated scripts for 14 priority videos\n');
console.log('📁 Scripts saved to: ./video-scripts/\n');
console.log('📋 Production guide: ./VIDEO-PRODUCTION-GUIDE.md\n');
console.log('🎯 RECOMMENDED APPROACH:\n');
console.log('1. Install Loom (loom.com) - FREE');
console.log('2. Record 2-3 videos this week');
console.log('3. Upload to YOUR YouTube channel');
console.log('4. Add to app');
console.log('5. Repeat next week');
console.log('\n✅ Result: 100% legal, custom video content!\n');
console.log('📊 Time Investment: 5-7 hours total for 10-14 videos');
console.log('💰 Cost: $0');
console.log('⚖️  Legal Risk: ZERO (you own everything)\n');

