'use client'
import React, { useEffect, useState } from 'react';
import { PanelBackgroundConfig } from './PanelBackgroundConfig';
import PanelBackground from '@/app/components/PanelBackground';
import { fetchSheetData } from './ParseSheet';

interface SheetData {
  contactInfos: {
    Instagram: string;
    Email: string;
    Phone: string;
  };
  menu: Array<{
    "Menu Category": string;
    "Item Name": string;
    IsVegetarian: boolean;
    Description: string;
  }>;
  news: Array<{
    Title: string;
    Description: string;
    DateAndPlace: string;
    Image: string;
  }>;
  team: Array<{
    DescriptionLeft: string;
    DescriptionRight: string;
    ImageLeft: string;
    ImageRight: string;
    Description: string;
  }>;
}

interface NewsPanelProps {
  isTreesAnimating?: boolean;
}

const useNewsPlaneConfig = () => {
  const [planeConfig, setPlaneConfig] = useState<typeof PanelBackgroundConfig>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data: SheetData = await fetchSheetData();
        
        // Map through the PanelBackgroundConfig and merge with news data
        const newConfig = PanelBackgroundConfig.map((layout, index) => {
          const newsItem = data.news[index];
          if (!newsItem) return layout; // Keep original layout if no news item

          // Convert Google Drive URL to direct URL if needed
          let imageUrl = newsItem.Image || layout.imageUrl;
          if (imageUrl.includes('drive.google.com')) {
            // Extract file ID and create direct link
            const fileId = imageUrl.match(/\/d\/(.+?)\/view/)?.[1];
            if (fileId) {
              imageUrl = `/api/placeholder/480/320`; // Fallback to placeholder for now
              // In production, you might want to use:
              // imageUrl = `https://drive.google.com/uc?id=${fileId}`;
            }
          }

          return {
            ...layout,
            imageUrl,
            text: {
              ...layout.text,
              text: newsItem.Description || layout.text.text
            },
            title: {
              ...layout.title,
              text: newsItem.Title || layout.title.text
            },
            dateAndPlace: {
              ...layout.dateAndPlace,
              text: newsItem.DateAndPlace || layout.dateAndPlace.text
            }
          };
        });

        setPlaneConfig(newConfig);
      } catch (error) {
        console.error('Error fetching news:', error);
        setPlaneConfig(PanelBackgroundConfig); // Fallback to default config
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