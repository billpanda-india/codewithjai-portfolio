import { supabase } from './client'

// =============================================
// SITE SETTINGS
// =============================================

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) console.error('Error fetching site settings:', error)
  return data
}

export async function getSiteLinks() {
  const { data, error } = await supabase
    .from('site_links')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) console.error('Error fetching site links:', error)
  return data || []
}

// =============================================
// NAVIGATION
// =============================================

export async function getNavigation() {
  const { data: nav, error: navError } = await supabase
    .from('navigation')
    .select('*')
    .single()

  if (navError) {
    console.error('Error fetching navigation:', navError)
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from('navigation_items')
    .select(`
      *,
      internal_page:pages(id, slug, title)
    `)
    .eq('navigation_id', nav.id)
    .order('order_index', { ascending: true })

  if (itemsError) console.error('Error fetching navigation items:', itemsError)

  return {
    ...nav,
    items: items || []
  }
}

// =============================================
// FOOTER
// =============================================

export async function getFooter() {
  const { data: footer, error: footerError } = await supabase
    .from('footer')
    .select('*')
    .single()

  if (footerError) {
    console.error('Error fetching footer:', footerError)
    return null
  }

  const { data: columns, error: columnsError } = await supabase
    .from('footer_columns')
    .select(`
      *,
      links:footer_links(
        *,
        internal_page:pages(id, slug, title)
      )
    `)
    .eq('footer_id', footer.id)
    .order('order_index', { ascending: true })

  const { data: socials, error: socialsError } = await supabase
    .from('footer_socials')
    .select('*')
    .eq('footer_id', footer.id)
    .order('order_index', { ascending: true })

  if (columnsError) console.error('Error fetching footer columns:', columnsError)
  if (socialsError) console.error('Error fetching footer socials:', socialsError)

  return {
    ...footer,
    columns: columns || [],
    socials: socials || []
  }
}

// =============================================
// PAGES
// =============================================

export async function getPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) console.error('Error fetching page:', error)
  return data
}

export async function getAllPageSlugs() {
  const { data, error } = await supabase
    .from('pages')
    .select('slug')

  if (error) console.error('Error fetching page slugs:', error)
  return data || []
}

// =============================================
// PROJECTS
// =============================================

export async function getAllProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      short_description,
      category,
      website_url,
      highlighted,
      order_index,
      created_at,
      updated_at,
      tech_stack:project_skills(
        skill:skills(id, name)
      )
    `)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects.map(project => ({
    ...project,
    tech_stack: project.tech_stack?.map((ps: any) => ps.skill) || []
  }))
}

export async function getFeaturedProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      short_description,
      category,
      website_url,
      highlighted,
      order_index,
      created_at,
      updated_at,
      tech_stack:project_skills(
        skill:skills(id, name)
      )
    `)
    .eq('highlighted', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return projects.map(project => ({
    ...project,
    tech_stack: project.tech_stack?.map((ps: any) => ps.skill) || []
  }))
}

export async function getProjectBySlug(slug: string) {
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      images:project_images(id, image, order_index),
      tech_stack:project_skills(
        skill:skills(id, name, logo, category)
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return {
    ...project,
    tech_stack: project.tech_stack?.map((ps: any) => ps.skill) || []
  }
}

export async function getAllProjectSlugs() {
  const { data, error } = await supabase
    .from('projects')
    .select('slug')

  if (error) console.error('Error fetching project slugs:', error)
  return data || []
}

// =============================================
// SKILLS/TECH
// =============================================

export async function getAllSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name', { ascending: true })

  if (error) console.error('Error fetching skills:', error)
  return data || []
}

// =============================================
// TESTIMONIALS
// =============================================

export async function getAllTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select(`
      *,
      project:projects(id, title, slug)
    `)

  if (error) console.error('Error fetching testimonials:', error)
  return data || []
}

export async function getTestimonialsByProject(projectId: string) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('project_id', projectId)

  if (error) console.error('Error fetching testimonials:', error)
  return data || []
}

// =============================================
// CONTACT INFO
// =============================================

export async function getContactInfo() {
  const { data: contact, error: contactError } = await supabase
    .from('contact_info')
    .select('*')
    .single()

  if (contactError) {
    console.error('Error fetching contact info:', contactError)
    return null
  }

  const { data: socials, error: socialsError } = await supabase
    .from('contact_socials')
    .select('*')
    .eq('contact_info_id', contact.id)
    .order('order_index', { ascending: true })

  if (socialsError) console.error('Error fetching contact socials:', socialsError)

  return {
    ...contact,
    socials: socials || []
  }
}
