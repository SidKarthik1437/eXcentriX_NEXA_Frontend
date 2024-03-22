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

function Faculties({ faculties, onUserSelect }) {
  console.log(faculties);
  const { departments } = useContext(DataContext);

  return departments.map((department) => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem className="!w-full" value={department.name}>
        <AccordionTrigger className="flex w-full justify-between text-sm">
          <span className="text-left w-full">{department.name}</span>
          <span className="">
            <Badge>
              {
                faculties.filter(
                  (faculty) => faculty.department.name === department.name
                ).length
              }
            </Badge>
          </span>
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
