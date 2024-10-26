import React from 'react';
import { UserPlus, List } from 'lucide-react';

interface NavigationProps {
  activeView: 'form' | 'list';
  onViewChange: (view: 'form' | 'list') => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <button
                onClick={() => onViewChange('form')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeView === 'form'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Nouveau Passeport
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeView === 'list'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <List className="h-5 w-5 mr-2" />
                Liste des Passeports
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}