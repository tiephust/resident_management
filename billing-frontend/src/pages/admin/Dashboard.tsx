import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material';
import axios from 'axios';
import { User, UserRole } from '../../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await axios.put(`/api/admin/users/${userId}/activate`);
      fetchUsers();
    } catch (err) {
      setError('Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await axios.put(`/api/admin/users/${userId}/deactivate`);
      fetchUsers();
    } catch (err) {
      setError('Failed to deactivate user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Management
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === UserRole.ADMIN ? 'primary' : 'default'} 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.isActive ? 'Active' : 'Inactive'} 
                            color={user.isActive ? 'success' : 'error'} 
                          />
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <Button 
                              variant="outlined" 
                              color="error"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button 
                              variant="outlined" 
                              color="success"
                              onClick={() => handleActivateUser(user.id)}
                            >
                              Activate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 