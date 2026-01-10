import React, { useState } from 'react';
import './Auth.css';
import OrbitalBackground from '../components/common/OrbitalBackground';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        companyName: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Submitted ${isLogin ? 'Login' : 'Register'}:`, formData);
        // Auth logic would go here
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            companyName: ''
        });
    };

    return (
        <main className="auth-page">
            <OrbitalBackground />
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>{isLogin ? 'Welcome Back' : 'Join Scratchpad'}</h1>
                        <p>{isLogin ? 'Enter your credentials to continue' : 'Create your account to start simulating'}</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <div className="input-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="companyName">Company Name <span style={{ opacity: 0.5, fontSize: '12px' }}>(Optional)</span></label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Acme Corp"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="hello@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="input-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="auth-submit-btn">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="auth-toggle-btn" onClick={toggleMode}>
                            {isLogin ? 'Create one now' : 'Sign in instead'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Auth;
