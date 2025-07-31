import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import TypewriterText from './TypewriterText';
import './HomePage.css';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log In</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="pulse"></span>
                <span>AI-Powered Resume Platform</span>
              </div>
              <h1 className="hero-title">
                <TypewriterText 
                  text="Transform Your Career With Smart Resume Tools" 
                  speed={80} 
                  className="gradient-text"
                />
              </h1>
              <p className="hero-subtitle">
                Build, classify, and perfect your resume with cutting-edge AI technology. 
                Stand out from the crowd and land your dream job with our intelligent resume platform.
              </p>
              <div className="hero-features">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`hero-feature ${currentFeature === index ? 'active' : ''}`}
                  >
                    <Check size={16} className="feature-check" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="hero-buttons">
                <button 
                  onClick={() => isAuthenticated ? navigate('/resume-builder') : navigate('/login')} 
                  className="btn btn-primary btn-large"
                >
                  <Play size={18} />
                  Start Building
                </button>
                <button className="btn btn-outline btn-large">
                  <Play size={18} />
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
                    <div className="preview-header"></div>
                    <div className="preview-section">
                      <div className="preview-line"></div>
                      <div className="preview-line short"></div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-line"></div>
                      <div className="preview-line"></div>
                      <div className="preview-line short"></div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-line"></div>
                      <div className="preview-line short"></div>
                      <div className="preview-line short"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-badge">
                <Check size={16} />
                <span>AI Verified</span>
              </div>
              <div className="floating-elements">
                <div className="floating-element e1">LaTeX</div>
                <div className="floating-element e2">AI</div>
                <div className="floating-element e3">PDF</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
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
              <button 
                onClick={() => isAuthenticated ? navigate('/resume-builder') : navigate('/login')} 
                className="feature-link"
              >
                Start Building
                <i className="fas fa-arrow-right"></i>
              </button>
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
            <button 
              onClick={() => isAuthenticated ? navigate('/resume-builder') : navigate('/login')} 
              className="btn btn-primary btn-large"
            >
              Get Started Free
            </button>
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