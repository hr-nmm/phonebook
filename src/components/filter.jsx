const Filter = ({ persons, setPersonsToShow }) => {
  return (
    <div>
      filter shown with
      <input
        onChange={(event) => {
          setPersonsToShow(
            persons.filter((person) => person.name.includes(event.target.value))
          );
        }}
      />
    </div>
  );
};
export default Filter;
