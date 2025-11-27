import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #08803eff 0%, #297a42ff 50%, #30c060ff 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  icon: {
    width: '32px',
    height: '32px',
    stroke: 'white',
    fill: 'none',
    strokeWidth: '2',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: '0',
  },
  formGroup: {
    marginBottom: '16px',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    stroke: '#a0aec0',
    fill: 'none',
    strokeWidth: '2',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 44px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputFocus: {
    border: '2px solid #764ba2',
    boxShadow: '0 0 0 3px rgba(118, 75, 162, 0.1)',
  },
  error: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    background: '#fff5f5',
    border: '1px solid #fc8181',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#c53030',
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    flexShrink: '0',
    marginTop: '2px',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #08803eff 0%, #30c060ff 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    marginBottom: '16px',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(118, 75, 162, 0.3)',
  },
  buttonDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  divider: {
    position: 'relative',
    margin: '24px 0',
    textAlign: 'center',
  },
  dividerLine: {
    position: 'absolute',
    top: '50%',
    left: '0',
    right: '0',
    height: '1px',
    background: '#e2e8f0',
  },
  dividerText: {
    position: 'relative',
    display: 'inline-block',
    padding: '0 16px',
    background: 'rgba(255, 255, 255, 0.95)',
    fontSize: '14px',
    color: '#718096',
  },
  googleButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    marginBottom: '24px',
  },
  googleButtonHover: {
    background: '#f9fafb',
    borderColor: '#cbd5e0',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#718096',
    margin: '0',
  },
  toggleLink: {
    color: '#764ba2',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '4px',
    textDecoration: 'none',
  },
  toggleLinkHover: {
    textDecoration: 'underline',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: '20px',
    height: '20px',
    stroke: '#a0aec0',
    fill: 'none',
    strokeWidth: '2',
  },
};

const LoginPage = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [googleHovered, setGoogleHovered] = useState(false);
  const [toggleHovered, setToggleHovered] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        alert('Check your email for confirmation link!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={styles.card}>
            <div style={styles.header}>
              
                <img 
                  src="/logo512.png" 
                  alt="Payment Tracker Logo" 
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
           
              <h1 style={styles.title}>Multifactors Sales</h1>
              <p style={styles.subtitle}>
                {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in'}
              </p>
            </div>

            <div>
              <div style={styles.formGroup}>
                <div style={styles.inputWrapper}>
                  <svg style={styles.inputIcon} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    style={{
                      ...styles.input,
                      ...(emailFocused ? styles.inputFocus : {}),
                    }}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <div style={styles.inputWrapper}>
                  <svg style={styles.inputIcon} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    style={{
                      ...styles.input,
                      paddingRight: '44px',
                      ...(passwordFocused ? styles.inputFocus : {}),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div style={styles.formGroup}>
                  <div style={styles.inputWrapper}>
                    <svg style={styles.inputIcon} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      style={{
                        ...styles.input,
                        paddingRight: '44px',
                        ...(confirmPasswordFocused ? styles.inputFocus : {}),
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      {showConfirmPassword ? (
                        <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg style={styles.eyeIcon} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div style={styles.error}>
                  <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                style={{
                  ...styles.button,
                  ...(buttonHovered && !loading ? styles.buttonHover : {}),
                  ...(loading ? styles.buttonDisabled : {}),
                }}
              >
                {loading ? (
                  <div style={styles.spinnerWrapper}>
                    <div style={styles.spinner}></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>Or continue with</span>
            </div>

            
            <button
              onClick={signInWithGoogle}
              onMouseEnter={() => setGoogleHovered(true)}
              onMouseLeave={() => setGoogleHovered(false)}
              style={{
                ...styles.googleButton,
                ...(googleHovered ? styles.googleButtonHover : {}),
              }}
            >
              <svg style={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <p style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <span
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                onMouseEnter={() => setToggleHovered(true)}
                onMouseLeave={() => setToggleHovered(false)}
                style={{
                  ...styles.toggleLink,
                  ...(toggleHovered ? styles.toggleLinkHover : {}),
                }}
              >
                {isSignUp ? ' Sign In' : ' Sign Up'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;