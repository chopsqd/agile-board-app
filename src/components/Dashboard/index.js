import React, {useCallback, useState} from 'react';
import {observer} from "mobx-react-lite";
import useStore from "../../hooks/useStore";
import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Column from "./Column";
import NewTaskDialog from "./NewTaskDialog";

function getListStyle(isDraggingOver) {
    return {
        backgroundColor: isDraggingOver ? 'lightblue' : 'lightgray',
        padding: 8,
        minHeight: 500
    }
}

const Dashboard = () => {
    const {boards} = useStore()
    const [newTaskToSection, setNewTaskToSection] = useState(null)

    const onDragEnd = useCallback((event) => {
        const {source, destination, draggableId: taskId} = event

        boards.active.moveTask(taskId, source, destination)
    }, [boards])

    const closeDialog = useCallback(() => {
        setNewTaskToSection(null)
    }, [setNewTaskToSection])

    return (
        <Box p={2}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={3}>
                    {boards?.active?.sections.map(section => (
                        <Grid item key={section.id} xs>
                            <Paper>
                                <Box p={1} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Typography variant={"h5"}>{section?.title}</Typography>
                                    <Button variant={"outlined"} color={"primary"} onClick={() => setNewTaskToSection(section.id)}>Add</Button>
                                </Box>
                                <Droppable droppableId={section.id} key={section.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot.isDraggingOver)}
                                        >
                                            <Column section={section}/>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
            <NewTaskDialog open={!!newTaskToSection} handleClose={closeDialog} activeSection={newTaskToSection}/>
        </Box>
    );
};

export default observer(Dashboard);