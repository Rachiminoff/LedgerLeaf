import React from 'react';
import { Icon } from '@iconify/react';
import { AppInfo as AppInfoType } from '@/types/help';

interface AppInfoProps {
  data: AppInfoType;
}

// Map technologies to their respective icons
const techIcons: Record<string, string> = {
  'React 19': 'logos:react',
  'TypeScript': 'logos:typescript-icon',
  'Inertia.js': 'logos:inertiajs-icon',
  'Tailwind CSS': 'logos:tailwindcss-icon',
  'Vite': 'logos:vitejs',
  'Laravel 12': 'logos:laravel',
  'PHP': 'logos:php',
  'MySQL': 'logos:mysql-icon',
};

export default function AppInfo({ data }: AppInfoProps) {
  const getTechIcon = (tech: string) => {
    // Try exact match first
    if (techIcons[tech]) return techIcons[tech];
    
    // Try partial match
    const key = Object.keys(techIcons).find(k => tech.includes(k.replace(/\s\d+$/, '')));
    if (key) return techIcons[key];
    
    // Default icon
    return 'mdi:code-brackets';
  };

  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
          <Icon icon="mdi:application-outline" className="w-5 h-5 text-[#5CB85C]" />
        </div>
        <h2 className="text-xl font-semibold text-white">Application Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Application Name</p>
            <p className="text-white font-medium">{data.applicationName}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Version</p>
            <p className="text-white font-medium">{data.version}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Developer</p>
            <p className="text-white font-medium">{data.developer}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Project Type</p>
            <p className="text-white font-medium">{data.project.type}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Category</p>
            <p className="text-white font-medium">{data.project.category}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">License</p>
            <p className="text-white font-medium">{data.license}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Last Updated</p>
            <p className="text-white font-medium">{data.lastUpdated}</p>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Platforms</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.platforms.map((platform, index) => {
                const platformIcons: Record<string, string> = {
                  'Desktop': 'mdi:monitor',
                  'Tablet': 'mdi:tablet',
                  'Mobile': 'mdi:cellphone',
                };
                return (
                  <span key={index} className="flex items-center gap-1.5 text-xs bg-[#1A1A1A] text-[#9A9A9A] px-3 py-1.5 rounded-full border border-[#242424]">
                    <Icon icon={platformIcons[platform] || 'mdi:device'} className="w-3.5 h-3.5" />
                    {platform}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#9A9A9A] uppercase tracking-wider">Repository</p>
            <a 
              href={data.repository} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#5CB85C] hover:text-[#6FCF70] transition-colors text-sm"
            >
              <Icon icon="mdi:github" className="w-4 h-4" />
              {data.repository.replace('https://github.com/', '')}
            </a>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mt-6 pt-6 border-t border-[#242424]">
        <p className="text-xs text-[#9A9A9A] uppercase tracking-wider mb-3">Technology Stack</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[#5CB85C] mb-2 flex items-center gap-1.5">
              <Icon icon="mdi:monitor" className="w-3.5 h-3.5" />
              Frontend
            </p>
            <div className="flex flex-wrap gap-2">
              {data.technologies.frontend.map((tech, index) => (
                <span key={index} className="flex items-center gap-1.5 text-xs bg-[#1A1A1A] text-[#9A9A9A] px-2.5 py-1.5 rounded-lg border border-[#242424]">
                  <Icon icon={getTechIcon(tech)} className="w-4 h-4" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#5CB85C] mb-2 flex items-center gap-1.5">
              <Icon icon="mdi:server" className="w-3.5 h-3.5" />
              Backend
            </p>
            <div className="flex flex-wrap gap-2">
              {data.technologies.backend.map((tech, index) => (
                <span key={index} className="flex items-center gap-1.5 text-xs bg-[#1A1A1A] text-[#9A9A9A] px-2.5 py-1.5 rounded-lg border border-[#242424]">
                  <Icon icon={getTechIcon(tech)} className="w-4 h-4" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#5CB85C] mb-2 flex items-center gap-1.5">
              <Icon icon="mdi:database" className="w-3.5 h-3.5" />
              Database
            </p>
            <div className="flex flex-wrap gap-2">
              {data.technologies.database.map((tech, index) => (
                <span key={index} className="flex items-center gap-1.5 text-xs bg-[#1A1A1A] text-[#9A9A9A] px-2.5 py-1.5 rounded-lg border border-[#242424]">
                  <Icon icon={getTechIcon(tech)} className="w-4 h-4" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 pt-6 border-t border-[#242424]">
        <p className="text-xs text-[#9A9A9A] uppercase tracking-wider mb-2">Description</p>
        <p className="text-[#9A9A9A] text-sm leading-relaxed">{data.description}</p>
      </div>

      {/* Features */}
      <div className="mt-6 pt-6 border-t border-[#242424]">
        <p className="text-xs text-[#9A9A9A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Icon icon="mdi:star" className="w-3.5 h-3.5" />
          Key Features
        </p>
        <div className="flex flex-wrap gap-2">
          {data.features.map((feature, index) => {
            const featureIcons: Record<string, string> = {
              'Pocket-Based Budgeting': 'mdi:folder-multiple',
              'Expense Tracking': 'mdi:credit-card-outline',
              'Savings Management': 'mdi:target',
              'Budget Planning': 'mdi:chart-pie',
              'Financial Analytics': 'mdi:chart-line',
              'PDF & Spreadsheet Export': 'mdi:file-export',
              'Responsive Desktop & Mobile Experience': 'mdi:responsive',
            };
            return (
              <span key={index} className="flex items-center gap-1.5 text-xs bg-[#1A1A1A] text-[#9A9A9A] px-3 py-1.5 rounded-full border border-[#242424]">
                <Icon icon={featureIcons[feature] || 'mdi:check-circle'} className="w-3.5 h-3.5 text-[#5CB85C]" />
                {feature}
              </span>
            );
          })}
        </div>
      </div>

      {/* Project Purpose */}
      <div className="mt-6 pt-6 border-t border-[#242424]">
        <p className="text-xs text-[#9A9A9A] uppercase tracking-wider mb-2">Project Purpose</p>
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#242424]">
          <div className="flex items-start gap-3">
            <Icon icon="mdi:lightbulb-outline" className="w-5 h-5 text-[#5CB85C] mt-0.5" />
            <p className="text-[#9A9A9A] text-sm leading-relaxed">{data.project.purpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
}