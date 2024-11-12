import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { postProduct } from "../../api/products";
import { findProductByUPC } from "../../api/upc";
import { modalStyle } from "../styles";

// test upcs:
// kitchen knife:
// 4002293401102
// medicine, not found:
// 359726734165
// lotion:
// 041167066218

// add from items:
// integrate with offers for where to buy, sort by cheapest

interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
}

function ProductModal({ open, handleClose }: ProductModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [upcValue, setUPCValue] = useState("");
  const [item, setItem] = useState({ name: "", size: "", image: "", upc: "" });

  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const { data, isFetching, refetch } = findProductByUPC(upcValue);

  // add cleanup on unmount
  useEffect(() => {
    if (data?.items[0]?.title) {
      setInputValue(data.items[0].title);
      setItem({
        name: data.items[0].title,
        size: data.items[0].size,
        image: data.items[0].images[0],
        upc: upcValue,
      });
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
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
              value={inputValue}
              required
              onChange={(e) => setInputValue(e.target.value)}
            />
            <TextField
              label="upc"
              variant="outlined"
              onChange={(e) => setUPCValue(e.target.value)}
            />
          </Box>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
          <Button
            onClick={() => {
              refetch();
            }}
            variant="text"
          >
            Lookup by upc
          </Button>
          <Button
            onClick={() => {
              postMutation.mutate(item);
              handleClose();
              setInputValue("");
              setItem({ name: "", size: "", image: "", upc: "" });
            }}
            variant="text"
          >
            Submit
          </Button>
          <div>
            {isFetching && !data?.items
              ? "fetching..."
              : `UPC item: ${data?.items && data?.items[0]?.title}: ${
                  data?.items && data?.items[0]?.size
                }`}
          </div>
          <img width={100} src={data?.items && data?.items[0]?.images[0]} />
        </Typography>
      </Box>
    </Modal>
  );
}

export default ProductModal;
