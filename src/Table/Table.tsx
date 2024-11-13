import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">Expiration Date</TableCell>
                <TableCell align="right">Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: Product) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                    <img width={100} src={row.image} />
                    <Button
                      variant="text"
                      onClick={() => {
                        deleteMutation.mutate(row.id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditOpen(true);
                        setCurrentProduct(row);
                      }}
                    >
                      Edit
                    </Button>

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
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.size}
                  </TableCell>
                  <TableCell component="th" scope="row">
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
                  </TableCell>
                  <TableCell component="th" scope="row">
                    Tags
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )
  );
}
