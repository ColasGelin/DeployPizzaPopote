'use client'
import React, { useState, useEffect } from 'react';
import { colors } from '@/app/styles/styles';
import { police } from '@/app/styles/fonts';
import styles from '../styles/TeamContent.module.css';
import Image from 'next/image';

interface TeamMember {
  descriptionLeft: string;
  descriptionRight: string;
  imageLeft: string;
  imageRight: string;
  description: string;
}

const API_URL = 'https://64.226.114.142:3443';
const API_ENDPOINT = `${API_URL}/api`;

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
        const response = await fetch(`${API_ENDPOINT}/team`);
        const data = await response.json();
        
        if (data) {
          const processedData = {
            ...data,
            imageLeft: data.imageLeft ? `${API_URL}${data.imageLeft}` : '',
            imageRight: data.imageRight ? `${API_URL}${data.imageRight}` : ''
          };
          
          setTeamData(processedData);
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
      style={{ color: colors.GREEN, fontFamily: police.style.fontFamily }}
    >
      <div className={styles.teamMembersContainer}>
        {/* Left Member */}
        <div className={styles.memberCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={teamData.imageLeft}
              alt="Team member left"
              width={400}
              height={400}
              className={styles.memberImage}
              priority
              unoptimized
            />
          </div>
          <p className={styles.memberDescription}>
            {teamData.descriptionLeft}
          </p>
        </div>

        {/* Right Member */}
        <div className={styles.memberCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={teamData.imageRight}
              alt="Team member right"
              width={400}
              height={400}
              className={styles.memberImage}
              priority
              unoptimized
            />
          </div>
          <p className={styles.memberDescription}>
            {teamData.descriptionRight}
          </p>
        </div>
      </div>

      <p
        className={styles.generalDescription}
        style={{ backgroundColor: `${colors.BEIGE}CC` }}
      >
        {teamData.description}
      </p>
    </div>
  );
};

export default TeamContent;