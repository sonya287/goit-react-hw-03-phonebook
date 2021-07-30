import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Form from './components/Form';
import ContactsList from './components/ContactsList';
import Filter from './components/Filter';
import contactsArr from './contactsArr';

import styles from './App.module.scss';

class App extends React.Component {
  state = {
    contacts: contactsArr,
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextContactsList = this.state.contacts;
    const prevContactsList = prevState.contacts;
    if (nextContactsList !== prevContactsList) {
      localStorage.setItem('contacts', JSON.stringify(nextContactsList));
    }
  }

  findContactName = contactName => {
    const { contacts } = this.state;
    return contacts.find(({ name }) => name === contactName);
  };

  addContact = ({ name, number }) => {
    if (this.findContactName(name)) {
      alert(`${name} is already in contacts`);
      return;
    }
    this.setState(({ contacts }) => {
      return {
        contacts: [
          {
            name,
            number,
            id: uuidv4(),
          },
          ...contacts,
        ],
      };
    });
  };

  getFilterValue = e => {
    this.setState({ filter: e.currentTarget.value });
  };
  filterContactsValue = () => {
    const { filter, contacts } = this.state;
    const normalizeFilter = filter.toLowerCase();
    return contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizeFilter);
    });
  };

  deleteContact = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const { filter } = this.state;
    return (
      <section className={styles.container}>
        <h1 className={styles.title}>Phonebook</h1>
        <Form addContact={this.addContact} />
        <div className={styles.contacts_container}>
          <h2 className={styles.contact_title}>Contacts</h2>
          <Filter filter={filter} onChange={this.getFilterValue} />
          <ContactsList
            contacts={this.filterContactsValue()}
            deleteContact={this.deleteContact}
          />
        </div>
      </section>
    );
  }
}

export default App;
