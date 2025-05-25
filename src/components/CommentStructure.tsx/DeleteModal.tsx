import { useState, useContext } from 'react';
import { Modal, Button } from 'antd';
import { GlobalContext } from '../../context/Provider';
import React from 'react';

interface DeleteModalProps {
  comId: string;
  parentId?: string;
}

const DeleteModal = ({ comId, parentId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const globalStore: any = useContext(GlobalContext);

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  const handleDelete = async () => {
    await globalStore.onDelete(comId, parentId);
    if (globalStore.onDeleteAction) {
      await globalStore.onDeleteAction({
        comIdToDelete: comId,
        parentOfDeleteId: parentId
      });
    }
    setOpen(false);
  };

  return (
    <div>
      <div style={{ width: '100%', cursor: 'pointer' }} onClick={showModal}>
        Delete
      </div>
      <Modal
        title="Are you sure?"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>
        ]}
        centered
      >
        <p>Once you delete this comment it will be gone forever.</p>
      </Modal>
    </div>
  );
};

export default DeleteModal;