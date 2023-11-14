interface NotFoundPageProps {
  onNavigateHome: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 font-sans">
      <h1 className="font-sans text-4xl font-bold">404 - Page Not Found</h1>
      <p className="font-sans text-lg">
        Sorry, the page you are looking for does not exist.
      </p>
      <button
        className="px-6 py-2 font-semibold text-white transition duration-300 ease-in-out transform bg-orange-500 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-2xl"
        onClick={onNavigateHome}
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
