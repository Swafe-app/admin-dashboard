'use client'

import '@/app/(app)/dashboard.css';
import { logout } from '@/store/adminSlice';
import { useTypeDispatch, useTypeSelector } from '@/store/hooks';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Button, IconButton, Menu, MenuItem, MenuList, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosBackInstance from '@/services/axiosInstances/axiosBackInstance';
import { DatagridUser, ListUsersResponse, User } from '@/types/userType';
import CloseIcon from '@mui/icons-material/Close';
import { queryClient } from '@/services/queryClient';

const columns: GridColDef[] = [
  { field: 'createdAt', headerName: 'Date de création', flex: 1, minWidth: 150 },
  { field: 'updatedAt', headerName: 'Date de modification', flex: 1, minWidth: 150 },
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
  const [selectedUser, setSelectedUser] = useState<DatagridUser | null>(null);
  const { info } = useTypeSelector(state => state.admin);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const newRows = rows.filter(row => row.name.toLowerCase().includes(value));
    setDisplayedRows(newRows);
    setSearchValue(event.target.value);
  };

  const validateImage = async (uid: string) => {
    try {
      const response = await axiosBackInstance.put('/admins/updateUser', {
        uid,
        selfieStatus: 'validated',
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('swafe-admin')}`,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.log(error);
    }
  };

  const refuseImage = async (uid: string) => {
    try {
      const response = await axiosBackInstance.put('/admins/updateUser', {
        uid,
        selfieStatus: 'refused',
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('swafe-admin')}`,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.log(error);
    }
  };

  useQuery({
    queryKey: ['users'],
    staleTime: 1, // 5 * 60 * 1000
    queryFn: async () => {
      try {
        const response = await axiosBackInstance.get<ListUsersResponse>('/admins/userList', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('swafe-admin')}`,
          },
        });
        const rows = response.data.data.map((user) => ({
          id: user.uid,
          createdAt: new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          updatedAt: new Date(user.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          name: `${user.firstName} ${user.lastName}`,
          image: user.selfie,
          status: user.selfieStatus
        })) as DatagridUser[];
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
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {info!.firstName[0].toLocaleUpperCase() + info!.lastName[0].toLocaleUpperCase()}
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
              sx={{
                maxHeight: 'calc(100vh - 380px)',
                minHeight: '163px',
                borderRadius: '0',
                border: 0,
                borderTop: '1px solid rgba(224, 224, 224, 1)',
              }}
              rows={displayedRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 }
                },
                sorting: {
                  sortModel: [{ field: 'updatedAt', sort: 'desc' }]
                }
              }}
              pageSizeOptions={[10, 25, 50]}
              onRowClick={(params) => setSelectedUser(params.row as DatagridUser)}
              pagination
            />
          </div>
          <div className='validate-image-container'>
            <div className='title'>
              <span>Vérification des photos</span>
              <IconButton
                onClick={() => setSelectedUser(null)}
                sx={{
                  borderRadius: '8px',
                  background: 'var(--neutral-100)',
                  boxShadow: 'var(--elevation-button)',
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className='text-area-image'>
              {/* <TextField
                value="[Nom] doit faire le V de victoire avec ses doigts : ✌️"
                label="Consigne"
                variant="outlined"
                InputProps={{ readOnly: true, }}
              /> */}
              <div className='image-button'>
                {(selectedUser && selectedUser.image) ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-selfie/${selectedUser.image}`}
                    alt="Selfie de l'utilisateur"
                  />
                  ) : (
                  <div
                    style={{
                      fontFamily: "Gill Sans, sans-serif",
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '340px',
                      height: '340px',
                      background: 'var(--neutral-80)',
                      borderRadius: '8px',
                    }}
                  >Image non disponible</div>
                  )}
                <div className='button-container'>
                  <Button
                    disabled={!selectedUser}
                    onClick={() => selectedUser && refuseImage(selectedUser.id)}
                    disableElevation
                    variant='outlined'
                    sx={{
                      display: 'flex',
                      padding: '10px 17px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '8px',
                      border: '2px solid var(--secondary-40)',
                      background: 'var(--neutral-100)',
                      color: 'var(--secondary-40)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      '&:hover': {
                        background: 'var(--secondary-80)',
                        border: '2px solid var(--secondary-40)'
                      }
                    }}
                  >Invalider</Button>
                  <Button
                    disabled={!selectedUser}
                    onClick={() => selectedUser && validateImage(selectedUser.id)}
                    disableElevation
                    variant='contained'
                    sx={{
                      display: 'flex',
                      padding: '10px 17px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '8px',
                      background: 'var(--secondary-40)',
                      color: 'var(--neutral-100)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      '&:hover': {
                        background: 'var(--secondary-30)',
                      }
                    }}
                  >Valider</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}
