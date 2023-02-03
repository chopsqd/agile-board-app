import React from 'react';
import {Avatar, Box} from "@mui/material";

const User = ({user}) => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            <Avatar src={user?.avatar} alt={user?.name}/>
            <span style={{padding: 5}}>{user?.name}</span>
        </Box>
    );
};

export default User;