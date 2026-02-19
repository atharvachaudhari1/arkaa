const Docs = () => {
    return (
        <div className="page-wrapper">
            <div className="page-header">
                <span className="section-label">06. SKILLS & SERVICES</span>
                <h1 className="section-heading">What We Bring to the Table</h1>
                <p className="about-text-new">
                    Our team combines deep technical expertise across multiple domains. Whether you need a web app, mobile solution,
                    AI integration, or a full product built from scratch — ARKAA has you covered.
                </p>
            </div>

            <section className="section-wrapper" style={{ paddingTop: '5rem' }}>
                <div className="problem-grid">
                    <div className="problem-card">
                        <h3>🌐 Web Development</h3>
                        <p>Full-stack web applications with React, Next.js, Node.js, and modern CSS. Responsive, accessible, and optimized for performance. From landing pages to complex SaaS platforms.</p>
                    </div>
                    <div className="problem-card">
                        <h3>🤖 AI & Machine Learning</h3>
                        <p>Custom AI solutions including NLP, computer vision, recommendation engines, and embedded AI models. We work with TensorFlow, PyTorch, OpenAI APIs, and LangChain.</p>
                    </div>
                    <div className="problem-card">
                        <h3>📱 Mobile Development</h3>
                        <p>Cross-platform mobile apps with React Native and native Android development. From UI/UX design to App Store deployment. Beautiful, performant apps for every device.</p>
                    </div>
                    <div className="problem-card solution-card">
                        <h3>🖥️ Desktop Applications</h3>
                        <p>Electron-based desktop apps, Python GUI tools, and system-level software. We build powerful tools that run natively on Windows, macOS, and Linux.</p>
                    </div>
                    <div className="problem-card">
                        <h3>🎨 UI/UX Design</h3>
                        <p>User-centered design with Figma, Adobe XD, and modern design systems. We create intuitive interfaces, smooth animations, and memorable visual experiences.</p>
                    </div>
                    <div className="problem-card">
                        <h3>☁️ DevOps & Cloud</h3>
                        <p>Cloud infrastructure on AWS, Docker containerization, CI/CD pipelines with GitHub Actions, and automated deployment. We keep your apps running reliably at scale.</p>
                    </div>
                </div>
            </section>

            <section className="section-wrapper">
                <span className="section-label">TECH STACK</span>
                <h2 className="section-heading">Tools & Technologies</h2>
                <div className="features-grid-new">
                    <div className="feature-card-new">
                        <h4>Languages</h4>
                        <p>JavaScript, TypeScript, Python, Java, Kotlin, C++, HTML/CSS — we're polyglot developers comfortable across the stack.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Frameworks & Libraries</h4>
                        <p>React, Next.js, Vite, Express, Flask, React Native, Electron, TailwindCSS, Three.js, GSAP — modern tools for modern products.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Infrastructure</h4>
                        <p>MongoDB, PostgreSQL, Redis, Docker, AWS, Vercel, GitHub Actions, Nginx — reliable infrastructure that scales.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Docs;
