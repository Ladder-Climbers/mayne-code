import { Box, List, ListItem, ListItemText, ListSubheader, Typography } from '@material-ui/core';
import React from 'react';

export default function ShowList(props) {
  const { list, subHeader } = props;
  const maxHeight = props.maxHeight || 320;
  return <Box>
    <List style={{ maxHeight: maxHeight, overflow: 'auto', }}
    // subheader={<Typography variant="body1">LIst</Typography>}
    >
      {subHeader && <ListSubheader>{subHeader}</ListSubheader>}
      {list.map((item, key) => <ListItem button key={key}>
        <ListItemText>
          {item.text}
        </ListItemText>
      </ListItem>)}
    </List>
  </Box>
};