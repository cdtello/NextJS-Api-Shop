import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "Usuarios",
      description: "Gestiona los usuarios registrados en la plataforma",
      href: "/users",
      icon: "👤",
    },
    {
      title: "Productos",
      description: "Administra el catalogo de productos disponibles",
      href: "/products",
      icon: "📦",
    },
    {
      title: "Ordenes",
      description: "Crea y consulta ordenes de compra",
      href: "/orders",
      icon: "🛒",
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Api Shop</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Tienda online. Administra usuarios, productos y ordenes desde un solo
          lugar.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto py-16 px-6 w-full">
        <h2 className="text-2xl font-bold text-center mb-10">Modulos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
