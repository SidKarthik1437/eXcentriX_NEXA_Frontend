import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

function Search() {
  return (
    <Command>
      <CommandInput
        className="w-4/5"
        placeholder="Type a command or search..."
      />
      {/* <CommandList>
            <CommandEmpty>No User Found</CommandEmpty>
          </CommandList> */}
    </Command>
  );
}

export default Search;
