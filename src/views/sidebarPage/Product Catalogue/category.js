import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(null)
  const [status, setStatus] = useState('active')

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Open add category modal
  const openAddCategoryModal = () => {
    setName('')
    setIcon(null)
    setStatus('active')
    setShowAddModal(true)
  }

  // Open edit category modal
  const openEditCategoryModal = (category) => {
    setSelectedCategory(category)
    setName(category.name)
    setStatus(category.status)
    setShowEditModal(true)
  }

  // Add Category
  const addCategory = async () => {
    if (!name) {
      alert('Category name is required.')
      return
    }

    let iconURL = ''
    if (icon) {
      iconURL = await convertToBase64(icon)
    }

    const newCategory = { name, icon: iconURL, status }

    const response = await fetch('http://localhost:8000/api/add-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    })

    const result = await response.json()
    alert(result.message)
    setShowAddModal(false)
    fetchCategories()
  }

  // Update Category
  const updateCategory = async () => {
    if (!selectedCategory) return

    let iconURL = selectedCategory.icon
    if (icon) {
      iconURL = await convertToBase64(icon)
    }

    const response = await fetch(
      `http://localhost:8000/api/update-categories/${selectedCategory._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon: iconURL, status }),
      },
    )

    const result = await response.json()
    alert(result.message)
    setShowEditModal(false)
    fetchCategories()
  }

  // Delete Category
  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    await fetch(`http://localhost:8000/api/delete-categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div>
      {/* Add Category Button */}
      <div className="d-flex justify-content-end mb-3">
        <CButton color="info" onClick={openAddCategoryModal}>
        Add Category
        </CButton>
      </div>

      {/* Categories Table */}
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Icon</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="5">No categories available.</CTableDataCell>
            </CTableRow>
          ) : (
            categories.map((category, index) => (
              <CTableRow key={category._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{category.name}</CTableDataCell>
                <CTableDataCell>
                  <img src={category.icon} alt="Icon" width="30" />
                </CTableDataCell>
                <CTableDataCell>{category.status}</CTableDataCell>
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle color="secondary">⋮</CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => openEditCategoryModal(category)}>
                        Edit
                      </CDropdownItem>
                      <CDropdownItem onClick={() => deleteCategory(category._id)}>
                        Delete
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      {/* Add Category Modal */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <CFormInput type="file" label="Icon" onChange={(e) => setIcon(e.target.files[0])} />
          <CFormSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={addCategory}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Category Modal */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <CFormInput type="file" label="Icon" onChange={(e) => setIcon(e.target.files[0])} />
          label = "update Menu Name"
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={updateCategory}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Categories
