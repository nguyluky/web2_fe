import {
    faEnvelope,
    faEye,
    faEyeSlash,
    faLock,
    faPhone,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';

type FormValues = {
  email: string;
  password: string;
  username: string;
  fullname: string;
  phone_number: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const {register: register_, isAuthenticated, error: error1} = useAuth();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      console.log('Đăng ký với:', data);
        const response = await register_({
            email: data.email,
            password: data.password,
            username: data.username,
            fullname: data.fullname,
            phone_number: data.phone_number,
        });
        // if (response) {
        //     navigate('/');
        // }
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng kiểm tra thông tin đăng ký');
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-5xl bg-base-100 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Form */}
          <div className="card-body flex-1 p-6 md:p-8">
            <h2 className="text-center text-3xl font-bold mb-6 text-primary">Đăng ký tài khoản</h2>
            
            {(error || error1) && (
              <div className="alert alert-error mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error || error1}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tên đăng nhập</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    className="input input-bordered w-full pl-10"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    {...register('username', {
                      required: 'Tên đăng nhập không được để trống',
                      maxLength: {
                        value: 256,
                        message: 'Tên đăng nhập không được vượt quá 256 ký tự',
                      },
                    })}
                  />
                </div>
                {errors.username && <p className="mt-1 text-error text-sm">{errors.username.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    className="input input-bordered w-full pl-10"
                    type="email"
                    placeholder="Nhập email"
                    {...register('email', {
                      required: 'Email không được để trống',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ',
                      },
                      maxLength: {
                        value: 256,
                        message: 'Email không được vượt quá 256 ký tự',
                      },
                    })}
                  />
                </div>
                {errors.email && <p className="mt-1 text-error text-sm">{errors.email.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Họ và tên</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    className="input input-bordered w-full pl-10"
                    type="text"
                    placeholder="Nhập họ và tên"
                    {...register('fullname', {
                      required: 'Họ và tên không được để trống',
                      maxLength: {
                        value: 256,
                        message: 'Họ và tên không được vượt quá 256 ký tự',
                      },
                    })}
                  />
                </div>
                {errors.fullname && <p className="mt-1 text-error text-sm">{errors.fullname.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Số điện thoại</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <input
                    className="input input-bordered w-full pl-10"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    {...register('phone_number', {
                      required: 'Số điện thoại không được để trống',
                      maxLength: {
                        value: 256,
                        message: 'Số điện thoại không được vượt quá 256 ký tự',
                      },
                      pattern: {
                        value: /^[0-9\+\-\s]+$/,
                        message: 'Số điện thoại không hợp lệ',
                      },
                    })}
                  />
                </div>
                {errors.phone_number && <p className="mt-1 text-error text-sm">{errors.phone_number.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Mật khẩu</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    {...register('password', {
                      required: 'Mật khẩu không được để trống',
                      minLength: {
                        value: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự',
                      },
                      maxLength: {
                        value: 256,
                        message: 'Mật khẩu không được vượt quá 256 ký tự',
                      },
                    })}
                    className="input input-bordered w-full pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-error text-sm">{errors.password.message}</p>}
              </div>

              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full text-base font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Đăng ký ngay
                </button>
              </div>
              
              <div className="divider">hoặc</div>
              
              <div className="space-y-3">
                <button type="button" className="btn btn-outline w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 488 512">
                    <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                  Đăng ký với Google
                </button>
                <button type="button" className="btn btn-outline w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
                    <path fill="#1877F2" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376.6 85.8 479.2 204 508.1V336H144V256h60V208c0-56.5 33.8-87.7 83-87.7 24.1 0 49.2 4.3 49.2 4.3v54h-27.7c-27.5 0-36.5 17.1-36.5 34.8V256h62l-9.9 80H272v172.1C390.2 479.2 512 376.6 512 256z"/>
                  </svg>
                  Đăng ký với Facebook
                </button>
              </div>
            </form>
            
            <p className="text-center mt-6 text-base-content/70">
              Đã có tài khoản?{' '}
              <Link to="/auth/login" className="link link-primary font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
          
          {/* Right side - Image and text overlay */}
          <div className="hidden md:block w-full md:w-2/5 bg-gradient-to-r from-primary to-secondary text-primary-content relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop')"}}></div>
            <div className="relative flex flex-col justify-center items-center h-full p-8 space-y-6 z-10">
              <div className="text-center">
                <h3 className="font-bold text-2xl mb-4">Chào mừng đến với TechStore!</h3>
                <p className="text-lg opacity-90">Đăng ký để truy cập vào tất cả các tính năng và ưu đãi độc quyền của chúng tôi.</p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Cập nhật các sản phẩm mới nhất</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Khuyến mãi độc quyền</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Theo dõi đơn hàng dễ dàng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Hỗ trợ khách hàng 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
