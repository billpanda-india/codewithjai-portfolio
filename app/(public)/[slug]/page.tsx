import { notFound } from 'next/navigation'
import { getPageBySlug, getAllPageSlugs, getAllProjects, getAllSkills } from '@/lib/supabase/queries'
import HeroSection from '@/components/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'

export const revalidate = 60

export async function generateStaticParams() {
  const pages = await getAllPageSlugs()
  return pages.filter((p: any) => p.slug !== 'home').map((page: any) => ({
    slug: page.slug,
  }))
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  const [projects, skills] = await Promise.all([
    getAllProjects(),
    getAllSkills(),
  ])

  return (
    <>
      {page.hero_title && (
        <HeroSection
          title={page.hero_title}
          titleHighlight={page.hero_title_highlight}
          subtitle={page.hero_subtitle}
          ctaLabel={page.hero_cta_label}
          ctaUrl={page.hero_cta_url}
          backgroundImage={page.hero_background_image}
        />
      )}

      {/* For services page - show skills */}
      {params.slug === 'services' && (
        <SkillsSection
          heading="Technologies & Tools"
          description="The tech stack I use to build exceptional products"
          skills={skills}
        />
      )}

      {/* For about page - show featured projects */}
      {params.slug === 'about' && (
        <ProjectsSection
          heading="Featured Work"
          description="Some of my recent projects"
          projects={projects.filter(p => p.highlighted).slice(0, 3)}
        />
      )}
    </>
  )
}
