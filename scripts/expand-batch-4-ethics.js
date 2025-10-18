#!/usr/bin/env node
// BATCH 4: Ethics & Professional Conduct (5 topics)

const fs = require('fs');
console.log('\n📚 BATCH 4: Ethics & Professional Conduct (5 topics)\n');

const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

function updateTopic(categoryId, topicId, newContent) {
    const category = content.categories.find(c => c.id === categoryId);
    if (category) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic) {
            topic.content = newContent;
            console.log(`✅ ${topic.title} (${newContent.split(/\s+/).length} words)`);
            return true;
        }
    }
    return false;
}

updateTopic('ethics', 'ethics-1', `The BACB Professional and Ethical Compliance Code establishes standards for behavior analyst conduct. Adherence protects clients, maintains field integrity, and ensures professional accountability.

PURPOSE AND AUTHORITY:
The Ethics Code provides enforceable professional standards for all BACB certificants (BCBA, BCBA-D, BCaBA, RBT). Violations can result in sanctions including remedial training, supervision requirements, suspension, or revocation of certification.

CORE PRINCIPLES:

COMPETENCE:
Practice only within boundaries of competence based on education, training, supervised experience, and professional credentials.

Requirements: Maintain knowledge of current research and practice, Engage in continuing education, Seek supervision when needed, Refer cases outside competence, Don't misrepresent qualifications.

Example: Don't treat feeding disorders without specific training in feeding interventions.

INTEGRITY:
Be honest and truthful in professional activities. Accurately represent credentials, experience, and affiliations.

Requirements: Don't make false statements, Accurately represent effectiveness of services, Truthful in data reporting, Acknowledge limitations, Credit others' work appropriately.

Violations: Fabricating credentials, Misrepresenting research outcomes, Plagiarism, False advertising.

PROFESSIONAL RELATIONSHIPS:
Maintain appropriate boundaries with clients, supervisees, students, and colleagues.

Requirements: Avoid multiple relationships that impair objectivity, Don't exploit clients for personal gain, Maintain sexual and romantic boundaries, Manage conflicts of interest, Be aware of power differentials.

Examples: Don't date clients, Don't hire clients for personal services, Don't enter business partnerships with current clients.

RESPONSIBILITY TO CLIENTS:
Prioritize client welfare and rights. Provide competent, ethical services.

Requirements: Informed consent before services, Involve clients in goal selection, Use least restrictive effective procedures, Protect client dignity, Modify ineffective interventions, Transition/terminate appropriately.

CLIENT RIGHTS: Effective treatment, Humane care, Dignity and respect, Participation in decisions, Confidentiality.

MAJOR SECTIONS OF ETHICS CODE:

SECTION 1: RESPONSIBLE CONDUCT OF BEHAVIOR ANALYSTS:
Reliance on scientific knowledge, Competent practice, Record keeping, Avoiding conflicts of interest, Multiple relationships management, Professional boundaries, Exploitation avoidance.

KEY: Practice evidence-based procedures, maintain competence, manage relationships professionally.

SECTION 2: BEHAVIOR ANALYSTS' RESPONSIBILITY TO CLIENTS:
Defining professional relationships, Accepting clients appropriately, Informed consent/assent, Involving clients in planning, Environmental conditions for behavior change, Describing treatment objectives and procedures, Ongoing assessment and data-based decisions.

Protecting confidentiality, Maintaining records, Communicating about services, Fees and financial arrangements, Accuracy in billing, Transitions and termination.

KEY: Client welfare is paramount. Informed, collaborative practice.

SECTION 3: ASSESSING BEHAVIOR:
Consent before assessment, Appropriate assessment methods, Culturally responsive assessment, Functional assessment before reduction, Medical consultation when needed, Accurate data collection and interpretation.

KEY: Comprehensive, appropriate, accurate assessment guides ethical intervention.

SECTION 4: BEHAVIOR ANALYSTS AND BEHAVIOR-CHANGE PROGRAM:
Involving clients in goal selection, Function-based interventions, Least restrictive procedures, Ongoing assessment, Modification based on data, Treatment efficacy,  Timely response to risks, Proper discontinuation.

KEY: Effective, respectful, data-driven intervention.

SECTION 5: BEHAVIOR ANALYSTS AS SUPERVISORS:
Competent supervision, Adequate oversight, Training and feedback, Performance monitoring, Delegation only to qualified individuals, Evaluation and feedback to supervisees.

KEY: Supervisors accountable for supervisee actions with clients.

SECTION 6: ETHICAL RESPONSIBILITY IN PUBLIC STATEMENTS:
Accurate representations, Avoiding false or deceptive statements, Public statements based on professional knowledge, Testimonials handled ethically.

KEY: Honest, accurate public communication about ABA.

SECTION 7: BEHAVIOR ANALYSTS AND RESEARCH:
IRB approval, Informed consent from participants, Avoiding harm, Debriefing, Accurate data reporting, Acknowledging contributions, Plagiarism avoidance.

KEY: Ethical conduct in research protects participants and maintains scientific integrity.

COMMON ETHICAL DILEMMAS:

MULTIPLE RELATIONSHIPS: Colleague asks you to treat their child. ISSUE: Dual relationship may impair objectivity. GUIDANCE: Generally avoid. If unavoidable in small community, take precautions, careful monitoring, consult supervisor.

INEFFECTIVE TREATMENT: Treatment not working after reasonable time. DILEMMA: Continue billing vs admit ineffectiveness? GUIDANCE: Modify approach, seek consultation, consider referral if outside competence. Don't continue ineffective treatment indefinitely.

CONFIDENTIALITY VS SAFETY: Client reveals plan to harm someone. DILEMMA: Confidentiality vs duty to warn/protect. GUIDANCE: Mandated reporting, duty to warn override confidentiality. Discuss limits upfront.

SCOPE OF COMPETENCE: Offered case outside experience. DILEMMA: Turn down (lose income) vs accept (maybe figure it out)? GUIDANCE: Don't accept outside competence. Refer appropriately or obtain necessary training/supervision first.

DECISION-MAKING FRAMEWORK:
When facing ethical questions: Consult Ethics Code relevant sections, Review professional literature/guidelines, Discuss with supervisor or colleagues, Consider client welfare first, Document decision-making process, Seek ethics consultation if uncertain.

REPORTING VIOLATIONS:
Obligated to report: Observed ethical violations by other certificants, Illegal activity, Harm to clients.

Process: Address directly with colleague if appropriate, Report to BACB if serious/unresolved, Document concerns, Protect client welfare.

ETHICS RESOURCES:
BACB Ethics Code (memorize key sections), BACB Ethics hotline for questions, Ethics articles and case studies, Supervision for ethical dilemmas, Peer consultation, Professional liability insurance.

MAINTAINING ETHICAL PRACTICE:
Regular Ethics Code review, Ongoing ethics training/CE, Supervision and consultation, Self-reflection on practice, Client feedback and rights, Documentation of decisions and services, Professional development.`);

updateTopic('ethics', 'ethics-2', `Informed consent ensures clients understand services and voluntarily agree to treatment. It's both ethical requirement and legal protection.

DEFINITION:
Informed consent is the process of providing clients (or legal guardians) with sufficient information about services to make an informed decision about participation, ensuring voluntary agreement, and documenting this consent.

ESSENTIAL ELEMENTS OF INFORMED CONSENT:

INFORMATION PROVISION:
Must provide in clear, understandable language: Nature of services (what will be done), Assessment procedures, Intervention methods and techniques, Expected outcomes and benefits, Possible risks or discomforts, Alternatives to proposed treatment, Right to refuse or withdraw, Limits of confidentiality, Costs and billing, Availability of answers to questions.

Information must be: Comprehensible (appropriate reading level, language), Complete (all relevant details), Accurate (truthful about outcomes/risks), Culturally appropriate (respectful of values).

VOLUNTARY PARTICIPATION:
Consent must be freely given without coercion: No undue pressure to participate, Genuine choice to decline, Can ask questions, Time to consider decision, No negative consequences for refusal.

CAPACITY TO CONSENT:
Person providing consent must have: Legal authority (parent/guardian for minor or individual with guardian), Cognitive capacity to understand, Ability to communicate decision.

For individuals with limited capacity: Guardian provides consent, Individual provides assent when possible, Consider individual's preferences and resistance.

DOCUMENTATION:
Written consent forms signed and dated, Include all key information, Copy provided to client/guardian, Stored in confidential records, Updated if services change significantly.

CONSENT FOR MINORS:

PARENTAL/GUARDIAN CONSENT:
Parent or legal guardian provides consent for services for child or individual with guardianship.

Requirements: Both parents if both have custody (unless court order specifies), Legal guardian if appointed, Documentation of guardianship status if relevant.

CHILD ASSENT:
When possible, obtain child's agreement even when not legally required: Explain services in child-appropriate language, Ask if willing to participate, Respect resistance (though may proceed if parent consents), Consider developmental level.

Balance: Parent can consent for needed services, but child's cooperation and assent enhance outcomes. Forced, coercive treatment ethically problematic.

ONGOING CONSENT:
Consent is not one-time event but ongoing process: Review regularly (annually or when significant changes), Update if methods/goals change significantly, Allow withdrawal at any time, Respond to concerns or questions, Document all consent interactions.

CONSENT FOR DIFFERENT SERVICES:

ASSESSMENT:
Explain: Purpose of assessment, Methods used (observation, testing, functional analysis), Time required, How results will be used, Potential risks (behavioral reactions during FA).

TREATMENT:
Explain: Specific procedures to be used, Why selected (function-based rationale), Expected outcomes (realistic, not guaranteed), Timeline and intensity, Potential risks or side effects, Alternative approaches available.

RESTRICTIVE PROCEDURES:
If using timeout, restraint, or punishment: Extra informed consent required, Detailed explanation of procedure, Clear justification (less restrictive tried/failed), Oversight and monitoring plan, Right to refuse.

Some states/agencies require separate consent forms for restrictive procedures.

CONSENT FOR DATA SHARING:
Obtain specific consent for: Sharing data with other professionals, Using de-identified data for research, Including case in presentations/publications, Video/audio recording of sessions, Testimonials or promotional materials.

Don't assume general consent covers these - get specific permission.

SPECIAL CONSENT SITUATIONS:

MANDATED SERVICES:
When services court-ordered or school-mandated: Still provide information, Explain even if participation not optional, Document consent process, Respect dignity even in mandated treatment.

THIRD-PARTY PAYORS:
When insurance/agency pays: Explain what information will be shared with payor, Limits on confidentiality due to third-party involvement, Client's financial responsibility if any.

RESEARCH PARTICIPANTS:
More stringent consent requirements: IRB approval required, Voluntary participation emphasized, Right to withdraw without penalty, Procedures for maintaining confidentiality, Debriefing after study.

CHALLENGES AND SOLUTIONS:

LIMITED ENGLISH PROFICIENCY:
Provide information in client's/guardian's primary language, Use qualified interpreters (not family members), Written materials translated, Confirm understanding.

LITERACY CONCERNS:
Read consent form aloud, Use plain language, Visual supports if helpful, Check for understanding through questions, Allow additional time.

DISAGREEMENT BETWEEN GUARDIAN AND CLIENT:
Minor resists but parent consents.
APPROACH: Attempt to gain child's cooperation, Explain benefits at child's level, Consider if resistance is informed choice vs temporary, Balance parent authority with child welfare.

Ultimately parent/guardian has legal right, but child's persistent resistance should be addressed.

CAPACITY QUESTIONS:
Uncertainty about guardian's ability to provide informed consent.
APPROACH: Explain thoroughly, Check understanding, Document process, Seek legal consultation if significant concerns.

DOCUMENTATION BEST PRACTICES:
Use clear, comprehensive consent forms, Include all required elements, Ensure signatures and dates, Provide copy to client/guardian, Store securely and confidentially, Update when services change, Document verbal consent if written not obtained.

ETHICAL VIOLATIONS:
FAILURE TO OBTAIN CONSENT: Beginning services without consent.
COERCED CONSENT: Pressuring client to agree.
INCOMPLETE INFORMATION: Not disclosing risks or alternatives.
IGNORING WITHDRAWAL: Continuing after client revokes consent.

All serious violations with sanctions.

CONSENT AND CULTURAL RESPONSIVENESS:
Consider cultural values in consent process: Some cultures value collective decision-making (include family), Communication styles vary (direct vs indirect), Authority views differ (who makes decisions), Consider cultural context while maintaining ethical standards.

ONGOING COMMUNICATION:
Beyond initial consent: Regular updates on progress, Discussions of changes needed, Answering questions promptly, Addressing concerns seriously, Providing options when possible.

Consent is relationship, not just paperwork.`);

updateTopic('ethics', 'ethics-3', `Confidentiality protects client privacy and is both ethical requirement and often legal mandate. Behavior analysts must safeguard client information carefully.

DEFINITION AND SCOPE:
Confidentiality is protecting private information about clients from unauthorized disclosure. Applies to: Verbal discussions about clients, Written records and reports, Electronic communications, Video/audio recordings, Data and graphs, Casual conversations.

LEGAL AND ETHICAL BASIS:
HIPAA (Health Insurance Portability and Accountability Act): Federal law protecting health information privacy. Applies when services are healthcare.

FERPA (Family Educational Rights and Privacy Act): Protects student educational records. Applies in school settings.

BACB ETHICS CODE: Requires confidentiality protection for all services.

STATE LAWS: May have additional confidentiality requirements.

Behavior analysts must comply with ALL applicable laws and ethical codes.

WHAT MUST BE PROTECTED:
CLIENT IDENTIFYING INFORMATION: Name, address, photo, phone, email, Social Security number, Medical record number, Any information that could identify individual.

ASSESSMENT RESULTS: Test scores, Functional assessment data, Diagnostic information.

TREATMENT INFORMATION: Intervention strategies used, Progress data, Behavior records, Session notes.

COMMUNICATIONS: Emails with/about client, Text messages, Phone conversations, Case discussions.

PROTECTED HEALTH INFORMATION (PHI): When HIPAA applies, all individually identifiable health information protected.

LIMITS TO CONFIDENTIALITY:
Confidentiality is NOT absolute. Must break confidentiality for:

MANDATED REPORTING: Suspected child abuse/neglect, Elder abuse, Abuse of individuals with disabilities, Requirements vary by state - know your jurisdiction.

DUTY TO WARN/PROTECT: Serious threat to identifiable third party, Client expresses intent to harm specific person, Balance confidentiality with safety.

Court orders/subpoenas (with proper legal authority), Emergency situations (risk of serious harm to self).

DISCUSS LIMITS UPFRONT:
Before services begin, explain: Generally confidential nature of services, Specific situations requiring disclosure (mandated reporting, danger), How information might be shared (with team, insurance), Documentation practices.

Clients should understand limits before sharing sensitive information.

APPROPRIATE INFORMATION SHARING:

WITH CLIENT CONSENT:
Can share with: Other professionals treating client (with signed release), Family members (with client/guardian consent), Insurance companies (with authorization), Schools (with proper release).

WRITTEN AUTHORIZATION: Specify: What information shared, With whom, Purpose of disclosure, Time limit, Client's right to revoke.

WITHOUT CLIENT CONSENT (when permitted):
Consultation with colleagues (de-identified - no identifying info), Supervision (may share identifiable info with direct supervisor), Treatment team (professionals directly involved in care), Legal requirements (mandated reporting, court orders).

DE-IDENTIFICATION: When discussing cases without consent: Remove all identifying information (name, location, specific details), Change identifying details, Use general descriptions, Don't share photos/videos.

MAINTAINING CONFIDENTIALITY - PRACTICAL STEPS:

VERBAL COMMUNICATION:
Don't discuss clients: In public places (hallways, elevators, restaurants), On phone where others can hear, With people not involved in care, Using client names unnecessarily.

DO: Discuss in private settings, Use code numbers instead of names when possible, Close doors during discussions, Lower voice.

WRITTEN RECORDS:
Secure storage: Locked file cabinets for paper records, Password-protected digital files, Encrypted electronic transmission, Secure server storage with restricted access.

ACCESS CONTROL: Only authorized personnel access records, Sign-out logs for file access, Shred documents before disposal, Wipe electronic devices before disposal.

ELECTRONIC COMMUNICATION:
EMAIL: Use secure/encrypted email for sensitive information, Don't include identifying details in subject line, Confirm recipient address before sending, Consider risks of email interception.

TEXT MESSAGES: Avoid for confidential information, If must use, be vague, encrypted messaging apps preferred.

SOCIAL MEDIA: Never discuss identifiable clients on social media, Strict privacy settings, Don't accept friend/follow requests from current clients/families, Professional accounts separate from personal.

DOCUMENTATION:
Keep only necessary information, Accurate and objective (facts, not opinions), Secure storage throughout retention period, Proper disposal after retention period, Know federal/state retention requirements (often 7 years adults, longer for minors).

TRAINING STAFF:
All staff working with clients must understand: Confidentiality requirements, What can/cannot be shared, Consequences of violations, Proper handling of information, Reporting breaches.

CONFIDENTIALITY BREACHES:
If confidentiality accidentally breached: Notify affected client immediately, Mitigate harm (retract information if possible), Document breach and response, Review procedures to prevent recurrence, Report to appropriate entities (HIPAA breach notification if applicable).

SERIOUS BREACHES: Report to BACB if ethics violation, Could result in professional sanctions.

SPECIAL SITUATIONS:

GROUP SERVICES:
When providing services to multiple clients simultaneously (group therapy, classroom): Discuss confidentiality expectations with all participants, Can't guarantee what others will share, Set ground rules about privacy, Monitor and address breaches.

FAMILY INVOLVEMENT:
When working with child: Parents have right to information about their child, Balance child's privacy with parental rights, Age-appropriate discussions with child about what shared, Minors have limited confidentiality.

DECEASED CLIENTS:
Confidentiality obligations continue after death. Still protect information unless legal exceptions apply.

CASE EXAMPLES AND TEACHING:
For presentations or publications: Obtain specific consent, De-identify thoroughly, Disguise identifying details, Consider composite cases, Get client approval of final content.

TESTIMONIALS:
If client offers testimonial: Must be voluntary, No pressure to provide, Can decline to use, Doesn't obligate continued services.

CULTURAL CONSIDERATIONS:
Different cultures have varying: Privacy expectations, Comfort with information sharing, Family involvement preferences.

Be sensitive while maintaining ethical standards. Explain confidentiality practices, Respect cultural values, Find culturally appropriate ways to meet requirements.

CONFIDENTIALITY AND TECHNOLOGY:
Telehealthservices: HIPAA-compliant platforms, Secure internet connections, Private locations for both parties, Discuss privacy limitations of technology.

Data storage: Cloud storage with encryption, Secure backup systems, Access controls and passwords, Regular security updates.

MAINTAINING BOUNDARIES:
Confidentiality supports professional boundaries: Don't share your reactions to client cases with clients, Don't gossip about clients, Don't use client information for personal gain, Maintain professional relationship quality.`);

updateTopic('ethics', 'ethics-4', `Professional boundaries define appropriate interactions between behavior analysts and clients. Maintaining boundaries protects clients from exploitation and ensures ethical practice.

DEFINITION:
Professional boundaries are limits on the professional relationship that protect clients, maintain objectivity, and ensure services remain therapeutic rather than social or personal.

POWER DIFFERENTIAL:
Behavior analyst-client relationship inherently has power imbalance: Analyst has knowledge/expertise client lacks, Client depends on analyst for services, Analyst controls aspects of intervention, Payment flows from client to analyst.

This power differential requires awareness and appropriate boundaries.

MULTIPLE RELATIONSHIPS:

DEFINITION: Serving multiple roles with same person. Behavior analyst who is also friend, relative, employer, business partner, or romantic interest.

ETHICS CODE GUIDANCE: Avoid multiple relationships that could: Impair objectivity in professional judgment, Risk exploitation of client, Harm the therapeutic relationship.

EXAMPLES OF PROBLEMATIC MULTIPLE RELATIONSHIPS: Treating close friend or family member, Dating current client or supervisee, Hiring client for personal services (babysitting, yard work), Business partnerships with current clients, Socializing extensively outside professional context.

NOT ALWAYS PROHIBIT: Some situations unavoidable, especially in: Small communities (limited providers), Rural areas, Specialized populations (small ABA community).

IF UNAVOIDABLE: Carefully evaluate potential risks, Take precautions to protect client, Increased oversight/supervision, Thoroughly document rationale, Be prepared to refer if conflicts arise, Ongoing monitoring.

EXPLOITATION:
Never exploit clients for: Financial gain (beyond appropriate fees), Sexual or romantic involvement, Personal services or labor, Business ventures, Social status or networking.

Violations are serious and can result in certification revocation.

FINANCIAL BOUNDARIES:

APPROPRIATE FEES: Charge reasonable, typical fees for region/service, Discuss fees upfront (informed consent), Bill accurately for services provided.

INAPPROPRIATE: Excessive fees exploiting client need, Billing for services not provided, Accepting valuab gifts as payment supplement, Bartering that exploits power differential.

GIFTS FROM CLIENTS:
GENERAL GUIDANCE: Small, culturally appropriate gifts may be acceptable (holiday card, token of appreciation <$10 value), Expensive or frequent gifts should be declined, Consider context and cultural norms.

CONCERNS: Creates sense of obligation, May be attempt to influence services, Could be exploitation if client has limited resources.

IF ACCEPTING: Ensure truly voluntary, Not contingent on services, Document in case notes, Consult if uncertain.

SOCIAL BOUNDARIES:

SOCIAL MEDIA:
AVOID: Friend requests from current clients/families, Following client social media accounts, Sharing personal life details publicly, Posting about work in identifiable ways.

DO: Strict privacy settings on personal accounts, Professional accounts separate from personal, Decline friend requests professionally, Consider how online presence could affect therapeutic relationship.

SOCIAL INTERACTIONS:
AVOID: Attending client social events (birthdays, weddings) unless clearly professional role, Extensive personal discussions unrelated to services, Sharing detailed personal problems with clients, Social outings with clients outside therapy context.

CONTEXT MATTERS: Community events where both present may be unavoidable in small towns. Maintain professional demeanor.

PERSONAL DISCLOSURES:
MINIMAL SELF-DISCLOSURE: Services focus on client, not analyst's personal life.

APPROPRIATE: Brief, relevant self-disclosures that serve therapeutic purpose. "I was nervous before my exam too."

INAPPROPRIATE: Extensive personal stories, Personal problems/complaints, Information that shifts focus from client to analyst.

BOUNDARY CROSSINGS VS VIOLATIONS:

BOUNDARY CROSSINGS: Minor, non-harmful departures from strict professional role. Examples: Accepting small gift, Brief personal conversation, Casual encounter in community.

May be acceptable if: Serve therapeutic purpose, Not exploitative, Don't harm relationship, Carefully considered and documented.

BOUNDARY VIOLATIONS: Serious breaches that harm client or exploit relationship. Examples: Sexual/romantic involvement, Financial exploitation, Using client for personal gain.

Always unethical and prohibited.

SEXUAL/ROMANTIC BOUNDARIES:

ABSOLUTE PROHIBITION:
Never sexual or romantic relationship with: Current clients, Current supervisees, Current students, Parents/guardians/family of current clients (during services).

RECENT CLIENTS:
BACB Code: Two-year waiting period after termination before any sexual/romantic relationship.

RATIONALE: Power differential persists after termination, Risk of retrospective exploitation (was termination to enable relationship?), Protects client welfare, Maintains professional integrity.

BEST PRACTICE: Avoid entirely. Two-year minimum often insufficient to eliminate power differential.

SUPERVISORY RELATIONSHIPS:

BOUNDARIES WITH SUPERVISEES:
Supervisor has power over: Certification eligibility, Employment recommendations, Professional development.

REQUIREMENTS: Provide competent supervision, Objective feedback, No exploitation, Sexual/romantic relationships problematic.

SOCIAL RELATIONSHIPS: Supervisors and supervisees may interact socially (professional conferences, group outings), but maintain awareness of power differential, don't exploit position.

TERMINATION AND TRANSITIONS:

APPROPRIATE TERMINATION:
When: Goals achieved, Services no longer beneficial, Client requests termination, Unable to help client (outside competence), Conflicts that impair objectivity.

PROCESS: Adequate notice, Assistance with transition/referrals, Final session for closure, Transfer of records as appropriate.

INAPPROPRIATE: Abandoning client without notice, Terminating due to unpaid bills without warning and alternatives, Terminating punitively.

PERSONAL RELATIONSHIPS POST-TERMINATION:
Friendships after services end: Two-year waiting period recommended, Consider whether relationship exploitative given history, Some relationships may never be appropriate (former child clients).

SELF-AWARENESS:
Maintaining boundaries requires: Regular self-reflection ("Am I maintaining professional role?"), Supervision and consultation, Recognition of attraction or conflicts, Addressing boundary challenges proactively, Putting client welfare first.

WARNING SIGNS OF BOUNDARY PROBLEMS:
Looking forward to sessions with certain clients more than others, Sharing extensive personal information, Feeling special connection beyond professional, Preferential treatment, Meeting outside office unnecessarily, Social media interactions, Accepting inappropriate gifts.

If any signs present: Discuss in supervision, Consider referral, Re-establish clear boundaries.

DOCUMENTATION:
Document boundary decisions: Rationale for accepting/declining gifts, Multiple relationship considerations, Consultation about boundary questions, Actions taken to protect client.

CULTURAL CONSIDERATIONS:
Different cultures have varying: Appropriate interaction styles, Gift-giving customs, Familiarity vs formality expectations, Personal space norms.

Balance: Cultural responsiveness with professional boundaries. Adapt while maintaining client protection.`);

updateTopic('ethics', 'ethics-5', `Supervision ensures supervisees practice competently and ethically. Supervisors are responsible for client services delivered by those under their supervision.

DEFINITION:
Supervision is oversight provided by experienced, certified behavior analysts to less experienced practitioners. Ensures quality services, ethical practice, professional development, and client welfare.

SUPERVISOR RESPONSIBILITIES:

COMPETENT OVERSIGHT:
Supervisors must: Have necessary expertise for cases supervised, Understand procedures supervisees implementing, Provide adequate oversight quantity/quality, Remain available for consultation, Monitor client progress.

Can't supervise: Outside your competence areas, More cases than you can monitor effectively, Without regular contact with supervisee.

ADEQUATE SUPERVISION QUANTITY:
BCBA supervising RBT: Minimum 5% of RBT's monthly service hours, In-person observation required, Regular meetings and feedback.

BCBA-D supervising BCBA candidate: Specific requirements per BACB (often 1-2 hours per week), Direct observation of service delivery, Review of documentation and data.

Minimums are MINIMUMS - may need more for: Complex cases, Less experienced supervisees, High-risk situations.

OVERSIGHT ACTIVITIES:
Direct observation of sessions (in-person or video), Review of client data and graphs, Discussion of cases and interventions, Providing feedback on performance, Answering questions and problem-solving, Reviewing documentation, Ethics guidance, Professional development.

FEEDBACK AND TRAINING:
Provide: Specific, objective feedback on performance, Both positive (reinforcement) and corrective, Models of appropriate procedures, Training on new skills/techniques, Resources for professional development.

Effective feedback is: Immediate when possible, Specific and concrete ("Great use of time delay"), Balanced (strengths and areas for improvement), Action-oriented (what to do differently), Documented for accountability.

DELEGATION:
Can delegate tasks to supervisees commensurate with training/competence: RBTs implement behavior plans under BACB supervision, BCaBAs provide some services under BCBA supervision, Students practice under supervision.

CANNOT DELEGATE: Tasks requiring higher certification level, Responsibilities legally restricted to certain credentials, Activities supervisee not trained to perform.

RESPONSIBILITY: Supervisor remains responsible for services delivered by supervisees. If supervisee makes error, supervisor accountable.

PERFORMANCE MONITORING:
Regularly assess supervisee performance: Direct observation with fidelity checklists, Review data and documentation, Client progress as indicator, Feedback from families/staff, Supervisee self-report and questions.

Address problems quickly: Additional training, Increased oversight, Modified assignments, Performance improvement plans if needed.

ETHICAL OBLIGATIONS OF SUPERVISORS:

PROMOTE ETHICAL CONDUCT: Model ethical behavior, Teach Ethics Code, Discuss ethical dilemmas, Correct ethical violations, Create culture of ethical practice.

ENSURE CLIENT WELFARE: Monitor services quality, Intervene if client harmed, Ensure evidence-based practice, Require data-based decision making.

SUPPORT PROFESSIONAL DEVELOPMENT: Provide learning opportunities, Constructive feedback, Mentoring, Career guidance, Resources and training.

SUPERVISEE RESPONSIBILITIES:

PRACTICE WITHIN COMPETENCE: Only do what trained to do, Ask for guidance when uncertain, Seek training for new skills, Don't exceed scope of certification.

RBTs: Must work under BCBA/BCaBA supervision, Implement behavior plans (don't create them), Follow protocols established by supervisor, Seek guidance as needed.

BACB CANDIDATES: Meet supervision requirements, Document supervision hours, Practice ethically while pursuing certification.

SEEK SUPERVISION: Ask questions proactively, Report challenges or concerns, Be receptive to feedback, Implement supervisor guidance, Ongoing communication.

SUPERVISORY RELATIONSHIP QUALITY:

EFFECTIVE SUPERVISION:
Regular, scheduled meetings (not just crisis-driven), Open communication and questions welcomed, Constructive, supportive feedback environment, Professional but collegial relationship, Clear expectations and goals.

PROBLEMATIC SUPERVISION:
Inadequate contact/oversight, Harsh, punitive feedback only, Supervisor unavailable or dismissive, No observation of actual service delivery, Exploitation of supervisee.

MULTIPLE RELATIONSHIP ISSUES:
Supervisor-supervisee relationship has power differential. Avoid: Sexual/romantic relationships (serious violation), Social relationships that impair objectivity, Financial dependencies beyond supervision fees, Family supervision (generally avoid).

DOCUMENTATION REQUIREMENTS:

SUPERVISION RECORDS:
Document: Dates and duration of supervision, Activities (observation, discussion, training), Cases discussed, Feedback provided, Supervisee performance, Signatures of both parties.

REQUIRED FOR: BACB experience requirements, Professional accountability, Legal protection.

RETENTION: Follow BACB and applicable legal requirements (often 7+ years).

FORMS: Supervision logs, Observation forms, Monthly summary forms, Experience verification forms (for certification).

COMPETENCY-BASED SUPERVISION:
Focus on skill development, not just hour requirements: Assess baseline competencies, Set learning objectives, Provide training and practice opportunities, Evaluate skill development, Provide feedback and additional training as needed.

SUPERVISION MODELS:

APPRENTICESHIP: Supervisee learns through doing under guidance. Gradual increase in independence.

DIDACTIC: Structured teaching of concepts and skills. Lectures, readings, discussions.

CASE-BASED: Discussion of active cases, problem-solving, applying concepts to real situations.

FEEDBACK-BASED: Observation followed by specific feedback on performance.

MOST EFFECTIVE: Combine all models - teach concepts, apply to cases, observe practice, provide feedback.

CHALLENGES IN SUPERVISION:

SUPERVISEE RESISTANCE: Doesn't implement feedback, defensive about criticism.

APPROACH: Build rapport first, Frame feedback constructively, Provide rationale for changes, Involve supervisee in problem-solving, Clear expectations and consequences.

INADEQUATE TIME: Too many supervisees or cases.

SOLUTION: Limit supervision commitments to manageable number, Don't accept more than can adequately oversee, Quality over quantity.

COMPETENCE GAPS: Supervisee lacks needed skills.

APPROACH: Assess competencies systematically, Provide targeted training, May need to reassign cases outside supervisee competence, Additional practice with feedback.

ETHICAL CONCERNS: Supervisee engages in unethical practice.

APPROACH: Address immediately, Clear correction and expectations, Increased monitoring, Report serious violations to BACB if not corrected, Protect client welfare first.

CULTURAL AND LINGUISTIC DIVERSITY:
When supervising across cultures/languages: Learn about supervisee's cultural context, Use interpreters if needed, Adapt supervision style appropriately, Ensure culturally responsive practice.

ENDING SUPERVISION:
When supervision relationship ends: Provide adequate notice, Complete necessary documentation, Final feedback session, Support transition to new supervisor if needed, Provide summative evaluation.

SUPERVISOR SELF-CARE:
Supervision is demanding: Manage workload sustainably, Seek consultation for difficult situations, Ongoing professional development, Balance supervision with other professional activities.`);

console.log('\n✅ Ethics batch in progress...\n');

fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));
console.log('📊 Progress: 25/47 topics (53%) - Ethics partially complete\n');

