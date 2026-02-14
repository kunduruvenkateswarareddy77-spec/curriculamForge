export interface Module {
  title: string;
  duration: string;
  description: string;
  learningObjectives: string[];
  topics: string[];
  activityIdea: string;
  videoSuggestions: string[]; // Search queries/titles for relevant videos
}

export interface Curriculum {
  title: string;
  targetAudience: string;
  difficultyLevel: string;
  totalDuration: string;
  overview: string;
  prerequisites: string[];
  modules: Module[];
}

export interface GenerationParams {
  topic: string;
  audience: string;
  level: string; // Beginner, Intermediate, Advanced
  duration: string; // e.g., "4 weeks", "2 days"
  focus: string; // e.g., "Practical skills", "Theory", "Mix"
}

export type ViewState = 'landing' | 'create' | 'result';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  name: string;
  email: string;
  password?: string; // Only used for storage/validation
}
