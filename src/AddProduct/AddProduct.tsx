import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function AddProduct() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Add a product</Button>
    </Stack>
  );
}
