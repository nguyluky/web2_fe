import { faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';

type FormValues = {
  username: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login , error, isAuthenticated} = useAuth();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {

        await login({
            username: data.username, 
            password: data.password
        })
    } catch {

    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        navigate('/'); // Redirect to home page or any other page after successful login
    }
    }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-5xl bg-base-100 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image and text overlay */}
          <div className="hidden md:block w-full md:w-2/5 bg-gradient-to-r from-primary to-secondary text-primary-content relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-4.0.3&auto=format&fit=crop')"}}></div>
            <div className="relative flex flex-col justify-center items-center h-full p-8 space-y-6 z-10">
              <div className="text-center">
                <h3 className="font-bold text-2xl mb-4">Chào mừng trở lại!</h3>
                <p className="text-lg opacity-90">Đăng nhập để tiếp tục mua sắm và tận hưởng các ưu đãi đặc biệt.</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Theo dõi đơn hàng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Lịch sử mua hàng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Khuyến mãi đặc biệt</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-lg">✓</div>
                  <span>Thanh toán nhanh chóng</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="card-body flex-1 p-6 md:p-8">
            <h2 className="text-center text-3xl font-bold mb-6 text-primary">Đăng nhập</h2>
            
            {error && (
              <div className="alert alert-error mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
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
                <div className="flex justify-end mt-1">
                  <Link to="/auth/forgot-password" className="text-sm link link-hover text-primary">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full text-base font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Đăng nhập ngay
                </button>
              </div>
              
              <div className="divider">hoặc</div>
              
              <div className="space-y-3">
                <button type="button" className="btn btn-outline w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 488 512">
                    <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                  Đăng nhập với Google
                </button>
                <button type="button" className="btn btn-outline w-full gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
                    <path fill="#1877F2" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376.6 85.8 479.2 204 508.1V336H144V256h60V208c0-56.5 33.8-87.7 83-87.7 24.1 0 49.2 4.3 49.2 4.3v54h-27.7c-27.5 0-36.5 17.1-36.5 34.8V256h62l-9.9 80H272v172.1C390.2 479.2 512 376.6 512 256z"/>
                  </svg>
                  Đăng nhập với Facebook
                </button>
              </div>
              
              <p className="text-center mt-6 text-base-content/70">
                Chưa có tài khoản?{' '}
                <Link to="/auth/register" className="link link-primary font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}