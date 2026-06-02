"use client"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Item from "./item"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"

interface DocumentListProps {
    parentDocumentId?: Id<"documents">
    level?: number
    data?: Doc<"documents">[]
}

const DocumentList = ({
    parentDocumentId,
    level = 0,
}: DocumentListProps) => {
    const params = useParams()
    const router = useRouter()

    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const onExpand = (documentId: string) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId],
        }))
    }

    const documents = useQuery(api.document.getDocuments, {
        parentDocument: parentDocumentId,
    })

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`)
    }

    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        )
    }

    return (
        <>
            {documents.length === 0 && level > 0 && (
                <p
                    style={{
                        paddingLeft: level
                            ? `${level * 14 + 28}px`
                            : undefined,
                    }}
                    className="mt-1 truncate text-xs font-medium text-white/40 transition-all duration-300"
                >
                    No pages inside
                </p>
            )}

            {documents.map((document) => (
                <div
                    key={document._id}
                    className={cn(
                        "relative",
                        level > 0 &&
                            "border-l border-violet-500/10 ml-2"
                    )}
                >
                    <Item
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        documentIcon={document.icon}
                        active={params.documentId === document._id}
                        level={level}
                        onExpand={() => onExpand(document._id)}
                        expanded={expanded[document._id]}
                    />

                    {expanded[document._id] && (
                        <div className="animate-in fade-in duration-300">
                            <DocumentList
                                parentDocumentId={document._id}
                                level={level + 1}
                            />
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}

export default DocumentList