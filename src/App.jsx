import "./App.css";
import ToDoList from "./ToDoList.jsx";
import ToDoPanel from "./ToDoPanel.jsx";

function App() {
  const annasToDoList = ["Call the landlord", "Book the dentist"];
  const konstantinaToDoList = ["Buy milk", "Book the dentist"];

  return (
    <>
      <ToDoList firstName={"Anna"} todos={annasToDoList} />
      <ToDoList firstName={"Konstantina"} todos={konstantinaToDoList} />

      <ToDoPanel firstName={"Lea"}>
        <ol>
          <li>Prepare Figma Tutorial</li>
          <li>Prepare Assignment</li>
        </ol>
      </ToDoPanel>
    </>
  );
}

export default App;
