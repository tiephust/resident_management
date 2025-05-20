import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Link,
} from '@mui/material';
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Statistics: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');

  // Mock data for resident statistics with total of 500 residents
  const residentData = [
    { name: 'Tạm trú', value: 480, color: '#2E4B77', total: '480/500 người' },
    { name: 'Tạm vắng', value: 20, color: '#7BA0CD', total: '20/500 người' },
  ];

  // Mock data for financial statistics with realistic VND values
  const financialData = [
    { month: 1, income: 1250000000, expenses: 450000000, profit: 800000000 },
    { month: 2, income: 1300000000, expenses: 480000000, profit: 820000000 },
    { month: 3, income: 1280000000, expenses: 460000000, profit: 820000000 },
    { month: 4, income: 1350000000, expenses: 500000000, profit: 850000000 },
    { month: 5, income: 1400000000, expenses: 520000000, profit: 880000000 },
    { month: 6, income: 1380000000, expenses: 510000000, profit: 870000000 },
  ].map(item => ({
    month: `Tháng ${item.month}`,
    'Thu nhập': item.income,
    'Chi phí': item.expenses,
    'Lợi nhuận': item.profit
  }));

  // Mock data for service statistics with actual usage numbers
  const serviceData = [
    { id: 1, name: 'Dịch vụ cơ bản', value: 500, total: '500 căn hộ' },
    { id: 2, name: 'Dịch vụ An ninh và Bảo vệ', value: 485, total: '485 căn hộ' },
    { id: 3, name: 'Dịch Vụ Gửi Xe và Đỗ Xe', value: 450, total: '450 căn hộ' },
    { id: 4, name: 'Dịch Vụ Giải Trí và Thể Thao', value: 320, total: '320 căn hộ' },
    { id: 5, name: 'Dịch Vụ Bảo Hiểm và An Toàn', value: 280, total: '280 căn hộ' },
    { id: 6, name: 'Dịch Vụ Bảo Dưỡng và Sửa Chữa', value: 180, total: '180 căn hộ' },
    { id: 7, name: 'Dịch Vụ Khác', value: 150, total: '150 căn hộ' },
    { id: 8, name: 'Dịch vụ mới', value: 95, total: '95 căn hộ' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Xem thống kê
      </Typography>

      <Box sx={{ mb: 3 }}>
        <RadioGroup
          row
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="Cả 2 chung cư (500 căn hộ)" />
          <FormControlLabel value="s1" control={<Radio />} label="S1 (250 căn hộ)" />
          <FormControlLabel value="s2" control={<Radio />} label="S2 (250 căn hộ)" />
        </RadioGroup>
      </Box>

      <Grid container spacing={3}>
        {/* Resident Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê cư dân (Tổng: 500 người)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <PieChart width={400} height={300}>
                  <Pie
                    data={residentData}
                    cx={200}
                    cy={150}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                    label={({ total }) => total}
                  >
                    {residentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} người`, name]} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => `${value}`}
                  />
                </PieChart>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <Link href="#" underline="hover">
                    Xem chi tiết {'>'}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê tài chính (6 tháng gần nhất)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <LineChart width={400} height={300} data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Thu nhập"
                    stroke="#2E4B77"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Chi phí"
                    stroke="#7BA0CD"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Lợi nhuận"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <Link href="#" underline="hover">
                    Xem chi tiết {'>'}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê dịch vụ (Tổng số căn hộ: 500)
              </Typography>
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Box sx={{ flex: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Biểu đồ số căn hộ sử dụng mỗi loại dịch vụ
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {serviceData.map((service) => (
                      <Box
                        key={service.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ minWidth: 30 }}>{service.id}</Typography>
                        <Box
                          sx={{
                            flex: 1,
                            height: 20,
                            bgcolor: '#2E4B77',
                            borderRadius: 1,
                            maxWidth: `${(service.value / 500) * 100}%`,
                          }}
                        />
                        <Typography sx={{ ml: 2, minWidth: 100 }}>
                          {service.total}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1, pl: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Chú thích:
                  </Typography>
                  {serviceData.map((service) => (
                    <Typography key={service.id} variant="body2" sx={{ mb: 0.5 }}>
                      {service.id}. {service.name}
                    </Typography>
                  ))}
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <Link href="#" underline="hover">
                    Xem chi tiết {'>'}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   Grid,
//   Link,
// } from '@mui/material';
// import {
//   PieChart,
//   Pie,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Cell,
// } from 'recharts';
// import { StatisticsService } from '../../services/admin/StatisticsService';
// import { StatisticsData } from '../../types/admin/StatisticsType';
//
// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat('vi-VN', {
//     style: 'currency',
//     currency: 'VND',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(value);
// };
//
// const Statistics: React.FC = () => {
//   const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
//   const [statistics, setStatistics] = useState<StatisticsData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     const fetchStatistics = async () => {
//       try {
//         setLoading(true);
//         const filter = selectedBuilding === 'all' ? {} : { buildingId: selectedBuilding };
//         const data = await StatisticsService.getStatistics(filter);
//         setStatistics(data);
//       } catch (err) {
//         setError('Failed to load statistics');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchStatistics();
//   }, [selectedBuilding]);
//
//   if (loading) {
//     return <Typography>Loading statistics...</Typography>;
//   }
//
//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }
//
//   if (!statistics) {
//     return <Typography>No statistics data available</Typography>;
//   }
//
//   // Prepare data for charts
//   const financialChartData = statistics.financialStats.map(item => ({
//     month: `Tháng ${item.month}`,
//     'Thu nhập': item.income,
//     'Chi phí': item.expenses,
//     'Lợi nhuận': item.profit
//   }));
//
//   return (
//       <Box>
//         <Typography variant="h4" gutterBottom>
//           Xem thống kê
//         </Typography>
//
//         <Box sx={{ mb: 3 }}>
//           <RadioGroup
//               row
//               value={selectedBuilding}
//               onChange={(e) => setSelectedBuilding(e.target.value)}
//           >
//             <FormControlLabel
//                 value="all"
//                 control={<Radio />}
//                 label={`Cả 2 chung cư (${statistics.totalApartments} căn hộ)`}
//             />
//             <FormControlLabel
//                 value="s1"
//                 control={<Radio />}
//                 label="S1"
//             />
//             <FormControlLabel
//                 value="s2"
//                 control={<Radio />}
//                 label="S2"
//             />
//           </RadioGroup>
//         </Box>
//
//         <Grid container spacing={3}>
//           {/* Resident Statistics */}
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Thống kê cư dân (Tổng: {statistics.totalResidents} người)
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
//                   <PieChart width={400} height={300}>
//                     <Pie
//                         data={statistics.residentStats}
//                         cx={200}
//                         cy={150}
//                         innerRadius={60}
//                         outerRadius={100}
//                         paddingAngle={0}
//                         dataKey="value"
//                         label={({ total }) => total}
//                     >
//                       {statistics.residentStats.map((entry, index) => (
//                           <Cell key={index} fill={entry.color || '#2E4B77'} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value, name) => [`${value} người`, name]} />
//                     <Legend
//                         verticalAlign="bottom"
//                         height={36}
//                         formatter={(value) => `${value}`}
//                     />
//                   </PieChart>
//                   <Box
//                       sx={{
//                         position: 'absolute',
//                         bottom: 0,
//                         right: 0,
//                       }}
//                   >
//                     <Link href="#" underline="hover">
//                       Xem chi tiết {'>'}
//                     </Link>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//
//           {/* Financial Statistics */}
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Thống kê tài chính ({statistics.financialStats.length} tháng gần nhất)
//                 </Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
//                   <LineChart width={400} height={300} data={financialChartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
//                     <Tooltip formatter={(value) => formatCurrency(value as number)} />
//                     <Legend />
//                     <Line
//                         type="monotone"
//                         dataKey="Thu nhập"
//                         stroke="#2E4B77"
//                         strokeWidth={2}
//                     />
//                     <Line
//                         type="monotone"
//                         dataKey="Chi phí"
//                         stroke="#7BA0CD"
//                         strokeWidth={2}
//                     />
//                     <Line
//                         type="monotone"
//                         dataKey="Lợi nhuận"
//                         stroke="#82ca9d"
//                         strokeWidth={2}
//                     />
//                   </LineChart>
//                   <Box
//                       sx={{
//                         position: 'absolute',
//                         bottom: 0,
//                         right: 0,
//                       }}
//                   >
//                     <Link href="#" underline="hover">
//                       Xem chi tiết {'>'}
//                     </Link>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//
//           {/* Service Statistics */}
//           <Grid item xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Thống kê dịch vụ (Tổng số căn hộ: {statistics.totalApartments})
//                 </Typography>
//                 <Box sx={{ display: 'flex', position: 'relative' }}>
//                   <Box sx={{ flex: 2 }}>
//                     <Typography variant="subtitle2" gutterBottom>
//                       Biểu đồ số căn hộ sử dụng mỗi loại dịch vụ
//                     </Typography>
//                     <Box sx={{ height: 300 }}>
//                       {statistics.serviceStats.map((service) => (
//                           <Box
//                               key={service.id}
//                               sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 mb: 1,
//                               }}
//                           >
//                             <Typography sx={{ minWidth: 30 }}>{service.id}</Typography>
//                             <Box
//                                 sx={{
//                                   flex: 1,
//                                   height: 20,
//                                   bgcolor: '#2E4B77',
//                                   borderRadius: 1,
//                                   maxWidth: `${(service.value / statistics.totalApartments) * 100}%`,
//                                 }}
//                             />
//                             <Typography sx={{ ml: 2, minWidth: 100 }}>
//                               {service.value}/{statistics.totalApartments} căn hộ
//                             </Typography>
//                           </Box>
//                       ))}
//                     </Box>
//                   </Box>
//                   <Box sx={{ flex: 1, pl: 3 }}>
//                     <Typography variant="subtitle2" gutterBottom>
//                       Chú thích:
//                     </Typography>
//                     {statistics.serviceStats.map((service) => (
//                         <Typography key={service.id} variant="body2" sx={{ mb: 0.5 }}>
//                           {service.id}. {service.name}
//                         </Typography>
//                     ))}
//                   </Box>
//                   <Box
//                       sx={{
//                         position: 'absolute',
//                         bottom: 0,
//                         right: 0,
//                       }}
//                   >
//                     <Link href="#" underline="hover">
//                       Xem chi tiết {'>'}
//                     </Link>
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//   );
// };
//
// export default Statistics;