'use client'
import React from 'react'
import Image from 'next/image'; // Corrected import statement
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Darkmode } from './../Darkmode';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

function Header() {
    const router = useRouter()

    async function logout() {
        await signOut(auth)
        router.push("/")
    }

    return (
        <div className="flex items-center justify-between max-w-[1300px] w-full py-5 m-auto">
            <Darkmode />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        <Image
                            src="https://res.cloudinary.com/dkibnftac/image/upload/v1696743505/wp8137478_ei7mcp.jpg"
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="overflow-hidden object-contain rounded-full"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Header