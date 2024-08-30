"use client";

import useError from "@/hooks/useError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export function SearchForm() {
  const { handleError } = useError();
  const router = useRouter();
  const [searching, setSearching] = useState(false);

  const formSchema = z.object({
    link: z.string().url(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSearching(true);
      const regex = /\/dp\/([A-Z0-9]{10})/;
      const match = values.link.match(regex);
      if (match && match[1]) {
        const value = match[1];
        router.push(`/products/${value}`);
      } else {
        throw new Error("Failed to retrieve ASIN from the provided link");
      }
    } catch (error) {
      handleError(error, true);
      setSearching(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.amazon.com/..."
                  disabled={searching}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={searching}>
          {searching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </form>
    </Form>
  );
}
