import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  const [signupInfo, setSignupInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
  })

  const [roleList, setRoleList] = useState([])

  const navigate = useNavigate()

  // Target value enter in registration field
  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    const copySignupInfo = { ...signupInfo }
    copySignupInfo[name] = value
    setSignupInfo(copySignupInfo)
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

  // console.log(roleList)

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const url = 'http://localhost:8000/api/register'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupInfo),
      })
      const result = await response.json()
      console.log(result)
      console.log(result.status)
      if (result.status === 'success') {
        alert('Registration Successfully completed')
        navigate('/')
      } else {
        alert('Email id already registered')
      }
    } catch (error) {
      console.error('Register error: ', error)
      alert('An error occurred while trying to Register. Please try again later.')
    }
  }

  return (
    <div className=" min-vh-90 pt-4 d-flex flex-row align-items-center" >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1 className="ms-5 ps-5 ">Register</h1>
                  <p className="text-body-secondary ms-5 ps-5  ">Register New User</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Enter First Name"
                      type="text"
                      name="first_name"
                      value={signupInfo.first_name}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Enter Last Name"
                      type="text"
                      name="last_name"
                      value={signupInfo.last_name}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Enter Email"
                      type="email"
                      name="email"
                      value={signupInfo.email}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={signupInfo.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect
                      aria-label="Default select example"
                      name="role"
                      value={signupInfo.role}
                      onChange={handleChange}
                    >
                      <option value="">Select Role</option>
                      {roleList.map((role, index) => (
                        <option key={index} value={role.roleName}>
                          {role.roleName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit" onClick={handleSignup}>
                      Register
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
