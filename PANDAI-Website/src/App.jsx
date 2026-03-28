import React, { useState, useEffect } from "react";
import { Download, Monitor, GraduationCap, Users, Heart, Zap, Shield, BarChart3, ChevronRight, Menu, X, ArrowDownCircle, Laptop, Smartphone, Globe } from "lucide-react";
import TeamCard from "./components/TeamCard";
import NeuralStatusBar from './components/NeuralStatusBar';
import NeuroExperience from './components/NeuroExperience';
import useSecurityShield from './hooks/useSecurityShield';
import "./index.css";

function App() {
  useSecurityShield(true); // Active globally
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObserver.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  const teamMembers = [
    {
      name: "Thoriq Abdurrohman Taqy",
      role: "CEO & Founder",
      photo: "https://ik.imagekit.io/telulang/ThoriqPose.JPG?updatedAt",
      bio: "Software Architect at Telkom University. Specialist in Neuro-AI systems and symbiotic interface design. Lead of PANDAI Neurolearn Project."
    },
    {
      name: "Grace Jessica",
      role: "CTO",
      photo: "https://ik.imagekit.io/2l9ibynmn0/bfd0a502-e2ec-4dea-885d-07a54337866f.jpg",
      bio: "Systems Architect for low-latency biometric synchronization. Lead implementer of PANDAI's high-intelligence core."
    },
    {
      name: "Mozart",
      role: "CPO",
      photo: "https://ik.imagekit.io/2l9ibynmn0/Gemini_Generated_Image_7fu2sd7fu2sd7fu2%20(2).png",
      bio: "Product Officer orchestrating the symbiotic user experience. Focus on educational flow and behavioral cognitive design."
    }
  ];

  const schools = [
    "SMAN 1 Cileunyi",
    "SMA Telkom Bandung",
    "SMK Telkom Jakarta",
    "SMP Telkom Makassar",
    "Telkom University",
    "Labschool Jakarta",
    "Binus School",
    "SMA 3 Bandung"
  ];

  return (
    <div className="app-root">
      <div className="app-container">
      <NeuralStatusBar />
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-content">
          <div className="logo-group">
            <img src="/images/logo-only.svg" alt="PANDAI" className="nav-logo" />
            <span className="logo-text">PANDAI</span>
          </div>
          
          <div className="nav-links">
            <a href="#tentang">Teknologi</a>
            <a href="#team">Tim Riset</a>
            <a href="#partnership">Kemitraan</a>
            <a href="#download">Software</a>
            <a href="#mari-belajar" className="cta-nav">Portal</a>
          </div>

          <button className="mobile-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="tentang" className="hero-section">
        <div className="container">
          <div className="hero-content reveal">
            <span className="badge">PANDAI NEUROLEARN 2.0</span>
            <h1 className="hero-title">
              Optimalisasi <span className="gradient-text">Kognitif</span> Melalui Neuro-AI Simbiotik.
            </h1>
            <p className="hero-description">
              Platform instruksional pertama yang mengintegrasikan AI generative dengan stimulasi neurofisiologis untuk 
              akselerasi kurikulum 14 hari menjadi <strong>7 hari efektif</strong>.
            </p>
            <div className="hero-actions stagger-2">
              <a href="#mari-belajar" className="btn-primary">Mulai Sesi Belajar</a>
              <a href="#download" className="btn-secondary">Download SDK/App</a>
            </div>
          </div>

          <div className="feature-grid grid-3">
             <div className="feature-card reveal stagger-1">
                <div className="icon-wrap gradient-bg">
                  <Zap size={24} color="#fff" />
                </div>
                <h3>Flow-State Logic</h3>
                <p>Sinkronisasi konten belajar dengan ambang batas atensi biologis siswa secara real-time.</p>
             </div>
             <div className="feature-card reveal stagger-2">
                <div className="icon-wrap gradient-bg">
                  <Shield size={24} color="#fff" />
                </div>
                <h3>Amigdala Shield</h3>
                <p>Protokol keamanan medis untuk menjamin integritas neurofisiologis pengguna.</p>
             </div>
             <div className="feature-card reveal stagger-3">
                <div className="icon-wrap gradient-bg">
                  <BarChart3 size={24} color="#fff" />
                </div>
                <h3>Precision Analytics</h3>
                <p>Dashboard analitik makro untuk Guru dan Waka Kurikulum berbasis data biometrik.</p>
             </div>
          </div>
        </div>
      </section>

      {/* PANDAI Neuro-Lab Experience */}
      <NeuroExperience />

      {/* Team Researcher Section */}
      <section id="team" className="team-section">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">Dewan <span className="gradient-text">Riset</span> PANDAI</h2>
            <p className="section-subtitle">Ahli dibalik inovasi pembelajaran berbasis sains saraf.</p>
          </div>
          <div className="team-grid grid-3 reveal stagger-2">
            {teamMembers.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Marquee */}
      <section id="kolaborasi" className="collab-section">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">Institusi <span className="gradient-text">Mitra</span></h2>
            <p className="section-subtitle">Telah mengimplementasikan protokol PANDAI dalam kurikulum mereka.</p>
          </div>
          <div className="schools-marquee">
            <div className="schools-track">
              {schools.concat(schools).map((school, i) => (
                <div key={i} className="school-pill">
                  <GraduationCap size={18} color="#0041c9" />
                  <span>{school}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Software Suite Selection */}
      <section id="download" className="download-section">
        <div className="container">
          <div className="download-card reveal-left">
            <div className="download-info">
              <h2 className="download-title">PANDAI Neuro-Client</h2>
              <p className="download-description">Unduh paket aplikasi desktop untuk sinkronisasi perangkat keras tDCS dan sensor biometrik dengan latensi minimal.</p>
              
              <div className="download-selection">
                <div className="os-option stagger-1">
                  <div className="os-header">
                    <Monitor size={24} />
                    <span>Windows Client v2.1 (Stability)</span>
                  </div>
                  <button className="btn-download" disabled>Download .msi</button>
                </div>
                <div className="os-option stagger-2">
                  <div className="os-header">
                    <Laptop size={24} />
                    <span>macOS Client v2.1 (Apple Silicon)</span>
                  </div>
                  <button className="btn-download" disabled>Download .dmg</button>
                </div>
              </div>
            </div>
            
            <div className="download-visual reveal">
               <div className="terminal-box floating">
                  <div className="terminal-header">
                    <div className="dot dot-r"></div>
                    <div className="dot dot-y"></div>
                    <div className="dot dot-g"></div>
                    <span className="terminal-title">pandai_example.py</span>
                  </div>
                  <div className="terminal-body">
                    <code>
                      <span className="code-keyword">import</span> pandai_sdk <span className="code-keyword">as</span> neuro<br/><br/>
                      <span className="code-comment"># Inisialisasi stream biometrik</span><br/>
                      stream = neuro.<span className="code-func">BiometricStream</span>(id=<span className="code-string">"T1-042"</span>)<br/><br/>
                      <span className="code-keyword">def</span> <span className="code-func">on_atention_drop</span>(event):<br/>
                      &nbsp;&nbsp;neuro.<span className="code-func">adjust_content</span>(event.intensity)<br/><br/>
                      stream.<span className="code-func">on_atention_drop</span>(on_atention_drop)<br/>
                      stream.<span className="code-func">start_effective_learning</span>()
                    </code>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="mari-belajar" className="portals-section">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">Ecosystem <span className="gradient-text">Portal</span></h2>
            <p className="section-subtitle">Pilih portal untuk memulai manajemen kognitif Anda.</p>
          </div>
          
          <div className="grid-2">
            <div className="portal-card reveal stagger-1">
              <div className="portal-icon gradient-bg">
                <Users size={32} color="#fff" />
              </div>
              <h3>Dashboard Guru</h3>
              <p>Analisis tren kognitif kelas dan kontrol intervensi neurofisiologis secara massal.</p>
              <button 
                className="btn-portal" 
                onClick={() => alert('Dashboard Guru masih dalam tahap pengembangan intensif untuk integrasi sensor biometrik.')}
              >
                Akses Dashboard <ChevronRight size={18} />
              </button>
            </div>

            <div className="portal-card reveal stagger-2">
              <div className="portal-icon gradient-bg">
                <GraduationCap size={32} color="#fff" />
              </div>
              <h3>PANDAI LMS Siswa</h3>
              <p>Ruang belajar dialektika AI yang tersinkronisasi dengan status fokus saraf Anda.</p>
              <button 
                className="btn-portal" 
                onClick={() => alert('Portal LMS Siswa sedang dalam tahap sinkronisasi protokol Neuro-AI.')}
              >
                Masuk LMS <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="partnership-section">
        <div className="container">
          <div className="partnership-grid">
            <div className="partnership-info reveal">
              <span className="badge">GABUNG EKOSISTEM</span>
              <h2 className="section-title">Mari <span className="gradient-text">Berkolaborasi</span></h2>
              <p className="section-subtitle" style={{textAlign: 'left', marginBottom: '2rem'}}>
                Jadilah bagian dari revolusi pendidikan berbasis sains saraf. Kami membantu institusi Anda 
                mengimplementasikan teknologi PANDAI secara end-to-end.
              </p>
              <div className="feature-list">
                <div className="school-pill" style={{marginBottom: '1rem', width: 'fit-content'}}>
                  <Shield size={18} color="#0041c9" /> <span>Implementasi Protokol Medis</span>
                </div>
                <div className="school-pill" style={{marginBottom: '1rem', width: 'fit-content'}}>
                  <Monitor size={18} color="#0041c9" /> <span>Instalasi Hardware tDCS</span>
                </div>
                <div className="school-pill" style={{width: 'fit-content'}}>
                  <BarChart3 size={18} color="#0041c9" /> <span>Pelatihan Guru & Staff</span>
                </div>
              </div>
            </div>

            <div className="contact-card reveal-left">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" className="form-input" placeholder="Masukkan nama Anda" />
                </div>
                <div className="form-group">
                  <label>Nama Sekolah / Institusi</label>
                  <input type="text" className="form-input" placeholder="Nama sekolah Anda" />
                </div>
                <div className="form-group">
                  <label>Email Profesional</label>
                  <input type="email" className="form-input" placeholder="email@sekolah.sch.id" />
                </div>
                <div className="form-group">
                  <label>Pesan atau Pertanyaan</label>
                  <textarea className="form-input" rows="4" placeholder="Apa yang bisa kami bantu?"></textarea>
                </div>
                <button type="submit" className="btn-submit">
                  Daftar Sebagai Mitra <ChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="logo-group">
              <img src="/images/logo-only.svg" alt="PANDAI" width={40} />
              <span className="logo-text">PANDAI</span>
            </div>
            <div className="footer-links">
              <a href="#">Privasi</a>
              <a href="#">Syarat & Ketentuan</a>
              <a href="#">Dokumentasi SDK</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 PANDAI PROJECT • Telkom University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}

export default App;
