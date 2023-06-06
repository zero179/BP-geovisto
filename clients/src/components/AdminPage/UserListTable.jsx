import {useState, useEffect} from 'react'
import {Button, Table, Modal, Input} from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import "./userListElements.css"

const UserListTable = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [users, setUsers] = useState([])

    const deleteUser = async id => {
        try {
          const deleteUser = await fetch(`http://localhost:8000/api/get-users/${id}`, {
            method: "DELETE"
          });
        } catch (err) {
          console.error(err.message);
        }
      };

    const getUsers = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/get-users");
        const jsonData = await response.json();
        console.log(jsonData);
        console.log("tusom")
        setUsers(jsonData.users);
        console.log(jsonData.users)
    } catch (err) {
        console.error(err.message);
    }
    };
    
    useEffect(() => {
    getUsers();
    }, []);

    const onDeleteUser=(record)=>{
        Modal.confirm({
            title:"Are you sure , you want to delete this user?",
            okText: "Yes",
            okType:"danger",
            onOk: () => {
                setUsers(users.filter(user => user.user_id !== record.user_id))
                deleteUser(record.user_id);
            }
        })
    }

    const updateUser = async user => {
        console.log(user, "user")
        try {
          const body = user ;
          const response = await fetch(
            `http://localhost:8000/api/get-users/${user.user_id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            }
          );
    
          //window.location = "/";
        } catch (err) {
          console.error(err.message);
        }
      };

    const onEditUser=(record)=>{
        setIsEditing(true);
        setEditingUser({...record});
        
    }
    const resetEditing=()=>{
        setIsEditing(false);
        setEditingUser(null);
    }
    const onAddUser=()=>{
        const randomNumber = parseInt(Math.random()*1000)
        const newUser = {
            user_id:randomNumber,
            email:randomNumber+"novak@gmail.com",
            password:"asd"+randomNumber
        }
        setUsers(pre=>{
            return [...pre, newUser]
        })
    }
    const columns=[
        {
            key:"1",
            title:"ID",
            dataIndex:"user_id"
        },
        {
            key:"3",
            title:"E-mail",
            dataIndex:"email"
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
                        <UserAddOutlined onClick={() => {onEditUser(record)}}/>
                    </>
                )
            }
        }
    ]
    
    
  return (
    <div className="tableuser">
        <header className="headeruserlist">
            <div className="buttons">
                <Button onClick={onAddUser}>Add a new user</Button>
            </div>
        <div className="tables">
        <Table columns={columns}
            dataSource={users}
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
                setUsers(pre=>{
                    return pre.map(user=>{
                        
                        if(user.user_id === editingUser.user_id){
                            return editingUser;
                        }
                        else{
                            return user
                        }
                    })
                });
                updateUser(editingUser);
                console.log(editingUser, "ahahah")
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