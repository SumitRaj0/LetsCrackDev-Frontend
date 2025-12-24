import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '@/modules/categories/data/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminCategories() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleEdit = (_id: string, currentName: string) => {
    setEditingId(_id)
    setEditName(currentName)
  }

  const handleSaveEdit = (_id: string) => {
    // In a real app, this would call an API
    // TODO: Implement API call to update category
    setEditingId(null)
    setEditName('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = (_id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // In a real app, this would call an API
      // TODO: Implement API call to delete category
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // In a real app, this would call an API
      // TODO: Implement API call to add category
      setNewCategoryName('')
      setShowAddForm(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Manage Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Add, rename, or delete categories</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Back to Dashboard
              </Link>
              <Link
                to="/categories"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                View Categories Page
              </Link>
            </div>
          </div>

          {/* Add Category Button */}
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} size="lg">
            {showAddForm ? 'Cancel' : 'Add New Category'}
          </Button>
        </div>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 max-w-2xl">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Add New Category
            </h2>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1"
                rounded="default"
              />
              <Button variant="primary" onClick={handleAddCategory} size="lg">
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resources
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === category.id ? (
                        <Input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          rounded="default"
                        />
                      ) : (
                        <div className="text-sm font-medium text-black dark:text-white">
                          {category.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category.resourceCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleSaveEdit(category.id)}
                            size="sm"
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={handleCancelEdit}
                            size="sm"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(category.id, category.name)}
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Rename
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(category.id)}
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
