import React, { useState, useEffect } from 'react'
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

const UserRole = () => {
  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
  })
  const [roleList, setRoleList] = useState([])

  useEffect(() => {
    getRegisterUser()
  }, [])

  const getRegisterUser = async () => {
    const url = 'http://localhost:8000/api/get-user'
    let users = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await users.json()
    const dataList = data.data
    setUsers(dataList)
  }

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-role')
        const roles = await response.json()
        setRoleList(roles)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    fetchRoles()
  }, [])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    })
    setVisible(true)
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      let response = await fetch(`http://localhost:8000/api/delete-user/${userId}`, {
        method: 'DELETE',
      })
      let result = await response.json()
      alert(result.message)
      getRegisterUser()
    }
  }

  const handleUpdate = async () => {
    try {
      let response = await fetch(`http://localhost:8000/api/update-user/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      let result = await response.json()
      alert('User updated successfully')
      setVisible(false)
      getRegisterUser()
    } catch (error) {
      console.error('Update error: ', error)
      alert('An error occurred while trying to update. Please try again later.')
    }
  }

  return (
    <div>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((user, index) => (
            <CTableRow key={user._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>
                {user.first_name} {user.last_name}
              </CTableDataCell>
              <CTableDataCell>{user.email}</CTableDataCell>
              <CTableDataCell>{user.role}</CTableDataCell>
              <CTableDataCell>
                <CDropdown>
                  <CDropdownToggle>⋮</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => handleEdit(user)}>Edit</CDropdownItem>
                    <CDropdownItem onClick={() => handleDelete(user._id)}>Delete</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                {/* <CButton color="warning" size="sm" onClick={() => handleEdit(user)}>Edit</CButton>
                <CButton color="danger" size="sm" className="ms-2" onClick={() => handleDelete(user._id)}>Delete</CButton> */}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* CoreUI Modal for Updating User */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-2"
            label="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <CFormSelect
            className="mb-2"
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">Select Role</option>
            {roleList.map((role, index) => (
              <option key={index} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdate}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default UserRole
