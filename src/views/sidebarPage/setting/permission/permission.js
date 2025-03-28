import React, { useEffect, useState } from "react";
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from "@coreui/react";
import RolePermissionModal from "../permission/rolePermissionModal";

const permission = () => {
    const [roles, setRoles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
      fetchRoles();
    }, []);
  
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get-role");
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
  
    const openPermissionPopup = (roleName) => {
      setSelectedRole(roleName);
      setModalVisible(true);
    };

  return (
    <>
      <CTable striped hover bordered responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Role Name</CTableHeaderCell>
            <CTableHeaderCell>Update Menu</CTableHeaderCell>
            <CTableHeaderCell>Update Submenu</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {roles.map((role, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{role.roleName}</CTableDataCell>
              <CTableDataCell>
                <CButton color="primary" onClick={() => openPermissionPopup(role.roleName)}>
                  Update Menu
                </CButton>
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="success" onClick={() => openPermissionPopup(role.roleName)}>
                  Update Submenu
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Role Permission Modal */}
      {modalVisible && (
        <RolePermissionModal visible={modalVisible} onClose={() => setModalVisible(false)} roleName={selectedRole} />
      )}
    </>
  );
}

export default permission;
