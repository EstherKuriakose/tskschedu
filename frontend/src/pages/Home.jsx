import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // Background animation using pure JS
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simple floating circles animation
    const circles = [];
    const colors = ['#e8f4f855', '#f0f7fa55', '#e3f2fd55'];

    for (let i = 0; i < 15; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 100 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.2 + 0.1,
        angle: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#e8f4f8');
      gradient.addColorStop(0.5, '#f0f7fa');
      gradient.addColorStop(1, '#e3f2fd');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw circles
      circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        
        // Move circles in gentle floating motion
        circle.x += Math.cos(circle.angle) * circle.speed;
        circle.y += Math.sin(circle.angle) * circle.speed * 0.5;
        
        // Keep circles on screen
        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;
        
        // Slowly change angle for organic movement
        circle.angle += (Math.random() - 0.5) * 0.1;
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  // Inline styles
  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#333',
      lineHeight: 1.6,
      overflowX: 'hidden'
    },
    header: {
      padding: '2rem',
      position: 'relative'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    appTitle: {
      display: 'flex',
      flexDirection: 'column',
      fontWeight: 700,
      lineHeight: 1
    },
    logoGradient: {
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #4a6fa5, #6b9080)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '1px'
    },
    tagline: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#666',
      marginTop: '0.5rem'
    },
    authLinks: {
      display: 'flex',
      gap: '1rem'
    },
    authLink: {
      padding: '0.6rem 1.2rem',
      borderRadius: '50px',
      fontWeight: 500,
      transition: 'all 0.3s ease'
    },
    loginLink: {
      border: '1px solid #4a6fa5',
      color: '#4a6fa5'
    },
    signupLink: {
      backgroundColor: '#4a6fa5',
      color: 'white'
    },
    heroSection: {
      padding: '5rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    heroContent: {
      maxWidth: '800px'
    },
    heroHeading: {
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      color: '#2d3e50'
    },
    heroText: {
      fontSize: '1.2rem',
      lineHeight: 1.8,
      color: '#333'
    },
    highlight: {
      backgroundColor: 'rgba(107, 144, 128, 0.2)',
      padding: '0.2rem 0.4rem',
      borderRadius: '4px',
      fontWeight: 500
    },
    featuresSection: {
      padding: '4rem 2rem',
      backgroundColor: 'white',
      borderRadius: '30px 30px 0 0',
      marginTop: '3rem',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.05)'
    },
    featureBlocks: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    featureBlock: {
      padding: '2rem',
      borderRadius: '16px',
      backgroundColor: '#f8f9fa',
      transition: 'all 0.3s ease'
    },
    featureIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      animation: 'float 4s ease-in-out infinite'
    },
    featureHeading: {
      fontSize: '1.3rem',
      marginBottom: '1rem',
      color: '#2d3e50'
    },
    featureText: {
      color: '#666',
      fontSize: '0.95rem'
    },
    securitySection: {
      padding: '5rem 2rem',
      backgroundColor: '#f8f9fa'
    },
    securityContent: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    securityHeading: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '3rem',
      color: '#2d3e50'
    },
    securityFeatures: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    securityItem: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'flex-start',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.03)'
    },
    securityIcon: {
      fontSize: '1.8rem',
      padding: '0.8rem',
      backgroundColor: 'rgba(74, 111, 165, 0.1)',
      borderRadius: '50%',
      color: '#4a6fa5'
    },
    securityItemHeading: {
      fontSize: '1.1rem',
      marginBottom: '0.5rem',
      color: '#2d3e50'
    },
    securityItemText: {
      color: '#666',
      fontSize: '0.9rem'
    },
    ctaSection: {
      padding: '5rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #4a6fa5, #6b8cbc)',
      color: 'white'
    },
    ctaHeading: {
      fontSize: '2.2rem',
      marginBottom: '1rem'
    },
    ctaText: {
      fontSize: '1.1rem',
      marginBottom: '2rem',
      opacity: 0.9
    },
    ctaButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap'
    },
    ctaButton: {
      padding: '0.9rem 2rem',
      borderRadius: '50px',
      fontWeight: 500,
      transition: 'all 0.3s ease'
    },
    primaryButton: {
      backgroundColor: 'white',
      color: '#4a6fa5'
    },
    secondaryButton: {
      border: '1px solid rgba(255,255,255,0.3)',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.appTitle}>
            <span style={styles.logoGradient}>VELORA</span>
            <span style={styles.tagline}>Mindful Productivity</span>
          </h1>
          <nav style={styles.authLinks}>
            <Link 
              to="/login" 
              style={{ ...styles.authLink, ...styles.loginLink }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(74, 111, 165, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              style={{ ...styles.authLink, ...styles.signupLink }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6b8cbc';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(74, 111, 165, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4a6fa5';
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              Create Account
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h2 style={styles.heroHeading}>Why VELORA Matters</h2>
          <p style={styles.heroText}>
           In a world full of noise, Velora brings calm to your chaos.

Designed for those who value clarity and intention, Velora helps you schedule, organize, and prioritize with effortless ease.

Whether it's work, personal goals, or daily to-dos — manage everything in one elegant space, so you can focus on what truly matters.

Velora isn’t just a planner. It’s your personal space to breathe, plan, and thrive.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={styles.featuresSection}>
        <div style={styles.featureBlocks}>
          {/* Feature 1 */}
          <div 
            style={styles.featureBlock}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>🌿</div>
            <h3 style={styles.featureHeading}>Stress-Free Planning</h3>
            <p style={styles.featureText}>
              Intelligent scheduling that adapts to your energy levels 
              throughout the day, preventing burnout.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div 
            style={styles.featureBlock}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>🧠</div>
            <h3 style={styles.featureHeading}>Cognitive Flow</h3>
            <p style={styles.featureText}>
              Interface designed to minimize decision fatigue and 
              maximize deep work sessions.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div 
            style={styles.featureBlock}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>🔄</div>
            <h3 style={styles.featureHeading}>Context Switching</h3>
            <p style={styles.featureText}>
              Smooth transitions between projects with our unique 
              context preservation system.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div 
            style={styles.featureBlock}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureHeading}>Progress Tracking</h3>
            <p style={styles.featureText}>
              Visual analytics that show meaningful progress, not just 
              completed tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section style={styles.securitySection}>
        <div style={styles.securityContent}>
          <h2 style={styles.securityHeading}>Your Data, Protected</h2>
          <div style={styles.securityFeatures}>
            <div style={styles.securityItem}>
              <div style={styles.securityIcon}>🔒</div>
              <div>
                <h3 style={styles.securityItemHeading}>End-to-End Encryption</h3>
                <p style={styles.securityItemText}>All your data is encrypted before it leaves your device.</p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityIcon}>🌐</div>
              <div>
                <h3 style={styles.securityItemHeading}>Privacy First</h3>
                <p style={styles.securityItemText}>We never sell your data or use it for advertising.</p>
              </div>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityIcon}>⚙️</div>
              <div>
                <h3 style={styles.securityItemHeading}>Transparent Operations</h3>
                <p style={styles.securityItemText}>Open-source core with regular security audits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaHeading}>Ready to Transform Your Productivity?</h2>
        <p style={styles.ctaText}>Join thousands who found focus with VELORA</p></section>
        {/* <div style={styles.ctaButtons}>
          <Link 
            to="/signup" 
            style={{ ...styles.ctaButton, ...styles.primaryButton }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Free Trial
          </Link>
          <Link 
            to="/demo" 
            style={{ ...styles.ctaButton, ...styles.secondaryButton }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            See Demo
          </Link>
        </div>
      </section> */}

      {/* Global styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 300 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2) format('woff2');
          }
        `}
      </style>
    </div>
  );
};

export default Home;