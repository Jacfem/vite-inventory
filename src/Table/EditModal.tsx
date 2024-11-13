import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button, TextInput, Modal } from "@mantine/core";

import { putProduct } from "../../api/products";
import { Product } from "../../api/types";

interface EditModalProps {
  open: boolean;
  item: Product;
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
    <Modal
      opened={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      title="Edit product"
    >
      <TextInput
        label="Product name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button.Group mt="md">
        <Button onClick={onClose} variant="text" mr="md">
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
      </Button.Group>
    </Modal>
  );
};
