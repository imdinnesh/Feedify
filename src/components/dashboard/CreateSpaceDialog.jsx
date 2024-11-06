import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function CreateSpaceDialog({ 
    spacename, 
    setSpaceName, 
    headingQues, 
    setHeadingQues, 
    spaceError, 
    titleError, 
    createSpace 
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-gray-600 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-gray-200">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Space
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Space</DialogTitle>
                    <DialogDescription>
                        Create a dedicated space for collecting messages
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Space Name</Label>
                        <Input
                            placeholder="Enter space name"
                            value={spacename}
                            onChange={(e) => setSpaceName(e.target.value)}
                            className={`w-full ${spaceError ? 'border-red-500' : ''}`}
                        />
                        {spaceError && (
                            <p className="text-sm text-red-500 mt-1">{spaceError}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Heading Question</Label>
                        <Input
                            placeholder="Enter heading question"
                            value={headingQues}
                            onChange={(e) => setHeadingQues(e.target.value)}
                            className={`w-full ${titleError ? 'border-red-500' : ''}`}
                        />
                        {titleError && (
                            <p className="text-sm text-red-500 mt-1">{titleError}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={createSpace} className="bg-gray-600 hover:bg-gray-700">
                            Create Space
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 