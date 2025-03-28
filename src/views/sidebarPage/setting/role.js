import React, { useState, useEffect } from "react";
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput } from "@coreui/react";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-role");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Add new role
  const handleAddRole = async () => {
    if (!newRole.trim()) {
      alert("Role name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/add-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: newRole }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Role added successfully");
        fetchRoles();
        setVisible(false);
        setNewRole("");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/delete-role/${roleId}`, {
          method: "DELETE",
        });

        const result = await response.json();
        alert(result.message);
        fetchRoles();
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  return (
    <div className="p-4">
      {/* Add Role Button */}
      <div className="d-flex justify-content-end mb-3">
        <CButton color="info" onClick={() => setVisible(true)}>Add Role</CButton>
      </div>

      {/* Role Table */}
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Role Name</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {roles.length > 0 ? (
            roles.map((role, index) => (
              <CTableRow key={role._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{role.roleName}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger" size="sm" onClick={() => handleDeleteRole(role._id)}>
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="3" className="text-center">No roles found</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Add Role Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput label="Role Name" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddRole}>Add Role</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Role;
