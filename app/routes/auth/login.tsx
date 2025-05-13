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
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        {/* {isAuthenticated && <Redirect></Redirect>} */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">Đăng nhập</h2>

          {error && (
            <div className="alert alert-error ">
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col">
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

            <div className='w-full'>
                 <div className="divider">OR</div>
              <div className="flex flex-col gap-3">
                <button className="btn btn-outline">Đăng nhập với Google</button>
                <button className="btn btn-outline">Đăng nhập với Facebook</button>
              </div>

              <p className="text-center mt-6">
                Chưa có tài khoản?{' '}
                <Link to="/auth/register" className="link link-primary">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}