import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Modal, Button, TextInput, Space } from "@mantine/core";

import { postProduct } from "../../api/products";
import { findProductByUPC } from "../../api/upc";

// test upcs:
// bandaids:
// 381370044444
// medicine, not found:
// 359726734165
// lotion:
// 041167066218

// add from items:
// integrate with offers for where to buy, sort by cheapest
// add tags and search

interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
}

function ProductModal({ open, handleClose }: ProductModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [upcValue, setUPCValue] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | string | null>(
    null
  );
  const [item, setItem] = useState({
    name: inputValue || "",
    size: "",
    image: "",
    upc: "",
    expirationDate: "",
  });

  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const { data, isFetching, refetch } = findProductByUPC(upcValue);

  useEffect(() => {
    if (data?.items[0]?.title) {
      setInputValue(data.items[0].title);
      setItem({
        name: data.items[0].title || inputValue,
        size: data.items[0].size,
        image: data.items[0].images[0],
        upc: upcValue,
        expirationDate,
      });
    }
    // add cleanup on unmount - data exists so not resetting on modal close yet
    // return () => {
    //   setItem({ name: "", size: "", image: "", upc: "", expirationDate: null });
    // };
  }, [data]);

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      title="Add a product"
    >
      <div>
        <TextInput
          label="Product name"
          value={inputValue}
          required
          onChange={(e) => {
            setInputValue(e.target.value);
            setItem({ ...item, name: e.target.value });
          }}
        />
        <TextInput label="UPC" onChange={(e) => setUPCValue(e.target.value)} />
        <TextInput
          label="Expiration Date"
          placeholder="YYYY-MM-DD"
          onChange={(e) => {
            const stringToDate = new Date(e.target.value)
              .toISOString()
              .split("T")[0];
            setExpirationDate(stringToDate);
            setItem({ ...item, expirationDate: stringToDate });
          }}
        />
        <Space h="md" />
        <Button.Group>
          <Button onClick={handleClose} variant="text" mr="md">
            Close
          </Button>
          <Button
            mr="md"
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
            }}
            variant="text"
          >
            Submit
          </Button>
        </Button.Group>
        <img width={100} src={data?.items && data?.items[0]?.images[0]} />
      </div>
    </Modal>
  );
}

export default ProductModal;
