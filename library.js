document.addEventListener('DOMContentLoaded', () => {
    // Modal functionality
    const modal = document.getElementById('filterModal');
    const filterBtn = document.getElementById('filterBtn');
    const closeBtn = document.querySelector('.close');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    let activeFilters = 0;

    // Modal controls
    filterBtn.addEventListener('click', () => modal.style.display = "block");
    closeBtn.addEventListener('click', () => modal.style.display = "none");
    window.addEventListener('click', (e) => e.target === modal && (modal.style.display = "none"));

    // Decision-specific input
    document.getElementById('decision-name').addEventListener('change', function() {
        document.getElementById('decision-specific').style.display = this.value ? 'block' : 'none';
    });

    // Filter application
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);

    function applyFilters() {
        modal.style.display = "none";
        const filters = {
            name: document.getElementById('filter-name').value.toLowerCase(),
            medicinal: Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value),
            decision: document.getElementById('decision-name').value,
            region: document.getElementById('region').value,
            growth: Array.from(document.querySelectorAll('[data-filter="growth"] input:checked')).map(cb => cb.value)
        };
        
        document.querySelectorAll('.model-container').forEach(plant => {
            const plantData = {
                name: plant.querySelector('h3').textContent.toLowerCase(),
                medicinal: plant.dataset.medicinal?.split(',') || [],
                decision: plant.dataset.decision?.split(',') || [],
                region: plant.dataset.region || '',
                growth: plant.dataset.growth || ''
            };
            
            const visible = Object.entries(filters).every(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return true;
                if (key === 'medicinal') return value.some(v => plantData.medicinal.includes(v));
                if (key === 'decision') return plantData.decision.includes(value);
                if (key === 'growth') return value.includes(plantData.growth);
                return plantData[key].includes(value);
            });
            
            plant.style.display = visible ? 'flex' : 'none';
        });
        
        updateFilterBadge(filters);
    }

    function resetFilters() {
        document.querySelectorAll('.modal input, .modal select').forEach(el => {
            if (el.type === 'checkbox') el.checked = false;
            else if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = '';
        });
        applyFilters();
    }

    function updateFilterBadge(filters) {
        activeFilters = Object.values(filters).filter(v => 
            Array.isArray(v) ? v.length > 0 : Boolean(v)
        ).length;
        document.querySelector('.filter-badge').textContent = activeFilters;
    }

    // fliping of card
    function flipCard(element) {
        element.closest('.model-container').classList.toggle('flipped');
    }

    // Search functionality
    window.searchPlants = function() {
        const input = document.getElementById('search-input').value.toLowerCase();
        const results = Array.from(document.querySelectorAll('.model-container'))
            .filter(plant => plant.querySelector('h3').textContent.toLowerCase().includes(input));
        
        document.getElementById('search-results').innerHTML = results.length ? 
            results.map(plant => `<div class="result-item">
                <a href="#${plant.id}" onclick="scrollToPlant('${plant.id}')">${plant.id}</a>
            </div>`).join('') : 
            '<div class="no-results">🌿 No plants found</div>';
    }

    window.scrollToPlant = function(id) {
        const plant = document.getElementById(id);
        plant?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        plant.style.boxShadow = '0 0 15px rgba(46, 125, 50, 0.5)';
        setTimeout(() => plant.style.boxShadow = '', 1000);
    }
});