'use client';
import React, { useEffect, useRef, useState } from 'react';

/** 1. Country type */
interface Country {
  code: string;
  name: string;
  flag: string;
}

/** 2. Sample country data */
const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
];

/** 3. Component */
export default function CountryDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Country | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    setSelected(country);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={wrapperRef} className="relative w-64">
      <label className="block text-sm font-medium text-gray-700 absolute left-[20%] -top-3.5 bg-white px-1 z-10">
        Country *
      </label>

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full border border-gray-300 bg-white rounded px-4 py-2 text-left shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <span>{selected.flag}</span>
            <span>{selected.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select a country</span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <ul>
            {filteredCountries.map(country => (
              <li
                key={country.code}
                onClick={() => handleSelect(country)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </li>
            ))}
            {!filteredCountries.length && (
              <li className="px-4 py-2 text-sm text-gray-500">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
