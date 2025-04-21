import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';
import { Resident } from '../types';

const Residents = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/residents');
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/residents', formData);
      handleClose();
      fetchResidents();
    } catch (error) {
      console.error('Error creating resident:', error);
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Residents</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Resident
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Stripe Customer ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.name}</TableCell>
                <TableCell>{resident.email}</TableCell>
                <TableCell>{resident.phoneNumber}</TableCell>
                <TableCell>{resident.stripeCustomerId || 'Not set'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Resident</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              fullWidth
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Residents; 