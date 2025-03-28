import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormCheck,
} from "@coreui/react";

const RolePermissionModal = ({ visible, onClose, roleName }) => {
  const [menus, setMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedSubmenus, setSelectedSubmenus] = useState([]);

  useEffect(() => {
    if (roleName) {
      fetchRolePermissions();
    }
  }, [roleName]);

  const fetchRolePermissions = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // Fetch all menus
      let menuResponse = await fetch(`http://localhost:8000/api/get-menu/${userId}`);
      let menuData = await menuResponse.json();

      // Fetch role-based menus/submenus
      let roleResponse = await fetch(`http://localhost:8000/api/get-sidebar/${roleName}`);
      let roleData = await roleResponse.json();

      let roleBasedMenuNames = roleData.map((menu) => menu.name);
      let roleBasedSubmenuNames = [];
      roleData.forEach((menu) =>
        menu.submenus.forEach((submenu) => roleBasedSubmenuNames.push(submenu.name))
      );

      setMenus(menuData.menus);
      setSelectedMenus(roleBasedMenuNames);
      setSelectedSubmenus(roleBasedSubmenuNames);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    }
  };

  const handleMenuChange = (menuName) => {
    setSelectedMenus((prev) =>
      prev.includes(menuName) ? prev.filter((name) => name !== menuName) : [...prev, menuName]
    );
  };

  const handleSubmenuChange = (submenuName) => {
    setSelectedSubmenus((prev) =>
      prev.includes(submenuName) ? prev.filter((name) => name !== submenuName) : [...prev, submenuName]
    );
  };

  const updatePermissions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      let responseData = await fetch(`http://localhost:8000/api/get-menu/${userId}`);
      let data = await responseData.json();

      let selectedMenuObjects = data.menus.filter((menu) => selectedMenus.includes(menu.name));
      let selectedMenuWithSubmenus = selectedMenuObjects.map((menu) => ({
        ...menu,
        submenus: menu.submenus.filter((submenu) => selectedSubmenus.includes(submenu.name)),
      }));

      let response = await fetch(`http://localhost:8000/api/update-permissions/${roleName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus: selectedMenuWithSubmenus }),
      });

      let result = await response.json();
      alert(result.message);
      onClose();
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Update Permissions for {roleName}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>Menus</h5>
        {menus.map((menu) => (
          <div key={menu.name}>
            <CFormCheck
              label={menu.name}
              checked={selectedMenus.includes(menu.name)}
              onChange={() => handleMenuChange(menu.name)}
            />
            <div style={{ paddingLeft: "20px" }}>
              {menu.submenus.map((submenu) => (
                <CFormCheck
                  key={submenu.name}
                  label={`${submenu.name} (${menu.name})`}
                  checked={selectedSubmenus.includes(submenu.name)}
                  onChange={() => handleSubmenuChange(submenu.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        <CButton color="primary" onClick={updatePermissions}>
          Save Changes
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default RolePermissionModal;
