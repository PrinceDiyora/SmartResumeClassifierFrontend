import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    "AI-Powered Resume Classification",
    "Professional LaTeX Templates", 
    "Smart Content Suggestions"
  ];

  return (
    <div className="homepage">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fa-solid fa-rocket"></i>
            </div>
            <span className="logo-text">ResumeCraft AI</span>
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link active">Home</Link>
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          <div className="auth-buttons">
            <button className="btn btn-ghost">Log In</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="gradient-text">Transform</span> Your Career
                <br />
                With AI-Powered
                <br />
                Resume Tools
              </h1>
              <p className="hero-subtitle">
                Build, classify, and perfect your resume with cutting-edge AI technology. 
                Stand out from the crowd and land your dream job.
              </p>
              <div className="hero-buttons">
                <Link to="/builder" className="btn btn-primary btn-large">
                  <i className="fas fa-play"></i>
                  Start Building
                </Link>
                <button className="btn btn-outline btn-large">
                  <i className="fas fa-play"></i>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-header">
                  <div className="card-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="resume-preview">
                    <div className="preview-line"></div>
                    <div className="preview-line short"></div>
                    <div className="preview-line"></div>
                    <div className="preview-line short"></div>
                    <div className="preview-line"></div>
                  </div>
                </div>
              </div>
              <div className="floating-badge">
                <i className="fas fa-check-circle"></i>
                <span>AI Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything You Need to
              <span className="gradient-text"> Succeed</span>
            </h2>
            <p className="section-subtitle">
              Our comprehensive suite of tools helps you create the perfect resume
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Smart Resume Builder</h3>
              <p>Create professional resumes with our AI-powered builder and beautiful LaTeX templates.</p>
              <Link to="/builder" className="feature-link">
                Start Building
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h3>AI Classification</h3>
              <p>Instantly classify resumes into roles like Frontend, Backend, or Data Science.</p>
              <a href="#" className="feature-link">
                Try Classifier
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Smart Suggestions</h3>
              <p>Get personalized AI-powered suggestions to improve your resume content.</p>
              <a href="#" className="feature-link">
                Get Suggestions
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Resumes Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Templates</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">
              Get your perfect resume in just 3 simple steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-icon">
                <i className="fas fa-upload"></i>
              </div>
              <h3>Upload or Create</h3>
              <p>Upload your existing resume or start from scratch with our templates</p>
            </div>
            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-icon">
                <i className="fas fa-magic"></i>
              </div>
              <h3>AI Enhancement</h3>
              <p>Our AI analyzes and suggests improvements to make your resume stand out</p>
            </div>
            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-icon">
                <i className="fas fa-download"></i>
              </div>
              <h3>Download & Apply</h3>
              <p>Download your professional resume and start applying to your dream jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Career?</h2>
            <p>Join thousands of professionals who have already landed their dream jobs</p>
            <Link to="/builder" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-container">
                <div className="logo-icon">
                  <i className="fa-solid fa-rocket"></i>
                </div>
                <span className="logo-text">ResumeCraft AI</span>
              </div>
              <p>Your partner in career success. Build the perfect resume with AI.</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Resume Builder</a>
                <a href="#">Resume Classifier</a>
                <a href="#">Templates</a>
                <a href="#">Pricing</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Blog</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Documentation</a>
                <a href="#">API</a>
                <a href="#">Status</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
                <a href="#">GDPR</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 ResumeCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}