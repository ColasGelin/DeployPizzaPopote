'use client'

import { useState } from 'react';
import { Plus, Trash2, AlertCircle, Image } from 'lucide-react';
import { NewsItem } from './types';

type NewsItemInput = Omit<NewsItem, 'id'>;

interface NewsComponentProps {
  news: NewsItem[];
  onDeleteNews: (id: number) => void;
  onAddNews: (newsData: NewsItemInput) => void;
}

export function NewsComponent({
  news,
  onDeleteNews,
  onAddNews,
}: NewsComponentProps) {
  const [newNewsItem, setNewNewsItem] = useState({
    title: '',
    description: '',
    dateAndPlace: '',
    image: null as string | null,
    order_num: 0
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    id: number;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsItem.title.trim() || !newNewsItem.description.trim()) return;

    // Prepare the data object instead of FormData
    const newsData = {
      title: newNewsItem.title,
      description: newNewsItem.description,
      dateAndPlace: newNewsItem.dateAndPlace,
      order_num: newNewsItem.order_num,
      image: newNewsItem.image
    };

    onAddNews(newsData);
    setNewNewsItem({
      title: '',
      description: '',
      dateAndPlace: '',
      image: null,
      order_num: 0
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64String = await convertToBase64(e.target.files[0]);
        setNewNewsItem(prev => ({
          ...prev,
          image: base64String
        }));
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }
  };

  const DeleteConfirmDialog = ({ 
    title, 
    onConfirm, 
    onCancel 
  }: {
    id: number;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <AlertCircle size={24} />
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        </div>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this news item:<br/>
          <span className="font-semibold">{title}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {showDeleteConfirm && <DeleteConfirmDialog {...showDeleteConfirm} />}
      
      <h2 className="text-xl font-semibold mb-6">News Management</h2>
      
      {/* Current News Display */}
      <div className="mb-8 space-y-4">
        {news.map(item => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2">{item.dateAndPlace}</p>
                {item.image && (
                  <div className="mt-2">
                    <img 
                      src={`https://64.226.114.142:3443/uploads/${item.image.split('/').pop()}`} 
                      alt={item.title}
                      className="max-w-xs rounded-lg shadow"
                    />
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowDeleteConfirm({
                  id: item.id,
                  title: item.title,
                  onConfirm: () => {
                    onDeleteNews(item.id);
                    setShowDeleteConfirm(null);
                  },
                  onCancel: () => setShowDeleteConfirm(null)
                })}
                className="text-red-400 hover:text-red-600 transition-colors ml-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <p className="text-gray-500 text-center py-4">No news items available</p>
        )}
      </div>
      
      {/* Add News Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Add News Item</h3>
        
        <input
          type="text"
          value={newNewsItem.title}
          onChange={(e) => setNewNewsItem({...newNewsItem, title: e.target.value})}
          placeholder="Title"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <textarea
          value={newNewsItem.description}
          onChange={(e) => setNewNewsItem({...newNewsItem, description: e.target.value})}
          placeholder="Description"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
        
        <input
          type="text"
          value={newNewsItem.dateAndPlace}
          onChange={(e) => setNewNewsItem({...newNewsItem, dateAndPlace: e.target.value})}
          placeholder="Date and Place"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Image size={20} />
            {newNewsItem.image ? 'Image selected' : 'Select Image'}
          </label>
          {newNewsItem.image && (
            <img 
              src={newNewsItem.image} 
              alt="Preview" 
              className="h-10 w-10 object-cover rounded"
            />
          )}
        </div>

        <button 
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add News
        </button>
      </form>
    </div>
  );
}