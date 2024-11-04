import { ChevronRight } from "lucide-react";
import React, { useState, ReactNode, MouseEvent } from "react";


interface MenuItem {
    label: string;
    icon: React.ReactNode;
    action: (...args: any[]) => void;
    submenu?: MenuGroup;
}

interface MenuGroup {
    groupName: string;
    items: MenuItem[];
}

interface ContextMenuProps {
    children: ReactNode;
    menuGroups: MenuGroup[];
    submenuVisible: { submenuLabel: string, visible: Boolean };
    setSubmenuVisible: any;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ children, menuGroups, submenuVisible, setSubmenuVisible }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setMenuVisible(true);
    };

    const handleClickOutside = () => {
        setMenuVisible(false);
        setSubmenuVisible({submenuLabel: submenuVisible.submenuLabel, visible: false });
    };

    // useEffect(() => {
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if (!menuVisible) return; // Do nothing if the menu isn’t open

    //         switch (event.key) {
    //             case "Escape":
    //                 setSubmenuVisible(null); // Close submenu if open
    //                 if (!submenuVisible) setMenuVisible(false); // Close main menu if no submenu
    //                 break;

    //             case "ArrowDown":
    //                 setFocusedIndex((prev) =>
    //                     prev === null ? 0 : Math.min(prev + 1, menuOptions.length - 1)
    //                 );
    //                 break;

    //             case "ArrowUp":
    //                 setFocusedIndex((prev) =>
    //                     prev === null ? 0 : Math.max(prev - 1, 0)
    //                 );
    //                 break;

    //             case "ArrowRight":
    //                 if (focusedIndex !== null && menuOptions[focusedIndex].items[0].submenus) {
    //                     setSubmenuVisible(menuOptions[focusedIndex].items[0].label);
    //                 }
    //                 break;

    //             case "ArrowLeft":
    //                 setSubmenuVisible(null); // Close submenu on left arrow
    //                 break;

    //             case "Enter":
    //                 if (focusedIndex !== null) {
    //                     const item = menuOptions[focusedIndex].items[0];
    //                     if (item.action) item.action(); // Trigger action on Enter
    //                     setMenuVisible(false);
    //                 }
    //                 break;

    //             default:
    //                 break;
    //         }
    //     };

    //     document.addEventListener("keydown", handleKeyDown);
    //     return () => document.removeEventListener("keydown", handleKeyDown);
    // }, [menuVisible, submenuVisible, focusedIndex]);

    return (
        <div onContextMenu={handleContextMenu} onClick={handleClickOutside} style={{ position: "relative" }}>
            {/* Render children as right-clickable element */}
            {children}

            {/* Render custom context menu if visible */}
            {menuVisible && (
                <div
                    className="p-2.5 rounded-lg border-solid border border-slate-500 bg-zinc-900 w-64 max-h-80"
                    style={{ position: "absolute", top: menuPosition.y, left: menuPosition.x, zIndex: 1000 }}
                >
                    <ul className="divide-y divide-solid divide-zinc-300 rounded scroll-smooth bg-inherit" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {menuGroups.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <p className="text-left text-zinc-300 font-medium text-xs">{group.groupName}</p>
                                <ul className="my-1">
                                    {group.items.map((item, itemIndex) => (
                                        <li
                                            className="text-zinc-300 rounded-md text-sm font-medium hover:font-bold flex items-center cursor-pointer hover:bg-blue-800"
                                            key={itemIndex}
                                            onClick={() => {
                                                item.action();
                                                handleClickOutside();
                                            }}
                                            style={{ padding: "4px 8px" }}
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.label}</span>
                                            {item.submenu && submenuVisible.visible && submenuVisible.submenuLabel == item.submenu.groupName && <div className="text-right">
                                               <ChevronRight size={16} />
                                            </div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ContextMenu;
