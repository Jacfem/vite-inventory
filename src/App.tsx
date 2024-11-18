import { useState } from "react";

import { Button, Title } from "@mantine/core";

import ProductTable from "./Table/Table";
import ProductModal from "./ProductModal/ProductModal";
import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
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
      <ProductTable />
      <ProductModal open={formOpen} handleClose={handleClose} />
    </div>
  );
}

export default App;
