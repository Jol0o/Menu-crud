'use client'
import React, { useEffect, useState } from 'react'
import Header from './../../components/section/Header';
import { Input } from '@/components/ui/input';
import { collection, getDocs, limit, startAfter, onSnapshot, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AddItem from './../../components/crud/AddItem';
import Loader from '@/components/section/Loader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TableData from './../../components/section/Table';

interface MenuItem {
    id: string;
    category: string;
    name: string;
    options: string[];
    price: string;
    cost: string;
    stock: string;
}

function Page() {
    const [filter, setFilter] = useState<string>("")
    const [filterData, setFilterData] = useState<MenuItem[]>([])
    const [originalData, setOriginalData] = useState<MenuItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const itemsPerPage: number = 10;
    const [totalItems, setTotalItems] = useState<number>(0);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);

    useEffect(() => {
        const q = query(collection(db, "menu"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTotalItems(snapshot.size);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const filterData = () => {
            const data = originalData.filter((item) => {
                return item.name.toLowerCase().includes(filter.toLowerCase()) ||
                    item.category.toLowerCase().includes(filter.toLowerCase())
            })
            setFilterData(data);
        }
        filterData();

    }, [filter, originalData])

    useEffect(() => {
        const fetchMenuItems = () => {
            setLoading(true);
            const menuRef = collection(db, "menu");

            let q;
            if (lastDoc) {
                q = query(
                    menuRef,
                    orderBy("id"),
                    startAfter(lastDoc),
                    limit(itemsPerPage)
                );
            } else {
                q = query(
                    menuRef,
                    orderBy("id"),
                    limit(itemsPerPage)
                );
            }

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setOriginalData(data as MenuItem[]);
                setFilterData(data as MenuItem[]);
                setLoading(false);
                if (snapshot.docs.length > 0) {
                    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                }
            });

            // Return the unsubscribe function to clean up
            return () => unsubscribe();
        };

        fetchMenuItems();
    }, [currentPage]);

    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
            setLastDoc(null); // reset lastDoc when going back to page 1
        }
    };

    return (
        <div className="w-full">
            <Header />
            <div className="w-full max-w-[1000px] m-auto">
                {!loading ? <TableData originalData={originalData} filterData={filterData} setFilter={setFilter} /> :
                    <div className="flex items-center justify-center w-full min-h-[70vh]"><Loader /></div>}
                {originalData.length > 0 && <div className="flex items-center justify-end py-4 space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {filterData.length} of{" "}
                        {totalItems} row(s) selected.
                    </div>
                    {filterData.length < totalItems && <div className="flex items-center gap-2">
                        <Button variant="ghost" disabled={currentPage === 1} className="w-8 h-8 p-0" onClick={prevPage}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <p className="flex items-center justify-center text-xs rounded-md w-7 h-7 bg-muted">{currentPage}</p>
                        <Button variant="ghost" className="w-8 h-8 p-0" disabled={originalData.length < itemsPerPage} onClick={nextPage}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>}
                </div>}
            </div>
        </div>
    )
}

export default Page;
