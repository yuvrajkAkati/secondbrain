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
  const router = useRouter();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElementTagNameMap["aside"]>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [openTrash, setOpenTrash] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
      setSidebarWidth(280);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && !isCollapsed) collapse();
  }, [pathName]);

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

    if (newWidth < 260) newWidth = 260;
    if (newWidth > 500) newWidth = 500;

    setSidebarWidth(newWidth);

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    setIsCollapsed(false);
    setIsResetting(true);
    setSidebarWidth(280);
    setTimeout(() => setIsResetting(false), 300);
  };

  const collapse = () => {
    setIsCollapsed(true);
    setIsResetting(true);
    setSidebarWidth(0);
    setTimeout(() => setIsResetting(false), 300);
  };

  const onCreate = () => {
    const newDoc = create({ title: "untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(newDoc, {
      loading: "Creating a new note...",
      success: "New Note Created!",
      error: "Failed to create a new note.",
    });
  };

  const showDocument = !!params?.documentId;

  return (
    <div className="flex h-full w-full overflow-hidden bg-black text-white">
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar no-scrollbar relative flex h-full flex-col overflow-y-auto border-r border-violet-500/10 bg-black/90 backdrop-blur-2xl transition-all duration-300",
          "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_60%)] before:pointer-events-none",
          isMobile ? "absolute z-[100000]" : "relative",
          isResetting && "ease-in-out"
        )}
        style={{
          width: isMobile
            ? isCollapsed
              ? "0px"
              : "100%"
            : `${sidebarWidth}px`,
        }}
      >
        {!isCollapsed && (
          <div
            role="button"
            className="
              absolute
              right-4
              top-4
              z-[200000]
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-violet-500/20
              bg-white/[0.03]
              text-white/60
              backdrop-blur-xl
              transition-all
              duration-200
              hover:border-violet-400/30
              hover:bg-violet-500/10
              hover:text-white
              hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]
            "
          >
            <ChevronsLeft
              className="h-5 w-5"
              onClick={collapse}
            />
          </div>
        )}

        <div className="relative z-10">
          <UserItems />

          <div className="px-2">
            <Item
              onClick={search.onOpen}
              label="Search"
              icon={Search}
              isSearch
            />

            <Item
              onClick={settings.onOpen}
              label="Settings"
              icon={Settings}
            />

            <Item
              onClick={onCreate}
              label="New Page"
              icon={PlusCircle}
            />
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <DocumentList />

          <div className="pt-3 px-2">
            <Item
              onClick={onCreate}
              icon={Plus}
              label="Add a page"
            />

            <Popover
              open={openTrash}
              onOpenChange={setOpenTrash}
            >
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
                sideOffset={12}
                className="
                  h-[420px]
                  w-[340px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-violet-500/20
                  bg-black/95
                  p-0
                  text-white
                  backdrop-blur-2xl
                  shadow-[0_0_50px_rgba(139,92,246,0.2)]
                "
              >
                <div className="h-full overflow-y-auto no-scrollbar">
                  <TrashBox />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {!isMobile && !isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="
              absolute
              right-0
              top-0
              h-full
              w-[3px]
              cursor-ew-resize
              bg-violet-500/20
              opacity-0
              transition-all
              duration-200
              group-hover/sidebar:opacity-100
            "
          />
        )}
      </aside>

      <div
        className="
          relative
          flex-1
          overflow-y-auto
          bg-gradient-to-br
          from-black
          via-black
          to-violet-950/20
          transition-all
          duration-300
        "
      >
        {showDocument && (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        )}

        {!showDocument && isCollapsed && (
          <div className="absolute left-6 top-6">
            <div
              role="button"
              onClick={resetWidth}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-violet-500/20
                bg-white/[0.03]
                text-white/60
                backdrop-blur-xl
                transition-all
                duration-200
                hover:border-violet-400/30
                hover:bg-violet-500/10
                hover:text-white
                hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]
              "
            >
              <MenuIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        <div
          className={cn(
            "h-full p-6 transition-all duration-300",
            !showDocument &&
              "flex items-center justify-center"
          )}
        >
          {!showDocument ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

              <h1 className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-4xl font-bold text-transparent">
                Welcome to {user.user?.firstName}&apos;s Second Brain
              </h1>

              <p className="text-sm text-white/50">
                Organize ideas, notes, research and knowledge.
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;