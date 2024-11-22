import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Modal,
  Button,
  TextInput,
  Space,
  Pill,
  PillsInput,
} from "@mantine/core";

import { postProduct, putProduct } from "../../api/products";
import { findProductByUPC } from "../../api/upc";
import { Product } from "../../api/types";

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
  product?: Product; //when editing
}

function ProductModal({ open, handleClose, product }: ProductModalProps) {
  const [inputValue, setInputValue] = useState(product ? product.name : "");
  const [upcValue, setUPCValue] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | string | null>(
    product ? product.expirationDate : null
  );
  const [item, setItem] = useState({
    name: inputValue || "",
    size: "",
    image: "",
    upc: "",
    expirationDate: null,
  });

  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const putMutation = useMutation({
    mutationFn: putProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const { data, refetch } = findProductByUPC(upcValue);

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
  }, [data]);

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      title="Add a product" // or edit
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
        <TextInput
          value={product ? product.upc : ""}
          disabled={product?.upc ? true : false}
          label="UPC"
          onChange={(e) => setUPCValue(e.target.value)}
        />
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
        <PillsInput label="Tags">
          <Pill.Group>
            <Pill withRemoveButton>Low</Pill>
            <Pill withRemoveButton>Expiring soon</Pill>
            <Pill withRemoveButton>Favorite</Pill>
            <PillsInput.Field placeholder="Enter tags" />
          </Pill.Group>
        </PillsInput>
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
              product
                ? putMutation.mutate({
                    ...product,
                    ...item,
                  })
                : postMutation.mutate(item);
              handleClose();
              setInputValue("");
            }}
            variant="text"
          >
            {product ? "Update" : "Submit"}
          </Button>
        </Button.Group>
        <img width={100} src={data?.items && data?.items[0]?.images[0]} />
      </div>
    </Modal>
  );
}

export default ProductModal;
