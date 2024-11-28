'use client'
import React, { useEffect, useState } from 'react';
import { PanelBackgroundConfig } from './PanelBackgroundConfig';
import PanelBackground from '@/app/components/PanelBackground';
import { NewsItem } from '@/app/admin/types';

interface NewsPanelProps {
  isTreesAnimating?: boolean;
}

const useNewsPlaneConfig = () => {
  const [planeConfig, setPlaneConfig] = useState<typeof PanelBackgroundConfig>([]);
  const API_URL = 'http://64.226.114.142:3001';
  const API_ENDPOINT = `${API_URL}/api`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/news`);
        const newsData: NewsItem[] = await response.json();
        const newConfig = PanelBackgroundConfig.map((layout, index) => {
          const newsItem = newsData[index];
          if (!newsItem) return layout;
          
          // Fix the image URL construction
          const imageUrl = newsItem.image 
            ? `${API_URL}${newsItem.image}` // Remove /api from the image URL
            : layout.imageUrl;

          return {
            ...layout,
            imageUrl,
            text: {
              ...layout.text,
              text: newsItem.description || layout.text.text
            },
            title: {
              ...layout.title,
              text: newsItem.title || layout.title.text
            },
            dateAndPlace: {
              ...layout.dateAndPlace,
              text: newsItem.dateAndPlace || layout.dateAndPlace.text
            }
          };
        });
        console.log("newConfig", newConfig);
        setPlaneConfig(newConfig);
      } catch (error) {
        console.error('Error fetching news:', error);
        setPlaneConfig(PanelBackgroundConfig);
      }
    };
    fetchNews();
  }, []);

  return planeConfig;
};

const NewsPanel: React.FC<NewsPanelProps> = ({ isTreesAnimating = false }) => {
  const planeConfig = useNewsPlaneConfig();
  
  if (planeConfig.length === 0) return null;

  return (
    <PanelBackground
      position={[-6.23, 0.8, 2.55]}
      isActive={true}
      items={planeConfig}
      isInvisible={isTreesAnimating}
    />
  );
};

export default NewsPanel;