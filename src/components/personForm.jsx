import personService from "../services/persons";

const checkDuplicates = (arr, name) => {
  let flag = false,
    personVal = "";
  arr.forEach((person) => {
    if (person.name === name) {
      flag = true;
      personVal = person.id;
    }
  });
  return { flag: flag, id: personVal };
};

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setPersonsToShow,
  setNotificationMessage,
}) => {
  return (
    <form
      onSubmit={(event) => {
        // prevent user from add names that already exist in the phonebook
        event.preventDefault();
        const newPersonID = checkDuplicates(persons, newName).id;
        !checkDuplicates(persons, newName).flag
          ? personService
              .create({
                name: newName,
                phoneNumber: newNumber,
              })
              .then((response) => {
                setPersons(persons.concat(response));
                console.log(persons);
                setPersonsToShow(persons.concat(response));
                setNotificationMessage(`Added ${response.name}'s entry`);
                setTimeout(() => {
                  setNotificationMessage(null);
                }, 5000);
              })
              .catch((error) => {
                console.log(`error catched : ${error}`);
              })
          : confirm(
              `${newName} is already added to the phonebook. replace the old number with a new one?`
            )
          ? personService
              .update(newPersonID, {
                name: newName,
                phoneNumber: newNumber,
              })
              .then((response) => {
                const newPersonList = persons.filter(
                  (person) => !person.id.includes(response.id)
                );
                setPersons(newPersonList.concat(response));
                setPersonsToShow(newPersonList.concat(response));
                setNotificationMessage(`Upadted ${response.name}'s entry`);
                setTimeout(() => {
                  setNotificationMessage(null);
                }, 5000);
              })
              .catch((error) => {
                console.log(`error catched : ${error}`);
                alert(`contact '${newName}' was already deleted from server`);
              })
          : alert(`No changes saved`);
        setNewName("");
        setNewNumber(NaN);
      }}
    >
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        number:{" "}
        <input
          value={newNumber || ""}
          onChange={(event) => {
            setNewNumber(event.target.value);
          }}
        />
      </div>
      <button type="submit">add</button>
    </form>
  );
};
export default PersonForm;
