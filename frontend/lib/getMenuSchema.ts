import { fetchWithAuth } from '@/app/admin/utils/api';

interface MenuItem {
  name: string;
  description: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface MenuSchema {
  '@type': 'Menu';
  name: string;
  hasMenuSection: {
    '@type': 'MenuSection';
    name: string;
    hasMenuItem: {
      '@type': 'MenuItem';
      name: string;
      description: string;
    }[];
  }[];
}

export async function generateMenuSchema(): Promise<MenuSchema | null> {
  try {
    const response = await fetchWithAuth('/menu');
    const menuData: MenuCategory[] = await response.json();
    
    return {
      '@type': 'Menu',
      'name': 'Menu PizzaPopote',
      'hasMenuSection': menuData.map((category) => ({
        '@type': 'MenuSection',
        'name': category.name,
        'hasMenuItem': category.items.map((item) => ({
          '@type': 'MenuItem',
          'name': item.name,
          'description': item.description,
        }))
      }))
    };
  } catch (error) {
    console.error('Error generating menu schema:', error);
    return null;
  }
}