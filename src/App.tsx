import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { postProduct } from "../api/products";

import BasicTable from "./Table/Table";

import "./App.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const handleOpen = () => setFormOpen(true);
  const handleClose = () => setFormOpen(false);
  const [inputValue, setInputValue] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/">
          All Products
        </Link>
      </Breadcrumbs>
      <Typography variant="h3">Inventory App</Typography>

      <Stack spacing={2} direction="row">
        <Button onClick={handleOpen} variant="text">
          Add a product
        </Button>
      </Stack>
      <BasicTable />
      <Modal
        open={formOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Add a product
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="name"
                variant="outlined"
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Box>
            <Button onClick={handleClose} variant="text">
              Close
            </Button>
            <Button
              onClick={() => {
                mutation.mutate(inputValue);
                handleClose();
              }}
              variant="text"
            >
              Submit
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
