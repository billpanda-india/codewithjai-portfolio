import HeroSection from "@/components/HeroSection"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import CertificationsSection from "@/components/sections/CertificationsSection"
import { supabaseAdmin } from "@/lib/supabase/client"
import { generatePageMetadata } from '@/lib/metadata'

export const revalidate = 0

export async function generateMetadata() {
  return generatePageMetadata('about')
}

async function getAboutData() {
  try {
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', 'about')
      .single()

    if (!page) return null

    const { data: aboutMe } = await supabaseAdmin
      .from('about_me_section')
      .select('*')
      .eq('page_id', page.id)
      .single()

    const { data: experience } = await supabaseAdmin
      .from('experience_items')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    const { data: education } = await supabaseAdmin
      .from('education_items')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    const { data: certifications } = await supabaseAdmin
      .from('certifications')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    return {
      ...page,
      about_me: aboutMe,
      experience: experience || [],
      education: education || [],
      certifications: certifications || [],
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
    return null
  }
}

export default async function AboutPage() {
  const data = await getAboutData()

  if (!data) {
    return <div>About page not found</div>
  }

  return (
    <>
      <HeroSection
        title={data.hero_title || "About"}
        titleHighlight={data.hero_title_highlight || "Me"}
        subtitle={data.hero_subtitle || "Learn more about my journey"}
        backgroundImage={data.hero_background_image}
      />

      {/* ABOUT ME SECTION */}
      {data.about_me && (
        <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {data.about_me.image ? (
                  <img
                    src={data.about_me.image}
                    alt="About Me"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[500px] bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {data.about_me.title_highlight || 'Me'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-8 -right-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 border-2 border-gray-200 dark:border-zinc-800">
                <div className="grid grid-cols-3 gap-6">
                  {data.about_me.years_experience && (
                    <div className="text-center">
                      <div className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                        {data.about_me.years_experience}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Years</div>
                    </div>
                  )}
                  {data.about_me.projects_completed && (
                    <div className="text-center">
                      <div className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                        {data.about_me.projects_completed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Projects</div>
                    </div>
                  )}
                  {data.about_me.happy_clients && (
                    <div className="text-center">
                      <div className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                        {data.about_me.happy_clients}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Clients</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-2">
                  {data.about_me.title}{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                    {data.about_me.title_highlight}
                  </span>
                </h2>
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {data.about_me.description}
              </p>
            </div>
          </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE SECTION */}
      {data.experience.length > 0 && (
        <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
              Work{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              My professional journey and career highlights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {data.experience.map((item: any, index: number) => {
              const gradients = [
                'from-emerald-500 to-teal-500',
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-orange-500 to-red-500',
              ]
              const gradient = gradients[index % gradients.length]

              return (
                <div key={item.id} className="group relative">
                  <div className="relative h-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        {item.logo_url ? (
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg ring-4 ring-gray-100 dark:ring-gray-800 group-hover:ring-emerald-500/20 transition-all">
                            <img src={item.logo_url} alt={item.company} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        <div className={`px-4 py-2 bg-gradient-to-r ${gradient} rounded-full shadow-lg`}>
                          <span className="text-sm font-bold text-white">{item.duration}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-2xl font-black text-black dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.role}
                        </h3>

                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
                          {item.company}
                        </div>

                        {item.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {item.location}
                          </div>
                        )}
                      </div>

                      <div className={`h-px bg-gradient-to-r ${gradient} opacity-20 mb-4`} />

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                  </div>

                  <div className="absolute -top-4 -right-4 z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-950 group-hover:scale-110 transition-transform`}>
                      <span className="text-white font-black text-lg">{index + 1}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        </section>
      )}

      {/* EDUCATION SECTION */}
      {data.education.length > 0 && (
        <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
              Education &{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Learning
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              My academic background and qualifications
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-6 max-w-7xl mx-auto">
            {data.education.map((item: any, index: number) => {
              // Bento grid layout matching the demo - 4 cards
              const gridAreas = [
                'md:[grid-area:1/1/2/7]',   // Card 1 - Top left (6 cols)
                'md:[grid-area:1/7/2/13]',  // Card 2 - Top right (6 cols)
                'md:[grid-area:2/1/3/7]',   // Card 3 - Bottom left (6 cols)
                'md:[grid-area:2/7/3/13]',  // Card 4 - Bottom right (6 cols)
              ]
              const area = gridAreas[index] || ''

              return (
                <div
                  key={item.id}
                  className={`group relative min-h-[20rem] ${area}`}
                >
                  <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-200 dark:border-zinc-800 p-2 md:rounded-[1.5rem] md:p-3">
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={3}
                    />
                    
                    <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-8">
                      <div className="relative flex flex-1 flex-col justify-between gap-4">
                        {/* Icon/Logo */}
                        <div className="w-fit">
                          {item.logo_url ? (
                            <div className="w-14 h-14 rounded-lg overflow-hidden border-[0.75px] border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                              <img src={item.logo_url} alt={item.institution} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-lg border-[0.75px] border-gray-200 dark:border-gray-800 bg-gradient-to-br from-emerald-500 to-blue-500 p-3 flex items-center justify-center">
                              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          {/* Duration Badge */}
                          <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
                            <span className="text-xs font-bold text-white tracking-wide">{item.duration}</span>
                          </div>

                          {/* Degree */}
                          <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-black dark:text-white">
                            {item.degree}
                          </h3>

                          {/* Field */}
                          {item.field && (
                            <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] font-semibold text-emerald-600 dark:text-emerald-400">
                              {item.field}
                            </p>
                          )}

                          {/* Institution & Location */}
                          <div className="space-y-1">
                            <p className="font-sans text-base leading-[1.25rem] md:text-lg md:leading-[1.5rem] font-bold text-gray-800 dark:text-gray-200">
                              {item.institution}
                            </p>
                            {item.location && (
                              <p className="font-sans text-sm leading-[1.125rem] text-gray-500 dark:text-gray-400">
                                {item.location}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-600 dark:text-gray-300">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS SECTION */}
      <CertificationsSection certifications={data.certifications} />
    </>
  )
}
