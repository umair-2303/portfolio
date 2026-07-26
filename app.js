// Main React Application for Muhammad Umair's Portfolio

const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion || { motion: { div: 'div', a: 'a', button: 'button', section: 'section', header: 'header', span: 'span', img: 'img' }, AnimatePresence: ({children}) => children };

// Three.js Background Component (Dark Mode)
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!window.THREE || !mountRef.current) return;

    const THREE = window.THREE;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle system
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xA81C1C); // Rudy Red
    const color2 = new THREE.Color(0xF5B335); // Crayola Yellow

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;

      const mixedColor = Math.random() > 0.5 ? color1 : color2;
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating Torus Mesh
    const torusGeo = new THREE.TorusGeometry(12, 0.4, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xA81C1C,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Mouse move interactive parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;

      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="three-bg-canvas" ref={mountRef} />;
};

// Navbar Component
const Navbar = ({ onOpenCvModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations.en;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: "#home" },
    { name: t.nav.about, href: "#about" },
    { name: t.nav.education, href: "#education" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.contact, href: "#contact" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 glass-nav shadow-lg' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A81C1C] to-[#F5B335] p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0D0D0D] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F5B335] to-[#A81C1C]">MU</span>
            </div>
          </div>
          <span className="text-xl font-bold tracking-wider text-[#F5F5F5] group-hover:text-[#F5B335] transition-colors">
            Muhammad <span className="text-[#A81C1C]">Umair</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-[#B3B3B3] hover:text-[#F5F5F5] hover:bg-white/5 rounded-lg transition-all"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={onOpenCvModal}
            className="px-4 py-2 text-sm font-semibold text-[#F5B335] border border-[#F5B335]/40 hover:border-[#F5B335] hover:bg-[#F5B335]/10 rounded-xl transition-all"
          >
            {t.nav.resume}
          </button>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 mt-3 space-y-2">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#B3B3B3] hover:text-[#F5F5F5] hover:bg-white/5 rounded-lg"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={() => { setMobileMenuOpen(false); onOpenCvModal(); }}
            className="w-full text-center px-4 py-2 mt-3 text-sm font-semibold text-[#F5B335] border border-[#F5B335] rounded-xl"
          >
            {t.nav.resume}
          </button>
        </div>
      )}
    </header>
  );
};

// Hero Section Component
const Hero = ({ onOpenCvModal }) => {
  const t = translations.en;

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center z-10">
      <div className="max-w-5xl mx-auto px-4 text-center">
        
        {/* Glowing Circular Avatar */}
        <div className="inline-block mb-8 relative">
          <div className="avatar-frame w-40 h-40 md:w-48 md:h-48 mx-auto overflow-hidden">
            <img
              src="assets/avatar.jpg"
              alt="Muhammad Umair"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80";
              }}
            />
          </div>
          <div className="absolute -bottom-2 right-4 bg-[#A81C1C] text-white p-2 rounded-full shadow-lg border border-[#F5B335]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
        </div>

        {/* Animated Name & Titles */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="text-[#F5F5F5]">{t.hero.name.split(' ')[0]} </span>
            <span className="gradient-text-red-yellow">{t.hero.name.split(' ')[1]}</span>
          </h1>

          <p className="text-lg md:text-2xl font-semibold text-[#F5B335] tracking-wide">
            {t.hero.subtitle}
          </p>

          <p className="text-base md:text-lg text-[#B3B3B3] leading-relaxed max-w-2xl mx-auto pt-2">
            {t.hero.bio}
          </p>
        </div>

        {/* Action Buttons: Download CV and Contact Me */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-6">
          <button
            onClick={onOpenCvModal}
            className="btn-3d px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#A81C1C] to-[#F5B335] text-white font-bold text-base shadow-lg shadow-[#A81C1C]/30 flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>{t.hero.downloadCv}</span>
          </button>

          <a
            href="#contact"
            className="btn-3d px-7 py-3.5 rounded-2xl glass-panel text-[#F5F5F5] hover:text-white font-semibold text-base border border-white/20 hover:border-white/40 flex items-center space-x-2"
          >
            <span>{t.hero.contactMe}</span>
          </a>
        </div>

        {/* Location Badge */}
        <div className="mt-8 inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-medium text-[#B3B3B3]">
          <svg className="w-4 h-4 text-[#A81C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>{t.hero.location}</span>
        </div>

      </div>
    </section>
  );
};

// About Component
const About = () => {
  const t = translations.en;

  return (
    <section id="about" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5]">
            {t.about.title}
          </h2>
          <p className="text-[#F5B335] font-semibold mt-2 text-base md:text-lg">
            {t.about.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="glass-panel p-8 rounded-3xl space-y-4 border-l-4 border-l-[#A81C1C]">
            <p className="text-[#F5F5F5] text-lg leading-relaxed">
              {t.about.paragraph1}
            </p>
            <p className="text-[#B3B3B3] text-base leading-relaxed">
              {t.about.paragraph2}
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-[#F5F5F5] flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#F5B335]"></span>
              <span>{t.about.quickFactsTitle}</span>
            </h3>

            <ul className="space-y-4 text-sm md:text-base text-[#B3B3B3]">
              <li className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-[#A81C1C]/20 text-[#A81C1C] mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span>{t.about.fact1}</span>
              </li>

              <li className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-[#F5B335]/20 text-[#F5B335] mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <span>{t.about.fact2}</span>
              </li>

              <li className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-[#A81C1C]/20 text-[#A81C1C] mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span>{t.about.fact3}</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

// Education Component (Including Matriculation J.W School 2023, Intermediate Aspire College, BSSE Superior University)
const Education = () => {
  const t = translations.en;

  const educationSteps = [
    {
      degree: "BS Software Engineering (BSSE)",
      status: "Currently Studying – 2nd Semester",
      institution: "Superior University",
      period: "2025 – Present",
      number: "01",
      iconSvg: (
        <svg className="w-6 h-6 text-[#F5B335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      degree: "Intermediate",
      status: "ICS with Physics",
      institution: "Aspire College",
      period: "June 2023 – 2025",
      number: "02",
      iconSvg: (
        <svg className="w-6 h-6 text-[#A81C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      degree: "Matriculation",
      status: "Computer Science",
      institution: "J.W School",
      period: "2011 – 2023",
      number: "03",
      iconSvg: (
        <svg className="w-6 h-6 text-[#F5B335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9m0 0h4" />
        </svg>
      )
    }
  ];

  return (
    <section id="education" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5] tracking-tight">
            {t.education.title}
          </h2>
          <p className="text-[#B3B3B3] text-base md:text-lg">
            Academic achievements & qualification timeline
          </p>
        </div>

        {/* Sleek Grid Layout (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationSteps.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-[#F5B335]/60 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${idx === 0 ? 'from-[#A81C1C] to-[#F5B335]' : idx === 1 ? 'from-[#F5B335] to-[#A81C1C]' : 'from-[#A81C1C] to-[#F5B335]'}`} />

              <div className="space-y-4">
                {/* Header row with icon, date badge & step number */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {item.iconSvg}
                  </div>

                  <span className="px-3 py-1 text-xs font-bold text-[#F5B335] bg-[#F5B335]/10 rounded-full border border-[#F5B335]/20">
                    {item.period}
                  </span>
                </div>

                {/* Degree Title */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[#F5F5F5] group-hover:text-[#F5B335] transition-colors">
                    {item.degree}
                  </h3>
                  <p className="text-xs font-semibold text-[#F5B335] mt-1">
                    {item.status}
                  </p>
                </div>
              </div>

              {/* Institution details */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2 text-xs font-medium text-[#B3B3B3]">
                  <svg className="w-4 h-4 text-[#A81C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9m0 0h4" />
                  </svg>
                  <span>{item.institution}</span>
                </div>
                <span className="text-xs font-bold text-white/20 tracking-widest">{item.number}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Technical Stack & Skills Component
const Skills = () => {
  const skillCategories = [
    {
      title: "Project Frontend & 3D Web Stack",
      description: "Core technologies and libraries used to build this portfolio",
      colorBorder: "border-t-[#A81C1C]",
      skills: [
        {
          name: "React",
          level: 75,
          badge: "Intermediate",
          badgeColor: "bg-[#A81C1C]/15 text-[#61DAFB] border-[#A81C1C]/30",
          logo: (
            <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 text-[#61DAFB]">
              <circle cx="0" cy="0" r="2" fill="currentColor"/>
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2"/>
                <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
              </g>
            </svg>
          )
        },
        {
          name: "JavaScript (ES6+)",
          level: 73,
          badge: "Intermediate",
          badgeColor: "bg-[#F7DF1E]/15 text-[#F7DF1E] border-[#F7DF1E]/30",
          logo: (
            <svg viewBox="0 0 128 128" className="w-8 h-8 rounded-lg">
              <path d="M1.408 1.408h125.184v125.184H1.408z" fill="#F7DF1E"/>
              <path d="M98.816 100.864c2.24 3.584 5.376 6.272 10.496 6.272 4.352 0 7.104-2.176 7.104-5.12 0-3.584-2.88-4.864-7.68-6.976l-2.688-1.152c-7.744-3.328-12.864-7.488-12.864-16.384 0-9.152 7.168-16.128 18.432-16.128 8.128 0 13.952 2.816 17.792 9.536l-8.384 5.376c-1.92-3.392-4.48-4.736-8.704-4.736-3.84 0-6.144 1.92-6.144 4.48 0 3.136 2.432 4.416 6.912 6.336l2.688 1.152c9.28 3.968 13.824 8.064 13.824 16.96 0 10.24-8.064 17.088-20.032 17.088-11.456 0-18.432-5.44-22.336-12.352l9.6-4.352zM67.328 100.224c2.048 3.52 4.8 6.08 9.088 6.08 4.288 0 6.976-1.728 6.976-8.32V57.6h11.968v40.704c0 13.056-7.616 18.752-18.88 18.752-10.048 0-16.064-5.248-19.2-11.584l10.048-5.248z" fill="#000"/>
            </svg>
          )
        },
        {
          name: "HTML5",
          level: 90,
          badge: "Advanced",
          badgeColor: "bg-[#E34F26]/15 text-[#E34F26] border-[#E34F26]/30",
          logo: (
            <svg viewBox="0 0 128 128" className="w-8 h-8">
              <path d="M19.387 113.689L9.771 6h108.458l-9.616 107.689L63.955 122" fill="#E34F26"/>
              <path d="M64 113.684l36.577-10.134 8.275-92.67H64" fill="#EF652A"/>
              <path d="M64 54.341H43.916l-1.393-15.617H64V24.591H28.324l.43 4.815 3.3 36.96h31.946M64 89.283l-.15.041-15.41-4.161-.986-11.043H31.78l1.941 21.742 30.207 8.385.072.02" fill="#FFF"/>
            </svg>
          )
        },
        {
          name: "CSS3",
          level: 85,
          badge: "Advanced",
          badgeColor: "bg-[#1572B6]/15 text-[#1572B6] border-[#1572B6]/30",
          logo: (
            <svg viewBox="0 0 128 128" className="w-8 h-8">
              <path d="M19.387 113.689L9.771 6h108.458l-9.616 107.689L63.955 122" fill="#1572B6"/>
              <path d="M64 113.684l36.577-10.134 8.275-92.67H64" fill="#33A9DC"/>
              <path d="M64 54.492H44.02l-1.393-15.617H64V24.742H28.428l.43 4.815 3.3 36.96H64" fill="#FFF"/>
            </svg>
          )
        },
        {
          name: "Tailwind CSS",
          level: 70,
          badge: "Intermediate",
          badgeColor: "bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30",
          logo: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#06B6D4] fill-current">
              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
            </svg>
          )
        },
        {
          name: "Three.js (3D WebGL)",
          level: 75,
          badge: "Intermediate",
          badgeColor: "bg-[#F5B335]/15 text-[#F5B335] border-[#F5B335]/30",
          logo: (
            <svg viewBox="0 0 128 128" className="w-8 h-8 text-white stroke-current fill-none" strokeWidth="6">
              <path d="M64 10L10 100h108L64 10zM64 40L35 90h58L64 40z"/>
            </svg>
          )
        }
      ]
    },
    {
      title: "Core Programming & Systems",
      description: "Systems programming & computer science fundamentals",
      colorBorder: "border-t-[#A81C1C]",
      skills: [
        {
          name: "C++",
          level: 75,
          badge: "Learning Fundamentals",
          badgeColor: "bg-[#00599C]/20 text-[#60A5FA] border-[#00599C]/40",
          logo: (
            <svg viewBox="0 0 128 128" className="w-8 h-8">
              <path d="M117.5 50h-7.5v-7.5h-5V50h-7.5v5h7.5v7.5h5V55h7.5v-5zm-25 0h-7.5v-7.5h-5V50h-7.5v5h7.5v7.5h5V55h7.5v-5zM60.6 27.6L34.1 42.9c-2.4 1.4-3.9 4-3.9 6.8v30.6c0 2.8 1.5 5.4 3.9 6.8l26.5 15.3c2.4 1.4 5.4 1.4 7.8 0l26.5-15.3c2.4-1.4 3.9-4 3.9-6.8V49.7c0-2.8-1.5-5.4-3.9-6.8L72.4 27.6c-3.7-2.1-8.1-2.1-11.8 0z" fill="#00599C"/>
            </svg>
          )
        }
      ]
    },
    {
      title: "Productivity & Office Suite",
      description: "Microsoft Office tools & documentation software",
      colorBorder: "border-t-[#A81C1C]",
      skills: [
        {
          name: "Microsoft Excel",
          level: 85,
          badge: "Proficient",
          badgeColor: "bg-[#107C41]/15 text-[#107C41] border-[#107C41]/30",
          logo: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#107C41] fill-current">
              <path d="M21.17 3H7.83A1.83 1.83 0 006 4.83v14.34A1.83 1.83 0 007.83 21h13.34A1.83 1.83 0 0023 19.17V4.83A1.83 1.83 0 0021.17 3zM1 18l4.5-6L1 6h3.5l2.75 4.2L10 6h3.5l-4.5 6 4.5 6H10l-2.75-4.2L4.5 18H1z"/>
            </svg>
          )
        },
        {
          name: "Microsoft Word",
          level: 92,
          badge: "Advanced",
          badgeColor: "bg-[#185ABD]/15 text-[#185ABD] border-[#185ABD]/30",
          logo: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#185ABD] fill-current">
              <path d="M21.17 3H7.83A1.83 1.83 0 006 4.83v14.34A1.83 1.83 0 007.83 21h13.34A1.83 1.83 0 0023 19.17V4.83A1.83 1.83 0 0021.17 3zM1 18l2.5-12h3l2 7.5L10.5 6h3L16 18h-3l-1.5-6L10 18H7.5l-1.5-6L4.5 18H1z"/>
            </svg>
          )
        },
        {
          name: "Microsoft PowerPoint",
          level: 90,
          badge: "Advanced",
          badgeColor: "bg-[#C43E1C]/15 text-[#C43E1C] border-[#C43E1C]/30",
          logo: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#C43E1C] fill-current">
              <path d="M21.17 3H7.83A1.83 1.83 0 006 4.83v14.34A1.83 1.83 0 0023 19.17V4.83A1.83 1.83 0 0021.17 3zM2.5 6h5.5a3.5 3.5 0 010 7H5.5v5H2.5V6zm3 2.5v2h2.5a1 1 0 000-2H5.5z"/>
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5] tracking-tight">
            Technical Stack & Skills
          </h2>
          <p className="text-[#B3B3B3] text-base md:text-lg">
            Technologies, programming languages, and tools used in my work
          </p>
        </div>

        {/* Categorized Tech Stack Sections */}
        <div className="space-y-12">
          {skillCategories.map((cat, catIdx) => (
            <div key={catIdx} className={`glass-panel p-6 md:p-8 rounded-3xl border-t-4 ${cat.colorBorder} space-y-6`}>
              <div>
                <h3 className="text-2xl font-bold text-[#F5F5F5]">
                  {cat.title}
                </h3>
                <p className="text-xs md:text-sm text-[#B3B3B3] mt-1">
                  {cat.description}
                </p>
              </div>

              {/* Grid of Skill Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.skills.map((sk, skIdx) => (
                  <div
                    key={skIdx}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 space-y-4 group"
                  >
                    {/* Logo & Name Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                          {sk.logo}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#F5B335] transition-colors">
                            {sk.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Badge & Strength Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={`px-2.5 py-0.5 rounded-full border ${sk.badgeColor}`}>
                          {sk.badge}
                        </span>
                        <span className="text-[#F5B335] font-bold">{sk.level}%</span>
                      </div>

                      <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#A81C1C] to-[#F5B335] transition-all duration-1000"
                          style={{ width: `${sk.level}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Contact Component
const Contact = () => {
  const t = translations.en;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);

    // Build mailto link – sends form data directly to Muhammad Umair's Gmail
    const recipient = "2008umairbhatti@gmail.com";
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Muhammad Umair,\n\nYou have received a new message from your portfolio website.\n\n` +
      `────────────────────────\n` +
      `Name:    ${formData.name}\n` +
      `Email:   ${formData.email}\n` +
      `────────────────────────\n\n` +
      `Message:\n${formData.message}\n\n` +
      `─── Sent via Portfolio Contact Form ───`
    );

    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      // Open the email client with pre-filled details
      window.location.href = mailtoLink;

      setSubmitted(true);

      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5]">
            {t.contact.title}
          </h2>
          <p className="text-[#B3B3B3] mt-2 text-base md:text-lg">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Details & Social Links */}
          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <h3 className="text-2xl font-bold text-[#F5F5F5]">
                Muhammad Umair
              </h3>
              <p className="text-[#B3B3B3] text-base">
                Motivated Software Engineering student seeking opportunities to collaborate, learn, and build software solutions.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-[#A81C1C]/20 text-[#A81C1C]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#B3B3B3]">{t.contact.locationTitle}</p>
                    <p className="text-base font-semibold text-[#F5F5F5]">{t.contact.locationVal}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-[#F5B335]/20 text-[#F5B335]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#B3B3B3]">{t.contact.phoneTitle}</p>
                    <a href="tel:+923334721305" className="text-base font-semibold text-[#F5F5F5] hover:text-[#F5B335]">
                      {t.contact.phoneVal}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-[#A81C1C]/20 text-[#A81C1C]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#B3B3B3]">Email</p>
                    <a href={`mailto:${t.contact.emailVal}`} className="text-base font-semibold text-[#F5F5F5] hover:text-[#F5B335]">
                      {t.contact.emailVal}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Cards */}
            <div className="glass-panel p-8 rounded-3xl">
              <h4 className="text-lg font-bold text-[#F5F5F5] mb-4">
                {t.contact.connectTitle}
              </h4>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  <span>GitHub</span>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#0A66C2] font-semibold text-sm transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-[#F5B335]">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-[#F5F5F5] mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.contact.namePlaceholder}
                  className="w-full px-4 py-3.5 rounded-2xl glass-panel text-[#F5F5F5] placeholder-[#B3B3B3] focus:outline-none focus:border-[#F5B335] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#F5F5F5] mb-2">
                  {t.contact.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full px-4 py-3.5 rounded-2xl glass-panel text-[#F5F5F5] placeholder-[#B3B3B3] focus:outline-none focus:border-[#F5B335] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#F5F5F5] mb-2">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-4 py-3.5 rounded-2xl glass-panel text-[#F5F5F5] placeholder-[#B3B3B3] focus:outline-none focus:border-[#F5B335] transition-all resize-none"
                ></textarea>
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-semibold flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold">Your email client has opened!</p>
                    <p className="text-green-400 font-normal text-xs mt-0.5">Your message is pre-filled and ready to send to <span className="text-green-300 font-semibold">2008umairbhatti@gmail.com</span>. Just click Send in your email app.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-3d w-full py-4 rounded-2xl bg-gradient-to-r from-[#A81C1C] to-[#F5B335] text-white font-bold text-base shadow-lg shadow-[#A81C1C]/30 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>{t.contact.sending}</span>
                ) : (
                  <>
                    <span>{t.contact.sendBtn}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

// Resume Modal Component (Exact Replica of Uploaded CV)
const ResumeModal = ({ isOpen, onClose }) => {
  const t = translations.en;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel max-w-4xl w-full rounded-3xl overflow-hidden border border-[#F5B335]/40 shadow-2xl p-6 md:p-8 space-y-6">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold text-[#F5F5F5]">
            {t.resumeModal.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* CV Preview Content styled matching the original layout */}
        <div className="bg-[#121216] p-6 md:p-8 rounded-2xl border border-white/10 max-h-[75vh] overflow-y-auto space-y-8 text-[#B3B3B3]">
          
          {/* Header & Personal Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-b border-white/10 pb-6 gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#F5F5F5] tracking-wider uppercase">
                MUHAMMAD <span className="text-[#F5B335]">UMAIR</span>
              </h1>
              <p className="text-sm text-[#F5B335] font-semibold">
                Software Engineering Student
              </p>
              
              <div className="text-xs text-[#B3B3B3] space-y-1 pt-2">
                <p><strong>Address:</strong> Phool Nagar, Punjab</p>
                <p><strong>Phone:</strong> +92 333 4721305</p>
                <p><strong>Email:</strong> <a href="mailto:2008umairbhatti@gmail.com" className="text-[#F5B335] underline">2008umairbhatti@gmail.com</a></p>
              </div>
            </div>

            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#A81C1C] shadow-lg flex-shrink-0">
              <img
                src="assets/avatar.jpg"
                alt="Muhammad Umair"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80";
                }}
              />
            </div>
          </div>

          {/* Objective */}
          <div>
            <h3 className="text-xl font-extrabold text-[#F5F5F5] border-b border-[#A81C1C] pb-1 mb-3">
              Objective
            </h3>
            <p className="text-sm leading-relaxed text-[#F5F5F5]">
              {t.resumeModal.objectiveText}
            </p>
          </div>

          {/* Skill Grid */}
          <div>
            <h3 className="text-xl font-extrabold text-[#F5F5F5] border-b border-[#A81C1C] pb-1 mb-4">
              Skill
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#F5F5F5]">
              <div className="flex items-center space-x-2">
                <span className="text-[#F5B335]">•</span>
                <span>Microsoft Excel</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#F5B335]">•</span>
                <span>HTML (Basic)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#F5B335]">•</span>
                <span>Microsoft Word</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#F5B335]">•</span>
                <span>CSS (Basic)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#F5B335]">•</span>
                <span>Microsoft PowerPoint</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#F5B335]">•</span>
                <span>C++ (Learning)</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xl font-extrabold text-[#F5F5F5] border-b border-[#A81C1C] pb-1 mb-4">
              Education
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-[#F5F5F5] text-base">BS Software Engineering (BSSE)</h4>
                <p className="text-[#F5B335]">Superior University (Currently Studying – 2nd Semester)</p>
              </div>
              <div>
                <h4 className="font-bold text-[#F5F5F5] text-base">Intermediate</h4>
                <p className="text-[#F5B335]">Aspire College (June 2023 – 2025)</p>
              </div>
              <div>
                <h4 className="font-bold text-[#F5F5F5] text-base">Matriculation (Computer Science)</h4>
                <p className="text-[#F5B335]">J.W School (2011 – 2023)</p>
              </div>
            </div>
          </div>

          {/* Projects / Learning */}
          <div>
            <h3 className="text-xl font-extrabold text-[#F5F5F5] border-b border-[#A81C1C] pb-1 mb-3">
              Projects / Learning
            </h3>
            <ul className="space-y-2 text-sm text-[#F5F5F5]">
              <li className="flex items-center space-x-2">
                <span className="text-[#F5B335]">▪</span>
                <span>Created basic web pages using HTML & CSS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#F5B335]">▪</span>
                <span>Learning programming fundamentals in C++</span>
              </li>
            </ul>
          </div>

          {/* Personal Strengths & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#F5F5F5] border-b border-[#A81C1C] pb-1 mb-3">
                Personal Strengths
              </h3>
              <ul className="space-y-2 text-sm text-[#F5F5F5]">
                <li className="flex items-center space-x-2">
                  <span className="text-[#F5B335]">▪</span>
                  <span>Quick learner</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#F5B335]">▪</span>
                  <span>Teamwork ability</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#F5B335]">▪</span>
                  <span>Passion for technology</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#F5F5F5] border-b border-[#A81C1C] pb-1 mb-3">
                Languages
              </h3>
              <ul className="space-y-2 text-sm text-[#F5F5F5]">
                <li><strong>Urdu:</strong> Native</li>
                <li><strong>English:</strong> Basic</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl glass-panel text-[#F5B335] font-semibold text-sm border border-[#F5B335]/40 hover:border-[#F5B335]"
          >
            {t.resumeModal.downloadPdf}
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm"
          >
            {t.resumeModal.close}
          </button>
        </div>

      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const t = translations.en;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-10 border-t border-white/10 relative z-10 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <p className="text-sm text-[#B3B3B3] text-center md:text-left">
          © {new Date().getFullYear()} {t.footer.copyright}
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 text-xs font-bold text-[#F5B335] hover:text-white px-4 py-2 rounded-xl glass-panel border border-[#F5B335]/30 hover:border-[#F5B335] transition-all"
        >
          <span>{t.footer.backToTop}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>

      </div>
    </footer>
  );
};

// App Main Shell
const App = () => {
  const [cvModalOpen, setCvModalOpen] = useState(false);

  useEffect(() => {
    document.body.classList.remove('light-theme');
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] text-[#F5F5F5] selection:bg-[#A81C1C] selection:text-white">
      
      {/* Three.js Background Canvas */}
      <ThreeBackground />

      {/* Top Sticky Glass Navigation */}
      <Navbar onOpenCvModal={() => setCvModalOpen(true)} />

      {/* Hero Section */}
      <Hero onOpenCvModal={() => setCvModalOpen(true)} />

      {/* About Section */}
      <About />

      {/* Education Section */}
      <Education />

      {/* Technical Stack & Skills Section */}
      <Skills />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Resume Viewer Modal */}
      <ResumeModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} />

    </div>
  );
};

// Render React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
