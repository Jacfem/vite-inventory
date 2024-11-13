import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@mantine/core";
import { Table } from "@mantine/core";

import { getProducts, deleteProduct } from "../../api/products";
import { Product } from "../../api/types";
import { EditModal } from "./EditModal";

export default function BasicTable() {
  const queryClient = useQueryClient();
  const { data } = getProducts();
  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    data && (
      <>
        <Table.ScrollContainer minWidth={500}>
          <Table
            highlightOnHover
            withColumnBorders
            withRowBorders
            withTableBorder
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product Name</Table.Th>
                <Table.Th align="right">Size</Table.Th>
                <Table.Th align="right">Expiration Date</Table.Th>
                <Table.Th align="right">Tags</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row: Product) => (
                <Table.Tr key={row.name}>
                  <Table.Td component="th" scope="row">
                    <div>
                      <p>{row.name}</p>
                      <img width={100} src={row.image} />
                    </div>
                    <Button.Group>
                      <Button
                        variant="outline"
                        color="blue"
                        onClick={() => {
                          setEditOpen(true);
                          setCurrentProduct(row);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="filled"
                        color="red"
                        onClick={() => {
                          deleteMutation.mutate(row.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Button.Group>
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
                  </Table.Td>
                  <Table.Td component="th" scope="row">
                    {row.size}
                  </Table.Td>
                  <Table.Td component="th" scope="row">
                    <p>
                      {row.expirationdate
                        ? new Date(row.expirationdate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </p>

                    {/* Why did expirationDate come back with lowercase? */}
                  </Table.Td>
                  <Table.Td component="th" scope="row">
                    Tags
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </>
    )
  );
}
