// Herbal Medicines Database
const medicines = {
    // Recipes database
    "ginger-tea": {
        name: "Ginger Immune Tea",
        category: ["digestion", "immunity"],
        preparation: "tea",
        difficulty: "beginner",
        time: "15 mins",
        ingredients: [
            "2 inches fresh ginger root, sliced thinly",
            "1 tablespoon raw honey",
            "1 slice of lemon",
            "2 cups of water",
            "Optional: 1 cinnamon stick, 2-3 cloves"
        ],
        steps: [
            "Slice the ginger into thin pieces (no need to peel if organic).",
            "Bring water to a boil in a small pot.",
            "Add ginger slices and optional spices, then reduce heat and simmer for 10 minutes.",
            "Remove from heat and strain into a mug.",
            "Add honey and lemon slice when the tea has cooled slightly (to preserve beneficial enzymes in the honey).",
            "Sip slowly while warm."
        ],
        notes: "This tea is especially beneficial during cold and flu season or when experiencing digestive discomfort.",
        tips: "For stronger immune support, add 1/4 teaspoon of turmeric powder and a pinch of black pepper to the simmering water.",
        warnings: "If you are on blood-thinning medication, consult with a healthcare provider before regularly consuming ginger tea as it may have blood-thinning effects."
    },
    "chamomile-blend": {
        name: "Calming Chamomile Blend",
        category: ["stress", "sleep"],
        preparation: "tea",
        difficulty: "beginner",
        time: "10 mins",
        ingredients: [
            "2 tablespoons dried chamomile flowers",
            "1 tablespoon dried lavender buds",
            "1 teaspoon dried lemon balm",
            "1 teaspoon honey (optional)",
            "2 cups water"
        ],
        steps: [
            "Bring water to just below boiling point (around 200°F).",
            "Place herbs in a tea infuser or teapot.",
            "Pour hot water over herbs and cover.",
            "Steep for 5-7 minutes.",
            "Strain and add honey if desired.",
            "Drink 30-60 minutes before bedtime for best results."
        ],
        notes: "This gentle blend promotes relaxation and can help ease you into a restful sleep.",
        tips: "Store the dry herb blend in an airtight container for up to 6 months for quick preparation when needed.",
        warnings: "Avoid if you have allergies to plants in the daisy family. Not recommended during pregnancy without consulting a healthcare provider."
    },
    "turmeric-oil": {
        name: "Anti-Inflammatory Turmeric Oil",
        category: ["inflammation"],
        preparation: "oil",
        difficulty: "intermediate",
        time: "3-4 weeks",
        ingredients: [
            "1/2 cup dried turmeric root or 1/4 cup organic turmeric powder",
            "2 tablespoons dried ginger (optional)",
            "1 teaspoon black pepper (increases turmeric absorption)",
            "2 cups organic olive or coconut oil",
            "1 sterilized glass jar with lid"
        ],
        steps: [
            "Combine all dry ingredients in a clean, dry glass jar.",
            "Heat oil gently until just warm (not hot).",
            "Pour oil over the herbs, making sure they are completely covered.",
            "Stir well to remove air bubbles.",
            "Seal the jar and place in a warm location (like a sunny windowsill).",
            "Shake the jar daily for 3-4 weeks.",
            "Strain through cheesecloth into a clean jar, squeezing to extract all oil.",
            "Label and store in a cool, dark place for up to 1 year."
        ],
        notes: "This oil can be applied to areas of inflammation or joint pain. For best results, apply with gentle massage twice daily.",
        tips: "You can accelerate the infusion process using a slow cooker on low for 24-48 hours instead of the 3-4 week waiting period.",
        warnings: "Always perform a patch test before applying widely. Do not use on broken skin or open wounds. Turmeric can stain clothing and skin."
    },
    "respiratory-tea": {
        name: "Respiratory Support Tea",
        category: ["respiratory"],
        preparation: "tea decoction",
        difficulty: "beginner",
        time: "20 mins",
        ingredients: [
            "1 tablespoon dried thyme",
            "1 tablespoon dried oregano",
            "2 teaspoons dried rosemary",
            "1-inch piece of fresh ginger, sliced",
            "1 tablespoon raw honey",
            "2 cups water"
        ],
        steps: [
            "Combine all herbs and ginger in a small pot.",
            "Add water and bring to a boil.",
            "Reduce heat and simmer covered for 15 minutes.",
            "Remove from heat and strain.",
            "Add honey when the tea has cooled slightly.",
            "Drink 2-3 cups daily when experiencing respiratory issues."
        ],
        notes: "This potent herbal blend helps to clear congestion and support lung health during colds or respiratory infections.",
        tips: "Add a pinch of cinnamon or a few drops of eucalyptus essential oil (not for internal use, just for steam inhalation) for enhanced clearing of sinuses.",
        warnings: "Not recommended for children under 1 year due to honey content. Consult with a healthcare provider before using during pregnancy."
    },
    "stress-tincture": {
        name: "Adaptogenic Stress Tincture",
        category: ["stress"],
        preparation: "tincture",
        difficulty: "advanced",
        time: "6-8 weeks",
        ingredients: [
            "1/4 cup dried ashwagandha root",
            "1/4 cup dried holy basil (tulsi)",
            "2 tablespoons dried rhodiola root",
            "2 cups 80-proof vodka or brandy (or apple cider vinegar for alcohol-free version)",
            "1 sterilized glass jar with lid",
            "Amber glass dropper bottles for storage"
        ],
        steps: [
            "Place all dried herbs in a clean glass jar.",
            "Pour alcohol over herbs until completely covered with an additional 1-2 inches of liquid.",
            "Seal jar tightly and shake well.",
            "Store in a cool, dark place for 6-8 weeks, shaking every few days.",
            "Strain through cheesecloth into a clean bowl.",
            "Transfer to dropper bottles using a small funnel.",
            "Label with date and contents.",
            "Store in a cool, dark place for up to 2 years."
        ],
        notes: "This tincture helps the body adapt to stress and supports overall vitality. Take 1/4-1/2 teaspoon (1-2 droppers) 2-3 times daily, either straight or diluted in water.",
        tips: "For improved taste, add the tincture to herbal tea or a small amount of juice.",
        warnings: "Not recommended during pregnancy or while breastfeeding. Consult with a healthcare provider if you are taking medications, as some herbs may interact with certain drugs."
    },
    "calendula-oil": {
        name: "Calendula Healing Oil",
        category: ["skin"],
        preparation: "oil",
        difficulty: "intermediate",
        time: "3-4 weeks",
        ingredients: [
            "1 cup dried calendula flowers",
            "2 cups organic olive oil or jojoba oil",
            "1 clean, dry glass jar with lid",
            "Optional: 10 drops lavender essential oil (added after straining)"
        ],
        steps: [
            "Make sure the calendula flowers are completely dry to prevent mold.",
            "Place dried calendula in a clean jar.",
            "Pour oil over the flowers, making sure they are completely covered.",
            "Stir with a clean spoon to release any air bubbles.",
            "Seal the jar and place in a sunny window.",
            "Shake the jar daily for 3-4 weeks.",
            "Strain through a fine mesh strainer lined with cheesecloth.",
            "Add essential oil if desired.",
            "Transfer to dark glass bottles and label.",
            "Store in a cool, dark place for up to 1 year."
        ],
        notes: "Calendula oil is excellent for minor skin irritations, dry skin, and mild burns. Apply directly to the affected area 2-3 times daily.",
        tips: "You can use this oil as a base for making healing salves by adding beeswax.",
        warnings: "If irritation occurs, discontinue use. Not recommended for use on deep wounds or serious burns."
    },
    "triphala-blend": {
        name: "Triphala Digestive Blend",
        category: ["digestion"],
        preparation: "powder",
        difficulty: "beginner",
        time: "5 mins",
        ingredients: [
            "1 part Amalaki (Indian Gooseberry) powder",
            "1 part Bibhitaki powder",
            "1 part Haritaki powder",
            "Glass jar for storage"
        ],
        steps: [
            "Combine all three powders in equal proportions in a bowl.",
            "Mix thoroughly until well blended.",
            "Transfer to an airtight glass container.",
            "Take 1/2-1 teaspoon mixed in warm water before bed or first thing in the morning."
        ],
        notes: "Triphala is a traditional Ayurvedic formula that supports digestion, regular elimination, and gentle detoxification.",
        tips: "The taste is quite bitter, so some people prefer taking it in capsule form. You can purchase empty vegetable capsules and fill them yourself.",
        warnings: "Not recommended during pregnancy or breastfeeding. May increase bowel movements initially as the body adjusts."
    },
    "yarrow-compress": {
        name: "Yarrow Healing Compress",
        category: ["inflammation", "skin"],
        preparation: "compress",
        difficulty: "intermediate",
        time: "30 mins",
        ingredients: [
            "2 tablespoons dried yarrow flowers and leaves",
            "1 tablespoon dried plantain leaves",
            "1 tablespoon dried calendula flowers",
            "1 teaspoon dried comfrey leaf (optional)",
            "2 cups water",
            "Clean cotton cloth or gauze"
        ],
        steps: [
            "Bring water to a boil in a small pot.",
            "Add all herbs, reduce heat, and simmer covered for 15 minutes.",
            "Remove from heat and strain, reserving the liquid.",
            "Allow the infusion to cool until warm but not hot.",
            "Soak a clean cloth in the warm liquid and wring out slightly.",
            "Apply the compress to affected area for 15-20 minutes.",
            "Reapply 2-3 times per day as needed."
        ],
        notes: "This herbal compress is useful for minor skin irritations, bruises, sprains, and minor wounds.",
        tips: "You can make a larger batch of the dried herb mixture and store it in a jar for future use. Simply use 2 tablespoons of the mix per cup of water.",
        warnings: "Do not use on deep wounds, serious burns, or infected areas. Seek medical attention for serious injuries."
    }
};

// Preparation Methods Database
const preparationMethods = {
    "tea": {
        name: "Herbal Teas & Infusions",
        description: "A simple water extraction that captures the water-soluble properties of herbs.",
        materials: [
            "Fresh or dried herbs",
            "Hot water (just below boiling point for most herbs)",
            "Tea infuser, teapot, or French press",
            "Strainer (if not using an infuser)",
            "Mug or cup"
        ],
        process: [
            "Measure your herbs - generally use 1-2 teaspoons of dried herbs or 1-2 tablespoons of fresh herbs per cup of water.",
            "Bring water to appropriate temperature (most herbs do best at around 200°F or just below boiling).",
            "Place herbs in infuser or teapot.",
            "Pour hot water over herbs.",
            "Cover and steep for 5-15 minutes depending on the herb and desired strength.",
            "Strain or remove infuser.",
            "Add sweetener if desired."
        ],
        tips: [
            "Delicate herbs (flowers and leaves) steep for shorter periods (3-5 minutes).",
            "Roots, barks, and seeds need longer steeping times (10-20 minutes).",
            "Covering your tea while steeping helps retain essential oils and medicinal compounds.",
            "Many herbal teas can be re-steeped 2-3 times before discarding."
        ],
        cautions: [
            "Some herbs should not be consumed in large quantities or by certain individuals (pregnant women, children, people on medications).",
            "Always research an herb's properties and contraindications before use.",
            "Start with small amounts when trying a new herbal tea to test for allergic reactions."
        ]
    },
    "tincture": {
        name: "Tinctures",
        description: "Alcohol-based liquid extracts that preserve and concentrate herbal properties for longer shelf life and quick absorption.",
        materials: [
            "Dried or fresh herbs",
            "High-proof alcohol (vodka or grain alcohol, 80-100 proof)",
            "Clean glass jar with tight-fitting lid",
            "Cheesecloth or fine mesh strainer",
            "Amber glass bottles with droppers for storage",
            "Labels and marker"
        ],
        process: [
            "Chop or grind herbs to increase surface area.",
            "Fill a clean glass jar 1/3 to 1/2 with herbs.",
            "Pour alcohol over herbs until completely covered with 1-2 inches of liquid above the herbs.",
            "Seal jar tightly and shake well.",
            "Store in a cool, dark place for 4-6 weeks, shaking daily if possible.",
            "Strain through cheesecloth, squeezing to extract all liquid.",
            "Transfer to amber glass bottles with droppers.",
            "Label with contents and date.",
            "Store in a cool, dark place for up to 5 years."
        ],
        tips: [
            "For fresh herbs, use higher proof alcohol (at least 80-90 proof).",
            "For dried herbs, 80 proof (40% alcohol) is usually sufficient.",
            "A general dosage is 1/4-1/2 teaspoon (1-2 ml) taken 2-3 times daily, but varies by herb.",
            "Tinctures can be taken straight under the tongue or mixed with water or juice.",
            "For alcohol-free versions, use vegetable glycerin or apple cider vinegar instead."
        ],
        cautions: [
            "Tinctures are concentrated, so proper dosage is important.",
            "Alcohol-based tinctures may not be appropriate for those avoiding alcohol.",
            "Some herbs can interact with medications.",
            "Not all herbs are suitable for tincturing - research specific herbs first."
        ]
    },
    "powder": {
        name: "Herbal Powders",
        description: "Dried herbs ground into fine powder for versatile use in capsules, foods, or topical applications.",
        materials: [
            "Dried herbs",
            "Coffee grinder, spice grinder, or mortar and pestle",
            "Fine-mesh sieve (optional)",
            "Airtight containers for storage",
            "Optional: empty capsules and capsule filling machine"
        ],
        process: [
            "Ensure herbs are completely dry before grinding.",
            "Break larger pieces into smaller bits.",
            "Grind herbs in small batches until a fine powder is achieved.",
            "Sift through a fine-mesh sieve if desired for finer powder.",
            "Store in airtight containers away from light, heat, and moisture.",
            "For capsules: fill empty capsules with powder using capsule machine or manually."
        ],
        tips: [
            "Dedicate a grinder specifically for herbs to avoid flavor contamination.",
            "Grind in short pulses to prevent overheating which can damage volatile compounds.",
            "Standard dosage for capsules is typically 500-1000mg, but varies by herb.",
            "Powders can be added to smoothies, foods, drinks, or made into tablets.",
            "For topical use, powders can be mixed with water, honey, or oils to create pastes."
        ],
        cautions: [
            "Powdered herbs lose potency faster than whole herbs due to increased surface area.",
            "Store for no more than 6-12 months for optimal potency.",
            "Wear a mask when grinding very fine powders to avoid inhalation.",
            "Always label clearly with contents and date."
        ]
    },
    "oil": {
        name: "Herbal Oils",
        description: "Oil-based extracts that capture fat-soluble properties of herbs, ideal for topical applications.",
        materials: [
            "Dried herbs (fresh herbs can cause mold due to water content)",
            "Base oil (olive, coconut, jojoba, almond, etc.)",
            "Clean, dry glass jar with lid",
            "Cheesecloth or fine strainer",
            "Dark glass bottles for storage",
            "Labels and marker"
        ],
        process: [
            "Cold Infusion Method:",
            "Fill a clean jar 1/3 to 1/2 with dried herbs.",
            "Pour oil over herbs until completely covered with 1 inch above herbs.",
            "Seal jar and place in a sunny window for 2-4 weeks, shaking daily.",
            "Strain through cheesecloth into clean bottles.",
            "Heat Infusion Method:",
            "Combine herbs and oil in a double boiler or slow cooker.",
            "Heat on low (under 110°F) for 24-48 hours.",
            "Strain through cheesecloth into clean bottles."
        ],
        tips: [
            "Choose base oil based on intended use - olive oil for medicinal applications, jojoba or sweet almond for cosmetic use.",
            "Add vitamin E oil (1 tsp per cup) to extend shelf life.",
            "For stronger infusion, strain and repeat with fresh herbs in the same oil.",
            "Herbal oils can be used directly on skin or as base for salves and balms."
        ],
        cautions: [
            "Always use completely dry herbs to prevent mold growth.",
            "Store in cool, dark place for up to 1 year.",
            "Check for rancidity before use (off smell or taste).",
            "Perform patch test before applying widely to skin."
        ]
    },
    "compress": {
        name: "Compresses & Poultices",
        description: "External applications that apply herbs directly to the skin for localized treatment.",
        materials: [
            "Fresh or dried herbs",
            "Water or apple cider vinegar",
            "Pot for heating water",
            "Clean cloth, gauze, or muslin",
            "Bowl for soaking (compresses)",
            "Optional: plastic wrap or bandage to cover poultice"
        ],
        process: [
            "For Compress:",
            "Prepare a strong herbal tea or decoction.",
            "Allow to cool to a comfortable temperature.",
            "Soak a clean cloth in the liquid.",
            "Wring out excess and apply to affected area.",
            "Replace as it cools or dries.",
            "For Poultice:",
            "Chop or grind herbs finely.",
            "Add enough hot water to moisten (consistency of paste).",
            "Apply directly to affected area when cool enough.",
            "Cover with cloth and optionally secure with bandage.",
            "Leave on for 20 minutes to several hours."
        ],
        tips: [
            "Compresses work well for larger areas or where cleanliness is important.",
            "Poultices provide more direct and intense herbal contact.",
            "Alternate hot and cold compresses to improve circulation.",
            "For drawing poultices (abscess, splinter), clay or charcoal can be added.",
            "Fresh herbs can be crushed and applied directly as a simple poultice."
        ],
        cautions: [
            "Do not apply to broken skin unless the herb is specifically indicated for wounds.",
            "Discontinue if irritation occurs.",
            "Do not use on deep wounds or serious infections without medical supervision.",
            "Test a small area first for sensitivity."
        ]
    },
    "decoction": {
        name: "Decoctions",
        description: "Simmered herb extracts ideal for tough plant materials like roots, bark, and seeds.",
        materials: [
            "Dried roots, bark, seeds, or other woody plant parts",
            "Water",
            "Pot with lid",
            "Strainer",
            "Storage container if making larger batches"
        ],
        process: [
            "Place herbs in pot (usually 1 ounce of herb to 16 ounces of water).",
            "Add cold water.",
            "Bring to a boil, then reduce to simmer.",
            "Cover and simmer for 20-40 minutes (depending on the herb and plant part).",
            "For roots and bark, simmer until liquid is reduced by about one-third.",
            "Remove from heat and strain.",
            "Drink warm or cool, typically 1/2 cup 2-3 times daily."
        ],
        tips: [
            "Breaking or cutting tough materials into smaller pieces increases extraction.",
            "Decoctions can be sweetened with honey if desired.",
            "Make larger batches and refrigerate for up to 72 hours.",
            "Freeze in ice cube trays for longer storage.",
            "Decoctions can be used as the liquid for making herbal jellies or syrups."
        ],
        cautions: [
            "Long simmering can destroy some beneficial compounds in certain herbs.",
            "Not suitable for herbs with volatile essential oils (use infusion instead).",
            "As with all preparations, research specific herbs for appropriate dosage.",
            "Properly label and date stored decoctions."
        ]
    }
};

// DOM elements
const medicineSearch = document.getElementById('medicine-search');
const searchBtn = document.getElementById('search-btn');
const healthFilter = document.getElementById('health-filter');
const preparationFilter = document.getElementById('preparation-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const medicinesContainer = document.getElementById('medicines-container');
const recipeModal = document.getElementById('recipe-modal');
const methodModal = document.getElementById('method-modal');
const recipeContainer = document.getElementById('recipe-container');
const methodContainer = document.getElementById('method-container');
const closeModal = document.querySelector('.close-modal');
const closeMethodModal = document.querySelector('.close-method-modal');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    medicineSearch.addEventListener('keyup', filterMedicines);
    searchBtn.addEventListener('click', filterMedicines);
    
    // Filter change events
    healthFilter.addEventListener('change', filterMedicines);
    preparationFilter.addEventListener('change', filterMedicines);
    difficultyFilter.addEventListener('change', filterMedicines);
    
    // Modal close buttons
    closeModal.addEventListener('click', () => {
        recipeModal.style.display = 'none';
    });
    
    closeMethodModal.addEventListener('click', () => {
        methodModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === recipeModal) {
            recipeModal.style.display = 'none';
        }
        if (e.target === methodModal) {
            methodModal.style.display = 'none';
        }
    });
    
    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            recipeModal.style.display = 'none';
            methodModal.style.display = 'none';
        }
    });
});

// Filter medicines based on search and filter selections
function filterMedicines() {
    const searchTerm = medicineSearch.value.toLowerCase();
    const healthValue = healthFilter.value;
    const preparationValue = preparationFilter.value;
    const difficultyValue = difficultyFilter.value;
    
    const medicineCards = document.querySelectorAll('.medicine-card');
    
    medicineCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const categories = card.getAttribute('data-category').split(' ');
        const preparation = card.getAttribute('data-preparation').split(' ');
        const difficulty = card.getAttribute('data-difficulty');
        
        // Check if card matches all filters
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesHealth = healthValue === 'all' || categories.includes(healthValue);
        const matchesPreparation = preparationValue === 'all' || preparation.includes(preparationValue);
        const matchesDifficulty = difficultyValue === 'all' || difficulty === difficultyValue;
        
        // Show or hide based on combined filters
        if (matchesSearch && matchesHealth && matchesPreparation && matchesDifficulty) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Open recipe modal
function openRecipe(recipeId) {
    const recipe = medicines[recipeId];
    if (!recipe) return;
    
    let html = `
        <div class="recipe-header">
            <h2>${recipe.name}</h2>
            <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                <span><i class="fas fa-chart-line"></i> ${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</span>
            </div>
        </div>
        
        <div class="recipe-ingredients">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        
        <div class="recipe-steps">
            <h3>Preparation</h3>
            <ol class="steps-list">
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
    
    if (recipe.notes) {
        html += `
            <div class="recipe-notes">
                <h3>Notes</h3>
                <p>${recipe.notes}</p>
            </div>
        `;
    }
    
    if (recipe.tips) {
        html += `
            <div class="recipe-tip">
                <strong><i class="fas fa-lightbulb"></i> Pro Tip:</strong> ${recipe.tips}
            </div>
        `;
    }
    
    if (recipe.warnings) {
        html += `
            <div class="recipe-warning">
                <strong><i class="fas fa-exclamation-triangle"></i> Important:</strong> ${recipe.warnings}
            </div>
        `;
    }
    
    recipeContainer.innerHTML = html;
    recipeModal.style.display = 'block';
}

// Show method tutorial
function showMethodTutorial(methodId) {
    const method = preparationMethods[methodId];
    if (!method) return;
    
    let html = `
        <div class="tutorial-header">
            <h2>${method.name}</h2>
            <p>${method.description}</p>
        </div>
        
        <div class="tutorial-content">
            <div class="tutorial-section">
                <h3>What You'll Need</h3>
                <ul>
                    ${method.materials.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tutorial-section">
                <h3>Step-by-Step Process</h3>
                <ol>
                    ${method.process.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="tutorial-tips">
                <h3>Tips for Success</h3>
                <ul class="tips-list">
                    ${method.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tutorial-tips">
                <h3>Cautions & Considerations</h3>
                <ul class="tips-list">
                    ${method.cautions.map(caution => `<li>${caution}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    methodContainer.innerHTML = html;
    methodModal.style.display = 'block';
} 