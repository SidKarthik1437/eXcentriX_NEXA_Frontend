import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

function Students({ students, onUserSelect }) {
  console.log(students);
  const { departments } = useContext(DataContext);

  return departments.map((department) => (
    <Accordion type="single" collapsible>
      <AccordionItem value={department.name}>
        <AccordionTrigger className="text-sm">
          {department.name}
        </AccordionTrigger>
        <AccordionContent>
          {students
            .filter((student) => student.department.name === department.name)
            .map((student) => (
              <Button
                key={student.id}
                className="text-sm"
                onClick={() => onUserSelect(student)}
              >
                {student.name} - {student.usn}
              </Button>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));
}

export default Students;
