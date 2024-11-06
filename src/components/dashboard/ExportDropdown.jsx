import { Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ExportDropdown({ exportData }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover:border-gray-400 transition-colors border-gray-200">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportData('json')}>
                    Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportData('csv')}>
                    Export as CSV
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 