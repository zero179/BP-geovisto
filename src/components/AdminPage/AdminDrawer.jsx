import React from 'react'
import {Menu} from "antd";
import { HomeOutlined, PoweroffOutlined, UnorderedListOutlined, UserOutlined ,QuestionCircleOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useNavigate, Routes, Route } from 'react-router-dom'
import UserListTable from "./UserListTable"

const AdminDrawer = () => {
    const navigate = useNavigate();
  return (
    <div style={{display:"flex", flexDirection:"row", height:"100vh"}}>
        <Menu
        onClick={({key})=>
        {
            if (key === "logout"){

            }
            else{
                navigate(key);
            }

        }}
            items={[
                {label: "Home" ,key:"/admin",icon:<HomeOutlined/>},
                {label: "Users List",key:"/admin/users", icon:<UnorderedListOutlined/>},
                {label: "GeoJSON List",key:"/admin/geojsons", icon:<SnippetsOutlined />},
                {label: "Profile",key:"/admin/profile",icon: <UserOutlined/>},
                {label: "Help",key:"/help",icon: <QuestionCircleOutlined />},
                {label: "Logout",icon:<PoweroffOutlined/>, danger:true},
            ]}
        ></Menu>
    </div>
  )
}

export default AdminDrawer