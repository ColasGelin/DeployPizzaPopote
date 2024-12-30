'use client'

import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Category, MenuItem } from '../types';

interface MenuComponentProps {
  categories: Category[];
  menuItems: { [key: number]: MenuItem[] };
  onDeleteCategory: (id: number) => void;
  onDeleteMenuItem: (itemId: number, categoryId: number) => void;
  onAddCategory: (name: string) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
}

export function MenuComponent({
  categories,
  menuItems,
  onDeleteCategory,
  onDeleteMenuItem,
  onAddCategory,
  onAddMenuItem,
}: MenuComponentProps) {
  const [newCategory, setNewCategory] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({
    category_id: '',
    name: '',
    description: '',
    hasVegetarianIcon: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'category' | 'item';
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    onAddCategory(newCategory);
    setNewCategory('');
  };

  const handleMenuItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.category_id || !newMenuItem.name.trim()) return;

    const itemToAdd = {
      ...newMenuItem,
      // Make sure it's explicitly converted to number
      category_id: Number(newMenuItem.category_id),
      // Make sure boolean is correct
      hasVegetarianIcon: Boolean(newMenuItem.hasVegetarianIcon)
    };

    onAddMenuItem(itemToAdd);

    setNewMenuItem({
      category_id: '',
      name: '',
      description: '',
      hasVegetarianIcon: false
    });
};

  // Delete confirmation dialog component
  const DeleteConfirmDialog = ({ 
    type,
    name, 
    onConfirm, 
    onCancel 
  }: {
    type: 'category' | 'item';
    name: string;
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
          Are you sure you want to delete this {type}:<br/>
          <span className="font-semibold">{name}</span>?
          {type === 'category' && <span className="block mt-2 text-sm text-red-500">This will also delete all items in this category!</span>}
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
      
      <h2 className="text-xl font-semibold mb-6">Menu Management</h2>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-gray-50 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <button 
                onClick={() => setShowDeleteConfirm({
                  type: 'category',
                  name: category.name,
                  onConfirm: () => {
                    onDeleteCategory(category.id);
                    setShowDeleteConfirm(null);
                  },
                  onCancel: () => setShowDeleteConfirm(null)
                })}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {menuItems[category.id]?.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        {item.name}
                        {Boolean(item.hasVegetarianIcon) && (
                          <span className="text-green-500 text-sm bg-green-50 px-2 py-1 rounded-full">
                            Vegetarian 🌱
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm({
                        type: 'item',
                        name: item.name,
                        onConfirm: () => {
                          onDeleteMenuItem(item.id, category.id);
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
              {(!menuItems[category.id] || menuItems[category.id].length === 0) && (
                <p className="text-gray-500 text-center py-4">No items in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleCategorySubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Add New Category</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category Name"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </form>

      <form onSubmit={handleMenuItemSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Add New Menu Item</h3>
        <select
          value={newMenuItem.category_id}
          onChange={(e) => setNewMenuItem({...newMenuItem, category_id: e.target.value})}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={newMenuItem.name}
          onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
          placeholder="Item Name"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <textarea
          value={newMenuItem.description}
          onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
          placeholder="Description"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newMenuItem.hasVegetarianIcon}
            onChange={(e) => setNewMenuItem({...newMenuItem, hasVegetarianIcon: e.target.checked})}
            className="w-4 h-4 text-green-600 focus:ring-green-500"
          />
          <label>Vegetarian</label>
        </div>
        <button 
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Item
        </button>
      </form>
    </div>
  );
}