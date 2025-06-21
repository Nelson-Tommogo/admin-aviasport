import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolBar";

const Transactions = () => {
  const theme = useTheme();

  // State for pagination and search input (removed unused `search`)
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");

  // ✅ Sample transaction data (Ensuring `id` exists)
  const transactions = [
    { id: "1", userId: "U1001", createdAt: "2024-03-10", paymentMethod: "Credit Card", cost: 50.25 },
    { id: "2", userId: "U1002", createdAt: "2024-03-09", paymentMethod: "PayPal", cost: 100.0 },
    { id: "3", userId: "U1003", createdAt: "2024-03-08", paymentMethod: "Bank Transfer", cost: 75.5 },
  ];

  // ✅ Ensure the grid always displays even with empty data
  const columns = [
    { field: "id", headerName: "Transaction ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "createdAt", headerName: "Transaction Date", flex: 1 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
    { 
      field: "cost", 
      headerName: "Amount", 
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="List of all transactions" />
      
      <Box height="75vh" sx={{
          "& .MuiDataGrid-root": { border: "1px solid #ccc" },
          "& .MuiDataGrid-cell": { borderBottom: "1px solid #ddd" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: theme.palette.background.alt, color: theme.palette.secondary[100] },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: theme.palette.primary.light },
          "& .MuiDataGrid-footerContainer": { backgroundColor: theme.palette.background.alt, color: theme.palette.secondary[100] },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${theme.palette.secondary[200]} !important` },
      }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={pageSize}
          pagination
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
