'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { CirclePlus } from 'lucide-react'
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface MenuForm {
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    options?: string[];
    [key: string]: string | number | string[] | undefined; // Update index signature
}


function AddItem() {
    const [category, setCategory] = useState<string>("")
    const [menuForm, setMenuForm] = useState<MenuForm>({
        name: "",
        category: "",
        price: 0,
        cost: 0,
        stock: 0,
    });

    useEffect(() => {
        if (category) {
            setMenuForm(prevMenuForm => ({ ...prevMenuForm, category }));
        }
    }, [category]);

    useEffect(() => {
        console.log(menuForm);
    }, [menuForm]);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setMenuForm(prevMenuForm => ({ ...prevMenuForm, [name]: value }));
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            for (const key in menuForm) {
                if (!menuForm[key]) {
                    alert(`${key} is required`);
                    return;
                }
            }
            const newForm = {
                ...menuForm,
                price: Number(menuForm.price),
                cost: Number(menuForm.cost),
                stock: Number(menuForm.stock),
                createdAt: new Date().toISOString(),
                options: menuForm.category === 'beverages' || menuForm.category === 'appetizers' ? ['small', 'medium', 'large'] : [],
            }
            const docRef = await addDoc(collection(db, "menu"), newForm);
            await updateDoc(doc(db, "menu", docRef.id), {
                id: docRef.id, // Add the ID to the document
            });
            toast('Successfully added new item.');
            setMenuForm({
                name: "",
                category: "",
                price: 0,
                cost: 0,
                stock: 0,
            })
        } catch (error: any) {
            toast(error.message);
            console.error(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1 h-7"> <CirclePlus className="h-3.5 w-3.5" /> Add Item</Button>
            </DialogTrigger>
            <DialogContent className="h-[400px] sm:h-auto overflow-auto sm:max-w-[505px]">
                <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                        Create a new item by filling out the form below. Make sure to fill out all the required fields before submitting the form.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4 ">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            required
                            id="name"
                            name="name"
                            value={menuForm.name}
                            onChange={handleChange}
                            placeholder="Enter item name..."
                        />
                    </div>
                    <div className="space-y-1 flex flex-col">
                        <Label htmlFor="category">Category</Label>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button className=" justify-start capitalize" variant="outline">{!category ? "Select Category" : category}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                                    <DropdownMenuRadioItem value="appetizers">Appetizers</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="main_courses">Main Courses</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="desserts">Desserts</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="beverages">Beverages</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            type="number"
                            required
                            id="price"
                            name="price"
                            value={menuForm.price}
                            onChange={handleChange}
                            placeholder="Enter item price..."
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cost">Cost</Label>
                        <Input
                            type="number"
                            required
                            id="cost"
                            name="cost"
                            value={menuForm.cost}
                            onChange={handleChange}
                            placeholder="Enter item cost..."
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            type="number"
                            required
                            id="stock"
                            name="stock"
                            value={menuForm.stock}
                            onChange={handleChange}
                            placeholder="Enter item stock..."
                        />
                    </div>
                    <Button className="capitalize" onClick={handleSubmit}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddItem