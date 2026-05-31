import type {
  BlogArticle,
  CategoryKey,
  PracticeText,
  SpeakingTip,
  TabKey,
  TipCategory,
} from '../types';

export const tabs: Array<{key: TabKey; label: string; icon: string}> = [
  {key: 'train', label: 'Train', icon: '🎙️'},
  {key: 'texts', label: 'Texts', icon: '📄'},
  {key: 'blog', label: 'Blog', icon: '📖'},
  {key: 'tips', label: 'Tips', icon: '💡'},
  {key: 'battle', label: 'Battle', icon: '🏆'},
];

export const categories: Array<{
  key: CategoryKey;
  label: string;
  shortLabel: string;
  icon: string;
}> = [
  {key: 'public', label: 'Public Speaking', shortLabel: 'Public', icon: '🎤'},
  {
    key: 'diction',
    label: 'Diction Practice',
    shortLabel: 'Diction',
    icon: '🗣️',
  },
  {
    key: 'emotion',
    label: 'Emotional Reading',
    shortLabel: 'Emotion',
    icon: '🎭',
  },
];

export const tipCategories: Array<{
  key: TipCategory;
  label: string;
  icon: string;
}> = [
  {key: 'voice', label: 'Voice Control', icon: '🎙️'},
  {key: 'confidence', label: 'Confidence', icon: '🧠'},
  {key: 'diction', label: 'Clear Diction', icon: '✨'},
];

export const onboardingPages = [
  {
    icon: '🎙️',
    title: 'Welcome to SpeakPro',
    body: 'Your personal companion for mastering public speaking and improving your diction. Practice, learn, and compete to become a better speaker.',
  },
  {
    icon: '📄',
    title: 'Teleprompter Training',
    body: 'Practice reading with our intelligent teleprompter. Choose from various categories and adjust speed and text size to match your comfort level.',
  },
  {
    icon: '📖',
    title: 'Text Workshop',
    body: 'Manage your practice materials with ease. Browse, add, edit, and organize texts by category. Create your perfect practice library.',
  },
  {
    icon: '💡',
    title: 'Expert Tips & Blog',
    body: 'Access professional speaking advice and articles. Learn voice control techniques, build confidence, and improve your diction with expert guidance.',
  },
  {
    icon: '🏆',
    title: 'Speaker Battle Mode',
    body: 'Challenge your friends! Take turns reading texts and let the audience vote for the best performance. May the best speaker win!',
  },
];

export const initialTexts: PracticeText[] = [
  {
    id: 'public-intro',
    category: 'public',
    title: 'Introduction to Public Speaking',
    builtIn: true,
    content:
      "Public speaking is one of the most valuable skills you can develop in your personal and professional life. Whether you're presenting to a large audience, leading a team meeting, or simply sharing ideas with colleagues, the ability to communicate clearly and confidently can open doors to countless opportunities.\n\nThe key to becoming an effective public speaker lies not in perfection, but in practice and persistence. Every great speaker started somewhere, often with trembling hands and a racing heart. What sets them apart is their commitment to continuous improvement and their willingness to speak even when the moment feels uncomfortable.",
  },
  {
    id: 'public-small-steps',
    category: 'public',
    title: 'The Power of Small Steps',
    builtIn: true,
    content:
      'Every great achievement begins with a small decision. People often wait for the perfect moment to start something important, but success rarely appears because of perfect timing. Most successful journeys begin during uncertain moments when people choose to move forward despite fear and doubt. Small actions repeated every day slowly create discipline, confidence, and experience.\n\nWhen people focus only on large goals, they often feel overwhelmed and lose motivation quickly. However, focusing on small daily improvements makes challenges easier to manage. Public speaking works the same way. Every speech improves posture, voice control, and confidence. Step by step, speakers become more natural, expressive, and persuasive in front of an audience.',
  },
  {
    id: 'public-confidence-stage',
    category: 'public',
    title: 'Confidence on Stage',
    builtIn: true,
    content:
      'Standing in front of an audience can feel intimidating, especially during important presentations or public events. Many people believe confident speakers are born with natural talent, but confidence is usually developed through preparation and repetition. Even experienced speakers still feel nervous before important moments.\n\nStrong posture, calm breathing, and steady pacing help speakers create a confident presence. Eye contact also plays a major role because it builds connection and trust with listeners. Confidence does not mean speaking perfectly without mistakes. It means staying calm, adapting to situations, and continuing with clarity even when unexpected moments happen.',
  },
  {
    id: 'diction-twisters',
    category: 'diction',
    title: 'Diction Exercise - Tongue Twisters',
    builtIn: true,
    content:
      'Peter Piper picked a peck of pickled peppers while patient performers practiced precise pronunciation. Seven sharp students slowly spoke simple sentences beside the silent silver station. Their speech remained smooth, stable, and controlled during the session.\n\nClear pronunciation requires patience, repetition, and concentration. Careful pacing helps speakers maintain stability while speaking longer sentences with confidence and control.',
  },
  {
    id: 'diction-morning',
    category: 'diction',
    title: 'Crisp Morning Practice',
    builtIn: true,
    content:
      'Bright blue birds flew above the bridge while brave travelers carried brown bags below the busy boulevard. Peter proudly prepared perfect presentations before public performances began. Powerful breathing patterns helped him pronounce every phrase precisely and clearly.\n\nThe peaceful morning air created a calm environment for focused speech practice. Step by step, speakers repeated difficult combinations of sounds to improve rhythm and articulation.',
  },
  {
    id: 'diction-precision',
    category: 'diction',
    title: 'Rhythm and Precision',
    builtIn: true,
    content:
      'Fast voices often fail when focus disappears and breathing becomes irregular. Careful pacing and controlled pauses improve both understanding and confidence during long conversations. Strong speakers know how to balance rhythm, speed, and articulation while maintaining natural delivery.\n\nPrecision is especially important during presentations, interviews, and storytelling. Listeners respond more positively when speech feels calm and organized.',
  },
  {
    id: 'emotion-practice',
    category: 'emotion',
    title: 'Emotional Speech Practice',
    builtIn: true,
    content:
      'Today I want to share with you a story that changed my life. It was not loud or dramatic at first. It began with one quiet decision, one difficult conversation, and one moment when I finally stopped running from the truth.\n\nEmotion gives words a human shape. A speaker who understands emotion can sound sincere without losing clarity. The goal is not to perform feelings, but to let meaning guide the voice naturally.',
  },
  {
    id: 'emotion-letter',
    category: 'emotion',
    title: 'The Last Letter',
    builtIn: true,
    content:
      'The old letter rested quietly inside the wooden drawer for many years. Dust covered the edges of the paper, and the handwriting had slowly faded with time. When she finally opened it, memories returned immediately. Every sentence carried emotion, regret, and hope from a distant moment in life that she had tried to forget.\n\nAs she continued reading, her hands trembled slightly. Outside the window, the evening rain softly touched the glass while silence filled the room. By the end of the letter, she understood that some memories never truly disappear.',
  },
  {
    id: 'emotion-beginning',
    category: 'emotion',
    title: 'A New Beginning',
    builtIn: true,
    content:
      'After years of doubt and hesitation, he finally decided to follow his dream. The decision was frightening because nothing about the future felt guaranteed. Friends questioned his choice, and many people believed the risk was too great. Still, deep inside, he knew he could no longer ignore the opportunity.\n\nThe first steps were difficult and uncertain. Some days brought motivation and excitement, while others brought fear and exhaustion. However, each challenge slowly strengthened his confidence and determination.',
  },
];

export const blogArticles: BlogArticle[] = [
  {
    id: 'vocal-variety',
    title: 'The Power of Vocal Variety in Public Speaking',
    excerpt:
      'Learn how changing your pitch, pace, and volume can transform your presentations and keep your audience engaged from start to finish.',
    date: 'May 25, 2026',
    readTime: '5 min read',
    content:
      "One of the most powerful tools in a speaker's arsenal is vocal variety. Yet, it's often one of the most overlooked aspects of public speaking training.\n\nYour voice is an instrument, and like any instrument, it has range. When you speak in a monotone, you're essentially playing one note repeatedly. No matter how interesting your content, a monotonous delivery will put your audience to sleep.\n\nUnderstanding Vocal Variety\n\nVocal variety encompasses three main elements: pitch, pace, and volume. Each plays a crucial role in keeping your audience engaged and emphasizing your key points.\n\nPitch refers to how high or low your voice sounds. Varying your pitch helps convey emotion and prevents your speech from sounding robotic. When you're excited about an idea, let your pitch rise naturally. When you're making a serious point, a lower pitch can convey authority and gravity.",
  },
  {
    id: 'stage-fright',
    title: 'Overcoming Stage Fright: A Scientific Approach',
    excerpt:
      'Discover evidence-based techniques to manage anxiety before and during presentations, backed by psychological research.',
    date: 'May 20, 2026',
    readTime: '7 min read',
    content:
      'Fear of public speaking is one of the most common fears in the world. Many people experience nervousness before presentations, meetings, or performances. Sweaty hands, faster breathing, and racing thoughts are normal reactions when speaking in front of others.\n\nPreparation is one of the best methods for reducing anxiety. Practicing several times before speaking helps create familiarity and confidence. The more prepared a person feels, the easier it becomes to focus on communication instead of fear.\n\nSlow breathing signals the body to relax and helps stabilize the voice. Taking short pauses while speaking also reduces pressure and creates a calmer speaking rhythm. Confidence grows through repeated experience.',
  },
  {
    id: 'body-language',
    title: 'Body Language Secrets of Great Speakers',
    excerpt:
      "Master the non-verbal communication techniques that complement your words and enhance your message's impact.",
    date: 'May 15, 2026',
    readTime: '6 min read',
    content:
      'Stage presence is the ability to capture attention while speaking in front of others. Body language strongly affects stage presence. Standing with open posture and controlled movements creates a calm and professional appearance.\n\nEye contact helps speakers connect emotionally with listeners and maintain audience engagement. Speakers with strong stage presence use vocal variety, pacing, and emotional delivery to maintain attention.\n\nConfidence also grows through preparation. Speakers who know their material well can focus more on delivery and audience interaction instead of worrying about remembering every sentence.',
  },
  {
    id: 'clear-diction',
    title: 'Why Clear Diction Changes Everything',
    excerpt:
      'Strong ideas need clean articulation. Learn simple drills that make every word easier for listeners to catch.',
    date: 'May 10, 2026',
    readTime: '4 min read',
    content:
      'Clear diction is essential for effective communication. Even strong ideas can lose impact if listeners struggle to understand the speaker. Good diction helps audiences stay focused and improves the overall quality of presentations and conversations.\n\nArticulation depends on proper movement of the lips, tongue, and jaw. Many people speak unclearly because they rush through words or avoid fully pronouncing sounds. Practicing slowly and emphasizing difficult consonants improves speech precision.\n\nClear diction also increases confidence. When people know they are speaking clearly, they feel more relaxed during conversations and public speaking situations.',
  },
];

export const speakingTips: SpeakingTip[] = [
  {
    id: 'breathe-deep',
    category: 'voice',
    title: 'Breathe Deep',
    body: 'Strong voice control begins with proper breathing. Try breathing slowly through your nose and speaking while exhaling steadily.',
  },
  {
    id: 'slow-pace',
    category: 'voice',
    title: 'Slow Your Pace',
    body: 'Many people speak too quickly when nervous. Slowing down improves clarity and makes your voice sound more confident.',
  },
  {
    id: 'vocal-variety-tip',
    category: 'voice',
    title: 'Use Vocal Variety',
    body: 'Change your volume, speed, and intonation to make your speech more expressive and engaging.',
  },
  {
    id: 'warm-up',
    category: 'voice',
    title: 'Warm Up Your Voice',
    body: 'Before speaking, do simple vocal exercises like humming or lip trills. This warms up your vocal cords and improves resonance.',
  },
  {
    id: 'message-focus',
    category: 'confidence',
    title: 'Focus on the Message',
    body: 'Instead of worrying about mistakes, focus on delivering your message clearly. Audiences respond to confidence and energy.',
  },
  {
    id: 'eye-contact',
    category: 'confidence',
    title: 'Maintain Eye Contact',
    body: 'Looking at different people in the audience helps you appear natural, confident, and engaged.',
  },
  {
    id: 'power-poses',
    category: 'confidence',
    title: 'Use Power Poses',
    body: 'Stand tall with your shoulders back. Good posture not only looks confident but can also make you feel more confident.',
  },
  {
    id: 'speak-purpose',
    category: 'confidence',
    title: 'Speak With Purpose',
    body: 'Understand the goal of your message and the emotion you want the audience to feel before you begin.',
  },
  {
    id: 'open-mouth',
    category: 'diction',
    title: 'Open Your Mouth',
    body: 'Clear pronunciation requires proper articulation. Practice speaking with fuller lip and jaw movement.',
  },
  {
    id: 'train-sounds',
    category: 'diction',
    title: 'Train Difficult Sounds',
    body: 'Repeating specific consonants and tongue exercises improves muscle coordination and articulation.',
  },
  {
    id: 'record-yourself',
    category: 'diction',
    title: 'Record Yourself',
    body: 'Listening to recordings helps identify unclear pronunciation, weak pacing, or repetitive speech patterns.',
  },
  {
    id: 'emphasize-endings',
    category: 'diction',
    title: 'Emphasize Endings',
    body: 'Focus on fully pronouncing final consonants to make your speech sound cleaner and easier to understand.',
  },
];

export const battleText =
  "Effective communication is the foundation of success in every aspect of life. Whether you're leading a team, pitching an idea, or simply sharing your thoughts, the ability to express yourself clearly and confidently sets you apart.\n\nThe best speakers are not perfect speakers. They are present speakers. They listen, adapt, breathe, and continue with purpose. Each sentence becomes a bridge between an idea and the people who need to hear it.";
