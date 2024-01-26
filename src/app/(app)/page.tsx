'use client'

import '@/app/(app)/dashboard.css';
import { logout } from '@/store/adminSlice';
import { useTypeDispatch } from '@/store/hooks';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Menu, MenuItem, MenuList, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosBackInstance from '@/services/axiosInstances/axiosBackInstance';
import { DatagridUser, ListUsersResponse, User } from '@/types/userType';

const columns: GridColDef[] = [
  { field: 'date', headerName: 'Date', flex: 1, minWidth: 150 },
  { field: 'name', headerName: 'Nom', flex: 1, minWidth: 150 },
  {
    field: 'image', headerName: 'Image', flex: 1, minWidth: 150,
    renderCell: (params) => (
      <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-selfie/${params.value}`} target='_blank'>{params.value}</Link>
    )
  },
  {
    field: 'status', headerName: 'Statut', flex: 1, minWidth: 150,
    renderCell: (params) => (
      <div className={`status-chips ${params.value.toLowerCase()}`}>{
        params.value === 'validated' ? 'Accepté' :
          params.value === 'refused' ? 'Refusé' :
            params.value === 'pending' ? 'En attente' :
              params.value === 'not_defined' ? 'Non défini' : ''
      }</div>
    )
  },
];

export default function Home() {
  const dispatch = useTypeDispatch();
  const [rows, setRows] = useState<DatagridUser[]>([]);
  const [displayedRows, setDisplayedRows] = useState<GridRowsProp>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const newRows = rows.filter(row => row.name.toLowerCase().includes(value));
    setDisplayedRows(newRows);
    setSearchValue(event.target.value);
  };

  useQuery({
    queryKey: ['users'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const response = await axiosBackInstance.get<ListUsersResponse>('/admins/userList', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('swafe-admin')}`,
          },
        });
        const rows = response.data.data.map((user) => ({ id: user.uid, date: user.createdAt, name: `${user.firstName} ${user.lastName}`, image: user.selfie, status: user.selfieStatus })) as DatagridUser[];
        setRows(rows);
        setDisplayedRows(rows);
        setSearchValue('');
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <section className='dashboard-section'>
      <div className='header'>
        <div className='title-logo'>
          <Image src='logo_dark.svg' alt='Swafe logo' width={40} height={40} />
          <span>Swafe Admin</span>
        </div>
        <Avatar
          sx={{
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            background: 'var(--secondary-80)',
            color: 'var(--primary-10)',
            fontFamily: 'Public Sans',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          RG
        </Avatar>
        <Menu
          sx={{ padding: 0 }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuList disablePadding={true}>
            <MenuItem onClick={() => dispatch(logout())}>Déconnexion</MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className='content'>
        <span>Validation des profils biométriques</span>
        <div>
          <div className='table-container'>
            <div className='search-container'>
              <TextField
                sx={{
                  border: 'var(--neutral-40)'
                }}
                value={searchValue}
                size='small'
                label="Rechercher"
                variant="outlined"
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <SearchIcon />
                  ),
                }}
              />
            </div>
            <DataGrid
              sx={{ maxHeight: 'calc(100vh - 380px)', minHeight: '163px' }}
              rows={displayedRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 }
                },
                sorting: {
                  sortModel: [{ field: 'date', sort: 'desc' }]
                }
              }}
              pageSizeOptions={[10, 25, 50]}
              pagination
            />
          </div>
        </div>
      </div>
    </section>
  );
}
