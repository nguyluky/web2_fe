import type { Route } from "./+types/category";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const id = params.id;
    return {
        id
    }
}

export async function clientAction() {}


export default function Category({loaderData}: Route.ComponentProps) {
    return (
      <>
        <section>
          <div className="hero">
            <div className="hero-content w-full">
              <div className="breadcrumbs text-sm w-full">
                <ul>
                  <li>
                    <a>Home</a>
                  </li>
                  <li>
                    <a>Danh mục</a>
                  </li>
                  <li>{loaderData.id.replaceAll('-', ' ')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}