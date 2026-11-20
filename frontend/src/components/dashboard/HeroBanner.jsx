import React from 'react';
import { Animated3DTruck } from './Animated3DTruck';

export const HeroBanner = () => {
  return (
    <div className="fleet-hero-container">
      {/* Left Column: Heading and Subtitle */}
      <div className="hero-content-left">
        <div className="hero-heading-wrap">
          <h1 className="hero-welcome-title">Welcome back,</h1>
          <h2 className="hero-manager-title">Admin!</h2>
        </div>
        <p className="hero-description">
          Drive smarter. Manage better with TTC Fleet360.<br />
          Real-time telemetry and 360° global logistics control.
        </p>
      </div>

      {/* Right Column: Realistic Animated 3D Logistics Truck Cruising Engine */}
      <div className="hero-image-wrap hero-animated-truck-wrap">
        <Animated3DTruck />
      </div>

      {/* Decorative ambient orange glowing curve at bottom */}
      <div className="hero-orange-glow-curve" />
    </div>
  );
};
