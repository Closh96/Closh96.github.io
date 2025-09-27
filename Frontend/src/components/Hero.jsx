import { useState, useEffect, useRef } from 'react';
import '../styles/hero.css';
import projects from '../data/projects.json';

// ============================================================================
// IMPORTAZIONE IMMAGINI PROGETTI
// ============================================================================
import ddImg from '../assets/dd.jpg';
import davideImg from '../assets/davide.jpg';
import mrcflImg from '../assets/mrcfl.jpg';
import oliodanteImg from '../assets/oliodante.jpg';

const imageMap = {
    dd: ddImg,
    davide: davideImg,
    mrcfl: mrcflImg,
    oliodante: oliodanteImg,
};

// ============================================================================
// COMPONENTE SPLIT TEXT EFFECT
// ============================================================================
const SplitText = ({ text, trigger = true, className = "", delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!trigger) return;

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [trigger, delay]);

    const words = text.split(' ');

    return (
        <span className={className}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'inline-block', marginRight: '0.3em' }}>
                    {word.split('').map((char, charIndex) => (
                        <span
                            key={charIndex}
                            style={{
                                display: 'inline-block',
                                opacity: isVisible ? 1 : 0,
                                transform: `translateY(${isVisible ? 0 : 20}px)`,
                                transition: `all 0.3s ease-out ${(wordIndex * word.length + charIndex) * 0.02}s`
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </span>
    );
};

// ============================================================================
// COMPONENTE FADE CONTENT EFFECT
// ============================================================================
const FadeContent = ({ children, className = "", delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px"
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay]);

    return (
        <div
            ref={elementRef}
            className={`fade-content ${isVisible ? 'fade-in' : 'fade-out'} ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 20}px)`,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
        >
            {children}
        </div>
    );
};

// ============================================================================
// COMPONENTE HERO PRINCIPALE
// ============================================================================
function Hero() {
    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    const [activeSection, setActiveSection] = useState('about');
    const [startAnimation, setStartAnimation] = useState(false);
    const contentRef = useRef(null);
    const aboutRef = useRef(null);
    const experienceRef = useRef(null);
    const projectsRef = useRef(null);

    // ========================================================================
    // AVVIA ANIMAZIONE AL CARICAMENTO
    // ========================================================================
    useEffect(() => {
        const timer = setTimeout(() => {
            setStartAnimation(true);
        }, 500); // Delay di 500ms

        return () => clearTimeout(timer);
    }, []);

    // ========================================================================
    // SCROLL HANDLER MIGLIORATO
    // ========================================================================
    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;

            const container = contentRef.current;
            const scrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;

            const sections = [
                { name: 'about', ref: aboutRef },
                { name: 'experience', ref: experienceRef },
                { name: 'projects', ref: projectsRef }
            ];

            let currentSection = 'about';
            let minDistance = Infinity;

            sections.forEach(({ name, ref }) => {
                if (ref.current) {
                    const elementTop = ref.current.offsetTop;
                    const elementHeight = ref.current.offsetHeight;
                    const elementCenter = elementTop + elementHeight / 2;
                    const viewportCenter = scrollTop + containerHeight / 2;

                    const distance = Math.abs(elementCenter - viewportCenter);

                    // La sezione più vicina al centro del viewport diventa attiva
                    if (distance < minDistance) {
                        minDistance = distance;
                        currentSection = name;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.addEventListener('scroll', handleScroll);
            handleScroll(); // Chiama subito per impostare la sezione iniziale
            return () => contentElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // ========================================================================
    // NAVIGATION HANDLER CON SCROLL PRECISO
    // ========================================================================
    const handleNavClick = (section) => {
        setActiveSection(section);

        if (!contentRef.current) return;

        let targetRef = null;

        switch(section) {
            case 'about':
                targetRef = aboutRef;
                break;
            case 'experience':
                targetRef = experienceRef;
                break;
            case 'projects':
                targetRef = projectsRef;
                break;
            default:
                return;
        }

        if (targetRef && targetRef.current) {
            const targetElement = targetRef.current;
            const containerTop = contentRef.current.offsetTop;
            const elementTop = targetElement.offsetTop;

            // Offset per compensare padding e posizionamento
            const offset = section === 'about' ? 0 : 40;

            contentRef.current.scrollTo({
                top: elementTop - containerTop - offset,
                behavior: 'smooth'
            });
        }
    };

    // ========================================================================
    // RENDER SEZIONI COMPLETE
    // ========================================================================
    return (
        <section className="hero">
            {/* ================================================================ */}
            {/* SEZIONE SINISTRA - INFO PERSONALI E NAVIGAZIONE */}
            {/* ================================================================ */}
            <div className="hero-left">
                <h1 className="hero-name">
                    <SplitText
                        text="Nicola Piras"
                        trigger={startAnimation}
                        delay={100}
                    />
                </h1>
                <p className="hero-title">
                    <SplitText
                        text="Designer & Junior Full Stack Developer"
                        trigger={startAnimation}
                        delay={300}
                    />
                </p>
                <p className="hero-subtitle">
                    <SplitText
                        text="Creo esperienze digitali accessibili per il web e vivo in italia."
                        trigger={startAnimation}
                        delay={500}
                    />
                </p>

                {/* Menu di navigazione */}
                <nav className="hero-nav">
                    <FadeContent delay={800}>
                        <a
                            href="#about"
                            className={`hero-nav-item ${activeSection === 'about' ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
                        >
                            Su di me
                        </a>
                    </FadeContent>
                    <FadeContent delay={900}>
                        <a
                            href="#experience"
                            className={`hero-nav-item ${activeSection === 'experience' ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); handleNavClick('experience'); }}
                        >
                            Esperienza
                        </a>
                    </FadeContent>
                    <FadeContent delay={1000}>
                        <a
                            href="#projects"
                            className={`hero-nav-item ${activeSection === 'projects' ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}
                        >
                            Progetti
                        </a>
                    </FadeContent>
                </nav>
            </div>

            {/* ================================================================ */}
            {/* SEZIONE DESTRA - CONTENUTO SCROLLABILE */}
            {/* ================================================================ */}
            <div className="hero-right" ref={contentRef}>
                {/* ============================================================ */}
                {/* SEZIONE: SU DI ME (ABOUT) */}
                {/* ============================================================ */}
                <div className="section-container" id="about-section" ref={aboutRef}>
                    <FadeContent delay={100}>
                        <div className="hero-content">
                            <p className="hero-intro">
                                <span className="hero-highlight">Sono un giovane Web Designer e sviluppatore Full Stack
                                    appassionato nella creazione di nuove
                                esperienze web.</span><br/>
                                Vivo a Cagliari, in Sardegna, ho un cane che cresce sempre di più, un computer fisso e uno
                                portatile per qualsiasi evenienza.
                                Amo il modellismo e il collezionismo, questo mi rende una persona molto paziente e
                                organizzata. Ma lo spazio in casa non è infinito, quindi ho appreso l'arte dell'ingegno per
                                farci stare tutto.
                            </p>

                            <p className="hero-description">
                                Dopo una vita passata dietro ad HTML e CSS, un corso di Graphic Design e lavori sparsi per
                                aggiornare il computer fisso e sostenere i miei hobby, ho deciso di affrontare un corso per
                                diventare Junior Full Stack Developer e dare inizio alla mia carriera come programmatore.
                                Con questo corso ho approfondito le mie conoscenze da Graphic Designer, rafforzato le mie
                                conoscenze sull'Atomic Design e imparato ad integrare tutto questo con l'utilizzo dei
                                linguaggi di programmazione, principalmente <span className="hero-highlight"> JavaScript </span>
                                e <span className="hero-highlight"> React </span>.
                            </p>

                            <p className="hero-description">
                                Ma nella vita non si smette mai di imparare, per questo partecipo attivamente a community
                                online e conferenze per rimanere sempre aggiornato sulle tendenze del mondo tech o per
                                trovare nuove ispirazioni per i miei lavori.
                            </p>

                            <p className="hero-description">
                                Nel tempo libero di solito mi sto allenando, giocando ai videogiochi, stando con la mia
                                famiglia e i miei amici, o esplorando nuove tecnologie nel mondo <span className="hero-highlight">tech</span>.
                            </p>
                        </div>
                    </FadeContent>
                </div>

                {/* ============================================================ */}
                {/* SEZIONE: ESPERIENZA (EXPERIENCE) */}
                {/* ============================================================ */}
                <div className="section-container" id="experience-section" ref={experienceRef}>
                    <FadeContent delay={200}>
                        <div className="hero-content">
                            <div className="experience-item">
                                <h3 className="experience-title">Corso Junior Full Stack Developer</h3>
                                <p className="experience-company">The Net Value <span className="experience-period">2024 — 2025</span></p>
                                <p className="hero-description">
                                    Sviluppo applicazioni web complete utilizzando <span className="hero-highlight">React</span>,
                                    <span className="hero-highlight"> Node.js</span> e <span className="hero-highlight">MongoDB</span>.
                                    Focus particolare su Python, Java, SQL, MySQL. Utilizzo di Postman per il testing, Git
                                    per il versioning e GitHub per la gestione Repository.
                                </p>
                            </div>

                            <div className="experience-item">
                                <h3 className="experience-title">Corso CMS</h3>
                                <p className="experience-company">IFOLD <span className="experience-period">2023 — 2024</span></p>
                                <p className="hero-description">
                                    Progettazione e sviluppo di siti WordPress.
                                    Utilizzo di <span className="hero-highlight">Figma</span>, <span className="hero-highlight">Adobe Creative Suite </span>
                                    e implementazione con <span className="hero-highlight">HTML/CSS</span>.
                                </p>
                            </div>

                            <div className="experience-item">
                                <h3 className="experience-title">Corso ADOBE</h3>
                                <p className="experience-company">IFOLD <span className="experience-period">2019 — 2020</span></p>
                                <p className="hero-description">
                                    Studio e utilizzo della suite Adobe, con particolare attenzione sui programmi
                                    <span className="hero-highlight"> Photoshop</span> e <span className="hero-highlight">Illustrator</span>.
                                </p>
                            </div>
                        </div>
                    </FadeContent>
                </div>

                {/* ============================================================ */}
                {/* SEZIONE: PROGETTI (PROJECTS) */}
                {/* ============================================================ */}
                <div className="section-container" id="projects-section" ref={projectsRef}>
                    <FadeContent delay={300}>
                        <div className="hero-content">
                            {projects.length > 0 ? (
                                <div className="projects-grid-scroll">
                                    {projects.map((project, index) => (
                                        <div key={index} className="project-card-scroll">
                                            <div className="project-image-container">
                                                <img
                                                    src={imageMap[project.id]}
                                                    alt={project.title}
                                                    className="project-image-hero"
                                                    onError={(e) => {
                                                        console.log('Image error for:', project.id);
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZmRiZjQ1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IiMwZjBmMjMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTZW4iIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                                                    }}
                                                />
                                                <div className="project-overlay">
                                                    <span className="project-arrow">↗</span>
                                                </div>
                                            </div>
                                            <div className="project-info">
                                                <h3 className="project-title-hero">{project.title}</h3>
                                                <p className="project-description-hero">{project.description}</p>
                                                {project.technologies && project.technologies.length > 0 && (
                                                    <div className="project-tech">
                                                        {project.technologies.map((tech, techIndex) => (
                                                            <span key={techIndex} className="tech-tag">{tech}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Link per vedere tutti i progetti */}
                                    <div className="view-all-projects">
                                        <a
                                            href="https://www.behance.net/nicolapiras2" // Modifica questo link secondo le tue esigenze
                                            className="view-all-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="view-all-text">Guarda tutti gli altri progetti</span>
                                            <span className="view-all-arrow">→</span>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="hero-content">
                                    <p className="hero-intro">
                                        Nessun progetto trovato. Verifica che il file projects.json sia presente
                                        e contenga dei progetti validi.
                                    </p>
                                </div>
                            )}
                        </div>
                    </FadeContent>
                </div>

                {/* ============================================================ */}
                {/* FOOTER */}
                {/* ============================================================ */}
                <footer className="site-footer">
                    <div className="footer-content">
                        <div className="footer-links">
                            <a href="mailto:closh1996@gmail.com" className="footer-link">
                                Email
                            </a>
                            <a href="https://www.linkedin.com/in/nicola-piras-65a010109/" className="footer-link" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                            <a href="https://www.behance.net/nicolapiras2" className="footer-link" target="_blank" rel="noopener noreferrer">
                                Behance
                            </a>
                            <a href="https://www.instagram.com/nico_closh/" className="footer-link" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        </div>

                        <div className="footer-credit">
                            <p>Progettato e sviluppato da Nicola Piras - © Closh Design</p>
                            <p>Progettato con Figma. Costruito con React, React Bits, Node.JS.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </section>
    );
}

export default Hero;