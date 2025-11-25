"use client";

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api/client';

interface Category {
    key: string;
    label: string;
    count?: number;
}

interface CategorySelectProps {
    value: string[];
    onChange: (categories: string[]) => void;
    maxSelections?: number;
}

export function CategorySelect({ 
    value, 
    onChange, 
    maxSelections = 5 
}: CategorySelectProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/categories');
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryKey: string) => {
        if (value.includes(categoryKey)) {
            // Remove category
            onChange(value.filter(k => k !== categoryKey));
        } else {
            // Add category (if under limit)
            if (value.length < maxSelections) {
                onChange([...value, categoryKey]);
            }
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading categories...
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Search */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Category List */}
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                {filteredCategories.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No categories found
                    </p>
                ) : (
                    filteredCategories.map((category) => (
                        <label
                            key={category.key}
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                value.includes(category.key)
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(category.key)}
                                onChange={() => toggleCategory(category.key)}
                                disabled={!value.includes(category.key) && value.length >= maxSelections}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                            />
                            <span className="flex-1 text-sm font-medium text-gray-700">
                                {category.label}
                            </span>
                            {category.count !== undefined && (
                                <span className="text-xs text-gray-500">
                                    ({category.count})
                                </span>
                            )}
                        </label>
                    ))
                )}
            </div>

            {/* Selected count */}
            <p className="text-sm text-gray-600">
                {value.length}/{maxSelections} categories selected
                {value.length >= maxSelections && (
                    <span className="text-amber-600 ml-2">
                        (Maximum reached)
                    </span>
                )}
            </p>

            {/* Selected categories chips */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((key) => {
                        const category = categories.find(c => c.key === key);
                        return category ? (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                                {category.label}
                                <button
                                    type="button"
                                    onClick={() => toggleCategory(key)}
                                    className="hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
}
