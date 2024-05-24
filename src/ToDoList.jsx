import { useEffect, useState } from "react";
import './custom-style.css';

// ---------------------------------------------------
//               MAIN REACT COMPONENT
// ---------------------------------------------------
function HomeworkPlanner({ userId, setPageTab }) {
    const [homeworkList, setHomeworkList] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch("http://localhost:3434/user/items/" + userId, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status) {
                    setHomeworkList(result.data.items);
                } else {
                    alert(result.msg);
                }
            })
            .catch((error) => console.error(error));
    }, [userId]);

    function handleSaveBtn() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "_id": userId,
            "items": homeworkList
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3434/user/items", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                alert(result.msg);
            })
            .catch((error) => console.error(error));
    }

    function handleAddBtn() {
        if (inputValue !== "") {
            setHomeworkList([...homeworkList, inputValue]);
            setInputValue("");
        }
    }

    function handleDeleteItems(deleteIdx) {
        let updatedList = homeworkList.filter((_, index) => index !== deleteIdx);
        setHomeworkList(updatedList);
    }

    function handleEditItems(editIdx) {
        let updatedContent = prompt("Enter the updated homework task");
        if (updatedContent !== "") {
            homeworkList[editIdx] = updatedContent;
            setHomeworkList([...homeworkList]);
        }
    }

    return (
        <div className="homework-planner">
            <button onClick={() => setPageTab("welcome")}>log-out</button>
            <br />
            <button onClick={handleSaveBtn}>save</button>
            <br />
            <label>Homework tasks:</label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button onClick={handleAddBtn}>add</button>
            <ol>
                {
                    homeworkList.map((task, index) => (
                        <div className="task-item" key={index}>
                            <div className="flex">
                                <div>
                                    <div className="content">{task}</div>
                                </div>
                                <div style={{ minWidth: '150px' }}>
                                    <button onClick={() => handleEditItems(index)}>Edit</button>
                                    <button onClick={() => handleDeleteItems(index)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </ol>
        </div>
    );
}

export default HomeworkPlanner;