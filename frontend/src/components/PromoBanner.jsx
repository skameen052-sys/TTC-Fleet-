import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import promoTruckImg from '../assets/promo-truck.jpg';

export const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="promo-truck-card">
      <img
        src={promoTruckImg}
        alt="Efficient Fleet"
        className="promo-truck-bg"
      />

      <div>
        <div className="promo-badge-tag">TTC Fleet360</div>
        <div className="promo-main-heading">
          Efficient Fleet.<br />Greater Productivity.
        </div>
        <div className="promo-body-text">
          Manage your logistics operations with ease and security.
        </div>
      </div>

      <button
        className="promo-action-btn"
        onClick={() => navigate('/configuration')}
      >
        <span>Explore Features</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};
