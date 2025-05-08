import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';

interface Spec {
  name: string;
  value: string;
}

interface Feat {
  name: string;
  value: string;
}

interface ProductModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  productId?: string;
  initialData?: {
    name: string;
    category: string;
    price: string;
    originalPrice: string;
    description: string;
    status?: boolean;
    specs: Spec[];
    features: Feat[];
    images: File[];
  };
  onClose: () => void;
  onSave: (data: any) => void;
}

const productSchema = yup.object({
  name: yup.string().required('Tên sản phẩm không đựợc để trống'),
  category: yup.string().required('Danh mục không được để trống'),
  price: yup.string().required('Giá bán không được để trống'),
  originalPrice: yup.string().required('Giá gốc không được để trống'),
  description: yup.string().required('Mô tả không được để trống'),
  status: yup.boolean().optional(),
  specs: yup.array(
    yup.object({
      name: yup.string().required("Tên không được để trống"),
      value: yup.string().required("Giá trị không được để trống"),
    })
  ),
  features: yup.array(
    yup.object({
      name: yup.string().required("Tên không được để trống"),
      value: yup.string().required("Giá trị không được để trống"),
    })
  ),
  images: yup.array().min(1, 'Vui lòng tải lên ít nhất một hình ảnh'),
});

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  isEditMode,
  initialData,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'product' | 'specs' | 'feature'>('product');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<boolean>(true);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [features, setFeatures] = useState<Feat[]>([]);
  const [imageFile, setImageFile] = useState<File[]>([]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setProductName(initialData.name || '');
      setCategory(initialData.category || '');
      setPrice(initialData.price || '');
      setOriginalPrice(initialData.originalPrice || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status ?? true);
      setSpecs(initialData.specs || []);
      setFeatures(initialData.features || []);
      setImageFile(initialData.images || []);
      setActiveTab('product');
    } else {
      setProductName('');
      setCategory('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setSpecs([]);
      setFeatures([]);
      setImageFile([]);
      setActiveTab('product');
    }
  }, [isOpen]);

  const handleAddSpec = (e: React.MouseEvent) => {
    e.preventDefault();
    setSpecs([...specs, { name: '', value: '' }]);
  };

  const handleChangeSpec = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleDeleteSpec = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleAddFeature = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeatures([...features, { name: '', value: '' }]);
  };

  const handleChangeFeature = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const handleDeleteFeature = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setImageFile(imageFile.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: productName,
      category,
      price,
      originalPrice,
      description,
      status,
      specs,
      features,
      images: imageFile,
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white pb-3 px-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[96vh] overflow-y-auto mx-auto">
        <div className="sticky top-0 bg-white border-b">
          <div className="py-5">
            <h2 className="text-xl font-semibold text-center">
              {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-5 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>

          <div className="flex gap-2">
            <a
              className={`tab ${activeTab === 'product' && 'tab-active'}`}
              onClick={() => setActiveTab('product')}
            >
              Thông tin
            </a>
            <a
              className={`tab ${activeTab === 'specs' && 'tab-active'}`}
              onClick={() => setActiveTab('specs')}
            >
              Thông số
            </a>
            <a
              className={`tab ${activeTab === 'feature' && 'tab-active'}`}
              onClick={() => setActiveTab('feature')}
            >
              Tính năng
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-1">
          {activeTab === 'product' && (
            <>
              <div className="mb-4">
                <label className="block">Tên sản phẩm</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block">Loại sản phẩm</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option>Loại 1</option>
                  <option>Loại 2</option>
                </select>
              </div>

              {isEditMode && (
                <div className="mb-4">
                  <label className="block">Trạng thái</label>
                  <select
                    value={status ? 'on' : 'off'}
                    onChange={(e) => setStatus(e.target.value === 'on')}
                    className="w-full p-2 border rounded"
                  >
                    <option value="on">Bật</option>
                    <option value="off">Tắt</option>
                  </select>
                </div>
              )}

              {/* Tải hình ảnh */}
              <div className="mb-4">
                <label className="block text-gray-700">Tải hình ảnh</label>
                <div className="flex justify-between mt-2">
                  {/* Tải file ảnh */}
                  <div className="uploadImage flex justify-between ml-2">
                    {/* Ảnh bìa */}
                    <div className="flex flex-col items-center outline outline-2 outline-dashed outline-gray-500 rounded-lg p-4">
                      <FontAwesomeIcon icon={faImage} className="text-gray-500 text-3xl mb-2" />
                      <label
                        htmlFor="image-upload"
                        className="p-1 bg-gray-300 text-sm text-gray rounded hover:bg-blue-300 hover:text-blue-800 cursor-pointer"
                      >
                        Tải ảnh lên
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* File name display */}
                  <div className="flex flex-col items-start">
                    {imageFile && imageFile.length > 0 && (
                      <div className="flex flex-col outline rounded p-3 w-110 h-25 overflow-y-auto">
                        {imageFile.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-1 border rounded mb-2"
                          >
                            {/* File name */}
                            <span className="text-gray-700 text-lg">{file.name}</span>

                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteImage(e, index)}
                              className="text-gray p-1 rounded-full text-sm"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block">Giá bán</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block">Giá gốc</label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block">Mô tả</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          {activeTab === 'specs' && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={handleAddSpec}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  + Thêm
                </button>
              </div>
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={spec.name}
                    onChange={(e) => handleChangeSpec(index, 'name', e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Tên"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => handleChangeSpec(index, 'value', e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Giá trị"
                  />
                  <button onClick={(e) => handleDeleteSpec(e, index)}>
                    <FontAwesomeIcon icon={faDeleteLeft} />
                  </button>
                </div>
              ))}
            </>
          )}

          {activeTab === 'feature' && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddFeature}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  + Thêm
                </button>
              </div>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={feature.name}
                    onChange={(e) => handleChangeFeature(index, 'name', e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Tên"
                  />
                  <input
                    value={feature.value}
                    onChange={(e) => handleChangeFeature(index, 'value', e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Giá trị"
                  />
                  <button onClick={(e) => handleDeleteFeature(e, index)}>
                    <FontAwesomeIcon icon={faDeleteLeft} />
                  </button>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {isEditMode ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
