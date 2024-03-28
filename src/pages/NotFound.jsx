import Header from "../components/Header";

function NotFound() {
  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
      <Header />
      <div className="flex h-full w-full items-center justify-center">
        {/* Body */}
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-semibold text-purple-700">404</h1>
          <p className="mb-4 text-lg text-gray-600 font-semibold">
            Oops! Looks like you're lost.
          </p>
          <div className="animate-bounce">
            <svg
              className="mx-auto h-16 w-16 text-purple-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">
            Let's get you back{" "}
            <a href="/" className="text-purple-700">
              home
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
