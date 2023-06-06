import {useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { Table, Modal, Input} from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, EyeOutlined } from '@ant-design/icons';
import './geoJsonElements.css'
const UserGeoJsonListTable = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [editingFile, setEditingFile] = useState(null)
    const [addUser, setAddUser] = useState({
        filename: '',
        file_id: null,
      })
    const [isAdding, setIsAdding] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [test, setTest] = useState([])
    const [emailString, setEmailString] = useState('');

    const handleAddUser = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/get-users/files/add-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailString }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            // User found, retrieve the user_id
            const user_id = data.user_id;
            console.log('User ID:', user_id);
            addUserFiles(user_id);
            // Perform further actions with the user_id
          } else {
            // User not found or error occurred
            console.log('User not found');
          }
    
          // Reset the emailString value
          setEmailString('');
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const addUserFiles = async (user_id) => {
        try {
          const response = await fetch('http://localhost:8000/api/get-users/files/add-user-file', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: user_id,
              file_id: addUser.file_id,
              role: 'read', // Set the role as "read"
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            console.log('User file added successfully');
            // Perform further actions if needed
          } else {
            console.log('Error occurred while adding user file');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const getFiles = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/get-users/files");
            const jsonData = await response.json();
            console.log(jsonData);
            console.log("tusom")
            setDataSource(jsonData.files);
            console.log(jsonData.files)
        } catch (err) {
            console.error(err.message);
        }
        };
        useEffect(() => {
        getFiles();
        }, []);
    
    const getFile = async(id)=> {
        try{
            const response = await fetch(`http://localhost:8000/api/get-users/files/${id}`);
            const jsonData = await response.json();
            console.log(jsonData,"ahahah")
            return jsonData.content;
        }catch (err) {
            console.error(err.message);
        }

    }
    const deleteFile = async (id) => {
        try {
            await fetch(`http://localhost:8000/api/get-users/files/${id}`, {
            method: "DELETE"
            });
        } catch (err) {
            console.error(err.message);
        }
        };
        const onDeleteFile = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this file?',
            okText: 'Yes',
            okType: 'danger',
            onOk: async () => {
            await deleteFile(record.file_id);
            setDataSource((prevDataSource) =>
                prevDataSource.filter((file) => file.file_id !== record.file_id)
            );
            },
        });
        };
        const navigate = useNavigate();

          const onEye = async (record) =>{
            try {
                const json = await getFile(record.file_id);
                console.log(json, "ashash");
                console.log(typeof json, "jsontyp");
            
                // Navigate to the '/user' route with the mojeData in the state
                navigate('/user', { state: { mojeData: json } });
              } catch (error) {
                console.error(error.message);
              }
            };
        const updateFile = async file => {
            console.log(file, "file")
            try {
              const body = file ;
              const response = await fetch(
                `http://localhost:8000/api/get-users/files/${file.file_id}`,
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
        const onEditFile=(record)=>{
            setIsEditing(true);
            setEditingFile({...record});
        }
        const resetEditing=()=>{
            setIsEditing(false);
            setEditingFile(null);
        }
        const onAddUser=(record)=>{
            setIsAdding(true);
            setAddUser({...record});
        }
        const resetAdd=()=>{
            setIsAdding(false);
            setAddUser(null);
        }
        


    const columns=[
        {
            key:"1",
            title:"ID",
            dataIndex:"file_id"
        },
        {
            key:"2",
            title:"Name",
            dataIndex:"filename"
        },
        {
            key:"5",
            title:"Actions",
            render: (record) =>{
                return(
                    <>
                        <EditOutlined onClick={()=>{
                            onEditFile(record) 
                        }}className="icon-hover"/>
                        <DeleteOutlined onClick={()=>{
                            onDeleteFile(record)
                        }} style={{marginleft:12}}className="icon-hover"/>
                        <UserAddOutlined onClick={() => {
                            onAddUser(record)}} className="icon-hover"/>
                        <Link to="#" onClick={() => onEye(record)}>
        <EyeOutlined className="icon-hover" />
      </Link>
                    </>
                )
            }
        }
    ]
    
  return (
    <div className="tablefiles">
        <header className="headerfileslist">
        <h1>Your GeoJSONS</h1>
        <div className="tables">
        <Table columns={columns}
            dataSource={dataSource}
            size="large"
            >

        </Table>
        </div>
        <Modal
            title="Enter the email of user"
            visible={isAdding}
            okText="Save"
            onCancel={()=>{resetAdd()}}
            
            onOk={handleAddUser}
                
                ><Input
                value={emailString}
                onChange={(e) => setEmailString(e.target.value)}

              />
            </Modal>
        <Modal
            title="Edit Name of File"
            visible={isEditing}
            okText="Save"
            onCancel={()=>{resetEditing()}}
            onOk={()=>{
                setDataSource(pre=>{
                    return pre.map(file=>{
                        
                        if(file.file_id === editingFile.file_id){
                            return editingFile
                        }
                        else{
                            return file
                        }
                    })
                });
                updateFile(editingFile);
                console.log(editingFile, "ahahah")
            resetEditing()
            }}
        >
            <Input value={editingFile?.filename} onChange={(e)=>{
                setEditingFile(pre=>{
                    return{...pre,filename:e.target.value}
                })
            }}/>
            </Modal>
        </header>
    </div>
  )
}

export default UserGeoJsonListTable