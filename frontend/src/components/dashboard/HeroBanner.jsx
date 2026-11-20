import React from 'react';

export const HeroBanner = () => {
  return (
    <div className="fleet-hero-container">
      {/* Left Column: Heading and Subtitle */}
      <div className="hero-content-left">
        <div className="hero-heading-wrap">
          <h1 className="hero-welcome-title">Welcome Back,</h1>
          <h2 className="hero-manager-title">Fleet Manager!</h2>
        </div>
        <p className="hero-description">
          Drive smarter. Manage your fleet.<br />
          Optimize every journey.
        </p>
      </div>

      {/* Right Column: Supplied Blue Truck & Tablet Image */}
      <div className="hero-image-wrap">
        <img
          src="/assets/fleet-manager-trucks.jpg"
          alt="Fleet Manager with Trucks"
          className="hero-banner-img"
        />
        {/* Navy gradient overlay on the left to seamlessly blend with hero background */}
        <div className="hero-gradient-overlay" />
      </div>

      {/* Decorative ambient orange glowing curve at bottom */}
      <div className="hero-orange-glow-curve" />
    </div>
  );
};
