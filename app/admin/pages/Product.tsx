// @ts-nocheck
import {
    faChevronLeft,
    faChevronRight,
    faDeleteLeft,
    faEdit,
    faPlus,
    faTimes,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';

const ProductManagement = () => {
    // ============= STATE MANAGEMENT =============
    const [products, setProducts] = useState([]);
    const [productVars, setProductVars] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [categories, setCategories] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState('basic');

    // Sử dụng state gộp cho sản phẩm
    const [editProduct, setEditProduct] = useState({
        product: {
            id: null,
            name: '',
            description: '',
            category_id: '',
            status: 'active',
            base_price: '',
            base_original_price: '',
            small_image: null,
            large_image: null,
            specifications: {},
        },
        variants: [
            {
                id: null,
                sku: '',
                price: '',
                original_price: '',
                stock: 0,
                specifications: {},
            },
        ],
        product_images: [
            {
                id: null,
                file: null,
                preview: null,
                url: null,
            },
        ],
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryRequiredFields, setCategoryRequiredFields] = useState([]);
    const [newCustomField, setNewCustomField] = useState({ name: '', value: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // ============= MODAL FUNCTIONS =============
    const openModal = (isEdit = false, productData = null) => {
        setIsModalOpen(true);
        setCurrentTab('basic');
        setIsEditing(isEdit);

        if (isEdit && productData) {
            // Populate form with existing product data
            prepareProductForEdit(productData);
        } else {
            // Reset for new product
            resetProductForm();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetProductForm();
        setIsEditing(false);
    };

    const getRequiredFields = (categoryId) => {
        const requiredFields = [];
        do {
            const category = categories.find((cat) => cat.id === parseInt(categoryId));
            requiredFields.push(...(category.require_fields || []));
            categoryId = category.parent_id;
        } while (categoryId);

        return requiredFields;
    };

    const resetProductForm = () => {
        setEditProduct({
            product: {
                id: null,
                name: '',
                description: '',
                category_id: '',
                status: 'active',
                base_price: '',
                base_original_price: '',
                small_image: null,
                large_image: null,
                specifications: {},
            },
            variants: [
                {
                    id: null,
                    sku: '',
                    price: '',
                    original_price: '',
                    stock: 0,
                    specifications: {},
                },
            ],
            product_images: [
                {
                    id: null,
                    file: null,
                    preview: null,
                    url: null,
                },
            ],
        });
        setSelectedCategory(null);
        setCategoryRequiredFields([]);
        setNewCustomField({ name: '', value: '' });
    };

    const prepareProductForEdit = async (productId) => {
        try {
            setIsLoading(true);
            // fetchWithToken product details from API

            const data = await products.find((product) => product.id === productId);
            const variants = await productVars.filter(
                (variant) => variant.product_id === productId
            );
            const images = await productImages.filter((image) => image.product_id === productId);
            const product = data;

            // Populate form with product data
            setEditProduct({
                product: {
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    category_id: product.category_id.toString(),
                    status: product.status,
                    base_price: product.base_price,
                    base_original_price: product.base_original_price || '',
                    small_image: null,
                    large_image: null,
                    specifications: product.specifications || {},
                },
                variants: variants.map((variant) => ({
                    id: variant.id,
                    sku: variant.sku || '',
                    price: variant.price,
                    original_price: variant.original_price || '',
                    stock: variant.stock,
                    specifications: variant.specifications || {},
                })) || [
                    {
                        id: null,
                        sku: '',
                        price: '',
                        original_price: '',
                        stock: 0,
                        specifications: {},
                    },
                ],
                product_images: images.map((image) => ({
                    id: image.id,
                    file: null,
                    preview: null,
                    url: image.url,
                })) || [
                    {
                        id: null,
                        file: null,
                        preview: null,
                        url: null,
                    },
                ],
            });

            setSelectedCategory(product.category_id.toString());
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            toast.error('Lỗi khi lấy thông tin sản phẩm: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ============= BASIC INFO HANDLERS =============
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                if (name === 'small_image' || name === 'large_image') {
                    const previewUrl = URL.createObjectURL(file);
                    setEditProduct((prev) => ({
                        ...prev,
                        product: {
                            ...prev.product,
                            [name]: file,
                            [`${name}_preview`]: previewUrl,
                        },
                    }));
                }
            }
        } else if (name === 'category_id') {
            setEditProduct((prev) => ({
                ...prev,
                product: {
                    ...prev.product,
                    [name]: value,
                },
            }));
            setSelectedCategory(value);
        } else {
            setEditProduct((prev) => ({
                ...prev,
                product: {
                    ...prev.product,
                    [name]: value,
                },
            }));
        }
    };

    const handleSpecificationChange = (field, value) => {
        setEditProduct((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                specifications: {
                    ...prev.product.specifications,
                    [field]: value,
                },
            },
        }));
    };

    const handleCustomFieldChange = (type, value) => {
        setNewCustomField((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    const addCustomField = () => {
        const { name, value } = newCustomField;

        if (!name.trim()) {
            toast.warning('Vui lòng nhập tên thuộc tính');
            return;
        }

        if (
            editProduct.product.specifications[name] !== undefined ||
            categoryRequiredFields.includes(name)
        ) {
            toast.warning(`Thuộc tính "${name}" đã tồn tại`);
            return;
        }

        setEditProduct((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                specifications: {
                    ...prev.product.specifications,
                    [name]: value,
                },
            },
        }));

        updateAllVariantsWithNewField(name, value);

        setNewCustomField({ name: '', value: '' });
    };

    const updateAllVariantsWithNewField = (fieldName, fieldValue) => {
        setEditProduct((prev) => ({
            ...prev,
            variants: prev.variants.map((variant) => ({
                ...variant,
                specifications: {
                    ...variant.specifications,
                    [fieldName]: fieldValue,
                },
            })),
        }));
    };

    const removeCustomField = (fieldName) => {
        setEditProduct((prev) => {
            const newSpecs = { ...prev.product.specifications };
            delete newSpecs[fieldName];

            return {
                ...prev,
                product: {
                    ...prev.product,
                    specifications: newSpecs,
                },
                variants: prev.variants.map((variant) => {
                    const variantSpecs = { ...variant.specifications };
                    delete variantSpecs[fieldName];
                    return {
                        ...variant,
                        specifications: variantSpecs,
                    };
                }),
            };
        });
    };

    // ============= VARIANT HANDLERS =============
    const handleVariantChange = (index, field, value) => {
        setEditProduct((prev) => {
            const newVariants = [...prev.variants];
            newVariants[index] = {
                ...newVariants[index],
                [field]: value,
            };
            return {
                ...prev,
                variants: newVariants,
            };
        });
    };

    const handleVariantSpecChange = (variantIndex, field, value) => {
        setEditProduct((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                specifications: {
                    ...newVariants[variantIndex].specifications,
                    [field]: value,
                },
            };
            return {
                ...prev,
                variants: newVariants,
            };
        });
    };

    const addVariant = () => {
        setEditProduct((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    id: null,
                    sku: '',
                    price: '',
                    original_price: '',
                    stock: 0,
                    specifications: { ...prev.product.specifications },
                },
            ],
        }));
    };

    const removeVariant = (index) => {
        if (editProduct.variants.length > 1) {
            setEditProduct((prev) => ({
                ...prev,
                variants: prev.variants.filter((_, i) => i !== index),
            }));
        } else {
            toast.warning('Phải có ít nhất một biến thể sản phẩm');
        }
    };

    // ============= PRODUCT IMAGE HANDLERS =============
    const handleProductImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            setEditProduct((prev) => {
                const newImages = [...prev.product_images];
                newImages[index] = {
                    ...newImages[index],
                    file,
                    preview: previewUrl,
                };
                return {
                    ...prev,
                    product_images: newImages,
                };
            });
        }
    };

    const addImageField = () => {
        setEditProduct((prev) => ({
            ...prev,
            product_images: [
                ...prev.product_images,
                {
                    id: null,
                    file: null,
                    preview: null,
                    url: null,
                },
            ],
        }));
    };

    const removeImageField = (index) => {
        if (editProduct.product_images.length > 1) {
            setEditProduct((prev) => ({
                ...prev,
                product_images: prev.product_images.filter((_, i) => i !== index),
            }));
        } else {
            toast.warning('Phải có ít nhất một ảnh sản phẩm');
        }
    };

    // ============= SEARCH AND PAGINATION HANDLERS =============
    const handleSearchInputChange = (e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => setStatusFilter(e.target.value);

    const handleDateStartChange = (e) => setDateStart(e.target.value);

    const handleDateEndChange = (e) => setDateEnd(e.target.value);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // ============= API CALLS =============
    const saveProduct = async () => {
        try {
            setIsLoading(true);
            if (!validateProductData()) {
                setIsLoading(false);
                return;
            }

            // const formData = createProductFormData();

            // console.log(formData)

            // Xác định phương thức và URL dựa trên việc đang thêm mới hay chỉnh sửa
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `http://127.0.0.1:8000/api/admin/products/${editProduct.product.id}`
                : 'http://127.0.0.1:8000/api/admin/products';

            const response = await fetchWithToken(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editProduct.product),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể lưu sản phẩm');
            }

            const data = await response.json();
            const productId = isEditing ? editProduct.product.id : data.data.id;
            // update product variants
            const variantPromises = editProduct.variants.map((variant) => {
                const url = isEditing
                    ? `http://127.0.0.1:8000/api/admin/product-variants/${variant.id}`
                    : 'http://127.0.0.1:8000/api/admin/product-variants';
                
                const method = variant.id ? 'PUT' : 'POST';
                const variantData = {
                    ...variant,
                    product_id: productId,
                };

                return fetchWithToken(url, {
                    method,
                    body: JSON.stringify(variantData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            });
            await Promise.all(variantPromises);

            // update product images
            const imagePromises = editProduct.product_images.map((image) => {
                const url = isEditing
                    ? `http://127.0.0.1:8000/api/admin/product-images/${image.id}`
                    : 'http://127.0.1:8000/api/admin/product-images';

                const method = image.id ? 'PUT' : 'POST';


                const formData = new FormData();
                formData.append('product_id', productId);
                formData.append('image', image.file);


                console.log(image)
                return fetchWithToken(url, {
                    method,
                    body: formData,
                    headers: {
                        accept: 'application/json',
                    }
                    // Don't set Content-Type header for FormData
                    // Browser will automatically set it with the correct boundary
                });

            })

            await Promise.all(imagePromises);

            toast.success(isEditing ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm thành công!');
            console.log('Sản phẩm:', data);

            // Refresh danh sách sản phẩm
            fetchWithTokenProducts();
            closeModal();
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            toast.error('Lỗi khi lưu sản phẩm: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const validateProductData = () => {
        try {
            const { product, variants } = editProduct;

            if (!product.name) throw new Error('Vui lòng nhập tên sản phẩm');
            if (!product.category_id) throw new Error('Vui lòng chọn danh mục');
            if (!product.base_price) throw new Error('Vui lòng nhập giá cơ bản');

            // Kiểm tra các trường yêu cầu của danh mục
            const missingFields = categoryRequiredFields.filter(
                (field) => !product.specifications[field]
            );
            if (missingFields.length > 0) {
                throw new Error(`Vui lòng nhập đầy đủ thông số: ${missingFields.join(', ')}`);
            }

            // Kiểm tra variants
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                if (!variant.price) {
                    throw new Error(`Biến thể ${i + 1}: Vui lòng nhập giá bán`);
                }
                if (!variant.stock) {
                    throw new Error(`Biến thể ${i + 1}: Vui lòng nhập số lượng tồn kho`);
                }
            }

            // Chỉ kiểm tra ảnh mới khi tạo mới hoặc khi thêm ảnh mới
            if (!isEditing) {
                const missingImages = editProduct.product_images.filter(
                    (img) => !img.file && !img.url
                );
                if (missingImages.length > 0) {
                    throw new Error('Vui lòng tải lên tất cả ảnh sản phẩm');
                }
            }

            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    const createProductFormData = () => {
        const { product, variants, product_images } = editProduct;
        const formData = new FormData();

        // Thông tin cơ bản của sản phẩm
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('category_id', product.category_id);
        formData.append('status', product.status);
        formData.append('base_price', product.base_price);
        if (product.base_original_price) {
            formData.append('base_original_price', product.base_original_price);
        }

        // Thêm specifications
        formData.append('specifications', JSON.stringify(product.specifications));

        // Thêm variants và ID của các variants đang edit
        const variantsData = variants.map((v) => {
            // Giữ lại ID nếu có khi đang edit
            const variantData = { ...v };
            // Loại bỏ các trường không cần thiết khi gửi dữ liệu
            if (variantData.id === null) {
                delete variantData.id;
            }
            return variantData;
        });
        formData.append('variants', JSON.stringify(variantsData));

        // Thêm thông tin về ảnh đã xóa nếu đang edit
        if (isEditing) {
            const removedImageIds = [];
            // Thêm logic xác định các ảnh đã bị xóa
            formData.append('removed_image_ids', JSON.stringify(removedImageIds));
        }

        // Thêm ảnh nhỏ và ảnh lớn nếu có
        if (product.small_image) {
            formData.append('small_image', product.small_image);
        }
        if (product.large_image) {
            formData.append('large_image', product.large_image);
        }

        // Thêm ảnh sản phẩm mới
        let newImageIndex = 0;
        product_images.forEach((img) => {
            if (img.file) {
                formData.append(`product_images[${newImageIndex}]`, img.file);
                newImageIndex++;
            }
        });

        return formData;
    };

    const fetchWithTokenProducts = async () => {
        try {
            const params = new URLSearchParams({
                keyword: searchTerm,
                status: statusFilter,
                date_start: dateStart,
                date_end: dateEnd,
                page: currentPage,
                per_page: 10,
            });
            const productRes = await fetchWithToken(
                `http://127.0.0.1:8000/api/admin/products/search?${params.toString()}`
            );
            const productData = await productRes.json();
            setProducts(productData.data.data || []);
            setTotalPages(productData.data.last_page || 1);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            toast.error('Lỗi khi lấy dữ liệu sản phẩm: ' + error.message);
        }
    };

    const fetchWithTokenProductVariants = async () => {
        try {
            const productVarRes = await fetchWithToken(`http://127.0.0.1:8000/api/admin/product-variants`);
            const productVarData = await productVarRes.json();
            setProductVars(productVarData.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu biến thể:', error);
            toast.error('Lỗi khi lấy dữ liệu biến thể: ' + error.message);
        }
    };

    const fetchWithTokenCategories = async () => {
        try {
            const categoryRes = await fetchWithToken(`http://127.0.0.1:8000/api/admin/categories`);
            const categoryData = await categoryRes.json();
            setCategories(categoryData.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu danh mục:', error);
            toast.error('Lỗi khi lấy dữ liệu danh mục: ' + error.message);
        }
    };

    const fetchWithTokenProductImages = async () => {
        try {
            const productImageRes = await fetchWithToken(`http://127.0.0.1:8000/api/admin/product-images`);
            const productImageData = await productImageRes.json();
            setProductImages(productImageData.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu hình ảnh sản phẩm:', error);
            toast.error('Lỗi khi lấy dữ liệu hình ảnh sản phẩm: ' + error.message);
        }
    };

    const deleteProduct = async (productId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetchWithToken(`http://127.0.0.1:8000/api/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể xóa sản phẩm');
            }

            toast.success('Xóa sản phẩm thành công!');
            fetchWithTokenProducts();
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            toast.error('Lỗi khi xóa sản phẩm: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ============= UTILITY FUNCTIONS =============
    const getProductImage = (productId) => {
        // Find all images for this product
        const images = productImages.filter(img => img.product_id === productId);
        
        if (images.length === 0) {
            // If no images found, return default image
            return 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692837880911';
        }
        
        // Find primary image (is_primary = true)
        const primaryImage = images.find(img => img.is_primary === true);
        if (primaryImage) {
            // Use appropriate URL property (image_url or url)
            return primaryImage.image_url || primaryImage.url;
        }
        
        // If no primary image, use the last image in the array
        const lastImage = images[images.length - 1];
        return lastImage.image_url || lastImage.url;
    };

    // ============= SIDE EFFECTS =============
    useEffect(() => {
        if (selectedCategory) {
            updateRequiredFieldsForCategory();
        }
    }, [selectedCategory, categories]);

    const updateRequiredFieldsForCategory = () => {
        const fields = getRequiredFields(selectedCategory);

        setCategoryRequiredFields(fields);

        // Khởi tạo specifications từ các trường yêu cầu mà không xóa các trường đã thêm
        setEditProduct((prev) => {
            const initialSpecs = {};
            fields.forEach((field) => {
                initialSpecs[field] = prev.product.specifications[field] || '';
            });

            // Giữ lại các trường không phải required nhưng đã được thêm
            const customSpecs = Object.entries(prev.product.specifications)
                .filter(([key]) => !fields.includes(key))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

            return {
                ...prev,
                product: {
                    ...prev.product,
                    specifications: { ...initialSpecs, ...customSpecs },
                },
            };
        });

        updateVariantsWithRequiredFields(fields);
    };

    const updateVariantsWithRequiredFields = (fields) => {
        setEditProduct((prev) => ({
            ...prev,
            variants: prev.variants.map((variant) => {
                // Giữ lại các trường custom specs cho variant
                const variantCustomSpecs = Object.entries(variant.specifications)
                    .filter(([key]) => !fields.includes(key))
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

                // Cập nhật hoặc giữ lại các trường required specs
                const variantRequiredSpecs = {};
                fields.forEach((field) => {
                    variantRequiredSpecs[field] = variant.specifications[field] || '';
                });

                return {
                    ...variant,
                    specifications: { ...variantRequiredSpecs, ...variantCustomSpecs },
                };
            }),
        }));
    };

    useEffect(() => {
        const fetchWithTokenAllData = async () => {
            try {
                await fetchWithTokenProducts();
                await fetchWithTokenProductVariants();
                await fetchWithTokenCategories();
                await fetchWithTokenProductImages();
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error.message);
                toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
            }
        };
        fetchWithTokenAllData();
    }, [currentPage, searchTerm, statusFilter, dateStart, dateEnd]);

    // ============= RENDER UI COMPONENTS =============
    const renderBasicInfoTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">
                            Tên sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editProduct.product.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category_id"
                            value={editProduct.product.category_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">
                            Giá cơ bản <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="base_price"
                            value={editProduct.product.base_price}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Giá gốc (nếu có giảm giá)</label>
                        <input
                            type="number"
                            name="base_original_price"
                            value={editProduct.product.base_original_price}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Trạng thái</label>
                        <select
                            name="status"
                            value={editProduct.product.status}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="active">Đang bán</option>
                            <option value="inactive">Ngưng bán</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Mô tả sản phẩm</label>
                        <textarea
                            name="description"
                            value={editProduct.product.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="5"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {selectedCategory && categoryRequiredFields.length > 0 && (
                        <div>
                            <label className="block mb-2">
                                Thông số kỹ thuật bắt buộc <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-300 rounded-md p-4 space-y-3">
                                {categoryRequiredFields.map((field, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2">
                                        <div className="font-medium">{field}:</div>
                                        <input
                                            type="text"
                                            value={editProduct.product.specifications[field] || ''}
                                            onChange={(e) =>
                                                handleSpecificationChange(field, e.target.value)
                                            }
                                            className="p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedCategory && (
                        <div>
                            <label className="block mb-2">Thêm thuộc tính tùy chỉnh</label>
                            <div className="border border-gray-300 rounded-md p-4 space-y-3">
                                {Object.entries(editProduct.product.specifications || {}).map(
                                    ([key, value], index) =>
                                        !categoryRequiredFields.includes(key) && (
                                            <div key={index} className="flex space-x-2 mb-2">
                                                <div className="font-medium mr-auto">{key}:</div>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleSpecificationChange(
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="p-2 border border-gray-300 rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomField(key)}
                                                    className="btn btn-error"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </div>
                                        )
                                )}

                                <div className="flex space-x-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Tên thuộc tính"
                                        value={newCustomField.name}
                                        onChange={(e) =>
                                            handleCustomFieldChange('name', e.target.value)
                                        }
                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Giá trị"
                                        value={newCustomField.value}
                                        onChange={(e) =>
                                            handleCustomFieldChange('value', e.target.value)
                                        }
                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomField}
                                        className="btn btn-primary"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedCategory && (
                        <div className="bg-yellow-100 p-4 rounded-md">
                            <p className="text-yellow-700">
                                Vui lòng chọn danh mục sản phẩm để xem các thông số kỹ thuật cần
                                thiết.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => setCurrentTab('variants')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Tiếp theo: Biến thể sản phẩm
                </button>
            </div>
        </div>
    );

    const renderVariantsTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Biến thể sản phẩm</h3>
                <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Thêm biến thể
                </button>
            </div>

            {editProduct.variants.map((variant, index) => (
                <div key={index} className="border border-gray-300 rounded-md p-4 relative">
                    <div className="absolute top-2 right-2">
                        <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={editProduct.variants.length <= 1}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                    <h4 className="font-medium mb-3">
                        Biến thể #{index + 1} {variant.id ? `(ID: ${variant.id})` : ''}
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-1">SKU</label>
                            <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Tồn kho <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                    handleVariantChange(index, 'stock', e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Giá bán <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                    handleVariantChange(index, 'price', e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Giá gốc (nếu có giảm giá)</label>
                            <input
                                type="number"
                                value={variant.original_price}
                                onChange={(e) =>
                                    handleVariantChange(index, 'original_price', e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                            />
                        </div>
                    </div>

                    {selectedCategory && (
                        <div>
                            <label className="block mb-2">Thông số kỹ thuật</label>
                            <div className="grid grid-cols-2 gap-4">
                                {categoryRequiredFields.map((field, fieldIndex) => (
                                    <div key={fieldIndex} className="flex items-center space-x-2">
                                        <span className="min-w-[120px] font-medium">
                                            {field}: <span className="text-red-500">*</span>
                                        </span>
                                        <input
                                            type="text"
                                            value={variant.specifications[field] || ''}
                                            onChange={(e) =>
                                                handleVariantSpecChange(
                                                    index,
                                                    field,
                                                    e.target.value
                                                )
                                            }
                                            className="flex-1 p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                ))}

                                {Object.entries(variant.specifications || {}).map(
                                    ([key, value]) =>
                                        !categoryRequiredFields.includes(key) && (
                                            <div key={key} className="flex items-center space-x-2">
                                                <span className="min-w-[120px]">{key}:</span>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleVariantSpecChange(
                                                            index,
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setCurrentTab('basic')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Quay lại: Thông tin cơ bản
                </button>

                <button
                    type="button"
                    onClick={() => setCurrentTab('images')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Tiếp theo: Hình ảnh
                </button>
            </div>
        </div>
    );

    const renderImagesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Hình ảnh sản phẩm</h3>
                <button
                    type="button"
                    onClick={addImageField}
                    className="flex items-center px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Thêm ảnh
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {editProduct.product_images.map((image, index) => (
                    <div key={index} className="border border-gray-300 rounded-md p-4 relative">
                        <div className="absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="text-red-500 hover:text-red-700"
                                disabled={editProduct.product_images.length <= 1}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>

                        <h4 className="font-medium mb-3">
                            Ảnh #{index + 1} {image.id ? `(ID: ${image.id})` : ''}
                        </h4>

                        <input
                            type="file"
                            onChange={(e) => handleProductImageChange(index, e)}
                            className="mb-2"
                            accept="image/*"
                        />

                        {image.preview && (
                            <div className="mt-2">
                                <img
                                    src={image.preview}
                                    alt={`Xem trước ${index + 1}`}
                                    className="max-w-full h-auto max-h-40 rounded"
                                />
                            </div>
                        )}

                        {!image.preview && image.url && (
                            <div className="mt-2">
                                <img
                                    src={image.url}
                                    alt={`Ảnh ${index + 1}`}
                                    className="max-w-full h-auto max-h-40 rounded"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Ảnh hiện tại. Tải lên ảnh mới để thay thế.
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setCurrentTab('variants')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Quay lại: Biến thể sản phẩm
                </button>

                <button
                    type="submit"
                    onClick={saveProduct}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : isEditing ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
                </button>
            </div>
        </div>
    );

    const renderProductList = () => (
        <div className="grid grid-co1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
            <table className="table text-lg w-full">
                <thead className="text-lg">
                    <tr>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Tồn kho</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {products.map((product) => (
                        <tr key={product.id} className="">
                            <td>{product.sku}</td>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="product-img">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <img
                                                src={getProductImage(product.id)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="">{product.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {product.category?.name}
                            </td>
                            <td>
                                {productVars
                                    .filter((productVar) => productVar.product_id === product.id)
                                    .reduce(
                                        (totalStock, productVar) => totalStock + productVar.stock,
                                        0
                                    ) || 'Not Found'}
                            </td>
                            <td>{product.created_at}</td>
                            <td>
                                <span
                                    className={`border border-gray-300 rounded-lg px-2 py-1 ${
                                        product.status === 'active'
                                            ? 'text-green-700'
                                            : 'text-red-500'
                                    }`}
                                >
                                    {product.status === 'active' ? 'Đang bán' : 'Ngưng bán'}
                                </span>
                            </td>
                            <td>
                                <div className="flex justify-start">
                                    <button
                                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                                        onClick={() => openModal(true, product.id)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                    </button>
                                    <button
                                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        <FontAwesomeIcon icon={faDeleteLeft} className="text-xl" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderSearchBar = () => (
        <div className="flex flex-wrap justify-between mb-6">
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col mb-4 mr-8 md:mb-0">
                    <span className="text-xl mb-2">Tìm kiếm</span>
                    <input
                        id="searchName"
                        type="text"
                        placeholder="Tìm kiếm theo tên sản phẩm"
                        className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="flex flex-col mb-4 mr-8 md:mb-0 ">
                    <span className="text-xl mb-2">Ngày bắt đầu</span>
                    <input
                        id="searchDateStart"
                        type="date"
                        className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
                        value={dateStart}
                        onChange={handleDateStartChange}
                    />
                </div>
                <div className="flex flex-col mb-4 mr-8 md:mb-0">
                    <span className="text-xl mb-2">Ngày kết thúc</span>
                    <input
                        id="searchDateEnd"
                        type="date"
                        className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
                        value={dateEnd}
                        onChange={handleDateEndChange}
                    />
                </div>

                <div className="flex flex-col mb-4 md:mb-0">
                    <span className="text-xl mb-2">Trạng thái</span>
                    <select
                        id="statusFilter"
                        className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
                        value={statusFilter}
                        onChange={handleStatusChange}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang bán</option>
                        <option value="inactive">Ngưng bán</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderPagination = () => (
        <div className="flex justify-center mt-4">
            <button
                className="btn rounded-lg ml-3"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
            </button>
            <span className="px-4 py-2 mx-2 text-gray-800">
                Trang {currentPage} / {totalPages}
            </span>
            <button
                className="btn rounded-lg mr-3"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
            </button>
        </div>
    );

    const renderProductModal = () => (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[80em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {isEditing
                            ? `Chỉnh sửa sản phẩm #${editProduct.product.id}`
                            : 'Thêm sản phẩm mới'}
                    </h2>
                    <button onClick={closeModal}>
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                <div className="border-b mb-4">
                    <nav className="flex space-x-4">
                        <button
                            className={`px-4 py-2 font-medium ${
                                currentTab === 'basic'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => {
                                setCurrentTab('basic');
                            }}
                        >
                            Thông tin cơ bản
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${
                                currentTab === 'variants'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setCurrentTab('variants')}
                        >
                            Biến thể sản phẩm
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${
                                currentTab === 'images'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setCurrentTab('images')}
                        >
                            Hình ảnh
                        </button>
                    </nav>
                </div>

                <div>
                    {currentTab === 'basic' && renderBasicInfoTab()}
                    {currentTab === 'variants' && renderVariantsTab()}
                    {currentTab === 'images' && renderImagesTab()}
                </div>
            </div>
        </div>
    );

    return (
        <div className="overflow-x-hidden min-h-screen bg-white p-4">
            <ToastContainer />
            <header className="py-10">
                <div className="container flex justify-between px-4">
                    <h1 className="text-2xl font-bold text-gray-800">Sản phẩm</h1>
                    <button
                        className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
                        onClick={() => openModal(false)}
                    >
                        Thêm sản phẩm +
                    </button>
                </div>
            </header>
            <main className="max-w-screen overflow-x-hidden px-4 py-6">
                {renderSearchBar()}
                {renderProductList()}
                {renderPagination()}
            </main>

            {isModalOpen && renderProductModal()}
        </div>
    );
};

export default ProductManagement;
