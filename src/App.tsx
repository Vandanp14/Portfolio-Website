import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Briefcase, 
  Trophy,
  Mail,
  Linkedin,
  Globe,
  Phone,
  MapPin,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              VP
            </h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['about', 'education', 'experience', 'skills'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm transition-colors ${
                    activeSection === section 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="px-4 py-2 space-y-2">
              {['about', 'education', 'experience', 'skills'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 rounded-lg"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative min-h-screen flex items-center pt-16">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
            opacity: 0.5
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-8 inline-block">
              <div className="relative">
                <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
                  VANDAN PATEL
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-20 blur"></div>
              </div>
              <p className="text-2xl text-gray-300">Computer Science Student & Tech Enthusiast</p>
              <div className="mt-6">
                <a
                  href="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  View Resume
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="mailto:patelvandan024@gmail.com" 
                className="flex items-center gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="text-sm">patelvandan024@gmail.com</div>
                </div>
              </a>

              <a 
                href="https://linkedin.com/in/vpatel1410" 
                className="flex items-center gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">LinkedIn</div>
                  <div className="text-sm">vpatel1410</div>
                </div>
              </a>

              <a 
                href="https://vandan.dev" 
                className="flex items-center gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Website</div>
                  <div className="text-sm">vandanpatel.me</div>
                </div>
              </a>

              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl group">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Phone</div>
                  <div className="text-sm">+1 315-236-1200</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl group">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Location</div>
                  <div className="text-sm">Oswego, NY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-6">
        {/* Education */}
        <section id="education" className="py-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold">Education</h2>
          </div>
          
          <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/5 hover:border-purple-500/20 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Bachelor of Computer Science</h3>
            <p className="text-gray-400">State University of New York at Oswego</p>
            <p className="text-purple-400 mb-4">Expected Dec 2026</p>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-4">Relevant Coursework</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Introduction to Programming Languages',
                  'Foundations of Computer Science',
                  'JAVA',
                  'C Language',
                  'Operating Systems',
                  'Web Development',
                  'Data Structures & Algorithms',
                ].map((course, index) => (
                  <div 
                    key={index} 
                    className="bg-purple-500/10 px-4 py-3 rounded-xl text-sm hover:bg-purple-500/20 transition-colors"
                  >
                    {course}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
<section id="experience" className="py-20">
  <div className="flex items-center gap-4 mb-8">
    <div className="p-3 bg-blue-500/10 rounded-xl">
      <Briefcase className="w-8 h-8 text-blue-400" />
    </div>
    <h2 className="text-3xl font-bold">Experience</h2>
  </div>

  <div className="space-y-6">
    {[
      {
        title: 'Frontend Developer',
        company: 'Facility Services, SUNY Oswego',
        period: 'Oct 2023 – Present',
        location: 'Oswego, NY',
        achievements: [
          'Redesigned Facility Services webpages using React, HTML, CSS, Bootstrap, and Tailwind CSS, improving site responsiveness.',
          'Conducted UI/UX enhancements using modern design principles, increasing user engagement by 15%.',
          'Collaborated in an Agile Scrum team, participating in sprint planning, stand-ups, and retrospectives.',
          'Assisted in integrating Java-based backend features in IntelliJ to improve system efficiency.'
        ]
      },
      {
        title: 'IT Service Intern',
        company: 'SUNY Oswego IT Service Help Desk',
        period: 'Aug 2023 – December 2023',
        location: 'Oswego, NY',
        achievements: [
          'Diagnosed and resolved technical issues across Windows, macOS, and Linux, improving resolution time by 20%.',
          'Used Git for version control and software deployments, ensuring smooth rollouts.',
          'Worked within a Scrum framework, participating in stand-ups and sprint planning to optimize IT support workflows.',
          'Assisted in software installations, system updates, and security patches to enhance IT infrastructure.'
        ]
      },
      {
        title: 'Student Project Coordinator',
        company: 'Major Projects Office at Facility Services, SUNY Oswego',
        period: 'Sep 2023 – December 2023',
        location: 'Oswego, NY',
        achievements: [
          'Optimized data transfer processes, reducing processing time by 20% through automation and better structuring.',
          'Implemented Gantt charts and Agile project tracking to streamline task allocation and deadline management.',
          'Improved project organization by standardizing data formats for improved accessibility across departments.'
        ]
      }
    ].map((job, index) => (
      <div 
        key={index} 
        className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/5 hover:border-blue-500/20 transition-all group"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
            <p className="text-gray-400">{job.company}</p>
            {job.location && <p className="text-gray-400">{job.location}</p>}
          </div>
          <p className="text-blue-400 mt-2 md:mt-0">{job.period}</p>
        </div>
        
        <ul className="space-y-3">
          {job.achievements.map((achievement, i) => (
            <li key={i} className="flex items-start gap-3 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <span className="text-gray-300">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>


        {/* Skills */}
        <section id="skills" className="py-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-500/10 rounded-xl">
              <Trophy className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold">Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/5 hover:border-pink-500/20 transition-colors">
              <h3 className="text-xl font-semibold mb-6">Technical Skills</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'JAVA',
                  'C',
                  'Operating Systems',
                  'HTML',
                  'CSS',
                  'JavaScript',
                  'Web Development'
                ].map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-pink-500/10 px-4 py-3 rounded-xl text-sm hover:bg-pink-500/20 transition-colors flex items-center justify-center text-center"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/5 hover:border-pink-500/20 transition-colors">
              <h3 className="text-xl font-semibold mb-6">Soft Skills</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Problem Solving',
                  'Team Collaboration',
                  'Effective Communication',
                  'Time Management'
                ].map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-pink-500/10 px-4 py-3 rounded-xl text-sm hover:bg-pink-500/20 transition-colors flex items-center justify-center text-center"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;