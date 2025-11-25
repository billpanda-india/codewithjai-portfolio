import { getPageBySlug, getFeaturedProjects, getAllSkills, getAllTestimonials } from "@/lib/supabase/queries";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import GsapScrollSection from "@/components/GsapScrollSection";
import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 0; // No cache during development

export async function generateMetadata() {
  return generatePageMetadata('home');
}

export default async function Home() {
  const [homePage, featuredProjects, skills, testimonials] = await Promise.all([
    getPageBySlug('home'),
    getFeaturedProjects(),
    getAllSkills(),
    getAllTestimonials(),
  ]);

  return (
    <>
      <HeroSection
        title={homePage?.hero_title || "Building Digital"}
        titleHighlight={homePage?.hero_title_highlight || "Excellence"}
        subtitle={homePage?.hero_subtitle || "Senior Full-Stack Developer crafting exceptional digital experiences with cutting-edge technologies"}
        ctaLabel={homePage?.hero_cta_label || "Explore My Work"}
        ctaUrl={homePage?.hero_cta_url || "/projects"}
        backgroundImage={homePage?.hero_background_image}
      />

      <GsapScrollSection animation="slide">
        <ProcessSection steps={homePage?.process_steps || []} />
      </GsapScrollSection>

      <GsapScrollSection animation="fade" delay={0.2}>
        <ProjectsSection
          heading="Featured Projects"
          description="Showcasing my best work and recent projects"
          projects={featuredProjects}
        />
      </GsapScrollSection>

      <GsapScrollSection animation="slide" delay={0.1}>
        <SkillsSection
          heading="Tech Stack"
          description="Technologies and tools I use to build exceptional products"
          skills={skills}
        />
      </GsapScrollSection>

      <GsapScrollSection animation="scale">
        <TestimonialsSection testimonials={testimonials} />
      </GsapScrollSection>

      <GsapScrollSection animation="fade" delay={0.3}>
        <CTASection
          badgeText={homePage?.cta_badge_text}
          title={homePage?.cta_title}
          titleHighlight={homePage?.cta_title_highlight}
          description={homePage?.cta_description}
          primaryButtonText={homePage?.cta_primary_button_text}
          primaryButtonUrl={homePage?.cta_primary_button_url}
          secondaryButtonText={homePage?.cta_secondary_button_text}
          secondaryButtonUrl={homePage?.cta_secondary_button_url}
          stat1Number={homePage?.cta_stat1_number}
          stat1Label={homePage?.cta_stat1_label}
          stat2Number={homePage?.cta_stat2_number}
          stat2Label={homePage?.cta_stat2_label}
          stat3Number={homePage?.cta_stat3_number}
          stat3Label={homePage?.cta_stat3_label}
        />
      </GsapScrollSection>
    </>
  );
}
