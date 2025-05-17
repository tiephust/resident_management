import React, { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Button,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { managementFeeTypeService } from '../../services/admin/ManagementFeeTypeService';
import { FeeType, NewFeeType } from '../../types/admin/FeeTypeManagementType';
import FeeTypeDialog from '../../components/admin/FeeTypeDialog';

type Order = 'asc' | 'desc';

const categoryConfig = {
    'Dịch vụ cơ bản': 'Basic Services',
    'Dịch vụ chung': 'Common Services',
    'Phí quản lý': 'Management Fees'
};

const billingCycleConfig = {
    'Hàng tháng': 'Monthly',
    'Hàng quý': 'Quarterly',
    'Hàng năm': 'Yearly'
};

const FeeTypeManagementPage: React.FC = () => {
    // Data state
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sort and filter states
    const [orderBy, setOrderBy] = useState<keyof FeeType>('name');
    const [order, setOrder] = useState<Order>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // Dialog states
    const [open, setOpen] = useState(false);
    const [editingFeeType, setEditingFeeType] = useState<FeeType | NewFeeType | null>(null);

    // Load fee types
    useEffect(() => {
        const loadFeeTypes = async () => {
            try {
                const data = await managementFeeTypeService.getAllFeeTypes();
                setFeeTypes(data);
            } catch (error) {
                setError('Lỗi khi tải danh sách loại phí');
                console.error('Lỗi khi tải danh sách loại phí:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFeeTypes();
    }, []);

    // Handle sorting
    const handleRequestSort = (property: keyof FeeType) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getComparator = (order: Order, orderBy: keyof FeeType) => {
        return order === 'desc'
            ? (a: FeeType, b: FeeType) => descendingComparator(a, b, orderBy)
            : (a: FeeType, b: FeeType) => -descendingComparator(a, b, orderBy);
    };

    const descendingComparator = (a: FeeType, b: FeeType, orderBy: keyof FeeType) => {
        const aValue = a[orderBy] ?? '';
        const bValue = b[orderBy] ?? '';
        if (bValue < aValue) return -1;
        if (bValue > aValue) return 1;
        return 0;
    };

    // Handle search
    const handleSearch = async () => {
        try {
            const data = await managementFeeTypeService.searchFeeTypes(searchTerm);
            setFeeTypes(data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm loại phí:', error);
        }
    };

    // Handle category filter
    const handleCategoryFilterChange = async (category: string) => {
        setCategoryFilter(category);
        try {
            const data = category
                ? await managementFeeTypeService.getFeeTypesByCategory(category)
                : await managementFeeTypeService.getAllFeeTypes();
            setFeeTypes(data);
        } catch (error) {
            console.error('Lỗi khi lọc theo danh mục:', error);
        }
    };

    // Dialog handlers
    const handleOpen = (feeType?: FeeType) => {
        if (feeType) {
            setEditingFeeType(feeType);
        } else {
            setEditingFeeType({
                name: '',
                category: '',
                unit: '',
                pricePerUnit: 0,
                billingCycle: '',
                description: '',
                isActive: true
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingFeeType(null);
    };

    // Data operations
    const handleSave = async () => {
        try {
            if (editingFeeType) {
                if ('id' in editingFeeType && editingFeeType.id) {
                    await managementFeeTypeService.updateFeeType(editingFeeType.id, editingFeeType);
                } else {
                    await managementFeeTypeService.createFeeType(editingFeeType as NewFeeType);
                }
                const data = await managementFeeTypeService.getAllFeeTypes();
                setFeeTypes(data);
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi lưu loại phí:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await managementFeeTypeService.deleteFeeType(id);
            const data = await managementFeeTypeService.getAllFeeTypes();
            setFeeTypes(data);
        } catch (error) {
            console.error('Lỗi khi xóa loại phí:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    if (loading) return <PageTemplate title="Quản Lý Loại Phí">Đang tải...</PageTemplate>;
    if (error) return <PageTemplate title="Quản Lý Loại Phí">{error}</PageTemplate>;

    return (
        <PageTemplate title="Quản Lý Loại Phí">
            <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Thêm loại phí
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Tìm kiếm..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ width: 300 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={categoryFilter}
                            label="Danh mục"
                            onChange={(e) => handleCategoryFilterChange(e.target.value)}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {Object.keys(categoryConfig).map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Tên loại phí
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'category'}
                                    direction={orderBy === 'category' ? order : 'asc'}
                                    onClick={() => handleRequestSort('category')}
                                >
                                    Danh mục
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Đơn vị tính</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'pricePerUnit'}
                                    direction={orderBy === 'pricePerUnit' ? order : 'asc'}
                                    onClick={() => handleRequestSort('pricePerUnit')}
                                >
                                    Đơn giá
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Chu kỳ thu</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feeTypes
                            .sort(getComparator(order, orderBy))
                            .map((feeType) => (
                                <TableRow key={feeType.id}>
                                    <TableCell>{feeType.name}</TableCell>
                                    <TableCell>{feeType.category}</TableCell>
                                    <TableCell>{feeType.unit}</TableCell>
                                    <TableCell>
                                        {formatCurrency(feeType.pricePerUnit)} VNĐ/{feeType.unit}
                                    </TableCell>
                                    <TableCell>{feeType.billingCycle}</TableCell>
                                    <TableCell>{feeType.description}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleOpen(feeType)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(feeType.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <FeeTypeDialog
                open={open}
                feeType={editingFeeType}
                setFeeType={setEditingFeeType}
                onClose={handleClose}
                onSave={handleSave}
            />
        </PageTemplate>
    );
};

export default FeeTypeManagementPage;