import React, { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import './TeamCard.css';

const TeamCard = ({ name, role, photo, bio }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`team-card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="team-card-inner">
        {/* Front Face: Premium Image Overlay */}
        <div className="team-card-front">
          <img 
            src={photo || 'https://via.placeholder.com/600x800'} 
            alt={name} 
            className="photo-full" 
          />
          <div className="member-overlay">
            <h3 className="member-name">{name}</h3>
            <div className="role-badge">{role}</div>
            <div className="click-hint">
              <span>Klik untuk info lebih lanjut</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* Back Face: Detailed Bio */}
        <div className="team-card-back">
          <div className="back-role">{role}</div>
          <h3 className="back-name">{name}</h3>
          <p className="team-bio">{bio}</p>
          <div className="click-hint" style={{marginTop: 'auto', opacity: 0.5}}>
             Kembali <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
