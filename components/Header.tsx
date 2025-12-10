import React, { useState, useRef, useEffect } from 'react';
import { SidebarIcon, NewChatIcon, ChevronDownIcon } from './Icons';

interface HeaderProps {
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  onModelChange: (model: 'gemini-2.5-flash' | 'gemini-2.5-pro') => void;
}

const Header: React.FC<HeaderProps> = ({ model, onModelChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modelDisplayName = model === 'gemini-2.5-pro' ? 'Pro' : 'Flash';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModelSelect = (selectedModel: 'gemini-2.5-flash' | 'gemini-2.5-pro') => {
    onModelChange(selectedModel);
    setIsDropdownOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0D0D0D] bg-opacity-80 backdrop-blur-sm z-20 border-b border-gray-800/50">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16">
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <SidebarIcon className="w-6 h-6" />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors"
          >
            <span>
              <span className="font-semibold bg-gradient-to-r from-[#00c6ff] via-[#8a2be2] to-[#00eaff] bg-clip-text text-transparent animate-gradient">
                Supernova
              </span>
              {' '}{modelDisplayName}
            </span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-40 bg-[#1A1A1A] border border-gray-700/50 rounded-lg shadow-lg z-30 right-0 origin-top-right">
              <ul className="py-1">
                <li
                  onClick={() => handleModelSelect('gemini-2.5-flash')}
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-300"
                >
                  Gemini Flash
                </li>
                <li
                  onClick={() => handleModelSelect('gemini-2.5-pro')}
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm text-gray-300"
                >
                  Gemini Pro
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <NewChatIcon className="w-6 h-6" />
        </button>
      </nav>
    </header>
  );
};

export default Header;