export type Profile = {
  id: number;
  name: string;
  greeting: string;
  job_title: string;
  location: string;
  available: boolean;
  avatar_url: string;
  about_title: string;
  about_paragraphs: string[];
  languages: string;
  education: string;
  ielts_score: string;
  email: string;
  phone: string;
  instagram_url: string;
  telegram_url: string;
  github_url: string;
  updated_at: string;
};

export type ProfileInput = Omit<Profile, 'id' | 'updated_at'>;

export type Skill = {
  id: string;
  name: string;
  icon: string;
  level: number;
  created_at: string;
};

export type SkillInput = Pick<Skill, 'name' | 'icon' | 'level'>;

export type Project = {
  id: string;
  title: string;
  description: string;
  tag: string;
  live_url: string;
  repo_url: string;
  image_url: string;
  created_at: string;
};

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type MessageInput = Pick<Message, 'name' | 'email' | 'message'>;

export type PortfolioContent = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
};
