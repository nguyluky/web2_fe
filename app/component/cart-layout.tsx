import { Link, Outlet } from "react-router";
import { Footer } from "./layout";

export default function CartLayout() {
  return (
    <>
      <header className="navbar justify-center">
        <div className="navbar-center w-full max-w-[80rem] pr-5">
          <div className="navbar-start">
            <Link to="/" className="btn btn-ghost text-xl font-bold">Codelỏ</Link>
            <div className="divider divider-horizontal"></div>
            <h2>Giỏ hàng</h2>
          </div>

          <div className="navbar-end">
            <div className="join">
              <div>
                <div>
                  <input className="input join-item" placeholder="Search" />
                </div>
              </div>
              <button className="btn join-item">Search</button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer></Footer>
    </>
  );
}
