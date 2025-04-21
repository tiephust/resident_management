import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Feedback {
  id: number;
  type: string;
  sender: string;
  apartment: string;
  building: string;
  content: string;
  date: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  response?: string;
}

const FeedbackManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('11');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');

  const mockFeedbacks: Feedback[] = [
    {
      id: 1,
      type: 'Phản ánh về an ninh',
      sender: 'Nguyễn Văn An',
      apartment: '31',
      building: 'S1',
      content: 'Cần lưu ý về việc có người lạ thường xuyên đi lại tại khu vực hành lang tầng 3...',
      date: '25/11/2023',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Phản ánh về vệ sinh',
      sender: 'Đỗ Văn Đức',
      apartment: '21',
      building: 'S1',
      content: 'Cần lưu ý về việc có một số cư dân vẫn thường xuyên vứt rác bừa bãi tại khu vực cổng A của tòa nhà S1. Tình trạng này không chỉ tạo ra một cảnh quan xấu mắt mà còn ảnh hưởng đến môi trường sống chung của chúng ta.',
      date: '25/11/2023',
      image: '/path-to-image.jpg',
      status: 'pending'
    },
    // Thêm các phản ánh mẫu khác...
  ];

  const handleOpenDetail = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedFeedback(null);
  };

  const handleOpenResponse = () => {
    setResponseDialogOpen(true);
  };

  const handleCloseResponse = () => {
    setResponseDialogOpen(false);
    setResponseText('');
  };

  const handleSendResponse = () => {
    // Xử lý logic gửi phản hồi
    console.log('Gửi phản hồi:', responseText);
    handleCloseResponse();
    handleCloseDetail();
  };

  const handleSendNotification = () => {
    // Xử lý logic gửi thông báo
    console.log('Gửi thông báo:', responseText);
    handleCloseResponse();
    handleCloseDetail();
  };

  const handleApprove = () => {
    // Xử lý logic chấp nhận phản ánh
    handleCloseDetail();
  };

  const handleOpenReject = () => {
    setRejectDialogOpen(true);
  };

  const handleCloseReject = () => {
    setRejectDialogOpen(false);
    setRejectReason('');
  };

  const handleReject = () => {
    // Xử lý logic từ chối phản ánh
    handleCloseReject();
    handleCloseDetail();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Ý kiến của cư dân
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Tháng</InputLabel>
            <Select
              value={selectedMonth}
              label="Tháng"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <MenuItem key={month} value={month}>{`Tháng ${month}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Năm</InputLabel>
            <Select
              value={selectedYear}
              label="Năm"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="2023">Năm 2023</MenuItem>
              <MenuItem value="2022">Năm 2022</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Loại phản ánh</InputLabel>
            <Select
              value={selectedType}
              label="Loại phản ánh"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="security">An ninh</MenuItem>
              <MenuItem value="sanitation">Vệ sinh</MenuItem>
              <MenuItem value="service">Dịch vụ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        {mockFeedbacks.map((feedback) => (
          <Card 
            key={feedback.id} 
            sx={{ 
              mb: 2, 
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => handleOpenDetail(feedback)}
          >
            <CardContent>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" gutterBottom>
                    {feedback.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Từ: {feedback.sender}, hộ gia đình số {feedback.apartment}, chung cư {feedback.building}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {feedback.content}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    {feedback.date}
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary" 
                    sx={{ mt: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(feedback);
                    }}
                  >
                    Xem thêm
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog chi tiết phản ánh */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedFeedback?.type}
            </Typography>
            <IconButton onClick={handleCloseDetail}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Từ ông/bà: {selectedFeedback?.sender}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Hộ gia đình số {selectedFeedback?.apartment}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Chung cư: {selectedFeedback?.building}
            </Typography>
          </Box>
          <Typography variant="subtitle1" gutterBottom>
            Nội dung phản ánh:
          </Typography>
          <Typography paragraph>
            {selectedFeedback?.content}
          </Typography>
          {selectedFeedback?.image && (
            <Box sx={{ mt: 2 }}>
              <img 
                src={selectedFeedback.image} 
                alt="Feedback"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
          {selectedFeedback?.response && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Phản hồi:
              </Typography>
              <Typography>
                {selectedFeedback.response}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>
            Đóng
          </Button>
          <Button onClick={handleOpenReject} color="error">
            Từ chối
          </Button>
          <Button onClick={handleOpenResponse} variant="contained" color="primary">
            Chấp nhận và phản hồi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog phản hồi */}
      <Dialog
        open={responseDialogOpen}
        onClose={handleCloseResponse}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Phản hồi ý kiến
            </Typography>
            <IconButton onClick={handleCloseResponse}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Phản hồi tới: {selectedFeedback?.sender}
            </Typography>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Về: {selectedFeedback?.type}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Nội dung phản hồi"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseResponse}>
            Hủy
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleSendNotification}
          >
            Thông báo
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSendResponse}
            disabled={!responseText.trim()}
          >
            Trả lời
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog từ chối */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={handleCloseReject}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Lý do từ chối
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Lý do từ chối</InputLabel>
            <Select
              value={rejectReason}
              label="Lý do từ chối"
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <MenuItem value="invalid">Thông tin không hợp lệ</MenuItem>
              <MenuItem value="duplicate">Phản ánh trùng lặp</MenuItem>
              <MenuItem value="insufficient">Thiếu thông tin cần thiết</MenuItem>
              <MenuItem value="other">Lý do khác</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject}>
            Hủy
          </Button>
          <Button onClick={handleReject} variant="contained" color="error">
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackManagement; 