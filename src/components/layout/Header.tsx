"use client";

interface HeaderProps {
  title?: string;
  showFilter?: boolean;
  filterCount?: number;
  onFilterClick?: () => void;
}

export default function Header({ title = "Vesile", showFilter = false, filterCount = 0, onFilterClick }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-cream/95 backdrop-blur-sm z-40 border-b border-night/5">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 h-14">
        <h1 className="font-serif text-xl font-bold text-night tracking-tight">
          {title}
        </h1>
        {showFilter && (
          <button
            onClick={onFilterClick}
            className="relative p-2 text-night/50 hover:text-night transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            {filterCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-cream text-[10px] font-sans font-bold rounded-full flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
