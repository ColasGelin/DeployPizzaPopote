'use client'

import React, { useEffect, useState } from 'react';
import { PlaneBackgroundConfig } from '@/app/components/PlaneBackgroundConfig';
import PlaneBackground from '@/app/components/PlaneBackground';

interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
    small: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
}

interface Post {
  id: number;
  documentId: string;
  Title: string;
  Description: string;
  DateAndPlace: string;
  Image: Image[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
}

interface NewsResponse {
  data: {
    id: number;
    posts: Post[];
  }[];
}

interface NewsPlaneBackgroundProps {
  isTreesAnimating?: boolean;
}

const useNewsPlaneConfig = () => {
  const [planeConfig, setPlaneConfig] = useState<typeof PlaneBackgroundConfig>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/newss?populate[posts][populate]=*');
        const data: NewsResponse = await response.json();
        
        const allPosts = data.data.reduce((acc: Post[], item) => {
          return [...acc, ...item.posts];
        }, []);

        const newConfig = allPosts.map((post, index) => {
          const referenceLayout = PlaneBackgroundConfig[index];
          if (!referenceLayout) return null;

          const imageUrl = post.Image?.[0]?.url
            ? `http://localhost:1337${post.Image[0].url}`
            : "/photoGG.png";

          return {
            imageUrl,
            position: referenceLayout.position,
            scale: referenceLayout.scale,
            borderColor: referenceLayout.borderColor,
            borderSize: referenceLayout.borderSize,
            text: {
              ...referenceLayout.text,
              text: post.Description
            },
            title: {
              ...referenceLayout.title,
              text: post.Title
            },
            dateAndPlace: {
              ...referenceLayout.dateAndPlace,
              text: post.DateAndPlace
            }
          };
        }).filter((item): item is typeof PlaneBackgroundConfig[0] => item !== null);

        setPlaneConfig(newConfig);
      } catch (error) {
        console.error('Error fetching news:', error);
        setPlaneConfig([]);
      }
    };

    fetchNews();
  }, []);

  return planeConfig;
};

const NewsPlaneBackground: React.FC<NewsPlaneBackgroundProps> = ({ isTreesAnimating = false }) => {
  const planeConfig = useNewsPlaneConfig();
  
  if (planeConfig.length === 0) return null;

  return (
    <PlaneBackground
      position={[-6.15, 1.15, 2.81]}
      isActive={true}
      items={planeConfig}
      isInvisible={isTreesAnimating}
    />
  );
};

export default NewsPlaneBackground;