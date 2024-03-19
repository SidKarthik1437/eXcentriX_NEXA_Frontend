import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DataContext } from "@/context/DataContext";
import { useContext } from "react";

function Faculties({ faculties, onUserSelect }) {
  console.log(faculties);
  const { departments } = useContext(DataContext);

  return departments.map((department) => (
    <Accordion type="single" collapsible>
      <AccordionItem value={department.name}>
        <AccordionTrigger className="text-sm">
          {department.name}
        </AccordionTrigger>
        <AccordionContent>
          {faculties
            .filter((faculty) => faculty.department.name === department.name)
            .map((faculty) => (
              <Button
                key={faculty.id}
                className="text-sm"
                onClick={() => onUserSelect(faculty)}
              >
                {faculty.usn}
              </Button>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));
}

export default Faculties;
