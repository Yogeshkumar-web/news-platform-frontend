"use client";

import { useState } from "react";
import { AdminCategory } from "@/types";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/features/admin/actions/admin-actions";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

interface CategoriesTableProps {
    initialCategories: AdminCategory[];
}

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
    const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: "", slug: "", description: "" });

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: "", slug: "", description: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (category: AdminCategory) => {
        setEditingCategory(category);
        setFormData({ name: category.name, slug: category.slug, description: category.description || "" });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingCategory) {
                const result = await updateCategoryAction(editingCategory.id, formData);
                if (result.success) {
                    setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
                    setIsModalOpen(false);
                    toast.success("Category updated successfully!");
                } else {
                    toast.error(result.message || "Failed to update category");
                }
            } else {
                const result = await createCategoryAction(formData);
                console.log("Create category result:", result);
                if (result.success && result.data) {
                    setCategories([...categories, result.data]);
                    setIsModalOpen(false);
                    toast.success("Category created successfully!");
                } else {
                    toast.error(result.message || "Failed to create category");
                }
            }
        } catch (error: any) {
            console.error("Category action error:", error);
            toast.error(error.message || "Failed to save category");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        setIsLoading(true);
        try {
            const result = await deleteCategoryAction(id);
            if (result.success) {
                setCategories(categories.filter(c => c.id !== id));
                toast.success("Category deleted successfully!");
            } else {
                toast.error(result.message || "Failed to delete category");
            }
        } catch (error: any) {
            console.error("Delete category error:", error);
            toast.error(error.message || "Failed to delete category");
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name" as keyof AdminCategory,
            className: "font-medium text-gray-900"
        },
        {
            header: "Slug",
            accessor: "slug" as keyof AdminCategory,
            className: "text-gray-500"
        },
        {
            header: "Articles",
            accessor: "articleCount" as keyof AdminCategory,
            className: "text-center"
        },
        {
            header: "Created",
            accessor: (cat: AdminCategory) => formatDate(cat.createdAt),
        },
        {
            header: "Actions",
            accessor: (cat: AdminCategory) => (
                <div className="flex gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(cat); }}
                        className="text-blue-600 hover:text-blue-900"
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <DataTable
                    data={categories}
                    columns={columns}
                    keyExtractor={(c) => c.id}
                    isLoading={isLoading && categories.length === 0}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Edit Category" : "Create Category"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
