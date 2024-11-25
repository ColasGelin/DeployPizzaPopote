export interface ContactInfo {
    Instagram: string;
    Email: string;
    Phone: string;
  }
  
  interface MenuItem {
    'Menu Category': string;
    'Item Name': string;
    'IsVegetarian': boolean;
    'Description': string;
  }
  
  interface NewsItem {
    Title: string;
    Description: string;
    DateAndPlace: string;
    Image: string;
  }
  
  // New interface for team members
  interface TeamMember {
    DescriptionLeft: string;
    DescriptionRight: string;
    ImageLeft: string;
    ImageRight: string;
    Description: string;
  }
  
  export interface SheetData {
    contactInfos: ContactInfo;
    menu: MenuItem[];
    news: NewsItem[];
    team: TeamMember[];  // Added team array
  }
  
  // Google Sheets API response types
  interface SheetColumn {
    id: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    pattern?: string;
  }
  
  interface CellValue {
    v: string | number | boolean | null;
    f?: string;
  }
  
  interface SheetRow {
    c: (CellValue | null)[];
  }
  
  interface SheetResponse {
    version: string;
    reqId: string;
    status: string;
    sig: string;
    table: {
      cols: SheetColumn[];
      rows: SheetRow[];
      parsedNumHeaders: number;
    };
  }
  
  export async function fetchSheetData(): Promise<SheetData> {
    try {
      const SHEET_ID = '1vaMoYioC8Kusp0RLZZU7uyBmv7_kfK8BXx9VfrFuw50';
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`
      );
      const text = await response.text();
      const jsonText = text.replace('/*O_o*/', '').replace(
        /google\.visualization\.Query\.setResponse\((.*)\);/,
        '$1'
      );
      const data: SheetResponse = JSON.parse(jsonText);
      const { cols, rows } = data.table;
  
      // Find indices based on column labels
      const contactIdx = cols.findIndex((col: SheetColumn) => col.label.includes('Instagram'));
      const menuCategoryIdx = cols.findIndex((col: SheetColumn) => col.label.includes('Menu Category'));
      const newsTitleIdx = cols.findIndex((col: SheetColumn) => col.label.includes('News Title'));
      const teamContentIdx = cols.findIndex((col: SheetColumn) => col.label.includes('Team Content'));
  
      const result: SheetData = {
        contactInfos: {
          Instagram: String(rows[0]?.c[contactIdx]?.v || ''),
          Email: String(rows[0]?.c[contactIdx + 1]?.v || ''),
          Phone: String(rows[0]?.c[contactIdx + 2]?.v || '')
        },
        menu: [],
        news: [],
        team: []
      };
  
      // Process all rows for menu items
      for (const row of rows) {
        const menuCategory = row.c[menuCategoryIdx]?.v;
        if (menuCategory) {
          result.menu.push({
            'Menu Category': String(menuCategory),
            'Item Name': String(row.c[menuCategoryIdx + 1]?.v || ''),
            'IsVegetarian': Boolean(row.c[menuCategoryIdx + 2]?.v),
            'Description': String(row.c[menuCategoryIdx + 3]?.v || '')
          });
        }
      }
  
      // Process all rows for news items
      for (const row of rows) {
        const newsTitle = row.c[newsTitleIdx]?.v;
        if (newsTitle) {
          result.news.push({
            'Title': String(newsTitle),
            'Description': String(row.c[newsTitleIdx + 1]?.v || ''),
            'DateAndPlace': String(row.c[newsTitleIdx + 2]?.v || ''),
            'Image': String(row.c[newsTitleIdx + 3]?.v || '')
          });
        }
      }
  
      // Process all rows for team content
      for (const row of rows) {
        const descriptionLeft = row.c[teamContentIdx]?.v;
        if (descriptionLeft) {
          result.team.push({
            DescriptionLeft: String(descriptionLeft),
            DescriptionRight: String(row.c[teamContentIdx + 1]?.v || ''),
            ImageLeft: String(row.c[teamContentIdx + 2]?.v || ''),
            ImageRight: String(row.c[teamContentIdx + 3]?.v || ''),
            Description: String(row.c[teamContentIdx + 4]?.v || '')
          });
        }
      }
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }