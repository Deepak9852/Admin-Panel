import React from 'react'
import { useState , useEffect} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {

  const [loggedInUser, SetLoggedInUser] = useState("");

  useEffect(() => {
    SetLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const navigate = useNavigate();


  const logout = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure to logout ?")) {
      try {
        const url = "http://localhost:8000/api/logout";
        let response = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          // Clear the user data from localStorage
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("loggedInUserRole");
          localStorage.removeItem("userId");
          SetLoggedInUser();
          navigate("/")
          // Optionally, clear the token
          // localStorage.removeItem('token');
        } else {
          alert("Logout failed, please try again.");
        }
      } catch (error) {
        console.error("Logout error: ", error);
        alert(
          "An error occurred while trying to logOut. Please try again later."
        );
      }
    } else {
      alert("Cancelled! No action taken.");
    }
  };


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
        {loggedInUser ? (
                      
                      <span>{loggedInUser.toUpperCase()}</span>
                         
                    ) : (
                      <Link to="/login" id="login">
                         Login
                      </Link>
                    )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          LogOut
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
