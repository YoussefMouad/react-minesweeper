export default function Navbar() {
  return (
    <nav className="mb-4 bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Minesweeper
          </span>
        </a>
      </div>
    </nav>
  );
}
