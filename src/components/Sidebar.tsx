import {
  ChevronLeft,
  Pencil,
  Search,
  Library,
  Plus,
  Settings,
} from "lucide-react";

type SidebarProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export function Sidebar({ setIsOpen }: SidebarProps) {
  const chatHistory = [
    "Multipotentialite Identity Strug...",
    "పట్టి పడుపులపై వివరణ",
    "DJ Ghibli Style Art",
    "Advice on Perfectionism",
    "Flirty Life Advice",
    "Anime style request denied",
    "Lab Test Summary",
    "LIC Top-Up Loan Inquiry",
    "Refund Request for EMI",
    "Global Wealth Distribution",
    "Vegetable Egg Curry Dinner",
    "Bluetooth output A9 mixer",
    "Bluetooth Output A9 CDJ",
    "Soldier Promotion in Checkers",
    "Sentry Clarification Request",
    "React.js Overview",
    "Domino's Offers Bangalore No...",
    "React Infinite Scroll Component",
    "How to use Herbalife",
    "Helping someone open up",
    "Select First Div After Body",
    "Accessing Section Tag by ID",
    "Things That Turn Off Guys",
    "Best IT Cities Bangalore",
    "Yaad aur bhoolna jruri",
    "Chanakya Neeti on Selfishness",
    "Nocturnal vs Diurnal Animals",
    "Saree Compliments Ideas",
    "Urgent Meeting for Software La...",
    "Good Morning Message Ideas",
    "Variable Name Conversion Solu...",
  ];

  return (
    <div className="p-4 flex flex-col h-full text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full" />
          <span className="font-bold text-lg">BotChat</span>
        </div>
        <button
          className="p-2 hover:bg-surface rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="mb-4 space-y-2">
        <button className="flex items-center w-full p-2 rounded-lg hover:bg-surface">
          <Pencil className="mr-2 h-5 w-5" />
          New Chat
        </button>
        <button className="flex items-center w-full p-2 rounded-lg hover:bg-surface">
          <Search className="mr-2 h-5 w-5" />
          Search chats
        </button>
        <button className="flex items-center w-full p-2 rounded-lg hover:bg-surface">
          <Library className="mr-2 h-5 w-5" />
          Library
        </button>
      </div>

      <hr className="border-surface my-2" />

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {chatHistory.map((chat, i) => (
          <div key={i} className="p-2 rounded-lg hover:bg-surface truncate">
            {chat}
          </div>
        ))}
      </div>

      <hr className="border-surface my-2" />

      <div className="pt-2 space-y-2">
        <button className="flex items-center w-full p-2 hover:bg-surface rounded-lg">
          <Plus className="mr-2 h-5 w-5" />
          Upgrade plan
        </button>
        <button className="flex items-center w-full p-2 hover:bg-surface rounded-lg">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
