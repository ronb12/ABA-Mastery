#!/usr/bin/env node
const fs = require('fs');
const dir = './realistic-scenarios-batches';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

console.log('🚀 GENERATING REMAINING 300 REALISTIC SCENARIOS (Batches 5-10)\n');

const ages = [3,4,5,6,7,8,9,10,11,12,14,16,18,22,25];
const dx = ['autism','developmental disabilities','ADHD','intellectual disability'];
const set = ['classroom','clinic','home','community'];

let all = [];
let id = 201;

// Generate 300 varied realistic scenarios across remaining categories
for (let batch = 5; batch <= 10; batch++) {
  const scenarios = [];
  
  for (let i = 0; i < 50; i++) {
    const age = ages[Math.floor(Math.random() * ages.length)];
    const diagnosis = dx[Math.floor(Math.random() * dx.length)];
    const setting = set[Math.floor(Math.random() * set.length)];
    
    // Vary scenarios by batch topic
    let category, scenario, question, options, correct, explanation, keywords;
    
    if (batch === 5) { // Measurement
      category = 'measurement';
      const rate = 10 + Math.floor(Math.random() * 20);
      scenario = `A behavior technician collects data on ${['engagement','compliance','interaction','requesting'][i%4]} for a ${age}-year-old with ${diagnosis} in ${setting}. Using ${['partial interval','whole interval','frequency','duration'][i%4]} recording during ${20+i} minutes, data shows ${['behavior in '+(30+i)+' of 60 intervals',''+rate+' occurrences','total duration of '+(5+i)+' minutes'][i%3]}.`;
      question = 'What measurement method is used and what is its primary characteristic?';
      options = ['Partial interval - overestimates','Whole interval - underestimates','Frequency - counts instances','Duration - measures time'];
      correct = String.fromCharCode(65 + (i % 4));
      explanation = `${options[i%4].split('-')[0]} is being used. This method ${['tends to overestimate behavior because any occurrence in interval scores it positive','underestimates because behavior must occur throughout entire interval','provides exact count of discrete occurrences','measures total time behavior occurs from start to finish'][i%4]}.`;
      keywords = [options[i%4].split('-')[0].trim().toLowerCase(),'measurement','data collection'];
    }
    else if (batch === 6) { // Experimental Design
      category = 'experimental-design';
      scenario = `A researcher evaluates an intervention using ${['multiple baseline across 3 participants','ABAB reversal design','alternating treatments design'][i%3]}. ${['Intervention introduced at different times for each participant, behavior changes only when intervention starts','Intervention added (behavior improves), removed (behavior worsens), readded (behavior improves again)','Two treatments rapidly alternated with discriminative stimuli, data shows one more effective'][i%3]}.`;
      question = 'What design demonstrates experimental control?';
      options = ['Multiple baseline','Reversal (ABAB)','Alternating treatments','Changing criterion'];
      correct = String.fromCharCode(65 + (i % 3));
      explanation = `${options[i%3]} design demonstrates experimental control by ${['staggered intervention showing behavior changes only when intervention introduced','systematic addition/removal showing intervention controls behavior','rapid alternation comparing treatment effectiveness'][i%3]}.`;
      keywords = [options[i%3].toLowerCase(),'experimental design','experimental control'];
    }
    else if (batch === 7) { // Ethics
      category = 'ethics-professional';
      scenario = `A BCBA is ${['contacted about providing services for a client currently with another BCBA','asked to give professional opinion without conducting assessment','supervising an RBT who implemented unauthorized procedures'][i%3]}. The ${['parent wants to switch providers','school wants quick consultation','supervisor must address the violation'][i%3]}.`;
      question = 'What is the BCBA\'s primary ethical obligation?';
      options = ['Accept immediately','Contact current provider first / Decline without assessment / Document and provide training','Decline to avoid conflict','Provide opinion with disclaimer'];
      correct = 'B';
      explanation = `BACB Ethics Code requires ${['contacting current providers before providing services','conducting appropriate assessment before professional opinions','supervisors to provide training and oversight when violations occur'][i%3]}. This protects client welfare and maintains professional standards.`;
      keywords = ['ethics','professional conduct','BACB ethics code'];
    }
    else if (batch === 8) { // Verbal Behavior
      category = 'verbal-behavior';
      const operants = ['mand','tact','echoic','intraverbal'];
      const op = operants[i%4];
      scenario = `A ${age}-year-old child ${op==='mand'?'wants cookie and says "cookie" - receives cookie':op==='tact'?'sees cookie and says "cookie" - receives praise':op==='echoic'?'hears "say cookie" and says "cookie" - receives praise':'hears "what do you eat?" and says "cookie" - receives praise'}. The verbal response was ${op==='mand'?'under control of motivation (MO) and produced specific reinforcement':op==='tact'?'under control of nonverbal stimulus (cookie present)':op==='echoic'?'under control of verbal stimulus with point-to-point correspondence':'under control of verbal stimulus without correspondence'}.`;
      question = 'What verbal operant is demonstrated?';
      options = ['Mand','Tact','Echoic','Intraverbal'];
      correct = String.fromCharCode(65 + (i%4));
      explanation = `${operants[i%4].charAt(0).toUpperCase()+operants[i%4].slice(1)} - ${op==='mand'?'request under MO control producing specific reinforcement':op==='tact'?'label evoked by nonverbal stimulus producing generalized reinforcement':op==='echoic'?'vocal imitation with point-to-point correspondence and formal similarity':'verbal response to verbal stimulus without point-to-point correspondence'}.`;
      keywords = [op,'verbal behavior','Skinner','verbal operants'];
    }
    else if (batch === 9) { // Supervision
      category = 'supervision';
      scenario = `A BCBA supervisor observes an RBT ${['implementing DTT incorrectly','using unauthorized punishment','collecting data with errors'][i%3]} during sessions with a ${age}-year-old client. ${['Client safety may be affected','Treatment integrity is 60%','Data shows no progress'][i%3]}. This is ${['first occurrence','repeated pattern','ongoing issue'][i%3]}.`;
      question = 'What is the supervisor\'s immediate responsibility?';
      options = ['Terminate RBT','Provide immediate corrective feedback and retraining','Document only','Report to BACB'];
      correct = 'B';
      explanation = `Supervisors must provide immediate corrective feedback when errors affect client welfare or treatment integrity. This protects clients and addresses skill deficits. Termination may be premature without training. Documentation alone doesn't address the issue. BACB reporting required only for serious violations. Supervision requires ongoing training and oversight.`;
      keywords = ['supervision','RBT oversight','corrective feedback','treatment integrity'];
    }
    else { // Batch 10 - Mixed Advanced
      category = 'advanced-application';
      scenario = `A BCBA develops comprehensive treatment for a ${age}-year-old with ${diagnosis} showing ${['multiple problem behaviors','complex skill deficits','co-occurring challenges'][i%3]}. Assessment reveals ${['multiple maintaining functions','various skill needs','individualized requirements'][i%3]}. Treatment must address ${['function-based intervention','skill acquisition','comprehensive needs'][i%3]} using ${['multi-component approach','individualized protocols','evidence-based practices'][i%3]}.`;
      question = 'What approach is most appropriate for complex cases?';
      options = ['Address one issue at a time','Implement comprehensive individualized function-based treatment','Use standard protocol regardless of assessment','Focus only on most severe behavior'];
      correct = 'B';
      explanation = `Complex cases require comprehensive, individualized, function-based approaches addressing all maintaining variables and skill deficits simultaneously. Sequential treatment of single issues may be less efficient. Standard protocols ignore individual differences. Addressing only severe behavior neglects other important targets. Best practice combines functional assessment, individualized intervention, and multi-component treatment.`;
      keywords = ['individualization','comprehensive treatment','function-based','complex cases'];
    }
    
    scenarios.push({
      id: `scenario-${String(id++).padStart(3,'0')}`,
      type: 'scenario',
      difficulty: ['beginner','intermediate','advanced'][i%3],
      category,
      scenario,
      question,
      options: typeof options === 'string' ? options.split('/').map(o=>o.trim()) : options,
      correctAnswer: correct,
      explanation,
      bacbTaskList: ['FK-01','G-1'],
      keywords
    });
  }
  
  fs.writeFileSync(dir + `/realistic-batch-${batch}.json`, JSON.stringify(scenarios, null, 2));
  console.log(`   ✅ Batch ${batch}: 50 scenarios`);
  all = all.concat(scenarios);
}

console.log(`\n✅ COMPLETE! Generated all 300 scenarios (batches 5-10)\n`);
console.log(`📊 Total realistic scenarios available: 500 (batches 1-10)\n`);
