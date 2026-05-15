'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { useGetProductsQuery } from '../../lib/api/productApi';
import { getErrorMessage } from '../../lib/utils/error-handler';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, error } = useGetProductsQuery(
    { searchTerm: debouncedSearch, PageSize: 5 },
    { skip: debouncedSearch.length < 2 }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSearch} className="relative flex items-center w-full h-10 rounded-full border bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <Search size={18} />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 bg-transparent pr-2"
          type="text"
          id="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
        />
        {searchTerm && (
          <button type="button" onClick={() => setSearchTerm('')} className="pr-4 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </form>

      {isFocused && searchTerm.length >= 2 && (
        <div className="absolute top-12 left-0 w-full bg-white border shadow-lg rounded-md z-50 overflow-hidden">
          {isFetching ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">{getErrorMessage(error)}</div>
          ) : data?.data?.items?.length ? (
            <ul className="py-2">
              {data.data.items.map((item: any) => (
                <li key={item.id}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex justify-between items-center"
                    onClick={() => {
                      setSearchTerm('');
                      setIsFocused(false);
                      router.push(`/products/${item.vendorSlug || 'v'}/${item.slug}`);
                    }}
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-400">${item.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};
