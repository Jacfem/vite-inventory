import { useState } from "react";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import BasicTable from "./Table/Table";
import ProductModal from "./ProductModal/ProductModal";
import "./App.css";

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const handleOpen = () => setFormOpen(true);
  const handleClose = () => setFormOpen(false);

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/">
          All Products
        </Link>
      </Breadcrumbs>
      <Typography variant="h3">Inventory App</Typography>

      <Stack spacing={2} direction="row">
        <Button onClick={handleOpen} variant="text">
          Add a product
        </Button>
      </Stack>
      <BasicTable />
      <ProductModal open={formOpen} handleClose={handleClose} />
    </div>
  );
}

export default App;
