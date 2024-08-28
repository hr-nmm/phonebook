const Notification = ({ notificationMessage }) => {
  if (notificationMessage === null) return null;
  const notificationStyle = {
    color: "green",
    fontWeight: "bold",
    fontSize: "15px",
    border: "5px solid red",
  };
  return <p style={notificationStyle}>{notificationMessage}</p>;
};
export default Notification;
