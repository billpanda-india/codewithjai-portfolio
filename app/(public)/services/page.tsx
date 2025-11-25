import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { supabaseAdmin } from "@/lib/supabase/client"
import * as Icons from 'lucide-react'
import { generatePageMetadata } from '@/lib/metadata'

export const revalidate = 0

export async function generateMetadata() {
  return generatePageMetadata('services')
}

async function getServicesData() {
  try {
    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', 'services')
      .single()

    if (!page) return null

    // Fetch services
    const { data: services } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    // Fetch benefits
    const { data: benefits } = await supabaseAdmin
      .from('service_benefits')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    return {
      ...page,
      services: services || [],
      benefits: benefits || [],
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    return null
  }
}

export default async function ServicesPage() {
  const data = await getServicesData()

  if (!data) {
    return <div>Services page not found</div>
  }

  return (
    <>
      <HeroGeometric
        badge={data.hero_badge || "Our Services"}
        title1={data.hero_title || "Elevate Your Digital"}
        title2={data.hero_title_highlight || "Vision"}
        subtitle={data.hero_subtitle || "Comprehensive solutions tailored to your needs"}
      />

      {/* SERVICES GRID */}
      {data.services && data.services.length > 0 && (
        <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
                What We{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  Offer
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Professional services to help you succeed
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.services.map((service: any, index: number) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.Code2
                
                // Mixed gradient colors using brand colors
                const gradients = [
                  'from-emerald-500 via-emerald-600 to-blue-600',
                  'from-blue-500 via-blue-600 to-emerald-600',
                  'from-emerald-500 via-blue-500 to-emerald-600',
                  'from-blue-500 via-emerald-500 to-blue-600',
                ]
                
                return (
                  <div
                    key={service.id}
                    className="group relative w-full rounded-[0.5rem_2rem] overflow-hidden shadow-[0px_15px_20px_-5px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0px_20px_30px_-5px_rgba(0,0,0,0.6)]"
                  >
                    {/* Image/Icon Container with Gradient - Vertical/Portrait - NO ZOOM */}
                    <div className={`relative h-[400px] bg-gradient-to-br ${gradients[index % gradients.length]} grid place-items-center rounded-[0.5rem_2rem]`}>
                      <IconComponent className="w-20 h-20 text-white/90" />
                    </div>

                    {/* Description Overlay - Expands to full height on hover */}
                    <div className="absolute bottom-2 left-2 right-2 h-auto group-hover:inset-2 p-4 backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-[0.5rem_2rem] transition-all duration-500 ease-out group-hover:bg-white/95 dark:group-hover:bg-black/90 overflow-hidden flex flex-col">
                      {/* Title - Always visible */}
                      <h3 className="text-white group-hover:text-black dark:group-hover:text-white text-sm font-bold uppercase tracking-wide truncate group-hover:text-base transition-all duration-300">
                        {service.title}
                      </h3>
                      
                      {/* Details - Hidden by default, shown on hover */}
                      <div className="max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-500 overflow-hidden flex-1 flex flex-col justify-center">
                        {service.price_starting && (
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-3 mb-3">
                            Starting at {service.price_starting}
                          </p>
                        )}
                        
                        <p className="text-gray-700 dark:text-gray-300 text-xs mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        {service.features && service.features.length > 0 && (
                          <div className="space-y-2">
                            {service.features.map((feature: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-xs">
                                <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* BENEFITS SECTION - PREMIUM DESIGN */}
      {data.benefits && data.benefits.length > 0 && (
        <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-zinc-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 mb-6">
                <Icons.Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Why Choose Us</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6">
                Built for{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience the difference with our commitment to quality, innovation, and your success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.benefits.map((benefit: any, index: number) => {
                const IconComponent = (Icons as any)[benefit.icon] || Icons.Award
                
                const gradients = [
                  'from-emerald-500/10 to-emerald-600/5',
                  'from-blue-500/10 to-blue-600/5',
                  'from-purple-500/10 to-purple-600/5',
                  'from-cyan-500/10 to-cyan-600/5',
                ]
                
                const iconGradients = [
                  'from-emerald-500 to-emerald-600',
                  'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600',
                  'from-cyan-500 to-cyan-600',
                ]
                
                return (
                  <div
                    key={benefit.id}
                    className="group relative"
                  >
                    {/* Card */}
                    <div className={`relative h-full p-8 rounded-3xl bg-gradient-to-br ${gradients[index % gradients.length]} backdrop-blur-sm border border-gray-200/50 dark:border-zinc-800/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 hover:-translate-y-2`}>
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-16 h-16 bg-gradient-to-br ${iconGradients[index % iconGradients.length]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {benefit.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                      
                      {/* Bottom accent line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${iconGradients[index % iconGradients.length]} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
