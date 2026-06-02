"use client"

import { useEffect, useState } from "react"
import { generateEmbedding } from "@/app/lib/ai/embeddings";
import { cosineSimilarity } from "@/app/lib/ai/cosine-similarity";
import { File } from "lucide-react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"

import { useSearch } from "@/hooks/use-search"
import { api } from "@/convex/_generated/api"
import { query } from "@/convex/_generated/server"
import { Spinner } from "./ui/spinner"

export const SearchCommand = () => {
    const [semanticResults, setSemanticResults] = useState<any[]>([]);
    const { user } = useUser()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [search, setSearch] = useState("")
    const toggle = useSearch((store) => store.toggle)
    const isOpen = useSearch((store) => store.isOpen)
    const isClose = useSearch((store) => store.onClose)
    const documents = useQuery(api.document.getSearch, { query: search })
    const allDocuments = useQuery(
        api.document.getAllDocumentsForSearch
    );



    useEffect(() => {
        setIsMounted(true)
    }, [])


    useEffect(() => {
        console.log(allDocuments);
    }, [allDocuments]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle()
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [toggle])


    useEffect(() => {
        console.table(
            semanticResults.map((doc) => ({
                title: doc.title,
                score: doc.score,
            }))
        );
    }, [semanticResults]);

    useEffect(() => {
        const runSemanticSearch = async () => {
            if (!search.trim()) {
                setSemanticResults([]);
                return;
            }

            if (!allDocuments) return;

            const queryEmbedding = await generateEmbedding(search);

            const ranked = allDocuments
                .filter((doc) => doc.embedding)
                .map((doc) => ({
                    ...doc,
                    score: cosineSimilarity(
                        queryEmbedding,
                        doc.embedding!
                    ),
                }))
                .sort((a, b) => b.score - a.score);

            setSemanticResults(ranked);
        };

        runSemanticSearch();
    }, [search, allDocuments]);


    useEffect(() => {
        console.log(semanticResults);
    }, [semanticResults]);

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`)
        isClose();
    }

    if (!isMounted) return null



    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24">
                    <div className="w-full max-w-2xl rounded-xl border bg-white shadow-2xl dark:bg-neutral-900 dark:border-neutral-800">

                        <div className="border-b p-4">
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-lg"
                                autoFocus
                            />
                        </div>

                        <div className="max-h-[500px] overflow-y-auto">
                            {semanticResults.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No results found
                                </div>
                            ) : (
                                <div className="p-2">
                                    {semanticResults.map((document) => (
                                        <button
                                            key={document._id}
                                            onClick={() => onSelect(document._id)}
                                            className="flex w-full items-center justify-between rounded-lg p-3 text-left transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        >
                                            <div className="flex items-center gap-3">
                                                {document.icon ? (
                                                    <span className="text-lg">
                                                        {document.icon}
                                                    </span>
                                                ) : (
                                                    <File className="h-4 w-4" />
                                                )}

                                                <div>
                                                    <p className="font-medium">
                                                        {document.title}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {document.score?.toFixed(3)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t p-2 flex justify-end">
                            <button
                                onClick={isClose}
                                className="rounded-md px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}