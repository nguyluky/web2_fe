// @ts-nocheck
import {
    faChevronLeft,
    faChevronRight,
    faDeleteLeft,
    faEdit,
    faPlus,
    faTimes,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState('basic');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryRequiredFields, setCategoryRequiredFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State cho thông tin sản phẩm mới
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        category_id: '',
        status: 'active',
        base_price: '',
        base_original_price: '',
        small_image: null,
        large_image: null,
        specifications: {}
    });

    // State cho thuộc tính tùy chỉnh
    const [newCustomField, setNewCustomField] = useState({ name: '', value: '' });

    // State cho variants
    const [variants, setVariants] = useState([{
        sku: '',
        price: '',
        original_price: '',
        stock: 0,
        specifications: {}
    }]);

    const [productImages, setProductImages] = useState([{
        file: null,
        preview: null
    }]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/admin/categories');
                if (!response.ok) throw new Error('Không thể lấy danh sách danh mục');
                const data = await response.json();
                setCategories(data.data.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error.message);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const category = categories.find(cat => cat.id === parseInt(selectedCategory));

            if (category && category.require_fields) {
                let fields = [];

                try {
                    if (typeof category.require_fields === 'string') {
                        fields = JSON.parse(category.require_fields);
                    } else {
                        fields = category.require_fields;
                    }
                } catch (error) {
                    console.error('Lỗi khi parse require_fields:', error);
                    fields = [];
                }

                setCategoryRequiredFields(fields);

                const initialSpecs = {};
                fields.forEach(field => {
                    initialSpecs[field] = '';
                });

                setNewProduct(prev => ({
                    ...prev,
                    specifications: initialSpecs
                }));

                setVariants(prevVariants =>
                    prevVariants.map(variant => ({
                        ...variant,
                        specifications: { ...initialSpecs }
                    }))
                );
            }
        }
    }, [selectedCategory, categories]);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTab('basic');
        setNewProduct({
            name: '',
            description: '',
            category_id: '',
            status: 'active',
            base_price: '',
            base_original_price: '',
            small_image: null,
            large_image: null,
            specifications: {}
        });
        setVariants([{
            sku: '',
            price: '',
            original_price: '',
            stock: 0,
            specifications: {}
        }]);
        setProductImages([{
            file: null,
            preview: null
        }]);
        setSelectedCategory(null);
        setCategoryRequiredFields([]);
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                if (name === 'small_image' || name === 'large_image') {
                    const previewUrl = URL.createObjectURL(file);
                    setNewProduct(prev => ({
                        ...prev,
                        [name]: file,
                        [`${name}_preview`]: previewUrl
                    }));
                }
            }
        } else if (name === 'category_id') {
            setNewProduct(prev => ({ ...prev, [name]: value }));
            setSelectedCategory(value);
        } else {
            setNewProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSpecificationChange = (field, value) => {
        setNewProduct(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [field]: value
            }
        }));
    };

    const handleVariantChange = (index, field, value) => {
        setVariants(prevVariants => {
            const newVariants = [...prevVariants];
            newVariants[index] = {
                ...newVariants[index],
                [field]: value
            };
            return newVariants;
        });
    };

    const handleVariantSpecChange = (variantIndex, field, value) => {
        setVariants(prevVariants => {
            const newVariants = [...prevVariants];
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                specifications: {
                    ...newVariants[variantIndex].specifications,
                    [field]: value
                }
            };
            return newVariants;
        });
    };

    const addVariant = () => {
        const initialSpecs = {};
        categoryRequiredFields.forEach(field => {
            initialSpecs[field] = '';
        });

        setVariants(prevVariants => [
            ...prevVariants,
            {
                sku: '',
                price: '',
                original_price: '',
                stock: 0,
                specifications: initialSpecs
            }
        ]);
    };

    const removeVariant = (index) => {
        if (variants.length > 1) {
            setVariants(prevVariants =>
                prevVariants.filter((_, i) => i !== index)
            );
        } else {
            toast.warning('Phải có ít nhất một biến thể sản phẩm');
        }
    };

    const handleProductImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            setProductImages(prevImages => {
                const newImages = [...prevImages];
                newImages[index] = {
                    file,
                    preview: previewUrl
                };
                return newImages;
            });
        }
    };

    const addImageField = () => {
        setProductImages(prevImages => [
            ...prevImages,
            { file: null, preview: null }
        ]);
    };

    const removeImageField = (index) => {
        if (productImages.length > 1) {
            setProductImages(prevImages =>
                prevImages.filter((_, i) => i !== index)
            );
        } else {
            toast.warning('Phải có ít nhất một ảnh sản phẩm');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!newProduct.name) throw new Error('Vui lòng nhập tên sản phẩm');
            if (!newProduct.category_id) throw new Error('Vui lòng chọn danh mục');
            if (!newProduct.base_price) throw new Error('Vui lòng nhập giá cơ bản');

            const missingFields = categoryRequiredFields.filter(field => !newProduct.specifications[field]);
            if (missingFields.length > 0) {
                throw new Error(`Vui lòng nhập đầy đủ thông số: ${missingFields.join(', ')}`);
            }

            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                if (!variant.price) {
                    throw new Error(`Biến thể ${i + 1}: Vui lòng nhập giá bán`);
                }
                if (!variant.stock) {
                    throw new Error(`Biến thể ${i + 1}: Vui lòng nhập số lượng tồn kho`);
                }

                const missingVariantFields = categoryRequiredFields.filter(field => !variant.specifications[field]);
                if (missingVariantFields.length > 0) {
                    throw new Error(`Biến thể ${i + 1}: Vui lòng nhập đầy đủ thông số: ${missingVariantFields.join(', ')}`);
                }
            }

            const missingImages = productImages.filter(img => !img.file);
            if (missingImages.length > 0) {
                throw new Error('Vui lòng tải lên tất cả ảnh sản phẩm');
            }

            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('category_id', newProduct.category_id);
            formData.append('status', newProduct.status);
            formData.append('base_price', newProduct.base_price);
            if (newProduct.base_original_price) {
                formData.append('base_original_price', newProduct.base_original_price);
            }

            formData.append('specifications', JSON.stringify(newProduct.specifications));

            formData.append('variants', JSON.stringify(variants));

            if (newProduct.small_image) {
                formData.append('small_image', newProduct.small_image);
            }
            if (newProduct.large_image) {
                formData.append('large_image', newProduct.large_image);
            }

            productImages.forEach((img, index) => {
                if (img.file) {
                    formData.append(`product_images[${index}]`, img.file);
                }
            });

            const response = await fetch('http://127.0.0.1:8000/api/admin/products', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tạo sản phẩm');
            }

            const productsResponse = await fetch('/api/products');
            const productsData = await productsResponse.json();
            setProducts(productsData);

            toast.success('Thêm sản phẩm thành công!');
            closeModal();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error.message);
            toast.error('Thêm sản phẩm thất bại: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý thay đổi trong trường tùy chỉnh mới
    const handleCustomFieldChange = (type, value) => {
        setNewCustomField(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Thêm thuộc tính tùy chỉnh vào sản phẩm
    const addCustomField = () => {
        const { name, value } = newCustomField;
        
        if (!name.trim()) {
            toast.warning('Vui lòng nhập tên thuộc tính');
            return;
        }

        // Kiểm tra xem thuộc tính đã tồn tại chưa (kể cả trong categoryRequiredFields)
        if (newProduct.specifications[name] !== undefined || categoryRequiredFields.includes(name)) {
            toast.warning(`Thuộc tính "${name}" đã tồn tại`);
            return;
        }

        // Thêm thuộc tính mới vào specifications
        setNewProduct(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [name]: value
            }
        }));

        // Thêm thuộc tính mới vào tất cả các biến thể
        setVariants(prevVariants => 
            prevVariants.map(variant => ({
                ...variant,
                specifications: {
                    ...variant.specifications,
                    [name]: value
                }
            }))
        );

        // Reset field
        setNewCustomField({ name: '', value: '' });
    };

    // Hàm trợ giúp để lấy tên danh mục từ ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Không xác định';
    };
    
    // Hàm trợ giúp để lấy thông tin về biến thể sản phẩm
    const getProductVariants = (productId) => {
        // Đây là một giá trị giả định, trong thực tế bạn sẽ lấy từ API
        return "10";
    };

    return (
        <div className="overflow-x-hidden min-h-screen bg-white p-4">
            <ToastContainer />

            <header className="py-10">
                <div className="container flex justify-between px-4">
                    <h1 className="text-2xl font-bold text-gray-800">Sản phẩm</h1>
                    <button
                        className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
                        onClick={openModal}
                    >
                        Thêm sản phẩm +
                    </button>
                </div>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[80em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Thêm sản phẩm mới</h2>
                            <button onClick={closeModal}>
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                        </div>

                        <div className="border-b mb-4">
                            <nav className="flex space-x-4">
                                <button
                                    className={`px-4 py-2 font-medium ${currentTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setCurrentTab('basic')}
                                >
                                    Thông tin cơ bản
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${currentTab === 'variants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setCurrentTab('variants')}
                                >
                                    Biến thể sản phẩm
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${currentTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setCurrentTab('images')}
                                >
                                    Hình ảnh
                                </button>
                            </nav>
                        </div>

                        <form onSubmit={handleAddProduct}>
                            {currentTab === 'basic' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newProduct.name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2">Danh mục <span className="text-red-500">*</span></label>
                                                <select
                                                    name="category_id"
                                                    value={newProduct.category_id}
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
                                                <label className="block mb-2">Giá cơ bản <span className="text-red-500">*</span></label>
                                                <input
                                                    type="number"
                                                    name="base_price"
                                                    value={newProduct.base_price}
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
                                                    value={newProduct.base_original_price}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    min="0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2">Trạng thái</label>
                                                <select
                                                    name="status"
                                                    value={newProduct.status}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="active">Hoạt động</option>
                                                    <option value="inactive">Không hoạt động</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block mb-2">Ảnh nhỏ (small_image)</label>
                                                <input
                                                    type="file"
                                                    name="small_image"
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    accept="image/*"
                                                />
                                                {newProduct.small_image_preview && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={newProduct.small_image_preview}
                                                            alt="Small image preview"
                                                            className="h-20 object-contain border rounded-md"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block mb-2">Ảnh lớn (large_image)</label>
                                                <input
                                                    type="file"
                                                    name="large_image"
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    accept="image/*"
                                                />
                                                {newProduct.large_image_preview && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={newProduct.large_image_preview}
                                                            alt="Large image preview"
                                                            className="h-32 object-contain border rounded-md"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-2">Mô tả sản phẩm</label>
                                                <textarea
                                                    name="description"
                                                    value={newProduct.description}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    rows="5"
                                                />
                                            </div>

                                            {selectedCategory && categoryRequiredFields.length > 0 && (
                                                <div>
                                                    <label className="block mb-2">Thông số kỹ thuật <span className="text-red-500">*</span></label>
                                                    <div className="border border-gray-300 rounded-md p-4 space-y-3">
                                                        {categoryRequiredFields.map((field, index) => (
                                                            <div key={index} className="grid grid-cols-2 gap-2">
                                                                <div className="font-medium">{field}:</div>
                                                                <input
                                                                    type="text"
                                                                    value={newProduct.specifications[field] || ''}
                                                                    onChange={(e) => handleSpecificationChange(field, e.target.value)}
                                                                    className="p-2 border border-gray-300 rounded-md"
                                                                    required
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {!selectedCategory && (
                                                <div className="bg-yellow-100 p-4 rounded-md">
                                                    <p className="text-yellow-700">
                                                        Vui lòng chọn danh mục sản phẩm để xem các thông số kỹ thuật cần thiết.
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block mb-2">Thêm thuộc tính tùy chỉnh</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Tên thuộc tính"
                                                        value={newCustomField.name}
                                                        onChange={(e) => handleCustomFieldChange('name', e.target.value)}
                                                        className="p-2 border border-gray-300 rounded-md"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Giá trị"
                                                        value={newCustomField.value}
                                                        onChange={(e) => handleCustomFieldChange('value', e.target.value)}
                                                        className="p-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addCustomField}
                                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                >
                                                    Thêm thuộc tính
                                                </button>
                                            </div>

                                            {selectedCategory && (
                                                <div>
                                                    <label className="block mb-2 mt-4">Thông số kỹ thuật đã thêm</label>
                                                    <div className="border border-gray-300 rounded-md p-4 space-y-3">
                                                        {Object.entries(newProduct.specifications || {}).map(([key, value], index) => (
                                                            !categoryRequiredFields.includes(key) && (
                                                                <div key={index} className="grid grid-cols-[1fr,2fr,auto] gap-2 items-center">
                                                                    <div className="font-medium">{key}:</div>
                                                                    <input
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                                        className="p-2 border border-gray-300 rounded-md"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            // Xóa thuộc tính khỏi sản phẩm
                                                                            const newSpecs = { ...newProduct.specifications };
                                                                            delete newSpecs[key];
                                                                            setNewProduct(prev => ({
                                                                                ...prev,
                                                                                specifications: newSpecs
                                                                            }));
                                                                            
                                                                            // Xóa thuộc tính khỏi tất cả biến thể
                                                                            setVariants(prevVariants => 
                                                                                prevVariants.map(variant => {
                                                                                    const variantSpecs = { ...variant.specifications };
                                                                                    delete variantSpecs[key];
                                                                                    return {
                                                                                        ...variant,
                                                                                        specifications: variantSpecs
                                                                                    };
                                                                                })
                                                                            );
                                                                        }}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </button>
                                                                </div>
                                                            )
                                                        ))}
                                                        
                                                        {Object.keys(newProduct.specifications || {}).filter(key => !categoryRequiredFields.includes(key)).length === 0 && (
                                                            <p className="text-gray-500 italic">Chưa có thông số tùy chỉnh nào.</p>
                                                        )}
                                                    </div>
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
                            )}

                            {currentTab === 'variants' && (
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

                                    {variants.map((variant, index) => (
                                        <div key={index} className="border border-gray-300 rounded-md p-4 relative">
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                    disabled={variants.length <= 1}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>

                                            <h4 className="font-medium mb-3">Biến thể #{index + 1}</h4>

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
                                                    <label className="block mb-1">Tồn kho <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        min="0"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1">Giá bán <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
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
                                                        onChange={(e) => handleVariantChange(index, 'original_price', e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            {selectedCategory && categoryRequiredFields.length > 0 && (
                                                <div>
                                                    <label className="block mb-2">Thông số kỹ thuật <span className="text-red-500">*</span></label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {categoryRequiredFields.map((field, fieldIndex) => (
                                                            <div key={fieldIndex} className="flex items-center space-x-2">
                                                                <span className="min-w-[120px]">{field}:</span>
                                                                <input
                                                                    type="text"
                                                                    value={variant.specifications[field] || ''}
                                                                    onChange={(e) => handleVariantSpecChange(index, field, e.target.value)}
                                                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                                                    required
                                                                />
                                                            </div>
                                                        ))}
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
                            )}

                            {currentTab === 'images' && (
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
                                        {productImages.map((image, index) => (
                                            <div key={index} className="border border-gray-300 rounded-md p-4 relative">
                                                <div className="absolute top-2 right-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageField(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                        disabled={productImages.length <= 1}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>

                                                <h4 className="font-medium mb-3">Ảnh #{index + 1}</h4>

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
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-32 object-contain border rounded-md"
                                                        />
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
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Đang xử lý...' : 'Lưu sản phẩm'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
                <table className="table text-lg w-full">
                    <thead className="text-lg">
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá bán</th>
                            <th>Tồn kho</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {products.map((product) => (
                            <tr key={product.id} className="">
                                <td>{product.id}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="product-img">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692837880911"
                                                    alt="iPhone 15 Pro"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{getCategoryName(product.category_id)}</td>
                                <td>{product.base_price}</td>
                                <td>{getProductVariants(product.id)}</td>
                                <td>{product.created_at}</td>
                                <td>
                                    <span
                                        className={`border border-gray-300 rounded-lg px-2 py-1 ${
                                            product.status === 'hd' ? 'text-green-700' : 'text-red-500'
                                        }`}
                                    >
                                        {product.status === 'hd' ? 'Hoạt động' : 'Ẩn'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex justify-start">
                                        <button className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
                                            <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                        </button>
                                        <button className="flex  w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
                                            <FontAwesomeIcon icon={faDeleteLeft} className="text-xl" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                <button className="btn rounded-lg ml-3">
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                </button>
                <button className="px-4 py-4 mx-2 badge text-gray-800 rounded-md hover:bg-gray-400 mt-1">
                    <span className="text-lg">1</span>
                </button>
                <button className="btn rounded-lg mr-3">
                    <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default ProductManagement;
