import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

function Students({ students, onUserSelect }) {
  console.log(students);
  const { departments } = useContext(DataContext);

  return departments.map((department) => (
    <Accordion key={department?.name} type="single" collapsible>
      <AccordionItem value={department?.name}>
        <AccordionTrigger className="flex w-full justify-between text-sm">
          <span className="text-left w-full">{department?.name}</span>
          <span className="">
            <Badge>
              {
                students.filter(
                  (student) => student?.department?.name === department?.name
                ).length
              }
            </Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="w-full grid grid-cols-3 gap-4">
            {students
              .filter(
                (student) => student?.department?.name === department?.name
              )
              .map((student) => (
                <Button
                  key={student?.usn}
                  className="text-sm w-full"
                  onClick={() => onUserSelect(student)}
                >
                  <span className="">
                    {student.name} - {student.usn}
                  </span>
                </Button>
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));
}

export default Students;
