import { useState } from "react";
import Fuse from "fuse.js";
import { Input } from "./input";
import { Search, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";

interface Filter {
    name: string;
    options: string[];
    key: string;
    customSort?: (a: string, b: string) => number;
}

interface SearchableListProps<T> {
    items: T[];
    searchKeys: string[];
    renderItems: (filteredItems: T[]) => React.ReactNode;
    placeholder?: string;
    threshold?: number;
    filters?: Filter[];
}

export function SearchableList<T>({
    items,
    searchKeys,
    renderItems,
    placeholder = "Search...",
    threshold = 0.3,
    filters = [],
}: SearchableListProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const fuseOptions = {
        keys: searchKeys,
        threshold,
        includeScore: true,
    };

    const fuse = new Fuse(items, fuseOptions);

    const applyFilters = (items: T[]) => {
        return items.filter((item) => {
            return Object.entries(selectedFilters).every(([key, values]) => {
                if (values.length === 0) return true;
                const itemValue = key.split('.').reduce((obj: any, key) => obj?.[key], item);
                return values.includes(itemValue);
            });
        });
    };

    const filteredItems = applyFilters(
        searchTerm ? fuse.search(searchTerm).map((result) => result.item) : items
    );

    const handleFilterChange = (filterKey: string, value: string, checked: boolean) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterKey]: checked
                ? [...(prev[filterKey] || []), value]
                : (prev[filterKey] || []).filter((v) => v !== value),
        }));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Input
                    className="w-96"
                    type="search"
                    placeholder={placeholder}
                    icon={<Search className="size-4 text-primary" />}
                    iconPosition="left"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filters.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:items-center">
                        <span className="text-xs font-bold">Filter by </span>
                        {filters.map((filter) => (
                            <DropdownMenu key={filter.key}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="justify-between" size="sm">
                                        <div className="flex items-center gap-2 relative text-sm">
                                            {filter.name}
                                            {selectedFilters[filter.key]?.length > 0 && (
                                                <span className="inline-flex items-center justify-center text-white bg-accent rounded-full w-3 h-3 text-xs p-2 absolute -top-0.5 -right-3.5">
                                                    {selectedFilters[filter.key].length}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[280px]" align="start">
                                    {filter.options.sort( filter.customSort || ((a, b) => a.localeCompare(b))).map((option) => (
                                        <DropdownMenuCheckboxItem
                                            key={option}
                                            checked={selectedFilters[filter.key]?.includes(option)}
                                            onCheckedChange={(checked) => handleFilterChange(filter.key, option, checked)}
                                            onSelect={(event) => event.preventDefault()}
                                        >
                                            {option}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ))}
                    </div>
                )}
            </div>
            {renderItems(filteredItems)}
        </div>
    );
}