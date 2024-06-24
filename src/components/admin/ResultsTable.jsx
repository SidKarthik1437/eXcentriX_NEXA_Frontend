import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

const ResultsTable = ({ results }) => {
  // get the data from the API

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SlNo</TableHead>
            <TableHead>USN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Marks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.id}</TableCell>
              <TableCell>{result.usn}</TableCell>
              <TableCell>{result.name}</TableCell>
              <TableCell className="text-right">{result.marks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;
