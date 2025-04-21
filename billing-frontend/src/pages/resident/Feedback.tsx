import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Feedback {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'processing' | 'resolved';
  response?: string;
}

const ResidentFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      title: 'Vấn đề về điều hòa',
      content: 'Điều hòa tầng hầm không hoạt động',
      date: '2024-01-15',
      status: 'resolved',
      response: 'Đã sửa chữa xong',
    },
    {
      id: '2',
      title: 'Thang máy gặp sự cố',
      content: 'Thang máy số 2 phát ra tiếng ồn bất thường',
      date: '2024-01-20',
      status: 'processing',
      response: 'Đang kiểm tra',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    content: '',
  });

  const handleOpenDialog = (feedback?: Feedback) => {
    if (feedback) {
      setSelectedFeedback(feedback);
      setNewFeedback({
        title: feedback.title,
        content: feedback.content,
      });
    } else {
      setSelectedFeedback(null);
      setNewFeedback({
        title: '',
        content: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFeedback(null);
    setNewFeedback({
      title: '',
      content: '',
    });
  };

  const handleSubmit = () => {
    if (!newFeedback.title || !newFeedback.content) return;

    if (selectedFeedback) {
      // Edit existing feedback
      setFeedbacks(feedbacks.map(f =>
        f.id === selectedFeedback.id
          ? {
              ...f,
              title: newFeedback.title,
              content: newFeedback.content,
            }
          : f
      ));
    } else {
      // Add new feedback
      const feedback: Feedback = {
        id: Date.now().toString(),
        title: newFeedback.title,
        content: newFeedback.content,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      setFeedbacks([...feedbacks, feedback]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản ánh này không?')) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    }
  };

  const getStatusChip = (status: Feedback['status']) => {
    const statusConfig = {
      pending: { color: 'warning' as const, label: 'Chờ xử lý' },
      processing: { color: 'info' as const, label: 'Đang xử lý' },
      resolved: { color: 'success' as const, label: 'Đã xử lý' },
    };

    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Phản ánh</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm phản ánh
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Nội dung</TableCell>
                  <TableCell>Ngày gửi</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Phản hồi</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{feedback.title}</TableCell>
                    <TableCell>{feedback.content}</TableCell>
                    <TableCell>{new Date(feedback.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{getStatusChip(feedback.status)}</TableCell>
                    <TableCell>{feedback.response || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(feedback)}
                        disabled={feedback.status !== 'pending'}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(feedback.id)}
                        disabled={feedback.status !== 'pending'}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedFeedback ? 'Sửa phản ánh' : 'Thêm phản ánh mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={newFeedback.title}
                onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung"
                value={newFeedback.content}
                onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
                required
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!newFeedback.title || !newFeedback.content}
          >
            {selectedFeedback ? 'Cập nhật' : 'Gửi'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResidentFeedback; 