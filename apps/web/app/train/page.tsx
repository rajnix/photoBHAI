import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UploadModal } from "@/components/ui/upload"



export default function Train() {
    return (
        <div className="flex justify-center flex-col h-screen items-center">
            <Card className="w-[350px] px-5">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of the model" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Age">Age</Label>
                                <Input id="Age" placeholder="Age of the model" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Ethnicity">Ethnicity</Label>
                                <Select>
                                    <SelectTrigger id="Ethnicity">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="White">White</SelectItem>
                                        <SelectItem value="Black">Black</SelectItem>
                                        <SelectItem value="Asian">Asian</SelectItem>
                                        <SelectItem value="Asian American">Asian American</SelectItem>
                                        <SelectItem value="East Asian">East Asian</SelectItem>
                                        <SelectItem value="South Asian">South Asian</SelectItem>
                                        <SelectItem value="Hispanic">Hispanic</SelectItem>
                                        <SelectItem value="Pacific">Pacific</SelectItem>
                                        <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                                        <SelectItem value="South East Asian">South East Asian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Gender">Gender</Label>
                                <Select>
                                    <SelectTrigger id="Gender">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="man">Man</SelectItem>
                                        <SelectItem value="woman">Woman</SelectItem>
                                        <SelectItem value="others">Others</SelectItem>

                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="EyeColor">Eye Color</Label>
                                <Select>
                                    <SelectTrigger id="EyeColor">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Brown">Brown</SelectItem>
                                        <SelectItem value="Blue">Blue</SelectItem>
                                        <SelectItem value="Hazel">Hazel</SelectItem>
                                        <SelectItem value="Gray">Gray</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Switch id="bald" />
                                <Label htmlFor="bald">Bald</Label>
                            </div>
                            </div>
                    </form>
                </CardContent>
                <UploadModal/>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Model</Button>
                </CardFooter>
            </Card>
            
        </div>
    )
}
