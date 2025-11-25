// =============================================
// DATABASE TYPES (Supabase)
// =============================================

export interface SiteSettings {
  id: string
  title: string
  tagline?: string
  default_seo_title?: string
  default_seo_description?: string
  default_og_image?: string
  favicon?: string
  primary_color?: string
  secondary_color?: string
  default_background_image?: string
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  title: string
  slug: string
  hero_title?: string
  hero_title_highlight?: string
  hero_subtitle?: string
  hero_background_image?: string
  hero_cta_label?: string
  hero_cta_url?: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
  created_at: string
  updated_at: string
}

export interface Navigation {
  id: string
  title: string
  items: NavigationItem[]
  created_at: string
  updated_at: string
}

export interface NavigationItem {
  id: string
  navigation_id: string
  label: string
  target_type: 'internal' | 'external'
  internal_page_id?: string
  internal_page?: Page
  external_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Footer {
  id: string
  columns: FooterColumn[]
  socials: FooterSocial[]
  created_at: string
  updated_at: string
}

export interface FooterColumn {
  id: string
  footer_id: string
  title: string
  links: FooterLink[]
  order_index: number
  created_at: string
}

export interface FooterLink {
  id: string
  column_id: string
  label: string
  target_type: 'internal' | 'external'
  internal_page_id?: string
  internal_page?: Page
  external_url?: string
  order_index: number
  created_at: string
}

export interface FooterSocial {
  id: string
  footer_id: string
  platform: string
  icon_name?: string
  url: string
  order_index: number
  created_at: string
}

export interface Skill {
  id: string
  name: string
  logo?: string
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'database' | 'other'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description?: string
  long_description?: string
  category?: 'web' | 'mobile' | 'design' | 'fullstack' | 'other'
  logo?: string
  website_url?: string
  github_url?: string
  auto_preview_image?: string
  highlighted: boolean
  order_index: number
  images?: ProjectImage[]
  tech_stack?: Skill[]
  technologies?: string[]
  client_feedback?: string
  content_blocks?: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface ContentBlock {
  id: string
  type: 'heading' | 'paragraph' | 'bullets' | 'quote'
  content: string
  order: number
}

export interface ProjectImage {
  id: string
  project_id: string
  image: string
  order_index: number
  created_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_role?: string
  company?: string
  avatar?: string
  quote: string
  project_id?: string
  project?: Project
  created_at: string
  updated_at: string
}

export interface ContactInfo {
  id: string
  email?: string
  phone?: string
  whatsapp?: string
  location?: string
  contact_intro_text?: string
  socials: ContactSocial[]
  created_at: string
  updated_at: string
}

export interface ContactSocial {
  id: string
  contact_info_id: string
  platform: string
  url: string
  order_index: number
  created_at: string
}

export interface SMTPSettings {
  id: string
  host?: string
  port?: number
  user_email?: string
  password?: string
  from_email?: string
  from_name?: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  password_hash: string
  name?: string
  created_at: string
  updated_at: string
}
