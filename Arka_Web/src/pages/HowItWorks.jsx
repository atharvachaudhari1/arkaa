const HowItWorks = () => {
    return (
        <div className="page-wrapper">
            <div className="page-header">
                <span className="section-label">05. OUR PROCESS</span>
                <h1 className="section-heading">How We Work</h1>
                <p className="about-text-new">
                    At ARKAA, we follow a proven, collaborative process to bring ideas to life. From understanding your vision
                    to delivering a polished product — every step is driven by communication, precision, and passion.
                </p>
            </div>

            <section className="section-wrapper" style={{ paddingTop: '5rem' }}>
                <div className="features-grid-new">
                    <div className="feature-card-new">
                        <h4>Phase 1: Discovery & Planning</h4>
                        <p>We start by understanding your goals, audience, and requirements. Through brainstorming sessions and research, we define the project scope, tech stack, and timeline to ensure alignment from day one.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Phase 2: Design & Prototype</h4>
                        <p>Our design process focuses on user experience first. We create wireframes, mockups, and interactive prototypes to visualize the product before a single line of code is written.</p>
                    </div>
                    <div className="feature-card-new">
                        <h4>Phase 3: Development & Testing</h4>
                        <p>With agile sprints and continuous feedback, we build robust, scalable applications. Every feature is rigorously tested for performance, security, and cross-platform compatibility.</p>
                    </div>
                </div>
            </section>

            <section className="section-wrapper">
                <span className="section-label">WORKFLOW</span>
                <h2 className="section-heading">From concept to deployment — seamlessly.</h2>
                <div className="problem-grid">
                    <div className="problem-card">
                        <h3>1. Ideation</h3>
                        <p>Collaborative brainstorming to understand the problem space. We research competitors, define user personas, and map out the core features that will make your product stand out.</p>
                    </div>
                    <div className="problem-card">
                        <h3>2. Architecture</h3>
                        <p>We design the technical architecture — choosing the right frameworks, databases, and infrastructure. Clean code structure and scalability are built into the foundation.</p>
                    </div>
                    <div className="problem-card">
                        <h3>3. Build & Iterate</h3>
                        <p>Agile development with weekly check-ins. We ship features incrementally, gather feedback early, and iterate fast. You'll see progress every step of the way.</p>
                    </div>
                    <div className="problem-card solution-card">
                        <h3>4. Launch & Support</h3>
                        <p>Deployment with CI/CD pipelines, performance monitoring, and post-launch support. We don't just ship — we make sure everything runs smoothly in production.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
