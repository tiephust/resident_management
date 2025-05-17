import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Chip,
  Link,
} from '@mui/material';
import { fetchBuildings, fetchRecentFeedback } from '../../services/admin/DashboardService';
import { Building, Feedback } from '../../types/admin/DashboardType';

const AdminDashboard: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [buildingsData, feedbackData] = await Promise.all([
          fetchBuildings(),
          fetchRecentFeedback(),
        ]);
        setBuildings(buildingsData);
        setRecentFeedback(feedbackData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

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