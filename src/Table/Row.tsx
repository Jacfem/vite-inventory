import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionIcon, ActionIconGroup, Table } from "@mantine/core";
import { IconEdit, IconTag, IconTrash } from "@tabler/icons-react";

import { deleteProduct } from "../../api/products";
import { Product } from "../../api/types";
import ProductModal from "../ProductModal/ProductModal";

interface RowProps {
  product: Product;
}

export const Row = ({ product }: RowProps) => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <Table.Tr key={product.name}>
      <Table.Td>{product.name}</Table.Td>
      <Table.Td>{product.size}</Table.Td>
      <Table.Td>
        {product.expirationDate
          ? new Date(product.expirationDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "unknown"}
      </Table.Td>
      <Table.Td>
        {product.tags || (
          <ActionIcon
            variant="outline"
            color="blue"
            onClick={() => {
              setEditOpen(true);
              setCurrentProduct(product);
            }}
          >
            <IconTag />
          </ActionIcon>
        )}
      </Table.Td>
      <Table.Td>
        <img width={50} src={product.image} />
      </Table.Td>
      <Table.Td>
        <ActionIconGroup>
          <ActionIcon
            variant="outline"
            color="blue"
            onClick={() => {
              setEditOpen(true);
              setCurrentProduct(product);
            }}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="red"
            onClick={() => {
              deleteMutation.mutate(product.id);
            }}
          >
            <IconTrash />
          </ActionIcon>
        </ActionIconGroup>
      </Table.Td>
      {editOpen && (
        <ProductModal
          product={currentProduct!}
          open={editOpen}
          handleClose={() => {
            setEditOpen(false);
            setCurrentProduct(null);
          }}
        />
      )}
    </Table.Tr>
  );
};
