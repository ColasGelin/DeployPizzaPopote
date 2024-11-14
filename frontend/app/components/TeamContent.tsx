'use client'

import React, { useState, useEffect } from 'react';
import { colors } from '@/app/styles/styles';
import { police } from '@/app/styles/fonts';
import styles from '../styles/TeamContent.module.css';

interface TeamData {
  id: string;
  descriptionRight: string;
  descriptionLeft: string;
  Description: string;
  imageLeft: {
    url: string;
  };
  imageRight: {
    url: string;
  };
}

const TeamContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const fetchTeamData = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/team-contents?populate=*');
        const data = await response.json();
        
        if (data && data.data[0]) {
          setTeamData({
            id: data.data[0].id,
            descriptionRight: data.data[0].descriptionRight,
            descriptionLeft: data.data[0].descriptionLeft,
            Description: data.data[0].Description,
            imageLeft: data.data[0].imageLeft,
            imageRight: data.data[0].imageRight,
          });
        } else {
          setError('Error fetching team data');
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to load team data');
      }
    };

    fetchTeamData();
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return <div className={styles.error} style={{ color: colors.RED, fontFamily: police.style.fontFamily }}>{error}</div>;
  }

  if (!teamData) {
    return null;
  }

  return (
    <div 
      className={`${styles.container} ${isVisible ? styles.fadeIn : styles.fadeOut}`}
      style={{ color: colors.GREEN, fontFamily: police.style.fontFamily }}
    >
      <div className={styles.teamMembersContainer}>
        {/* Left Member */}
        <div className={styles.memberCard}>
          <img
            src={`http://localhost:1337${teamData.imageLeft.url}`}
            className={styles.memberImage}
            alt="Team member left"
          />
          <p className={styles.memberDescription}>
            {teamData.descriptionLeft}
          </p>
        </div>

        {/* Right Member */}
        <div className={styles.memberCard}>
          <img
            src={`http://localhost:1337${teamData.imageRight.url}`}
            className={styles.memberImage}
            alt="Team member right"
          />
          <p className={styles.memberDescription}>
            {teamData.descriptionRight}
          </p>
        </div>
      </div>

      <p 
        className={styles.generalDescription} 
        style={{ backgroundColor: `${colors.BEIGE}CC` }}
      >
        {teamData.Description}
      </p>
    </div>
  );
};

export default TeamContent;