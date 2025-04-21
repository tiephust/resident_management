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

interface Comment {
  id: string;
  title: string;
  content: string;
  date: string;
  response?: string;
}

const ResidentComments = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      title: 'Đề xuất thêm cây xanh',
      content: 'Đề xuất trồng thêm cây xanh ở khu vực sân chơi để tạo bóng mát',
      date: '2024-01-15',
      response: 'Cảm ơn góp ý của anh/chị. Ban quản lý sẽ xem xét đề xuất này.',
    },
    {
      id: '2',
      title: 'Góp ý về dịch vụ vệ sinh',
      content: 'Đề xuất tăng tần suất dọn vệ sinh hành lang vào cuối tuần',
      date: '2024-01-20',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState({
    title: '',
    content: '',
  });

  const handleOpenDialog = (comment?: Comment) => {
    if (comment) {
      setSelectedComment(comment);
      setNewComment({
        title: comment.title,
        content: comment.content,
      });
    } else {
      setSelectedComment(null);
      setNewComment({
        title: '',
        content: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedComment(null);
    setNewComment({
      title: '',
      content: '',
    });
  };

  const handleSubmit = () => {
    if (!newComment.title || !newComment.content) return;

    if (selectedComment) {
      // Edit existing comment
      setComments(comments.map(c =>
        c.id === selectedComment.id
          ? {
              ...c,
              title: newComment.title,
              content: newComment.content,
            }
          : c
      ));
    } else {
      // Add new comment
      const comment: Comment = {
        id: Date.now().toString(),
        title: newComment.title,
        content: newComment.content,
        date: new Date().toISOString().split('T')[0],
      };
      setComments([...comments, comment]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ý kiến này không?')) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Ý kiến đóng góp</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm ý kiến
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
                  <TableCell>Phản hồi</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.title}</TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{new Date(comment.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{comment.response || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(comment)}
                        disabled={!!comment.response}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(comment.id)}
                        disabled={!!comment.response}
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
          {selectedComment ? 'Sửa ý kiến' : 'Thêm ý kiến mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={newComment.title}
                onChange={(e) => setNewComment({ ...newComment, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung"
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
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
            disabled={!newComment.title || !newComment.content}
          >
            {selectedComment ? 'Cập nhật' : 'Gửi'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResidentComments; 