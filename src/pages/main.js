import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Button, CardActionArea, CardContent } from "@mui/material";
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { TaskModal } from "./components/taskModal";
import { baseUrl } from "../utils/helperFunctions";

function Dashboard() {
    const [data, setData] = useState([]);
    const [updateMessage, setUpdateMessage] = useState('');
    const [selectedTask, setSelectedTask] = useState([]);
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('success');
    const [displayModal, setDisplayModal] = useState({newTask:false, taskInfo:false})
    // const [displayNewTaskModal,setDisplayNewTaskModal] = useState(false)
    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        taskDescription: '',
        tags: [],
        notes: [],
        status: 'open',
        dueDate: '',
        assignedTo:"",
    });
const [noteData,setNoteData] = useState("");


    function formatDate(inputDate) {
        // Create a new Date object from the input string
        const date = new Date(inputDate);
    
        // Extract day, month, and year components from the Date object
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if the day is a single digit
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const year = date.getFullYear();
    
        // Format the components into dd/mm/yyyy format
        const formattedDate = `${day}/${month}/${year}`;
    
        return formattedDate;
    }
    

    const handleNewTaskInputChange = (event) => {
        const { name, value } = event.target;
        setNewTaskData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddNewTask = () => {
        // Call your API to add a new task with newTaskData
        handleNewTask(newTaskData);
        setDisplayModal({newTask:false}); // Close the modal after adding the task
    };

    const handleToast = (message, severity) => {
        setToastMessage(message);
        setToastSeverity(severity);
        setOpenToast(true);
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };





const handleNewTask = () =>{
    const tagsArray = newTaskData.tags.split(',').map(tag => tag.trim());

    const payload = {
        ...newTaskData,
        tags: tagsArray,
        notes: []
    };

    const url = `${baseUrl}/task/v1/`;
    axios.post(url, payload)
        .then(response => {
            setUpdateMessage(`New Task has been added`);
            handleToast(`New Task has been added`, 'success');
            setSelectedTask({ taskId: '', value: '' });
        })
        .catch(error => {
            console.error("Error Fetching Data:", error);
            handleToast('Failed to update task status', 'error');
        });

   }


   const handleAddNotes = () =>{
    const payload = noteData
    
    const url = `${baseUrl}/task/v1/notes/${selectedTask.taskId}/`;
    axios.put(url, payload)
        .then(response => {
            setUpdateMessage(`note has been added`);
            handleToast(`note has been added`, 'success');
           // Update the local state to reflect the new note
           const updatedTasks = data.map(task => {
            if (task.taskId === selectedTask.taskId) {
                return {
                    ...task,
                    notes: [...task.notes, { noteText: noteData, timeCreated: new Date().toISOString() }] // Assuming you want to store the timestamp as well
                };
            }
            return task;
        });

        setData(updatedTasks); // Update the state with the updated tasks
        })
        .catch(error => {
            console.error("Error Fetching Data:", error);
            handleToast('Failed to add note', 'error');
        });
};


const handleNewNoteInputChange = (event) => {
    const { value } = event.target;
    setNoteData(value);


};
    const changeStatus = (status,taskId) => {
        const url = `${baseUrl}/task/v1/task/${taskId}/${status}`;
        axios.put(url, [])
            .then(response => {
                setUpdateMessage(`${taskId} has been changed to ${status}`);
                handleToast(`${taskId} has been changed to ${status}`, 'success');
                setSelectedTask({ taskId: '', value: '' });
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
                handleToast('Failed to update task status', 'error');
            });
    };



    const url = `${baseUrl}/task/v1/`;
    useEffect(() => {
        axios.get(url)
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
            });
    }, [updateMessage]);

    return (
        <div className="App">
              {/*  Modal */}

       <TaskModal data={selectedTask} displayNewTaskModal={displayModal} setDisplayNewTaskModal={setDisplayModal} handleAddNotes={handleAddNotes} noteData={noteData}  handleNewNoteInputChange={handleNewNoteInputChange} />

              <Dialog open={displayModal.newTask} onClose={() => setDisplayModal({newTask:false,taskInfo:false})}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>


   

                    <TextField
                        autoFocus
                        margin="dense"
                        id="taskName"
                        name="taskName"
                        label="Task Name"
                        type="text"
                        fullWidth
                        value={newTaskData.taskName}
                        onChange={handleNewTaskInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="taskDescription"
                        name="taskDescription"
                        label="Task Description"
                        type="text"
                        fullWidth
                        value={newTaskData.taskDescription}
                        onChange={handleNewTaskInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="tags"
                        name="tags"
                        label="Tags"
                        type="text"
                        fullWidth
                        value={newTaskData.tags}
                        onChange={handleNewTaskInputChange}
                    />
                
                    <TextField
                        margin="dense"
                        id="status"
                        name="status"
                        label="Status"
                        type="text"
                        fullWidth
                        value={newTaskData.status}
                        onChange={handleNewTaskInputChange}
                    />
                      <TextField
                        margin="dense"
                        id="assignedTo"
                        name="assignedTo"
                        label="Assign To"
                        type="text"
                        fullWidth
                        value={newTaskData.assignedTo}
                        onChange={handleNewTaskInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="dueDate"
                        name="dueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={newTaskData.dueDate}
                        onChange={handleNewTaskInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisplayModal({newTask:false})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewTask} color="primary">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>

            <header className="App-header">
                Dashboard
            </header>
            <div onClick={()=>setDisplayModal({newTask:true})} class="add-button">
    <span class="plus-sign">+</span>
    <span class="button-text">Add</span>
  </div>
            <Box display="flex" flexDirection={"column"} justifyContent="center" alignItems="center" p={5}>
                {data.map(task => (
                    <Card onClick={()=>{
                        setDisplayModal({taskInfo:true})
                        setSelectedTask(task)
                    }}
                    key={task.taskId} sx={{ display: "flex", width: "100%", margin: 1 }}>
                        <CardContent><div style={{display:"flex", flexDirection:"column"}}>
                            <div>
                            {formatDate(task.timeCreated)} 
                            </div >
                            <Typography 
                             style={{
                                display: 'inline-block',
                                backgroundColor: 'green',
                                color: '#ffffff',
                                padding: '5px 10px',
                                borderRadius: '16px',
                                marginRight: '10px',
                                marginBottom: '10px',
                                fontSize: '14px',
                            }}
                            variant="p">
                            {task.assignedTo}
                            </Typography>
                            
                            </div>  </CardContent>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {task.taskName}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            {task.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#007bff',
                                        color: '#ffffff',
                                        padding: '5px 10px',
                                        borderRadius: '16px',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {tag}
                                </div>
                            ))}
                        </CardContent>
                        <CardContent>
                            {task.status === "open" && (
                                <div onClick={() => {
                                    setSelectedTask({ taskId: task.taskId, value: "" });
                                    changeStatus("close",task.taskId);
                                }}>
                                    <CheckBoxOutlineBlankIcon />
                                </div>
                            )}
                            {task.status === "close" && (
                                <div onClick={() => {
                                    setSelectedTask({ taskId: task.taskId, value: "" });
                                    changeStatus("open",task.taskId);
                                }}>
                                    <CheckBoxIcon />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                <Snackbar
                    open={openToast}
                    autoHideDuration={6000}
                    onClose={handleCloseToast}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseToast}
                        severity={toastSeverity}
                    >
                        {toastMessage}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </div>
    );
}

export default Dashboard;