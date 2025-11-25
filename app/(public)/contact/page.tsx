import ContactForm from '@/components/ContactForm'
import { supabaseAdmin } from "@/lib/supabase/client"
import * as Icons from 'lucide-react'
import { generateContactMetadata } from '@/lib/metadata'

export const revalidate = 0

export async function generateMetadata() {
  return generateContactMetadata()
}

async function getContactData() {
  try {
    const { data: page } = await supabaseAdmin
      .from('contact_page')
      .select('*')
      .single()

    if (!page) return null

    const { data: methods } = await supabaseAdmin
      .from('contact_methods')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    const { data: features } = await supabaseAdmin
      .from('contact_features')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    return {
      ...page,
      methods: methods || [],
      features: features || [],
    }
  } catch (error) {
    console.error('Error fetching contact:', error)
    return null
  }
}

export default async function ContactPage() {
  const data = await getContactData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">Please configure the contact page in the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* PREMIUM CONTACT HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-zinc-900 dark:to-black">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/20 backdrop-blur-sm mb-8 animate-fade-in">
            <Icons.Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {data.hero_badge || "Get In Touch"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6">
            <span className="block text-black dark:text-white mb-2 animate-fade-in-up">
              {data.hero_title || "Let's Build Something"}
            </span>
            <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 dark:from-emerald-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent animate-fade-in-up [animation-delay:0.1s]">
              {data.hero_title_highlight || "Amazing Together"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 animate-fade-in-up [animation-delay:0.2s]">
            {data.hero_subtitle || "Have a project in mind? Let's discuss how we can help bring your vision to life."}
          </p>

          {/* Quick Contact Stats - Admin Manageable */}
          <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-in-up [animation-delay:0.4s]">
            {/* Stat 1 */}
            {data.stat1_value && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 flex items-center justify-center">
                    {(() => {
                      const Icon = (Icons as any)[data.stat1_icon] || Icons.Clock
                      return <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    })()}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-black dark:text-white">{data.stat1_value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{data.stat1_label}</div>
                  </div>
                </div>
                
                {data.stat2_value && <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />}
              </>
            )}
            
            {/* Stat 2 */}
            {data.stat2_value && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 dark:bg-blue-500/20 flex items-center justify-center">
                    {(() => {
                      const Icon = (Icons as any)[data.stat2_icon] || Icons.Users
                      return <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    })()}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-black dark:text-white">{data.stat2_value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{data.stat2_label}</div>
                  </div>
                </div>
                
                {data.stat3_value && <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />}
              </>
            )}
            
            {/* Stat 3 */}
            {data.stat3_value && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 dark:bg-purple-500/20 flex items-center justify-center">
                  {(() => {
                    const Icon = (Icons as any)[data.stat3_icon] || Icons.Globe
                    return <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  })()}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-black dark:text-white">{data.stat3_value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{data.stat3_label}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="relative bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {data.contact_intro && (
            <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
              {data.contact_intro}
            </p>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* CONTACT METHODS */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-black dark:text-white mb-2">
                  Get In{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                    Touch
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your preferred way to reach us
                </p>
              </div>

              <div className="space-y-4">
                {data.methods && data.methods.map((method: any) => {
                  const IconComponent = (Icons as any)[method.icon] || Icons.Mail
                  
                  return (
                    <div
                      key={method.id}
                      className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 border-2 border-gray-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                            {method.title}
                          </h3>
                          {method.link ? (
                            <a
                              href={method.link}
                              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                              target={method.link.startsWith('http') ? '_blank' : undefined}
                              rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {method.value}
                            </a>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-300">
                              {method.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CONTACT FEATURES */}
              {data.features && data.features.length > 0 && (
                <div className="mt-12 pt-12 border-t border-gray-200 dark:border-zinc-800">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                    Why Contact Us?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {data.features.map((feature: any) => {
                      const IconComponent = (Icons as any)[feature.icon] || Icons.Award
                      
                      return (
                        <div
                          key={feature.id}
                          className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-500/20 dark:border-emerald-500/30"
                        >
                          <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
                          <h4 className="text-sm font-bold text-black dark:text-white mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CONTACT FORM */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-2 border-gray-200 dark:border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-black text-black dark:text-white mb-6">
                  Send a{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                    Message
                  </span>
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
