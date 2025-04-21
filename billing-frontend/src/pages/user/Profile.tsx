import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, TextField, Button } from '@mui/material';
import axios from 'axios';
import { Resident } from '../../types';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    unitNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        unitNumber: response.data.unitNumber
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/user/profile', formData);
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Unit Number"
                        name="unitNumber"
                        value={formData.unitNumber}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary">
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                        sx={{ ml: 2 }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <Box>
                  <Typography variant="h6">Name: {profile?.name}</Typography>
                  <Typography variant="h6">Email: {profile?.email}</Typography>
                  <Typography variant="h6">Phone: {profile?.phoneNumber}</Typography>
                  <Typography variant="h6">Unit: {profile?.unitNumber}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserProfile; 