import { useState } from 'react';
import { Plus, Edit, Trash2, Heart, Settings } from 'lucide-react';
import { Button, Input, Select, Modal } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { useToastContext } from '../context/ToastContext';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';

const ComponentDemo = () => {
  const { success, error, warning, info } = useToastContext();
  const demoModal = useModal();
  const expenseModal = useModal();
  const deleteModal = useModal();
  
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [inputError, setInputError] = useState('');

  const options = [
    { value: 'option1', label: 'Opzione 1' },
    { value: 'option2', label: 'Opzione 2' },
    { value: 'option3', label: 'Opzione 3' }
  ];

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    success('Form inviato con successo!');
  };

  const handleToastTest = (type: string) => {
    switch (type) {
      case 'success':
        success('Operazione completata con successo!');
        break;
      case 'error':
        error('Si è verificato un errore durante l\'operazione.');
        break;
      case 'warning':
        warning('Attenzione: questa azione richiede conferma.');
        break;
      case 'info':
        info('Informazione: nuova funzionalità disponibile.');
        break;
    }
  };

  const validateInput = (value: string) => {
    if (value.length < 3) {
      setInputError('Minimo 3 caratteri richiesti');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
          Component Demo Page
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Test page per verificare il funzionamento di tutti i componenti UI creati.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          Buttons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Variants */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Variants
            </h3>
            <div className="space-y-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Sizes
            </h3>
            <div className="space-y-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              With Icons
            </h3>
            <div className="space-y-2">
              <Button icon={Plus}>Add New</Button>
              <Button icon={Edit} variant="outline">Edit</Button>
              <Button icon={Trash2} variant="danger">Delete</Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              States
            </h3>
            <div className="space-y-2">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button icon={Heart} loading>Loading with Icon</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          Form Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Input Base"
              placeholder="Inserisci del testo..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                validateInput(e.target.value);
              }}
              error={inputError}
              helperText="Testo di aiuto sotto l'input"
            />

            <Input
              label="Input con Icona"
              icon={Settings}
              placeholder="Input con icona..."
            />

            <Input
              label="Input Required"
              placeholder="Campo obbligatorio..."
              required
            />

            <Input
              label="Input con Errore"
              value="Valore non valido"
              error="Questo campo contiene un errore"
            />
          </div>

          <div className="space-y-4">
            <Select
              label="Select Base"
              options={options}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              placeholder="Scegli un'opzione..."
            />

            <Select
              label="Select Required"
              options={options}
              required
            />

            <Select
              label="Select con Errore"
              options={options}
              error="Selezione obbligatoria"
            />

            <Input
              label="Input Disabled"
              value="Campo disabilitato"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Toast Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          Toast Notifications
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="primary" 
            onClick={() => handleToastTest('success')}
          >
            Success Toast
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleToastTest('error')}
          >
            Error Toast
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleToastTest('warning')}
          >
            Warning Toast
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleToastTest('info')}
          >
            Info Toast
          </Button>
        </div>
      </section>

      {/* Modals Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          Modals
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => demoModal.openModal()}>
            Modal Semplice
          </Button>
          <Button onClick={() => expenseModal.openModal()}>
            Expense Modal
          </Button>
          <Button 
            variant="danger"
            onClick={() => deleteModal.openModal()}
          >
            Delete Confirmation
          </Button>
        </div>
      </section>

      {/* Form Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          Complete Form Example
        </h2>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft max-w-2xl">
          <ExpenseForm
            onSubmit={handleFormSubmit}
          />
        </div>
      </section>

      {/* Demo Modal */}
      <Modal
        isOpen={demoModal.isOpen}
        onClose={demoModal.closeModal}
        title="Modal di Esempio"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-primary-light dark:text-text-primary-dark">
            Questo è un modal di esempio per testare il funzionamento del componente Modal.
          </p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Puoi chiudere questo modal cliccando fuori, premendo Escape, o usando il pulsante di chiusura.
          </p>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={demoModal.closeModal}>
              Chiudi
            </Button>
            <Button onClick={() => {
              success('Azione confermata!');
              demoModal.closeModal();
            }}>
              Conferma
            </Button>
          </div>
        </div>
      </Modal>

      {/* Expense Modal */}
      <AddExpenseModal
        isOpen={expenseModal.isOpen}
        onClose={expenseModal.closeModal}
        onSuccess={(expense) => {
          console.log('Expense created:', expense);
          success('Spesa creata con successo!');
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={() => {
          setTimeout(() => {
            success('Elemento eliminato!');
            deleteModal.closeModal();
          }, 1000);
        }}
        itemName="Esempio di elemento"
        itemType="elemento"
      />
    </div>
  );
};

export default ComponentDemo;