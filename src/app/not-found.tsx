import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-heading font-bold text-navy mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/en/products"
        className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Go to Products
      </Link>
    </div>
  );
}
