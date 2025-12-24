import { PageHero } from '@/components/shared/PageHero'
import { CTASection } from '@/components/shared/CTASection'
import { COMPANY_INFO, FOUNDER_INFO } from '@/lib/constants'
import { Card } from '@/components/ui/card'

export default function About() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="About LetsCrackDev"
        description="Crack the Code. Build the Future."
      />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              LetsCrackDev was founded with a simple mission: to help developers discover, organize,
              and track the best resources available. We believe that great developers are made
              through continuous learning, and finding quality resources shouldn't be a challenge.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our platform aggregates thousands of curated resources, tools, libraries, and learning
              materials from across the web, making it easier for developers at all levels to find
              exactly what they need to grow their skills.
            </p>
          </Card>

          <Card className="p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Company Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Company Name</h3>
                <p className="text-gray-700 dark:text-gray-300">{COMPANY_INFO.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Managed By</h3>
                <p className="text-gray-700 dark:text-gray-300">{COMPANY_INFO.managedBy}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h3>
                <p className="text-gray-700 dark:text-gray-300">{COMPANY_INFO.contact}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                <p className="text-gray-700 dark:text-gray-300">{COMPANY_INFO.email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              About the Founder
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {FOUNDER_INFO.name}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  {FOUNDER_INFO.title}
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <a
                    href={`mailto:${FOUNDER_INFO.email}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {FOUNDER_INFO.email}
                  </a>
                  <span className="text-gray-400 dark:text-gray-500">|</span>
                  <a
                    href={`tel:${FOUNDER_INFO.phone}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {FOUNDER_INFO.phone}
                  </a>
                  <span className="text-gray-400 dark:text-gray-500">|</span>
                  <a
                    href={FOUNDER_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    github.com/SumitRaj0
                  </a>
                  <span className="text-gray-400 dark:text-gray-500">|</span>
                  <a
                    href={FOUNDER_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    linkedin.com/in/5umitraj
                  </a>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{FOUNDER_INFO.location}</p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Summary
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {FOUNDER_INFO.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Professional Experience
                </h4>
                <div className="space-y-4">
                  {FOUNDER_INFO.experience.map((exp, index) => (
                    <div key={index}>
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {exp.company}, {exp.position}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {exp.period} | {exp.location}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Key Skills
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Frontend
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {FOUNDER_INFO.skills.frontend}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Backend</h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {FOUNDER_INFO.skills.backend}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      DevOps & Cloud
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {FOUNDER_INFO.skills.devops}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Tools & Testing
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {FOUNDER_INFO.skills.tools}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Education
                </h4>
                <div className="border-l-4 border-gray-200 dark:border-gray-700 pl-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {FOUNDER_INFO.education.institution}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {FOUNDER_INFO.education.degree}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {FOUNDER_INFO.education.period} | {FOUNDER_INFO.education.location}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <CTASection
            title="Join Our Community"
            description="Crack the Code. Build the Future."
            primaryButton={{ text: 'Explore Resources', to: '/resources' }}
            secondaryButton={{ text: 'Get in Touch', to: '/contact' }}
          />
        </div>
      </section>
    </div>
  )
}
