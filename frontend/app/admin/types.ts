export interface MenuItem {
    id: number;
    name: string;
    description: string;
    hasVegetarianIcon: boolean;
    category_id: number;
  }
  
  export interface Category {
    id: number;
    name: string;
    items: MenuItem[];
  }

  export interface NewsItem {
    id: number;
    title: string;
    description: string;
    dateAndPlace: string;
    image: string | null;
    order_num: number;
  }

  