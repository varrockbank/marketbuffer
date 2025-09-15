import React, { useState } from 'react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { Sidebar } from './components/Sidebar';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const menuItems = [
    { id: 1, label: 'Dashboard' },
    { id: 2, label: 'Projects' },
    { id: 3, label: 'Settings' }
  ];

  return (
    <div className="app">
      <Sidebar items={menuItems} onSelect={setSelected} />
      <main>
        <h1>Welcome to Marketbuffer</h1>
        <Button onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Hello World"
        >
          <p>This is a sample modal content.</p>
        </Modal>
      </main>
    </div>
  );
}

export default App;
