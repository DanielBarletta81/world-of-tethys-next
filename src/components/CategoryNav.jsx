const categories = ['Geodes', 'Civilizations', 'Biomes', 'Biodiversity'];

export default function CategoryNav({ activeTab, setActiveTab }) {
  return (
    <nav className="flex flex-wrap gap-4 justify-center py-8">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => setActiveTab(category)}
          className={`px-6 py-2 font-display text-lg transition-all transform hover:-translate-y-1 ${
            activeTab === category
              ? 'bg-[#3d2b1f] text-[#e2d7c5] shadow-lg rotate-1'
              : 'bg-[#d1c4ae] text-[#3d2b1f] border border-[#3d2b1f] -rotate-1 opacity-80 hover:opacity-100'
          }`}
          style={{ boxShadow: '2px 2px 0px #2b2621' }}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
