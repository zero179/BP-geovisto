import {useState} from 'react'
import {Button, Table, Modal, Input, Space} from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import "./userListElements.css"

const UserListTable = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [dataSource, setDataSource] = useState([
    {
        id:1,
        username:"Jan",
        email:"jan.novak@gmail.com",
        password:"asd"
    },
    {
        id:2,
        username:"Peter",
        email:"peter.novak@gmail.com",
        password:"asd"
    },
    {
        id:3,
        username:"Marek",
        email:"marek.novak@gmail.com",
        password:"asd"
    },
    ])
    const columns=[
        {
            key:"1",
            title:"ID",
            dataIndex:"id"
        },
        {
            key:"2",
            title:"Username",
            dataIndex:"username"
        },
        {
            key:"3",
            title:"E-mail",
            dataIndex:"email"
        },
        {
            key:"4",
            title:"Password",
            dataIndex:"password"
        },
        {
            key:"5",
            title:"actions",
            render: (record) =>{
                return(
                    <>
                        <EditOutlined onClick={()=>{
                            onEditUser(record)
                        }}/>
                        <DeleteOutlined onClick={()=>{
                            onDeleteUser(record)
                        }} style={{marginleft:12}}/>
                    </>
                )
            }
        }
    ]
    const onAddUser=()=>{
        const randomNumber = parseInt(Math.random()*1000)
        const newUser = {
            id:randomNumber,
            username:"Marek" + randomNumber,
            email:randomNumber+"novak@gmail.com",
            password:"asd"+randomNumber
        }
        setDataSource(pre=>{
            return [...pre, newUser]
        })
    }
    const onDeleteUser=(record)=>{
        Modal.confirm({
            title:"Are you sure , you want to delete this user?",
            okText: "Yes",
            okType:"danger",
            onOk:()=>{
                setDataSource((pre)=>{
                    return pre.filter(user => user.id !==record.id);
                })
            }
        })
    }
    const onEditUser=(record)=>{
        setIsEditing(true);
        setEditingUser({...record});
    }
    const resetEditing=()=>{
        setIsEditing(false);
        setEditingUser(null);
    }
  return (
    <div className="tableuser">
        <header className="headeruserlist">
            <div className="buttons">
                <Button onClick={onAddUser}>Add a new user</Button>
            </div>
        <div className="tables">
        <Table columns={columns}
            dataSource={dataSource}
            size="large"
            >

        </Table>
        </div>
        <Modal
            title="Edit User"
            visible={isEditing}
            okText="Save"
            onCancel={()=>{resetEditing()}}
            onOk={()=>{
                setDataSource(pre=>{
                    return pre.map(user=>{
                        
                        if(user.id === editingUser.id){
                            return editingUser
                        }
                        else{
                            return user
                        }
                    })
                });
            resetEditing()
            }}
        >
            <Input value={editingUser?.username} onChange={(e)=>{
                setEditingUser(pre=>{
                    return{...pre,username:e.target.value}
                })
            }}/>
            <Input value={editingUser?.email} onChange={(e)=>{
                setEditingUser(pre=>{
                    return{...pre,email:e.target.value}
                })
            }}/>
            <Input value={editingUser?.password}onChange={(e)=>{
                setEditingUser(pre=>{
                    return{...pre,password:e.target.value}
                })
            }}/>
        </Modal>
        </header>
    </div>
  )
}

export default UserListTable