'use client'
import React, { useState, useEffect } from 'react';
import { colors } from '@/app/styles/styles';
import { police } from '@/app/styles/fonts';
import styles from '../styles/TeamContent.module.css';
import { fetchWithAuth } from '@/app/admin/utils/api';

interface TeamMember {
  descriptionLeft: string;
  descriptionRight: string;
  description: string;
}

const TeamContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const fetchTeam = async () => {
      try {
        const response = await fetchWithAuth('/team');
        const data = await response.json();
        if (data) {
          setTeamData(data);
        } else {
          setError('Error fetching team data');
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to load team data');
      }
    };

    fetchTeam();
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div
        className={styles.error}
        style={{ color: colors.RED, fontFamily: police.style.fontFamily }}
      >
        {error}
      </div>
    );
  }

  if (!teamData) {
    return null;
  }

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.fadeIn : styles.fadeOut}`}
      style={{ color: colors.BEIGE, fontFamily: police.style.fontFamily }}
    >
      <p
        className={styles.generalDescription}
        style={{ backgroundColor: `${colors.BLUE}CC` }}
      >
        {teamData.description}
      </p>
      <div className={styles.teamMembersContainer}>
        <div className={styles.memberCard}>
          <p className={styles.memberDescription}>
            {teamData.descriptionLeft}
          </p>
        </div>
        <div className={styles.memberCard}>
          <p className={styles.memberDescription}>
            {teamData.descriptionRight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamContent;