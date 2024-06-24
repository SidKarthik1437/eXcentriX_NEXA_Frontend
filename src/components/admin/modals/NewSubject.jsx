import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { subjectServices } from "../../../api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { sub } from "date-fns";

const formSchema = z.object({
  // TODO: VERIFY SCHEMA WITH BACKEND
  id: z
    .string()
    .min(1, { message: "Please enter valid Subject ID" })
    .max(10, { message: "Subject ID too long" }),
  name: z
    .string()
    .min(2, { message: "Please enter valid Subject Name" })
    .max(50, { message: "Subject Name too long" }),
  department: z.string({ required_error: "Please select a department" }).min(1),
  semester: z.string({ required_error: "Please select a semester" }).min(1),
});

function NewSubject({ setSubOpen }) {
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const { departments, setSubjects } = useContext(DataContext);

  const handleSave = async (values) => {
    values["department"] = departments.filter(
      (department) => department.name === values.department
    )[0].id;
    values["semester"] = parseInt(values.semester);

    await subjectServices.createSubject(values).then((res) => {
      console.log("Subject Created Successfully: ", res);
    });

    await subjectServices.fetchSubjects().then((res) => {
      setSubjects(res.data);
    });

    setSubOpen(false);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
    },
  });

  return (
    <Card className=" w-1/2 card-container relative rounded-xl border-purple-300 bg-white space-y-4 z-10">
      <Button
        className="absolute top-0 right-0 rounded-bl-2xl text-2xl rounded-tr-xl"
        onClick={() => setSubOpen(false)}
      >
        &times;
      </Button>
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="">New Subject Configuration</CardTitle>
      </CardHeader>
      <CardContent className="m-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className=" space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Subject ID :</FormLabel>
                  <FormControl>
                    <Input placeholder="21AML61" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Subject Name :</FormLabel>
                  <FormControl>
                    <Input placeholder="Cyber Security" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Department:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the subject department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem value={department.name} key={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the subject semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem value={semester} key={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default NewSubject;
