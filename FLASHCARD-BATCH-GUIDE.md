# Flashcard Batch Addition Guide

## Overview

This system adds 500 comprehensive ABA flashcards to your app in manageable batches of ~30 cards at a time.

## Current Status

- **Current**: 75 flashcards
- **Target**: 500 flashcards  
- **Needed**: 425 flashcards
- **Batches**: 5 batches defined (covering ~155 flashcards)

## How to Use

### Quick Start:

```bash
# Add next batch of flashcards
npm run add-flashcards
```

That's it! Run this command multiple times until you reach 500.

### What It Does:

1. ✅ Checks current flashcard count
2. ✅ Creates automatic backup before changes
3. ✅ Adds next batch (25-35 flashcards)
4. ✅ Validates JSON structure
5. ✅ Updates metadata
6. ✅ Shows progress and breakdown

### Progress Tracking:

The script shows:
- How many flashcards added
- New total count
- Progress percentage
- Remaining to reach 500
- Breakdown by category

## Batch Contents

### Batch 1: Assessment & FBA (30 flashcards)
- Functional analysis procedures
- FBA methods
- Assessment tools
- Conditions and designs

### Batch 2: Teaching & Skill Acquisition (30 flashcards)  
- DTT procedures
- Prompting strategies
- Prompt fading
- Teaching methods

### Batch 3: Verbal Behavior (30 flashcards)
- Mands, tacts, intraverbals, echoics
- Transfer of stimulus control
- Multiple control
- VB teaching strategies

### Batch 4: Measurement & Data (35 flashcards)
- Recording methods
- IOA calculations
- Measurement procedures
- Data collection systems

### Batch 5: Research Methods (30 flashcards)
- Experimental designs
- Single-subject methodology
- Validity threats
- Treatment integrity

## Safety Features

### Automatic Backups:
Every run creates backup in `backups/` folder:
```
backups/content-backup-batch1-[timestamp].json
backups/content-backup-batch2-[timestamp].json
```

### JSON Validation:
- Checks JSON is valid before saving
- Restores from backup if validation fails
- Prevents corrupted files

### Incremental Approach:
- Small batches prevent overwhelming changes
- Can review each batch before adding next
- Easy to rollback if needed

## Example Run:

```bash
$ npm run add-flashcards

╔══════════════════════════════════════════════════════════╗
║       ABA MASTERY - FLASHCARD BATCH ADDER               ║
╚══════════════════════════════════════════════════════════╝

📊 Current Status:
   Flashcards: 75/500
   Progress: 15%

📦 Adding Batch 1...
   Cards in this batch: 30

💾 Backup saved: backups/content-backup-batch1-1760820123456.json

✅ JSON validation passed

╔══════════════════════════════════════════════════════════╗
║                   BATCH COMPLETE!                        ║
╚══════════════════════════════════════════════════════════╝

✅ Added 30 flashcards (Batch 1)
📊 New total: 105/500
📈 Progress: 21%
📉 Remaining: 395

📋 Flashcards by category:
   reinforcement: 25
   assessment: 20
   measurement: 15
   ...

💡 Run again to add Batch 2:
   node run-flashcard-batch.js
```

## Deploying Flashcards

After adding batches:

```bash
# Test locally first
npm start
open http://localhost:5002/app.html

# Then deploy to production
firebase deploy --only hosting
```

## Restoring from Backup

If you need to undo a batch:

```bash
# List backups
ls -lt backups/

# Restore specific backup
cp backups/content-backup-batch2-[timestamp].json content.json
```

## Adding More Batches

To add additional batches beyond the 5 defined:

1. Edit `batch-add-flashcards.js`
2. Add BATCH_6, BATCH_7, etc. following the same format:
```javascript
const BATCH_6 = [
  {cat:'category', q:'Question?', a:'Answer.'},
  // ... more flashcards
];
```
3. Export them at the bottom
4. Script will automatically use them

## Tips

### Quality Over Speed:
- Review each batch before deploying
- Ensure accuracy of content
- Check for typos

### Test After Each Batch:
```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('content.json','utf8')); console.log('✅ Valid')"

# Check count
node -e "const c=JSON.parse(require('fs').readFileSync('content.json','utf8')); console.log('Flashcards:',c.flashcards.length)"
```

### Deploy Periodically:
- Don't wait until all 500
- Deploy after every 2-3 batches
- Get user feedback

## File Structure

```
batch-add-flashcards.js     # Flashcard data (5 batches defined)
run-flashcard-batch.js      # Execution script
content.json                # Your main content file
backups/                    # Automatic backups
```

## Current Coverage (After Defined Batches)

The 5 batches cover:
- ✅ Assessment & FBA methods
- ✅ Teaching procedures
- ✅ Verbal behavior
- ✅ Measurement systems  
- ✅ Research designs

**Total in 5 batches**: ~155 flashcards

**To reach 500**: Need to define 8-10 more batches covering:
- Ethics (50 cards)
- Behavior change procedures (50 cards)
- Stimulus control (40 cards)
- Motivation (30 cards)
- Generalization (30 cards)
- Other topics (65+ cards)

## Quick Commands

```bash
# Add next batch
npm run add-flashcards

# Check current count
node -e "const c=JSON.parse(require('fs').readFileSync('content.json','utf8')); console.log(c.flashcards.length)"

# List backups
ls -lt backups/

# Deploy
firebase deploy --only hosting
```

---

**Ready to add your first batch? Run:**

```bash
npm run add-flashcards
```

This will add Batch 1 (30 flashcards) and create automatic backup!

