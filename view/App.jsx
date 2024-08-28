// Imports
import { useState, useEffect } from "react";
import Filter from "./components/filter";
import PersonForm from "./components/personForm";
import Persons from "./components/persons";
import Notification from "./components/notification";
import personService from "./services/persons";

const App = () => {
  // States
  const [persons, setPersons] = useState([]); // for controlling form submission
  const [newName, setNewName] = useState(""); // for controlling the form input of name
  const [newNumber, setNewNumber] = useState(NaN); // for controlling the form input of number
  const [personsToShow, setPersonsToShow] = useState([]); // for controlling state of what to render
  const [notificationMessage, setNotificationMessage] = useState(null); // for controlling state of notification message

  // fetching personsDB from server using hook useEffect
  useEffect(() => {
    console.log(`effect`);
    personService.getAll().then((response) => {
      console.log("promise fulfilled", response);
      setPersons(response);
      setPersonsToShow(response);
    });
  }, []);
  console.log("render", persons.length, "notes");

  return (
    <div>
      <h2>PhoneBook</h2>
      <Notification notificationMessage={notificationMessage} />
      <Filter persons={persons} setPersonsToShow={setPersonsToShow}></Filter>
      <h2>Add a new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setPersonsToShow={setPersonsToShow}
        setNotificationMessage={setNotificationMessage}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        setPersonsToShow={setPersonsToShow}
        setPersons={setPersons}
      />
    </div>
  );
};

export default App;
