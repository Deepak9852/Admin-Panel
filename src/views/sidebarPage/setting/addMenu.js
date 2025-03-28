import React, { useState, useEffect, useRef } from 'react'
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

const addMenu = () => {
  const [menuData, setMenuData] = useState([])
  const [visible, setVisible] = useState(false)
  const [updatevisible, setUpdatevisible] = useState(false)
  const [menuName, setMenuName] = useState('')
  const [icon, setIcon] = useState(null)
  const [status, setStatus] = useState('active')
  const [link, setLink] = useState('')
  const [selectedMenu, setSelectedMenu] = useState("");
  const [updateMenuName, setUpdateMenuName] = useState('')
  const [updateIcon, setUpdateIcon] = useState(null)
  const [updateStatus, setUpdateStatus] = useState('active')
  const [UpdateLink, setUpdateLink] = useState('')

  const fileInputRef = useRef(null);

  let userId = localStorage.getItem('userId')
  useEffect(() => {
    fetchMenuData()
  }, []) // Runs when `userId` changes

  const fetchMenuData = async () => {
    try {
      let response = await fetch(`http://localhost:8000/api/get-menu/${userId}`)
      let data = await response.json()
      setMenuData(data.menus || [])
    } catch (error) {
      console.error('Error fetching menu data:', error)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setIcon(e.target.files[0]); // Store file object
    }
  };

  const handleSubmit = async () => {
    if (!menuName || !icon || !link || !status) {
      alert('field is required.')
      return
    }
    let responseMenu = await fetch(`http://localhost:8000/api/get-menu/${userId}`)
    let data = await responseMenu.json()
    let existingMenus = data.menus || []

    // Check if menu exists
    if (existingMenus.some((menu) => menu.name.toLowerCase() === menuName.toLowerCase())) {
      alert('Menu already exists!')
      return
    }

    let iconURL = ''
    if (icon) {
      iconURL = await convertToBase64(icon)
    }

    const newMenu = {
      userId: userId, // Ensure userId is stored after login
      menu: {
        name: menuName,
        link: link,
        logo: iconURL,
        status: status,
        submenus: [], // Empty initially
      },
    }

    const response = await fetch(`http://localhost:8000/api/add-menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMenu),
    })

    const result = await response.json()
    alert(result.message)

    fetchMenuData()
    setVisible(false) // Close modal after submission
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const deleteMenu = async (menuName) => {
    let confirmDelete = confirm(`Are you sure you want to delete the menu: ${menuName}?`)
    if (!confirmDelete) return

    let response = await fetch(`http://localhost:8000/api/delete-menu/${userId}/${menuName}`, {
      method: 'DELETE',
    })

    let result = await response.json()
    alert(result.message)
    console.log('Deleting menu:', menuName)
    // Implement delete logic
  }

  const openUpdateMenuForm = (menuName) => {
    setSelectedMenu(menuName)
    setUpdatevisible(true)
    console.log('Editing menu:', menuName)
    // Open the update form
  }


  const handleUpdateSubmit = async () => {
   if (!selectedMenu) return

    let iconURL = "";
    if (updateIcon) {
      iconURL = await convertToBase64(updateIcon)
    }

    const response = await fetch(
      `http://localhost:8000/api/update-menu/${userId}/${selectedMenu}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newName : updateMenuName,
          logo: updateIcon,
        link: UpdateLink,
        status: updateStatus,
         }),
      },
    )

    const result = await response.json()
    alert("menu updated")
    fetchMenuData()
    setUpdatevisible(false) // Close modal after submission
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CButton color="info" onClick={() => setVisible(true)}>
          Add Menu
        </CButton>

        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader closeButton>Add New Menu</CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                label = "Menu Name"
                type="text"
                placeholder="Enter menu name"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
              <CFormInput
                label = "Menu Logo"
                type="file"
                placeholder="Enter menu Icon"
               
                onChange={handleFileChange}
              />
              <CFormInput
                label ="Menu Link"
                type="text"
                placeholder="Enter menu link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <CFormSelect
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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

      <div className="Table">
        {/* Main Menu Table */}
        <h3>Menus</h3>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Logo</CTableHeaderCell>
              <CTableHeaderCell>Link</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {menuData.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="4" className="text-center">
                  No menus available.
                </CTableDataCell>
              </CTableRow>
            ) : (
              menuData.map((menu, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{menu.name}</CTableDataCell>
                  <CTableDataCell>
                    <img
                      src={menu.logo}
                      alt="Menu Logo"
                      style={{ width: '25px', height: '25px' }}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{menu.link}</CTableDataCell>
                  <CTableDataCell>
                    <CDropdown>
                      <CDropdownToggle>⋮</CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => openUpdateMenuForm(menu.name)}>
                          Edit
                        </CDropdownItem>
                        <CDropdownItem onClick={() => deleteMenu(menu.name)}>Delete</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>

      <CModal visible={updatevisible} onClose={() => setUpdatevisible(false)}>
        <CModalHeader closeButton>Add New Menu</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label = "update Menu Name"
              type="text"
              placeholder="Enter update menu name"
              value={updateMenuName}
              onChange={(e) => setUpdateMenuName(e.target.value)}
            />
            <CFormInput
               label = "update Menu Icon"
              type="file"
              placeholder="Enter update menu Icon"
              onChange={(e) => setUpdateIcon(e.target.value)}
            />
            <CFormInput
            label = "update Menu Link"
              type="text"
              placeholder="Enter update menu link"
              value={UpdateLink}
              onChange={(e) => setUpdateLink(e.target.value)}
            />
           <CFormSelect label="update Status" value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
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

export default addMenu
