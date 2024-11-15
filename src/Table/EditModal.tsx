import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Modal, Button, TextInput, Space } from "@mantine/core";

import { putProduct } from "../../api/products";
import { Product } from "../../api/types";

interface EditModalProps {
  open: boolean;
  product: Product;
  handleClose: () => void;
}

export const EditModal = ({ open, product, handleClose }: EditModalProps) => {
  const { name, expirationDate } = product;
  const queryClient = useQueryClient();
  const [nameValue, setNameValue] = useState(name);
  const [expirationInputValue, setExpirationInputValue] = useState<
    Date | string | undefined
  >(expirationDate);

  const putMutation = useMutation({
    mutationFn: putProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return (
    <Modal
      opened={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      title="Edit product"
    >
      <div>
        <TextInput
          label="Product name"
          value={nameValue}
          required
          onChange={(e) => {
            setNameValue(e.target.value);
          }}
        />
        <TextInput
          label="Expiration Date"
          placeholder="YYYY-MM-DD"
          value={expirationInputValue}
          onChange={(e) => {
            setExpirationInputValue(e.target.value);
          }}
        />
        <Space h="md" />
        <Button.Group>
          <Button onClick={handleClose} variant="text" mr="md">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const expDate = new Date(expirationInputValue!)
                .toISOString()
                .split("T")[0];

              putMutation.mutate({
                ...product,
                name: nameValue,
                expirationDate: expDate,
              });
              handleClose();
            }}
            variant="text"
          >
            Update
          </Button>
        </Button.Group>
      </div>
    </Modal>
  );
};
