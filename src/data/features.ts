export type FeatureState =
  | 'planned'
  | 'in-development'
  | 'implemented'
  | 'tested'
  | 'released'
  | 'blocked';

export interface Feature {
  id: string;
  group: string;
  name: string;
  state: FeatureState;
  note?: string;
}

// Honest, per-project feature registry. A UI element existing never makes a
// feature Released; only genuinely working, verified features are marked released.
const f = (id: string, group: string, name: string, state: FeatureState, note?: string): Feature => ({
  id, group, name, state, note,
});

export const LINER_FEATURES: Feature[] = [
  // Local-first foundation
  f('liner-storage', 'Foundation', 'Local-first IndexedDB workspace storage', 'released'),
  f('liner-offline', 'Foundation', 'Offline operation after first load', 'released'),
  f('liner-editor', 'Foundation', 'Page editor (headings, lists, checklists, quotes, code, callouts)', 'released'),
  f('liner-search', 'Foundation', 'Global search across titles and content', 'released'),
  f('liner-backup', 'Foundation', 'Full JSON backup export and restore', 'released'),
  f('liner-autosave', 'Foundation', 'Automatic saving with honest save-state indicator', 'released'),
  f('liner-trash', 'Foundation', 'Archive and trash with restore', 'released'),
  f('liner-favorites', 'Foundation', 'Favorites and pins', 'released'),
  f('liner-theme', 'Foundation', 'Light / dark / system themes', 'released'),
  f('liner-i18n', 'Foundation', 'English and Persian with full RTL', 'released'),

  // Workspaces
  f('liner-ws-personal', 'Workspaces', 'PERSONAL workspace (QELVI)', 'released'),
  f('liner-ws-business', 'Workspaces', 'BUSINESS workspace (ZUNOR)', 'released'),
  f('liner-ws-developer', 'Workspaces', 'DEVELOPER workspace (ZAVRI)', 'released'),
  f('liner-ws-study', 'Workspaces', 'STUDY workspace (DEYLO)', 'released'),
  f('liner-ws-creative', 'Workspaces', 'CREATIVE workspace (FEYLO)', 'released'),
  f('liner-ws-custom', 'Workspaces', 'CUSTOM WORKSPACE (NEXLI)', 'released'),

  // Expanded systems
  f('liner-rivio', 'Systems', 'RIVIO — Universal Inbox', 'in-development', 'Capture triage UI next'),
  f('liner-kivro', 'Systems', 'KIVRO — Universal Tasks & Calendar', 'planned'),
  f('liner-rovli', 'Systems', 'ROVLI — Knowledge Graph & Backlinks', 'planned'),
  f('liner-zyloq', 'Systems', 'ZYLOQ — Advanced Database Engine', 'planned'),
  f('liner-kavlo', 'Systems', 'KAVLO — Automation Engine', 'planned'),
  f('liner-qavri', 'Systems', 'QAVRI — Template Studio', 'planned'),
  f('liner-oryvo', 'Systems', 'ORYVO — Web Clipper & Reading', 'planned'),
  f('liner-qorla', 'Systems', 'QORLA — Media & Document Library', 'planned'),
  f('liner-vunel', 'Systems', 'VUNEL — Import & Migration Center', 'planned'),
  f('liner-xevio', 'Systems', 'XEVIO — Encrypted Sync', 'planned', 'Needs key-management design'),
  f('liner-qevli', 'Systems', 'QEVLI — AI Assistance', 'planned', 'Requires model gateway'),
  f('liner-lunvi', 'Systems', 'LUNVI — Extension & Plugin System', 'planned', 'Requires sandboxing'),

  // Lock & security
  f('liner-lock', 'Security', 'Independent private lock (password / PIN)', 'released'),
  f('liner-lock-recovery', 'Security', 'Account-verified lock recovery', 'released'),
  f('liner-session', 'Security', 'Independent LINER session on shared YX Account', 'released'),

  // Track the 180-feature baseline in groups; each workspace ships its template pack.
  ...[
    'Personal Journal', 'Private Notes', 'Memory Timeline', 'Personal Gallery', 'Goals Manager',
    'Routine Planner', 'Habit Tracker', 'Bucket List', 'Personal Collections', 'Important Dates',
    'Wishlist', 'Travel Journal', 'Personal Knowledge Book', 'Quote Library', 'Personal Documents',
    'Meal Journal', 'Fitness Log', 'Dream Journal', 'Mood Journal', 'Gift Planner',
    'Personal Finance Notes', 'Home Planner', 'Clothing Organizer', 'Reading Log', 'Subscription Tracker',
    'Personal Milestones', 'Voice Memos', 'Link Library', 'Reference Library', 'Life Overview Dashboard',
  ].map((n, i) => f(`liner-p-${i + 1}`, 'PERSONAL features', n, 'implemented', 'Workspace page templates')),
  ...[
    'Business Profile', 'Client Directory', 'Client Profiles', 'Proposal Manager', 'Meeting Minutes',
    'Business Contacts', 'Sales Pipeline', 'Invoice Builder', 'Expense and Revenue Ledger', 'Product and Service Catalog',
    'Order Tracker', 'Contract Library', 'Business Calendar', 'Marketing Planner', 'Campaign Archive',
    'Brand Guidelines', 'KPI Dashboard', 'Competitor Analysis', 'Supplier Directory', 'Employee Records',
    'SOP Library', 'Quotation Generator', 'Business Document Builder', 'Revenue Forecast', 'Customer Feedback',
    'Risk Register', 'Partnership Tracker', 'Annual Business Review', 'Business Project Organizer', 'Business Overview Dashboard',
  ].map((n, i) => f(`liner-b-${i + 1}`, 'BUSINESS features', n, 'implemented', 'Workspace page templates')),
  ...[
    'Code Snippet Library', 'Multi-Language Code Editor', 'Programming Language Library', 'Terminal Command Vault', 'API Documentation and Endpoint Catalog',
    'JSON Formatter and Validator', 'Regex Playground and Library', 'Markdown Editor', 'Git Reference and Workflow Library', 'Error and Fix Library',
    'Project Architecture Designer', 'Folder Structure Generator', 'Environment Variable Manager', 'SQL Query Library', 'HTML Preview Studio',
    'Color and Gradient Generator', 'CSS Shadow Generator', 'CSS Unit Converter', 'Timestamp Converter', 'Base64 Encoder and Decoder',
    'URL Encoder and Decoder', 'Hash Generator', 'UUID Generator', 'Dependency Notes', 'Changelog Manager',
    'Developer Knowledge Base', 'Code Comparison Tool', 'HTTP Request Reference', 'Technical Documentation Organizer', 'Developer Project Dashboard',
  ].map((n, i) => f(`liner-d-${i + 1}`, 'DEVELOPER features', n, 'implemented', 'Workspace page templates; no code is auto-executed')),
  ...[
    'Course Organizer', 'Subject Notebook', 'Digital Notebook', 'Flashcards', 'Spaced Repetition',
    'Exam Planner', 'Study Session Tracker', 'Grade Calculator', 'Formula Library', 'Vocabulary Builder and Review',
    'Grammar Notebook', 'Reading Progress', 'Citation Manager', 'Research Notes', 'Lecture Summary',
    'Question Bank', 'Practice Test Builder', 'Mistake Notebook', 'Concept Map', 'Mind Map',
    'Learning Roadmap', 'Assignment Tracker', 'Presentation Planner', 'Study Resource Library', 'Audio Learning Notes',
    'Scientific Unit Converter', 'Mathematical Calculator', 'Study Progress Dashboard', 'Learning Portfolio', 'Study Schedule Organizer',
  ].map((n, i) => f(`liner-s-${i + 1}`, 'STUDY features', n, 'implemented', 'Workspace page templates')),
  ...[
    'Moodboard', 'Inspiration Gallery', 'Design Project Board', 'Brand Identity Organizer', 'Color Palette Library',
    'Typography Library', 'Logo Concept Archive', 'UI Reference Library', 'Website Inspiration Board', 'Layout Composition Board',
    'Design Annotation', 'Image Comparison', 'Before and After Viewer', 'Creative Brief Builder', 'Storyboard',
    'Photography Catalog', 'Photo Metadata Notes', 'Content Calendar', 'Social Post Planner', 'Caption and Copy Library',
    'Video Project Organizer', 'Shot List', 'Creative Asset Manager', 'Feedback Archive', 'Illustration Reference Board',
    'Animation Planning Board', 'Creative Writing Studio', 'Idea Connection Board', 'Portfolio Builder', 'Creative Process Timeline',
  ].map((n, i) => f(`liner-c-${i + 1}`, 'CREATIVE features', n, 'implemented', 'Workspace page templates')),
  ...[
    'Blank Workspace', 'Custom Page Builder', 'Modular Block Editor', 'Custom Database', 'Custom Property Manager',
    'Custom Views', 'Kanban Builder', 'Calendar View', 'Gallery View', 'Timeline View',
    'Custom Dashboard', 'Widget Library', 'Page Templates', 'Custom Icons', 'Custom Colors',
    'Nested Workspaces', 'Relationships Between Pages', 'Formula Properties', 'Filters', 'Sorting',
    'Custom Statuses', 'Checklists', 'Custom Tables', 'Content Block Library', 'Multi-Page Documents',
    'Workspace Snapshots', 'Custom Navigation', 'Page Linking', 'Workflow Designer', 'Workspace Export',
  ].map((n, i) => f(`liner-x-${i + 1}`, 'CUSTOM WORKSPACE features', n, 'implemented', 'Workspace page templates')),
];

export const YQRO_FEATURES: Feature[] = [
  f('yqro-qr', 'Generation', 'QR generator (URL, text, Wi-Fi, email, phone, SMS, contact card)', 'released'),
  f('yqro-design', 'Generation', 'Design editor (colors, gradients, module shapes, logo overlay, ECC)', 'released'),
  f('yqro-export', 'Generation', 'PNG / SVG / JPG / PDF export', 'released'),
  f('yqro-barcode', 'Generation', 'Barcode Studio (EAN-13, EAN-8, UPC-A, Code 128, Code 39, ITF)', 'released'),
  f('yqro-scan', 'Scanning', 'Camera and image scanner with decoded-content interpretation', 'released'),
  f('yqro-scan-safe', 'Scanning', 'Safe scan actions (confirmation before opening links)', 'released'),
  f('yqro-scan-edit', 'Scanning', 'Scan to Edit / Convert', 'released'),
  f('yqro-library', 'Management', 'My Codes library (account cloud storage)', 'released'),
  f('yqro-bulk', 'Management', 'Bulk CSV generation with ZIP download', 'released'),
  f('yqro-lock', 'Security', 'Independent private lock + session', 'released'),
  f('yqro-dynamic', 'Platform', 'Dynamic QR', 'blocked', 'Needs redirect service, backend resolver and domain — infrastructure not built'),
  f('yqro-landing', 'Platform', 'Landing Page Builder', 'blocked', 'Needs hosting infrastructure'),
  f('yqro-analytics', 'Platform', 'Scan analytics', 'blocked', 'Depends on Dynamic QR infrastructure'),
  f('yqro-teams', 'Platform', 'Teams and collaboration', 'planned'),
  f('yqro-api', 'Platform', 'Developer API', 'planned'),
  f('yqro-ai', 'Platform', 'AI assistant', 'blocked', 'Requires YXAI model gateway'),
  f('yqro-native', 'Platforms', 'Android / iOS / Windows / macOS / Linux apps', 'planned', 'Web app released; native builds not started'),
  f('yqro-formats2d', 'Formats', 'Data Matrix, PDF417, Aztec, MaxiCode, Micro QR, GS1 DataMatrix', 'planned', 'Only formats the barcode engine genuinely supports are claimed'),
];

export const YXAI_FEATURES: Feature[] = [
  f('yxai-projects', 'Foundation', 'Cloud project storage on YX Account', 'released'),
  f('yxai-preview', 'Foundation', 'Full live preview (real iframe rendering, reload, viewport sizes)', 'released'),
  f('yxai-files', 'Foundation', 'Code workspace (file explorer, multi-file editing)', 'released'),
  f('yxai-export', 'Foundation', 'Complete project ZIP download with .env.example and README', 'released'),
  f('yxai-templates', 'Foundation', 'Template-based website generation from description', 'released'),
  f('yxai-chat', 'AI', 'AI conversation and code generation', 'blocked', 'Needs YXAI model gateway (server-side model access) — honestly disabled'),
  f('yxai-agents', 'AI', 'Specialized agent team', 'blocked', 'Depends on model gateway'),
  f('yxai-gateway', 'AI', 'Multi-provider model gateway', 'in-development'),
  f('yxai-research', 'AI', 'Proprietary YX AI research', 'planned', 'Long-term R&D track'),
  f('yxai-import', 'Foundation', 'Import existing projects (ZIP)', 'planned'),
  f('yxai-versioning', 'Foundation', 'Version history and rollback', 'planned'),
  f('yxai-testing', 'QA', 'Testing center and browser agent', 'planned'),
  f('yxai-deploy', 'Platform', 'Build & release center, deployment', 'blocked', 'Needs build infrastructure'),
  f('yxai-lock', 'Security', 'Independent private lock + session', 'released'),
];

export const FEATURE_STATE_LABELS: Record<FeatureState, { en: string; fa: string }> = {
  planned: { en: 'Planned', fa: 'برنامه‌ریزی‌شده' },
  'in-development': { en: 'In Development', fa: 'در حال توسعه' },
  implemented: { en: 'Implemented', fa: 'پیاده‌سازی‌شده' },
  tested: { en: 'Tested', fa: 'آزموده‌شده' },
  released: { en: 'Released', fa: 'منتشرشده' },
  blocked: { en: 'Blocked', fa: 'متوقف‌شده' },
};
