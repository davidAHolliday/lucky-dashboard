import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions, Table, TableRow, TextField } from '@mui/material';
import { formatDate } from '../../utils/helperFunctions';

export const TaskModal = ({data =[], displayNewTaskModal, setDisplayNewTaskModal,handleAddNotes, noteData, handleNewNoteInputChange}) =>{

    

    return(
        <>
        
        <Dialog open={displayNewTaskModal.taskInfo} onClose={() => setDisplayNewTaskModal({taskInfo:false})}>
        <DialogTitle style={{backgroundColor:"lightblue"}}>Task Details</DialogTitle>
        <DialogContent>
            <div style ={{height:"500px", width:"700px"}}>
                <h2>{data.taskName}</h2>
                <p><span style={{fontWeight:500, marginRight:"5px"}}>Description:</span>{data.taskDescription}</p>
                <p> <span style={{fontWeight:500, marginRight:"5px"}}>Assigned To:</span> {data.assignedTo || "unknown"} on {formatDate(data.timeCreated)}</p>
                <p> Due on: {formatDate(data.dueDate) || "No Due Date"} </p>

              {data.notes && data.notes.length > 0 ? (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <h4 style={{ marginBottom: '10px' }}>Notes:</h4>
        {data.notes.map((note, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', borderRadius: '5px', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                    {formatDate(note.timeCreated)}
                </p>
                <p style={{ fontSize: '14px', color: '#555' }}>
                    {note.noteText}
                </p>
            </div>
        ))}
    </div>
) : (
    <p>No notes available.</p>
)}

                Add New Note:
                <TextField
    autoFocus
    margin="dense"
    id="notes"
    name="notes"
    label="Notes"
    type="text"
    fullWidth
    value={noteData.noteText}
    onChange={handleNewNoteInputChange}  // Ensure this is correctly set
/>

            </div>
            
          

      
        
        </DialogContent>
        <DialogActions>
                    <Button onClick={() => setDisplayNewTaskModal({taskInfo:false})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleAddNotes()} color="primary">
                       Add Notes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}