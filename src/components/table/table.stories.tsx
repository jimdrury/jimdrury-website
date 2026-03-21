import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./table";

const meta = {
  title: "Components/Table",
  component: Table,
  subcomponents: { TableHead, TableBody, TableRow, TableCell },
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Name</TableCell>
          <TableCell header>Role</TableCell>
          <TableCell header>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>Designer</TableCell>
          <TableCell>Away</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
