
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilPuzzle } from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

// let _nav = []; // Define _nav globally

// Function to fetch and return menu data
export  const getMenuItems = async () => {
  try {
    console.log("Fetching menu data...");
    const role = localStorage.getItem("loggedInUserRole").toLowerCase(); 
    console.log(role)// Change role dynamically if needed
    const response = await axios.get(`http://localhost:8000/api/get-sidebar/${role}`);
    
    console.log("Fetched Menu Data:", response.data);
    const _nav = generateNavItems(response.data); // Assign menu data to _nav

    return _nav; // Return the updated menu
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return [];
  }
};

const generateNavItems = (menudata) => {
  return menudata.map((menu) => {
    if (menu.submenus && menu.submenus.length > 0) {
      return {
        component: CNavGroup,
        name: menu.name,
        to: menu.link,
        icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
        items: menu.submenus.map((submenu) => ({
          component: CNavItem,
          name: submenu.name,
          to: submenu.link,
        })),
      };
    } else {
      return {
        component: CNavItem,
        name: menu.name,
        to: menu.link, // Use 'menu.link' instead of 'menu.to'
        icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
      };
    }
  });
};

// console.log(_nav)
// export default _nav; // _nav will be empty on first load but updates later




// import React,{useState} from 'react';
// import axios from 'axios';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBell,
//   cilCalculator,
//   cilChartPie,
//   cilCursor,
//   cilDescription,
//   cilDrop,
//   cilExternalLink,
//   cilNotes,
//   cilPencil,
//   cilPuzzle,
//   cilSpeedometer,
//   cilStar,
// } from '@coreui/icons'
// import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'



//  const generateNavItems = (menudata) => {


//   return menudata.map((menu) => {
//     if (menu.submenus && menu.submenus.length > 0) {
//       return {
//         component: CNavGroup,
//         name: menu.name,
//         to: menu.to,
//         icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
//         items: menu.submenus.map((submenu) => ({
//           component: CNavItem,
//           name: submenu.name,
//           to: submenu.to,
//         })),
//       }
//     } else {
//       return {
//         component: CNavItem,
//         name: menu.name,
//         to: menu.to,
//         icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
//       }
//     }
//   })
// }



// const menuData = [
//   {
//     "_id": "1",
//     "name": "Dashboard",
//     "to": "/dashboard",
//     "icon": "cilSpeedometer",
//     "submenus": []
//   },
//   {
//     "_id": "2",
//     "name": "Base",
//     "to": "/base",
//     "icon": "cilPuzzle",
//     "submenus": [
//       {
//         "_id": "2-1",
//         "name": "Accordion",
//         "to": "/base/accordion"
//       },
//       {
//         "_id": "2-2",
//         "name": "Breadcrumb",
//         "to": "/base/breadcrumbs"
//       }
//     ]
//   }
// ]


// const _nav = generateNavItems(menuData)

// console.log(_nav)

// export default _nav;


//  const fetchMenu = async () => {
//   try {
//     const role = "admin";
//     const response = await axios.get(`http://localhost:8000/api/get-sidebar/${role}`);
//     // const formattedData = formatMenuData(response.data);
//     // setNavItems(formattedData);
//     const menudata = await response.data;
//     // setMenuDatas(menudata)
//     console.log(response.data)
//   } catch (error) {
//     console.error("Error fetching menu:", error);
//   }
// };

// fetchMenu();


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CIcon from '@coreui/icons-react';
// import {
//   cilPuzzle,
// } from '@coreui/icons';
// import { CNavGroup, CNavItem } from '@coreui/react';

// let _nav = []

// const fetchMenuData = async () => {
//   try {
//     const role = "admin";
//     const response = await axios.get(`http://localhost:8000/api/get-sidebar/${role}`); // Replace with your API URL
//     _nav = await generateNavItems(response.data);
//     console.log(_nav)
//   } catch (error) {
//     console.error('Error fetching menu data:', error);
//   }
// };

// const generateNavItems = (menudata) => {
//   return menudata.map((menu) => {
//     if (menu.submenus && menu.submenus.length > 0) {
//       return {
//         component: CNavGroup,
//         name: menu.name,
//         to: menu.link,
//         icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
//         items: menu.submenus.map((submenu) => ({
//           component: CNavItem,
//           name: submenu.name,
//           to: submenu.link,
//         })),
//       };
//     } else {
//       return {
//         component: CNavItem,
//         name: menu.name,
//         to: menu.to,
//         icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
//       };
//     }
//   });
// };

// fetchMenuData();
 
// console.log(_nav)
// // const NavComponent = () => {
// //   const [menuData, setMenuData] = useState([]);

// //   useEffect(() => {
// //     fetchMenuData(setMenuData);
// //   }, []);

// // const _nav = generateNavItems(menuData);
// //   return _nav; // Exporting navigation items
// // };
// // console.log(NavComponent)

// // export default NavComponent;
// export default _nav;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CIcon from "@coreui/icons-react";
// import { cilPuzzle } from "@coreui/icons";
// import { CNavGroup, CNavItem } from "@coreui/react";

// const NavComponent = () => {
//   const [navItems, setNavItems] = useState([]);

//   useEffect(() => {
//     console.log("useEffect is running..."); // Debugging
//     fetchMenuData();
//   }, []);

//   const fetchMenuData = async () => {
//     try {
//       console.log("Fetching data from API..."); // Debugging
//       const role = "admin";
//       const response = await axios.get(`http://localhost:8000/api/get-sidebar/${role}`);
//       console.log("Fetched Menu Data:", response.data); // Debugging
//       setNavItems(generateNavItems(response.data));
//     } catch (error) {
//       console.error("Error fetching menu data:", error);
//     }
//   };



//   return navItems;
// };


// const generateNavItems = (menudata) => {
//   return menudata.map((menu) => {
//     if (menu.submenus && menu.submenus.length > 0) {
//       return {
//         component: CNavGroup,
//         name: menu.name,
//         to: menu.link,
//         icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
//         items: menu.submenus.map((submenu) => ({
//           component: CNavItem,
//           name: submenu.name,
//           to: submenu.link,
//         })),
//       };
//     } else {
//       return {
//         component: CNavItem,
//         name: menu.name,
//         to: menu.link, // Use 'menu.link' instead of 'menu.to'
//         icon: <CIcon icon={menu.icon ? eval(menu.icon) : cilPuzzle} customClassName="nav-icon" />,
//       };
//     }
//   });
// };

// export default NavComponent;



