import { useState } from "react";

import { Button, Title } from "@mantine/core";

import BasicTable from "./Table/Table";
import ProductModal from "./ProductModal/ProductModal";
import "./App.css";
import "@mantine/core/styles.css";

// add localization

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const handleOpen = () => setFormOpen(true);
  const handleClose = () => setFormOpen(false);

  return (
    <div>
      <Title>Inventory App</Title>

      <Button onClick={handleOpen} variant="text">
        Add a product
      </Button>
      <BasicTable />
      <ProductModal open={formOpen} handleClose={handleClose} />
    </div>
  );
}

export default App;
