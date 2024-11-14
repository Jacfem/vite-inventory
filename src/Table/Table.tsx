import { Table } from "@mantine/core";

import { getProducts } from "../../api/products";
import { Row } from "./Row";

export default function BasicTable() {
  const { data } = getProducts();

  const rows = data?.map((item) => <Row product={item} />);

  return (
    data && (
      <>
        <Table
          stickyHeader
          stickyHeaderOffset={60}
          highlightOnHover
          withColumnBorders
          withRowBorders
          withTableBorder
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product Name</Table.Th>
              <Table.Th>Size</Table.Th>
              <Table.Th>Expiration Date</Table.Th>
              <Table.Th>Tags</Table.Th>
              <Table.Th>Manage</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </>
    )
  );
}
