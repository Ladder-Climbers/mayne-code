import { Button, Container, Typography } from "@material-ui/core";

export default function Dashboard() {
  return (<Container>
    <Typography variant="body1">
      Dashboard here.
    </Typography>

    <Button variant="contained" color="secondary">Test Button</Button>
  </Container>);
};