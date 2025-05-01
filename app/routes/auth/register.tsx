import {
    faEnvelope,
    faEye,
    faEyeSlash,
    faLock,
    faPhone,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

type FormValues = {
  email: string;
  password: string;
  username: string;
  fullname: string;
  phone_number: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // TODO: Implement API call to login endpoint
      console.log('Đăng nhập với:', data);

      // Simulate successful login
      // After successful login, redirect to home page
      navigate('/');
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">Đăng nhập</h2>

          {error && (
            <div className="alert alert-error ">
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-10">
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
              <div className="fieldset ">
                <legend className="fieldset-legend">Tên đăng nhập</legend>
                <div className="join">
                  <span className="join-item flex items-center justify-center px-3 border border-r-0 border-base-300 bg-base-200 rounded-l-md">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    className="input input-bordered w-full rounded-none join-item"
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
                {errors.username && <p className="label text-error">{errors.username.message}</p>}
              </div>

              <div className="fieldset ">
                <legend className="fieldset-legend">Email</legend>
                <div className="join">
                  <span className="join-item flex items-center justify-center px-3 border border-r-0 border-base-300 bg-base-200 rounded-l-md">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    className="input input-bordered w-full rounded-none join-item"
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
                {errors.email && <p className="label text-error">{errors.email.message}</p>}
              </div>

              <div className="fieldset ">
                <legend className="fieldset-legend">Họ và tên</legend>
                <div className="join">
                  <span className="join-item flex items-center justify-center px-3 border border-r-0 border-base-300 bg-base-200 rounded-l-md">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    className="input input-bordered w-full rounded-none join-item"
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
                {errors.fullname && <p className="label text-error">{errors.fullname.message}</p>}
              </div>

              <div className="fieldset ">
                <legend className="fieldset-legend">Số điện thoại</legend>
                <div className="join">
                  <span className="join-item flex items-center justify-center px-3 border border-r-0 border-base-300 bg-base-200 rounded-l-md">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  <input
                    className="input input-bordered w-full rounded-none join-item"
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
                {errors.phone_number && (
                  <p className="label text-error">{errors.phone_number.message}</p>
                )}
              </div>

              <div className="fieldset mb-6">
                <legend className="fieldset-legend">Mật khẩu</legend>
                <div className="join">
                  <span className="join-item flex items-center justify-center px-3 border border-r-0 border-base-300 bg-base-200 rounded-l-md">
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
                    className="input input-bordered w-full rounded-none join-item"
                  />
                  <button
                    type="button"
                    className="join-item flex items-center justify-center px-3 border border-l-0 border-base-300 bg-base-200 rounded-r-md"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && <p className="label text-error">{errors.password.message}</p>}
                <div className="flex justify-end mt-1">
                  <Link to="/auth/forgot-password" className="text-sm link link-hover text-primary">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div className="form-control">
                <button type="submit" className="btn btn-primary w-full">
                  Đăng nhập
                </button>
              </div>
            </form>

            <div className='w-full mt-20'>
              <div className="flex flex-col gap-3">
                <button className="btn btn-outline">Đăng nhập với Google</button>
                <button className="btn btn-outline">Đăng nhập với Facebook</button>
              </div>

              <p className="text-center mt-6">
                Chưa có tài khoản?{' '}
                <Link to="/auth/login" className="link link-primary">
                  LOGIN
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
