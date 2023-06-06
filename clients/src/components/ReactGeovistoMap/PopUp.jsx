import { Button, Modal } from 'antd';
import { useState } from 'react';
import { onAddFiles } from "../../api/auth";
const PopUp = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Save
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={async () => {
            try {
              await onAddFiles({file_id: 41, filename: fileName,content: props.content, user_id: 10  })
            } catch (error) {
              console.log(error)
            }
            setIsModalOpen(false);
          }} onCancel={handleCancel}>
        <input type="text" value={fileName} onChange = {({target})=>setFileName(target.value)}></input>
      </Modal>
    </>
  );
        }
export default PopUp;