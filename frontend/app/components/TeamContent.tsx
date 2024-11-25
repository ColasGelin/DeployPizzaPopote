'use client'
import React, { useState, useEffect } from 'react';
import { colors } from '@/app/styles/styles';
import { police } from '@/app/styles/fonts';
import styles from '../styles/TeamContent.module.css';
import { fetchSheetData } from './ParseSheet';

interface TeamMember {
  DescriptionLeft: string;
  DescriptionRight: string;
  ImageLeft: string;
  ImageRight: string;
  Description: string;
}

const TeamContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to convert Google Drive sharing URL to embedded content URL
  const getGoogleDriveEmbedUrl = (url: string) => {
    const fileId = url.match(/\/d\/(.+?)\/view/)?.[1];
    if (fileId) {
      // Using the more reliable embedded content URL
      return `https://lh3.googleusercontent.com/d/1D2fIm38Ne2DeTB9D5jBMGSI-UNKfFVdK=w1000`;
    }
    return url;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const fetchTeam = async () => {
      try {
        const sheetData = await fetchSheetData();
        if (sheetData.team && sheetData.team[0]) {
          const teamMember = sheetData.team[0];
          setTeamData({
            ...teamMember,
            ImageLeft: getGoogleDriveEmbedUrl(teamMember.ImageLeft),
            ImageRight: getGoogleDriveEmbedUrl(teamMember.ImageRight)
          });
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
          <img
            src={teamData.ImageLeft}
            className={styles.memberImage}
            alt={`Team member ${teamData.DescriptionLeft}`}
            loading="lazy"
          />
          <p className={styles.memberDescription}>
            {teamData.DescriptionLeft}
          </p>
        </div>

        {/* Right Member */}
        <div className={styles.memberCard}>
          <img
            src={teamData.ImageRight}
            className={styles.memberImage}
            alt={`Team member ${teamData.DescriptionRight}`}
            loading="lazy"
          />
          <p className={styles.memberDescription}>
            {teamData.DescriptionRight}
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