"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItems from "./user-items";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";
import DocumentList from "./documentList";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import TrashBox from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import Navbar from "@/app/(main)/_components/navbar";
import { useUser } from "@clerk/clerk-react";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const settings = useSettings();
  const search = useSearch();
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.document.create);
  const user = useUser();
  const router = useRouter()
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElementTagNameMap["aside"]>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [openTrash, setOpenTrash] = useState(false);

  // --- Responsive behavior ---
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
      setSidebarWidth(240);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && !isCollapsed) collapse();
  }, [pathName]);

  // --- Resize Handlers ---
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current || isCollapsed) return;
    let newWidth = event.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;
    setSidebarWidth(newWidth);
    if (sidebarRef.current) sidebarRef.current.style.width = `${newWidth}px`;
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // --- Sidebar controls ---
  const resetWidth = () => {
    setIsCollapsed(false);
    setIsResetting(true);
    setSidebarWidth(240);
    setTimeout(() => setIsResetting(false), 300);
  };

  const collapse = () => {
    setIsCollapsed(true);
    setIsResetting(true);
    setSidebarWidth(0);
    setTimeout(() => setIsResetting(false), 300);
  };

  const onCreate = () => {
    const newDoc = create({ title: "untitled" })
    .then((documentId)=> router.push(`/documents/${documentId}`));
    toast.promise(newDoc, {
      loading: "Creating a new note...",
      success: "New Note Created!",
      error: "Failed to create a new note.",
    });
  };

  const showDocument = !!params?.documentId;
  const pushAmount =
    !isMobile && !isCollapsed
      ? `${Math.min(Math.round(sidebarWidth * 0.2), 80)}px`
      : "0px";

  return (
    <div className="flex h-full w-full overflow-hidden transition-all duration-300">
      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar no-scrollbar overflow-y-auto bg-[#2E004F] h-full flex flex-col transition-all duration-300 text-white",
          isMobile ? "absolute z-[100000]" : "relative",
          isResetting && "ease-in-out"
        )}
        style={{
          width: isMobile ? (isCollapsed ? "0px" : "100%") : `${sidebarWidth}px`,
        }}
      >
        {/* Collapse button */}
        {!isCollapsed && (
          <div
            role="button"
            className="h-6 w-6 hover:bg-purple-600 dark:hover:bg-black absolute top-3 right-3 z-[200000]
              transition flex items-center justify-center border rounded-md bg-background/20 backdrop-blur-sm"
          >
            <ChevronsLeft className="h-5 w-5" onClick={collapse} />
          </div>
        )}

        {/* Sidebar content */}
        <div>
          <UserItems />
          <Item onClick={search.onOpen} label="Search" icon={Search} isSearch />
          <Item onClick={settings.onOpen} label="Settings" icon={Settings} />
          <Item onClick={onCreate} label="New Page" icon={PlusCircle} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <div className="pt-2">
            <Item onClick={onCreate} icon={Plus} label="Add a page" />
            <Popover open={openTrash} onOpenChange={setOpenTrash}>
              <PopoverTrigger asChild>
                <div onClick={(e) => e.stopPropagation()}>
                  <Item
                    icon={Trash}
                    label="Trash"
                    onClick={() => setOpenTrash(!openTrash)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="right"
                sideOffset={8}
                className="w-[300px] h-[400px] bg-background rounded-xl border shadow-xl overflow-hidden p-0"
              >
                <div className="h-full overflow-y-auto no-scrollbar">
                  <TrashBox />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Resize handle */}
        {!isMobile && !isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="opacity-0 group-hover/sidebar:opacity-100 absolute h-full w-1 bg-primary/10 right-0 top-0 transition cursor-ew-resize"
          />
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div
        className="relative flex-1 h-full transition-all duration-300 overflow-y-auto"
        style={{ marginLeft: 0 }}
      >
        {showDocument && (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        )}

        {/* ✅ Menu Icon (Top Left on /documents) */}
        {!showDocument && isCollapsed && (
          <div className="absolute top-4 left-4">
            <MenuIcon
              role="button"
              onClick={resetWidth}
              className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer transition"
            />
          </div>
        )}

        {/* Centered Welcome Section */}
        <div
          className={cn(
            "p-6 h-full transition-all duration-300",
            !showDocument && "flex items-center justify-center"
          )}
        >
          {!showDocument ? (
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Welcome to {user.user?.firstName}&apos;s secondBrain 
            </h1>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
