import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { styles } from '../../styles/authStyles';

const LoginPage = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        alert('Check your email for confirmation link!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h1 style={styles.loginTitle}>Payment Tracker</h1>
        <div style={styles.formDiv}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {error && <div style={styles.error}>{error}</div>}
          <button onClick={handleSubmit} style={styles.button}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        <button onClick={signInWithGoogle} style={styles.googleButton}>
          Sign in with Google
        </button>
        <p style={styles.toggleText}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)} style={styles.toggleLink}>
            {isSignUp ? ' Sign In' : ' Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;