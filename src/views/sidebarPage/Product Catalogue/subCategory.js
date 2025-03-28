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

const Subcategories = () => {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('active')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)

      // Extract subcategories from categories
      let subcats = []
      data.forEach((category) => {
        category.subcategories.forEach((sub) => {
          subcats.push({ ...sub, categoryId: category._id, categoryName: category.name })
        })
      })
      setSubcategories(subcats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const openAddSubcategoryModal = () => {
    setSelectedCategory('')
    setName('')
    setStatus('active')
    setShowAddModal(true)
  }

  const openEditSubcategoryModal = (subcategory) => {
    setSelectedSubcategory(subcategory)
    setSelectedCategory(subcategory.categoryId)
    setName(subcategory.name)
    setStatus(subcategory.status)
    setShowEditModal(true)
  }

  const addSubcategory = async () => {
    if (!selectedCategory || !name) {
      alert('Please select a category and enter a name.')
      return
    }

    const newSubcategory = { categoryName: selectedCategory, name, status }

    const response = await fetch('http://localhost:8000/api/add-subcategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubcategory),
    })

    const result = await response.json()
    alert(result.message)
    setShowAddModal(false)
    fetchCategories()
  }

  const updateSubcategory = async () => {
    if (!selectedSubcategory) return

    const response = await fetch(
      `http://localhost:8000/api/update-subCategory/${selectedSubcategory.categoryId}/${selectedSubcategory._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status }),
      },
    )

    const result = await response.json()
    alert(result.message)
    setShowEditModal(false)
    fetchCategories()
  }

  const deleteSubcategory = async (categoryId, subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return

    await fetch(`http://localhost:8000/api/delete-subcategory/${categoryId}/${subcategoryId}`, {
      method: 'DELETE',
    })

    fetchCategories()
  }

  return (
    <div>
      {/* Add Subcategory Button */}
      <div className="d-flex justify-content-end mb-3">
        <CButton color="info" onClick={openAddSubcategoryModal}>
          Add Subcategory
        </CButton>
      </div>

      {/* Subcategories Table */}
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Subcategory</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {subcategories.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="5">No subcategories available.</CTableDataCell>
            </CTableRow>
          ) : (
            subcategories.map((subcategory, index) => (
              <CTableRow key={subcategory._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{subcategory.categoryName}</CTableDataCell>
                <CTableDataCell>{subcategory.name}</CTableDataCell>
                <CTableDataCell>{subcategory.status}</CTableDataCell>
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle color="secondary">⋮</CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => openEditSubcategoryModal(subcategory)}>
                        Edit
                      </CDropdownItem>
                      <CDropdownItem onClick={() => deleteSubcategory(subcategory.categoryId, subcategory._id)}>
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

      {/* Add Subcategory Modal */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Subcategory</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </CFormSelect>
          <CFormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <CFormSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={addSubcategory}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Subcategory Modal */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit Subcategory</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <CFormSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={updateSubcategory}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Subcategories
