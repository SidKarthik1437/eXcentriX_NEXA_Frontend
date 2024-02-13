const TableHeader = () => (
  <tr className="bg-purple-700 text-white rounded-t-lg">
    <th className=" px-4 py-2 border-purple-300 w-1/3">Question</th>
    <th className=" px-4 py-2 border-purple-300">Type</th>
    <th className=" px-4 py-2 border-purple-300">Choice A</th>
    <th className=" px-4 py-2 border-purple-300">Choice B</th>
    <th className=" px-4 py-2 border-purple-300">Choice C</th>
    <th className=" px-4 py-2 border-purple-300">Choice D</th>
    <th className=" px-4 py-2 border-purple-300">Correct Choice</th>
    <th className=" px-4 py-2 border-purple-300">Actions</th>
  </tr>
);

export default TableHeader;
