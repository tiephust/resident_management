import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Link,
} from '@mui/material';

const AdminDashboard: React.FC = () => {
  // Mock data for buildings
  const buildings = [
    {
      id: 'S2',
      area: '556 m2',
      floors: 5,
      units: 25,
      residents: 53,
    },
    {
      id: 'S1',
      area: '652 m2',
      floors: 5,
      units: 25,
      residents: 56,
    },
  ];

  // Mock data for recent feedback
  const recentFeedback = [
    {
      id: 1,
      from: 'Nguyễn Văn A',
      unit: '31',
      content: 'Phản ánh hàng xóm làm ồn',
      date: '25/11/2023',
    },
    {
      id: 2,
      from: 'Nguyễn Văn A',
      unit: '3',
      content: 'Phản ánh về vệ sinh chung cư',
      date: '25/11/2023',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Xin chào Ban quản Lý
      </Typography>

      <Grid container spacing={3}>
        {/* Building Information */}
        {buildings.map((building) => (
          <Grid item xs={12} md={6} key={building.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chung cư {building.id}
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Diện tích
                    </Typography>
                    <Typography variant="h6">
                      {building.area}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Số tầng
                    </Typography>
                    <Typography variant="h6">
                      {building.floors}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Số căn hộ
                    </Typography>
                    <Typography variant="h6">
                      {building.units}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Số cư dân
                    </Typography>
                    <Typography variant="h6">
                      {building.residents}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Feedback */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Ý kiến gần đây của cư dân
                </Typography>
                <Link href="#" underline="hover">
                  Xem chi tiết
                </Link>
              </Box>
              <List>
                {recentFeedback.map((feedback) => (
                  <ListItem
                    key={feedback.id}
                    divider
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        {feedback.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Từ: {feedback.from}, hộ gia đình số {feedback.unit}
                      </Typography>
                    </Box>
                    <Chip
                      label={feedback.date}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 