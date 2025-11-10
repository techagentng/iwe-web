import Link from 'next/link';

export default function ExampleChat() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Sidebar */}
      <aside className="w-64 flex flex-col p-4" style={{ borderRight: '1px solid var(--border-color)' }}>
        <div className="text-xl font-semibold mb-6">ChatPOKO</div>

        {/* New Chat Button */}
        <button 
          className="w-full py-2 px-3 rounded-md text-left transition flex items-center gap-2 mb-6" 
          style={{ backgroundColor: 'var(--bg-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New chat
        </button>

        {/* Search Chats */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Search chats
          </div>
        </div>

        {/* Library */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4.66667H14M2 4.66667V13.3333C2 13.6869 2.14048 14.0261 2.39052 14.2761C2.64057 14.5262 2.97971 14.6667 3.33333 14.6667H12.6667C13.0203 14.6667 13.3594 14.5262 13.6095 14.2761C13.8595 14.0261 14 13.6869 14 13.3333V4.66667M2 4.66667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H5.33333L6.66667 4.66667M14 4.66667V3.33333C14 2.97971 13.8595 2.64057 13.6095 2.39052C13.3594 2.14048 13.0203 2 12.6667 2H10.6667L9.33333 4.66667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Library
          </div>
        </div>

        {/* GPTs Section */}
        <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>GPTs</div>
        
        {/* Explore */}
        <div className="mb-4">
          <Link href="/">
            <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10.6667C9.47276 10.6667 10.6667 9.47276 10.6667 8C10.6667 6.52724 9.47276 5.33333 8 5.33333C6.52724 5.33333 5.33333 6.52724 5.33333 8C5.33333 9.47276 6.52724 10.6667 8 10.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 2L4 4M12 12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Explore
            </div>
          </Link>
        </div>

        {/* Projects Section */}
        <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Projects</div>
        
        {/* New project */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New project
          </div>
        </div>

        {/* App overview and tech at... */}
        <div className="mb-8">
          <div className="text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            App overview and tech at...
          </div>
        </div>

        {/* Chats Section */}
        <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Chats</div>

        {/* Custom errors in Go */}
        <div className="mb-8">
          <div className="text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Custom errors in Go
          </div>
        </div>

        {/* User profile */}
        <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <span style={{ color: 'white', fontSize: '12px' }}>NN</span>
            </div>
            <span>Nnah Nnamdi</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        
        {/* Empty chat area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-4xl font-semibold mb-8">ChatPOKO</div>
          <div className="grid grid-cols-2 gap-4 max-w-4xl w-full mb-12">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="font-medium mb-2">Examples</div>
              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-md cursor-pointer transition hover:bg-gray-700/20">"Sum up amount sent to this account 2007876758"</div>
                <div className="p-3 rounded-md cursor-pointer transition hover:bg-gray-700/20">"Summarize my spending last month."</div>
                <div className="p-3 rounded-md cursor-pointer transition hover:bg-gray-700/20">"Group transactions by description and show spends"</div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="font-medium mb-2">Capabilities</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8L6 12.1962L6 3.80385L13 8Z" fill="currentColor"/>
                  </svg>
                  Remembers what user said earlier in the conversation
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8L6 12.1962L6 3.80385L13 8Z" fill="currentColor"/>
                  </svg>
                  Allows user to provide follow-up corrections
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8L6 12.1962L6 3.80385L13 8Z" fill="currentColor"/>
                  </svg>
                  Trained to decline inappropriate requests
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="font-medium mb-2">Limitations</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  May occasionally generate incorrect information
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  May occasionally produce harmful instructions or biased content
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Limited knowledge of non transaction statement related info
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt input */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto flex items-center gap-3 p-3 rounded-full border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <input
              type="text"
              className="flex-1 outline-none bg-transparent px-4"
              placeholder="Message ChatGPT..."
              style={{ color: 'var(--text-primary)' }}
            />
            <button 
              className="p-2 rounded-full transition"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6.66667L14 8L2 9.33333L2 6.66667Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
            ChatPOKO can make mistakes. Consider checking important information.
          </div>
        </div>
      </main>

    </div>
  );
}