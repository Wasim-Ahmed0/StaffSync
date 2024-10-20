export default function Input({ ...attributes }) {
  return (
    <input
      className="rounded-xl border-2 border-white border-opacity-70 bg-gray-500 bg-opacity-50 px-3 py-2 text-white shadow-lg outline-none transition placeholder:text-gray-300 hover:bg-opacity-70 focus:border-primary focus:bg-opacity-100"
      {...attributes}
    ></input>
  );
}
