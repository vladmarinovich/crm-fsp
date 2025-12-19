interface Tab {
    id: string;
    label: string;
    icon?: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
    return (
        <div className="border-b border-slate-200 bg-white rounded-t-xl">
            <nav className="flex space-x-1 px-4" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
                            px-6 py-3 text-sm font-medium rounded-t-lg transition-all
                            ${activeTab === tab.id
                                ? 'bg-slate-50 text-cyan-600 border-b-2 border-cyan-600'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }
                        `}
                    >
                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};
