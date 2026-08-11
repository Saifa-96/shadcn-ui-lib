import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerSection() {
  const [date, setDate] = useState<Date>();

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Date Picker</h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-[240px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </section>
  );
}
