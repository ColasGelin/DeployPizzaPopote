'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { MenuComponent } from '../Tabs/menu';
import { Category, MenuItem, NewsItem } from '../types';
import { NewsComponent } from '../Tabs/News';
import { ContactComponent } from '../Tabs/Contact';
import { TeamComponent } from '../Tabs/Team';
import { isAuthenticated } from '@/app/admin/utils/auth';
import { fetchWithAuth } from '@/app/admin/utils/api';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<{ [key: number]: MenuItem[] }>({});
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin');
    } else {
      fetchMenu();
      fetchNews();
      setIsLoading(false);
    }
  }, [router]);

  const fetchMenu = async () => {
    try {
      const response = await fetchWithAuth('/menu');
      const data = await response.json();
      setCategories(data);
      
      const itemsByCategory = {};
      data.forEach((category: Category) => {
        (itemsByCategory as { [key: number]: MenuItem[] })[category.id] = category.items || [];
      });
      setMenuItems(itemsByCategory);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await fetchWithAuth(`/menu/categories/${categoryId}`, {
        method: 'DELETE'
      });
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
      setMenuItems(prevItems => {
        const newItems = { ...prevItems };
        delete newItems[categoryId];
        return newItems;
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      fetchMenu();
    }
  };

  const handleDeleteMenuItem = async (itemId: number, categoryId: number) => {
    try {
      await fetchWithAuth(`/menu/items/${itemId}`, {
        method: 'DELETE'
      });
      setMenuItems(prevItems => ({
        ...prevItems,
        [categoryId]: prevItems[categoryId].filter(item => item.id !== itemId)
      }));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      fetchMenu();
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      const response = await fetchWithAuth('/menu/categories', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      
      const newCategoryData = await response.json();
      setCategories(prevCategories => [...prevCategories, newCategoryData]);
      setMenuItems(prevItems => ({
        ...prevItems,
        [newCategoryData.id]: []
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      fetchMenu();
    }
  };

  const handleAddMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const response = await fetchWithAuth('/menu/items', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      const newItemData = await response.json();

      if (!newItemData || !newItemData.id) {
        console.error('Invalid response from server:', newItemData);
        return;
      }

      const completeItemData: MenuItem = {
        ...item,
        id: newItemData.id
      };

      setMenuItems(prevItems => {
        const categoryId = Number(item.category_id);
        const currentItems = prevItems[categoryId] || [];
        return {
          ...prevItems,
          [categoryId]: [...currentItems, completeItemData]
        };
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      fetchMenu();
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetchWithAuth('/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await fetchWithAuth(`/news/${id}`, {
        method: 'DELETE'
      });
      setNews(prevNews => prevNews.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      fetchNews();
    }
  };

  const handleAddNews = async (newsData: {
    title: string;
    description: string;
    dateAndPlace: string;
    image: string | null;
    order_num: number;
  }) => {
    try {
      const response = await fetchWithAuth('/news', {
        method: 'POST',
        body: JSON.stringify(newsData)
      });

      const newNewsData = await response.json();
      
      if (!newNewsData || !newNewsData.id) {
        console.error('Invalid response from server:', newNewsData);
        return;
      }

      const completeNewsData: NewsItem = {
        id: newNewsData.id,
        title: newsData.title,
        description: newsData.description,
        dateAndPlace: newsData.dateAndPlace,
        image: newNewsData.image,
        order_num: newsData.order_num
      };

      setNews(prevNews => [...prevNews, completeNewsData]);
    } catch (error) {
      console.error('Error adding news:', error);
      fetchNews();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">PizzaPopote Admin Dashboard</h1>
      
      <MenuComponent
        categories={categories}
        menuItems={menuItems}
        onDeleteCategory={handleDeleteCategory}
        onDeleteMenuItem={handleDeleteMenuItem}
        onAddCategory={handleAddCategory}
        onAddMenuItem={handleAddMenuItem}
      />

      <NewsComponent
        news={news}
        onDeleteNews={handleDeleteNews}
        onAddNews={handleAddNews}
      />
      <ContactComponent />
      <TeamComponent />
    </div>
  );
}