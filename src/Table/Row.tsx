import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ActionIcon, ActionIconGroup, Table } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { deleteProduct } from "../../api/products";
import { Product } from "../../api/types";
import { EditModal } from "./EditModal";

export const Row = ({ product }) => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const { hovered, ref } = useHover();

  return (
    <Table.Tr key={product.name} ref={ref}>
      <Table.Td>{product.name}</Table.Td>
      <Table.Td>{product.size}</Table.Td>
      <Table.Td>
        {product.expirationdate
          ? new Date(product.expirationdate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "unknown"}
      </Table.Td>
      <Table.Td>{product.tags}</Table.Td>
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
              // add toast error/confirmation
            }}
          >
            <IconTrash />
          </ActionIcon>
        </ActionIconGroup>
      </Table.Td>
      {editOpen && (
        <EditModal
          item={currentProduct!}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setCurrentProduct(null);
          }}
        />
      )}
    </Table.Tr>
  );
};
