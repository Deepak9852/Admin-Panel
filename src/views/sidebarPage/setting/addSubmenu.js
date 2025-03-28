import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CForm,
  CFormInput,
  CModalFooter,
  CFormSelect,
} from '@coreui/react'

const addSubmenu = () => {
  const [submenuData, setSubmenuData] = useState([])
  const [visible, setVisible] = useState(false)
  const [updatevisible, setUpdatevisible] = useState(false)
  const [submenuName, setSubmenuName] = useState('')
  const [submenuLink, setSubmenuLink] = useState('')
  const [submenuStatus, setSubmenuStatus] = useState('active')
  const [menuList, setMenuList] = useState([])
  const [selectedMainMenu, setSelectedMainMenu] = useState('')
  const [newName, setNewName] = useState('')
  const [newLink, setNewLink] = useState('')
  const [newStatus, setNewStatus] = useState('active')
  const [selectedSubmenu, setSelectedSubmenu] = useState('')
  const [selectMenuUpdate, setSelectMenuUpdate] = useState([''])

  const [menuName, setMenuName] = useState('')

  let userId = localStorage.getItem('userId')
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        let response = await fetch(`http://localhost:8000/api/get-menu/${userId}`)
        let data = await response.json()
        setSubmenuData(data.menus || [])
      } catch (error) {
        console.error('Error fetching menu data:', error)
      }
    }

    fetchMenuData()
  }, [userId]) // Runs when `userId` changes

  const deleteSubmenu = async (menuName, submenuName) => {
    let userId = localStorage.getItem('userId')

    let confirmDelete = confirm(`Are you sure you want to delete the submenu: ${submenuName}?`)
    if (!confirmDelete) return

    let response = await fetch(
      `http://localhost:8000/api/delete-submenu/${userId}/${menuName}/${submenuName}`,
      {
        method: 'DELETE',
      },
    )

    let result = await response.json()
    alert(result.message)

    console.log(`Deleting submenu: ${submenuName} under ${menuName}`)
    // Implement delete logic
  }

  console.log(submenuData)

  const handleSubmit = async () => {
    console.log('New Menu:', menuName)
    if (!submenuName || !selectedMainMenu || !submenuLink) {
      alert('Please enter all required fields.')
      return
    }

    const submenuData = {
      userId,
      menuName: selectedMainMenu,
      submenu: {
        name: submenuName,
        link: submenuLink,
        status: submenuStatus,
      },
    }

    try {
      let response = await fetch('http://localhost:8000/api/add-submenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submenuData),
      })

      let result = await response.json()

      if (response.ok) {
        alert('Submenu added successfully!')

        resetForm()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error adding submenu:', error)
    }
  }

  // Reset form fields
  const resetForm = () => {
    setSubmenuName('')
    setSubmenuLink('')
    setSubmenuStatus('active')
    setSelectedMainMenu('')

    setVisible(false) // Close modal after submission
  }

  const openUpdateSubmenuForm = (menuName, submenuName) => {
    setSelectMenuUpdate(menuName)
    setSelectedSubmenu(submenuName)
    setUpdatevisible(true)
    console.log('Editing menu:', menuName, submenuName)
    // Open the update form
  }

  const handleUpdateSubmit = async () => {
    console.log('New Menu:', menuName)
    if (!newName || !newLink || !newStatus) {
      alert('All fields are required!')
      return
    }

    let response = await fetch(
      `http://localhost:8000/api/update-submenu/${userId}/${selectMenuUpdate}/${selectedSubmenu}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName, link: newLink, status: newStatus }),
      },
    )

    let result = await response.json()
    alert(result.message)
    // Add your API call here to save menu in MongoDB
    setUpdatevisible(false) // Close modal after submission
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <CButton color="info" onClick={() => setVisible(true)}>
          Add SubMenu
        </CButton>

        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader closeButton>Add New Menu</CModalHeader>
          <CModalBody>
            <CForm>
              <CFormSelect
                label="Select Main Menu"
                value={selectedMainMenu}
                onChange={(e) => setSelectedMainMenu(e.target.value)}
                required
              >
                <option value="">Select a menu</option>
                {submenuData.map((menu) => (
                  <option key={menu._id} value={menu.name}>
                    {menu.name}
                  </option>
                ))}
              </CFormSelect>
              <CFormInput
                label="SubMenu Name"
                type="text"
                placeholder="Enter subMenu name"
                value={submenuName}
                onChange={(e) => setSubmenuName(e.target.value)}
              />
              <CFormInput
                label="Sub Menu Link"
                type="text"
                placeholder="Enter Submenu link"
                value={submenuLink}
                onChange={(e) => setSubmenuLink(e.target.value)}
              />
              <CFormSelect
                label="Status"
                value={submenuStatus}
                onChange={(e) => setSubmenuStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleSubmit}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>
      </div>

      <div>
        <h3>Submenus</h3>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Menu</CTableHeaderCell>
              <CTableHeaderCell>Submenu</CTableHeaderCell>
              <CTableHeaderCell>Logo</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {submenuData.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  No submenus available.
                </CTableDataCell>
              </CTableRow>
            ) : (
              submenuData.map((menu, index) =>
                menu.submenus.map((submenu, subIndex) => (
                  <CTableRow key={`${index}-${subIndex}`}>
                    <CTableDataCell>{subIndex + 1}</CTableDataCell>
                    <CTableDataCell>{menu.name}</CTableDataCell>
                    <CTableDataCell>{submenu.name}</CTableDataCell>
                    <CTableDataCell>{submenu.link}</CTableDataCell>
                    <CTableDataCell>
                      <CDropdown>
                        <CDropdownToggle color="secondary">⋮</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem
                            onClick={() => openUpdateSubmenuForm(menu.name, submenu.name)}
                          >
                            Edit
                          </CDropdownItem>
                          <CDropdownItem onClick={() => deleteSubmenu(menu.name, submenu.name)}>
                            Delete
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                )),
              )
            )}
          </CTableBody>
        </CTable>
      </div>

      <CModal visible={updatevisible} onClose={() => setUpdatevisible(false)}>
        <CModalHeader closeButton>Add New Menu</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label=" Update subMenu Name"
              type="text"
              placeholder="Enter update menu name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <CFormInput
              label=" Update subMenu Link"
              type="text"
              placeholder="Enter update menu link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <CFormSelect
              label="Update SubMenu Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdatevisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateSubmit}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default addSubmenu



