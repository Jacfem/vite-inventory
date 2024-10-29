import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { modalStyle } from "../App";
import { putProduct } from "../../api/products";

interface EditModalProps {
  open: boolean;
  item: any; // fill in model for type
  onClose: () => void;
}

export const EditModal = ({ open, item, onClose }: EditModalProps) => {
  const { id, name } = item;
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState(name);

  const putMutation = useMutation({
    mutationFn: putProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return (
    open && (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Edit product
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="name"
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Box>
            <Button onClick={onClose} variant="text">
              Close
            </Button>
            <Button
              onClick={() => {
                putMutation.mutate({ id, name: inputValue });
                onClose();
              }}
              variant="text"
            >
              Submit
            </Button>
          </Typography>
        </Box>
      </Modal>
    )
  );
};
