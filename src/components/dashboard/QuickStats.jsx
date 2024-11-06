import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

export function QuickStats({ 
    activeMessages, 
    activeSpace, 
    spaces, 
    setActiveSpace, 
    acceptMessages, 
    form, 
    handleSwitchChange, 
    isSwitchLoading 
}) {
    const { register } = form;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-gray-200">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-100 text-sm font-medium">Total Messages</p>
                            <h3 className="text-3xl font-bold mt-1">{activeMessages.length}</h3>
                        </div>
                        <MessageSquare className="h-8 w-8 text-gray-200" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Space</p>
                            <h3 className="text-xl font-semibold mt-1 text-gray-800">{activeSpace || 'None Selected'}</h3>
                        </div>
                        <Select onValueChange={setActiveSpace}>
                            <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200 hover:border-gray-400 transition-colors">
                                <SelectValue placeholder="Switch" />
                            </SelectTrigger>
                            <SelectContent>
                                {spaces.map((space, key) => (
                                    <SelectItem key={key} value={space}>
                                        {space}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Message Status</p>
                            <h3 className="text-xl font-semibold mt-1 text-gray-800">
                                {acceptMessages ? 'Accepting' : 'Paused'}
                            </h3>
                        </div>
                        <Switch
                            {...register('acceptMessages')}
                            checked={acceptMessages}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitchLoading}
                            className="data-[state=checked]:bg-gray-600"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 