import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { departmentServices } from "../../../api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    .min(1, { message: "Please enter valid Department ID" })
    .max(10, { message: "Department ID too long" }),
  name: z
    .string()
    .min(2, { message: "Please enter valid Department Name" })
    .max(50, { message: "Department Name too long" }),
});

function NewDepartment({ setDepOpen }) {
  const { setDepartments } = useContext(DataContext);
  const handleSave = async (values) => {
    //
    console.log(values);
    await departmentServices.createDepartment(values).then((res) => {
      console.log("Subject Create Succesfully: ", res);
    });
    await departmentServices.fetchDepartments().then((res) => {
      setDepartments(res.data);
    });

    setDepOpen(false);
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
        onClick={() => setDepOpen(false)}
      >
        &times;
      </Button>
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="">New Department Configuration</CardTitle>
      </CardHeader>
      <CardContent className="m-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className=" space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Department ID :</FormLabel>
                  <FormControl>
                    <Input placeholder="2" {...field} />
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
                  <FormLabel className="">Department Name :</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Artificial Intelligence and Machine learning"
                      {...field}
                    />
                  </FormControl>
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

export default NewDepartment;
