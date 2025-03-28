import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

const MenuItem = () => {
  const [menuItems, setMenuItems] = useState([])
  const [addModal, setAddModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [currentItem, setCurrentItem] = useState('')
  const [newItem, setNewItem] = useState({
    categoryName: '',
    subcategoryName: '',
    menuName: '',
    price: '',
    CGST: '',
    SGST: '',
    IGST: '',
    mrp_is_including: '',
    status: 'active',
  })

  const [updateItem, setUpdateItem] = useState({
    categoryName: '',
    subcategoryName: '',
    oldMenuName : '',
    menuName: '',
    price: '',
    CGST: '',
    SGST: '',
    IGST: '',
    mrp_is_including: '',
    status: 'active',
  })

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-categories')
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddMenuItem = async () => {
    try {
      // console.log('Sending data:', newItem); // Check what you're sending
      // const formattedItem = {
      //   categoryName: newItem.categoryName,
      // subcategories: [
      //   {
      //     name: newItem.subcategoryName,
      //     menuItems: [
      //       {
      //         menuName: newItem.menuName,
      //         price: Number(newItem.price),
      //         CGST: Number(newItem.CGST),
      //         SGST: Number(newItem.SGST),
      //         IGST: Number(newItem.IGST),
      //         mrp_is_including: newItem.mrp_is_including === "true",
      //         status: newItem.status, // Ensure it matches the enum
      //       },
      //     ],
      //   },
      // ],
      // };
  
      console.log("Formatted data:", formattedItem);
      const response = await fetch(`http://localhost:8000/api/add-menuItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuName : newItem.menuName,
          categoryName : newItem.categoryName,
          subcategoryName :newItem.subcategoryName,
          price :Number(newItem.price),
          CGST :Number(newItem.CGST),
          SGST :Number(newItem.SGST),
          IGST :Number(newItem.IGST),
          mrp_is_including:newItem.mrp_is_including === "true",
          status :newItem.status,
        }),
      });
  
      // if (!response.ok) {
      //   throw new Error(`Failed to add menu item: ${response.statusText}`);
      // }
  
      const data = await response.json(); // Ensure valid JSON
      console.log('Menu item added:', data);
      alert("menuItem added")
  
      fetchMenuItems(); // Refresh menu items
      setAddModal(false); // Close modal
  
      // Reset form state
      setNewItem({
        categoryName: '',
        subcategoryName: '',
        menuName: '',
        price: '',
        CGST: '',
        SGST: '',
        IGST: '',
        mrp_is_including: 'false',
        status: 'active',
      });
      setSelectedCategory('');
      setSelectedSubcategory('');
    } catch (error) {
      console.error('Error adding menu item:', error.message);
    }
  };
  

  const handleDeleteMenuItem = async (category, subcategory, menuitem) => {

    if (!window.confirm('Are you sure you want to delete this menu item?')) return
    try {
      await fetch(`http://localhost:8000/api/delete-menuItem`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: category,
          subcategoryName: subcategory,
          menuName: menuitem,
        }),
      })
      fetchMenuItems()
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }
  const handleEditClick = (category, subcategory, menuItem) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    setCurrentItem( menuItem)
    setUpdateModal(true)
  }

  const handleUpdateMenuItem = async () => {
    try {
    
      const response = await fetch(`http://localhost:8000/api/update-menuItem`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: selectedCategory,
          subcategoryName: selectedSubcategory,
          oldMenuName : currentItem,
          menuName: updateItem.menuName,
          price: Number(updateItem.price),
          CGST: Number(updateItem.CGST),
          SGST: Number(updateItem.SGST),
          IGST: Number(updateItem.IGST),
          mrp_is_including: updateItem.mrp_is_including === "true",
          status: updateItem.status,
        }),
      })
      await response.json()
      alert("MenuItem Updated")
      fetchMenuItems()
      setUpdateModal(false)
    } catch (error) {
      console.error('Error updating menu item:', error)
    }
  }

  return (
    <div>
      <CButton
        color="info"
        onClick={() => setAddModal(true)}
        className="d-flex justify-content-end mb-2"
      >
        Add MenuItem
      </CButton>

      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Subcategory</CTableHeaderCell>
            <CTableHeaderCell>Menu Name</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>CGST</CTableHeaderCell>
            <CTableHeaderCell>SGST</CTableHeaderCell>
            <CTableHeaderCell>IGST</CTableHeaderCell>
            <CTableHeaderCell>MRP Inclusive</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {menuItems.map((category, i) =>
            category.subcategories.map((subcategory) =>
              subcategory.menuItems.map((menuItem, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{category.name}</CTableDataCell>
                  <CTableDataCell>{subcategory.name}</CTableDataCell>
                  <CTableDataCell>{menuItem.menuName}</CTableDataCell>
                  <CTableDataCell>{menuItem.price}</CTableDataCell>
                  <CTableDataCell>{menuItem.CGST}</CTableDataCell>
                  <CTableDataCell>{menuItem.SGST}</CTableDataCell>
                  <CTableDataCell>{menuItem.IGST}</CTableDataCell>
                  <CTableDataCell>{menuItem.mrp_is_including.toString()}</CTableDataCell>
                  <CTableDataCell>{menuItem.status}</CTableDataCell>
                  <CTableDataCell>
                    <CDropdown>
                      <CDropdownToggle color="secondary">⋮</CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem
                          onClick={() =>
                            handleEditClick(category.name, subcategory.name, menuItem.menuName)
                          }
                        >
                          Edit
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={() =>
                            handleDeleteMenuItem(category.name, subcategory.name, menuItem.menuName)
                          }
                        >
                          Delete
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              )),
            ),
          )}
        </CTableBody>
      </CTable>

      {/* Add MenuItem Modal */}
      <CModal visible={addModal} onClose={() => setAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Add Menu Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <CFormSelect
                label="Category"
                value={selectedCategory}
                onChange={(e) => {
                  const selectedCat = e.target.value
                  setSelectedCategory(selectedCat) // Update selectedCategory
                  setNewItem({ ...newItem, categoryName: selectedCat, subcategoryName: '' }) // Reset subcategory
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </CFormSelect>

              <CFormSelect
                label="Subcategory"
                value={selectedSubcategory}
                onChange={(e) => {
                  const selectedSubCat = e.target.value
                  setSelectedSubcategory(selectedSubCat) // Update selectedCategory
                  setNewItem({ ...newItem, subcategoryName: selectedSubCat}) // Reset subcategory
                }}
                disabled={!selectedCategory} // Disable if no category is selected
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((c) => c.name === selectedCategory)
                  ?.subcategories.map((sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </CFormSelect>
              <CFormInput
                label="Menu Name"
                type="text"
                onChange={(e) => setNewItem({ ...newItem, menuName: e.target.value })}
              />
              <CFormInput
                label="Price"
                type="number"
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label="CGST"
                type="number"
                onChange={(e) => setNewItem({ ...newItem, CGST: parseFloat(e.target.value) })}
              />
              <CFormInput
                label="SGST"
                type="number"
                onChange={(e) => setNewItem({ ...newItem, SGST: parseFloat(e.target.value) })}
              />
              <CFormInput
                label="IGST"
                type="number"
                onChange={(e) => setNewItem({ ...newItem, IGST: parseFloat(e.target.value) })}
              />
              <CFormSelect
                label="Select mrp_is_including"
                onChange={(e) => setNewItem({ ...newItem, mrp_is_including: e.target.value === "true" })}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </CFormSelect>

              <CFormSelect
                label="Status"
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddMenuItem}>
            Add MenuItem
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Update MenuItem Modal */}
      <CModal visible={updateModal} onClose={() => setUpdateModal(false)}>
        <CModalHeader>
          <CModalTitle>Update Menu Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              {/* <CFormSelect label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </CFormSelect> */}

              {/* <CFormSelect label="Subcategory" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                {categories.find((c) => c.name === selectedCategory)?.subcategories.map((sub) => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </CFormSelect> */}

              {/* <CFormSelect label="Menu Name" value={currentItem?.menuName} onChange={(e) => setCurrentItem({ ...currentItem, menuName: e.target.value })}>
                {categories.find((c) => c.name === selectedCategory)?.subcategories.find((s) => s.name === selectedSubcategory)?.menuItems.map((m) => (
                  <option key={m.menuName} value={m.menuName}>{m.menuName}</option>
                ))}
              </CFormSelect> */}

              <CFormInput
                type="text"
                label="Menu Name"
                value={updateItem?.menuName || ''}
                onChange={(e) => setUpdateItem({ ...updateItem, menuName: e.target.value })}
              />
              <CFormInput
                type="number"
                label="Price"
                value={updateItem?.price || ''}
                onChange={(e) =>
                  setUpdateItem({ ...updateItem, price: parseFloat(e.target.value) })
                }
              />
              <CFormInput
                type="number"
                label="CGST"
                value={updateItem?.CGST || ''}
                onChange={(e) =>
                  setUpdateItem({ ...updateItem, CGST: parseFloat(e.target.value) })
                }
              />
              <CFormInput
                type="number"
                label="SGST"
                value={updateItem?.SGST || ''}
                onChange={(e) =>
                  setUpdateItem({ ...updateItem, SGST: parseFloat(e.target.value) })
                }
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="number"
                label="IGST"
                value={updateItem?.IGST || ''}
                onChange={(e) =>
                  setUpdateItem({ ...updateItem, IGST: parseFloat(e.target.value) })
                }
              />

              <CFormSelect
                label="MRP Including"
                value={updateItem?.mrp_is_including}
                onChange={(e) =>
                  setUpdateItem({ ...updateItem, mrp_is_including: e.target.value === 'true' })
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </CFormSelect>

              <CFormSelect
                label="Status"
                value={updateItem?.status}
                onChange={(e) => setUpdateItem({ ...updateItem, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateMenuItem}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default MenuItem
