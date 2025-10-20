// UI Animations - Maximum performance with instant toggle

export function initCollapsibleSections() {
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('click', () => {
            const section = title.closest('.section');
            // Instant toggle - CSS display:none handles everything
            section.classList.toggle('collapsed');
        });
    });
}

export function autoCollapseSections() {
    // Auto-collapse specific sections immediately
    const sectionsToCollapse = ['ANIMATED TEXT', 'ANIMATIONS'];
    document.querySelectorAll('.section-title').forEach(title => {
        const titleText = title.textContent.trim().replace('▼', '').trim();
        if (sectionsToCollapse.includes(titleText)) {
            const section = title.closest('.section');
            section.classList.add('collapsed');
        }
    });
    
    // Instant show - no animations on load
    const editorPanel = document.querySelector('.editor-panel');
    if (editorPanel) {
        editorPanel.style.opacity = '1';
    }
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '1';
    });
}
