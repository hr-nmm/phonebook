import personService from "../services/persons";

const Persons = ({ personsToShow, setPersonsToShow, setPersons }) => {
  return (
    <>
      <ul>
        {personsToShow.map((person) => (
          <li key={person.id}>
            {" "}
            {person.name} : {person.phoneNumber}{" "}
            <button
              style={{ color: "red" }}
              onClick={() => {
                confirm(`are you sure you want to delete this number?`)
                  ? personService.remove(person.id).then((response) => {
                      console.log(response);
                      const newPersonList = personsToShow.filter(
                        (person) => !person.id.includes(response.data.id)
                      );
                      setPersonsToShow(newPersonList);
                      setPersons(newPersonList);
                    })
                  : alert("you saved it");
              }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
export default Persons;
