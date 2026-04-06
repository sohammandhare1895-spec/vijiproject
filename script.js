// ==================== MAIN SCRIPT ====================
// Vijji - Worldwide Recipes Manual
// Handles all frontend functionality

// Global Variables
let currentUser = null;
let purchasedRecipes = [];
let allRecipes = [];
let regions = [];
let currentLanguage = 'en';

// Translations Database
const translations = {
    en: {
        heroTitle: "Discover Recipes from 74 Countries",
        heroSubtitle: "26 Global Regions | Authentic Recipes | ₹1 to ₹5 per recipe",
        searchPlaceholder: "Search by recipe name, cuisine, country, ingredient...",
        login: "Login",
        myLibrary: "My Library",
        logout: "Logout",
        buyNow: "Buy Now",
        readManual: "Read Manual",
        servings: "Servings",
        prepTime: "Prep",
        cookTime: "Cook",
        addToCart: "Add to Cart",
        purchased: "Purchased"
    },
    hi: {
        heroTitle: "74 देशों से रेसिपी खोजें",
        heroSubtitle: "26 वैश्विक क्षेत्र | प्रामाणिक रेसिपी | ₹1 से ₹5 प्रति रेसिपी",
        searchPlaceholder: "रेसिपी नाम, व्यंजन, देश, सामग्री से खोजें...",
        login: "लॉगिन",
        myLibrary: "मेरी रेसिपी",
        logout: "लॉगआउट",
        buyNow: "खरीदें",
        readManual: "मैनुअल पढ़ें",
        servings: "सर्विंग्स",
        prepTime: "तैयारी",
        cookTime: "पकाने का समय",
        addToCart: "कार्ट में डालें",
        purchased: "खरीदा गया"
    },
    mr: {
        heroTitle: "74 देशांमधून रेसिपी शोधा",
        heroSubtitle: "26 जागतिक प्रदेश | प्रामाणिक रेसिपी | ₹1 ते ₹5 प्रति रेसिपी",
        searchPlaceholder: "रेसिपी नाव, पदार्थ, देशानुसार शोधा...",
        login: "लॉगिन",
        myLibrary: "माझ्या रेसिपी",
        logout: "लॉगआउट",
        buyNow: "खरेदी करा",
        readManual: "मॅन्युअल वाचा",
        servings: "सर्विंग्स",
        prepTime: "तयारी",
        cookTime: "शिजवण्याची वेळ",
        addToCart: "कार्टमध्ये घाला",
        purchased: "खरेदी केले"
    }
    // Add more languages as needed
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadPurchasedRecipes();
    loadRegions();
    loadRecipesFromExcel();
    setupEventListeners();
    updateAuthUI();
    disableScreenshotProtection();
});

// Load user data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('vijji_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

// Load purchased recipes
function loadPurchasedRecipes() {
    const saved = localStorage.getItem('vijji_purchased');
    if (saved) {
        purchasedRecipes = JSON.parse(saved);
    }
}

// ==================== EXCEL BACKEND CONNECTION ====================
// Method 1: Using SheetDB API (Recommended)
async function loadRecipesFromExcel() {
    showLoader();
    
    try {
        // Using Google Sheets CSV export
        // Step 1: Upload your Excel to Google Sheets
        // Step 2: Publish to web (File → Share → Publish to web)
        // Step 3: Replace the URL below with your published CSV link
        
        const SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv';
        
        const response = await fetch(SHEET_URL);
        const csvData = await response.text();
        
        // Parse CSV to JSON
        allRecipes = parseCSVtoRecipes(csvData);
        
        if (allRecipes.length === 0) {
            // Fallback to local data if Excel not connected
            loadLocalRecipes();
        }
        
        renderRecipes(allRecipes);
        updateStats();
        
    } catch (error) {
        console.error('Error loading Excel data:', error);
        // Fallback to local data
        loadLocalRecipes();
        renderRecipes(allRecipes);
        updateStats();
    }
    
    hideLoader();
}

// Parse CSV to Recipe Objects
function parseCSVtoRecipes(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const recipes = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 10) {
            recipes.push({
                id: values[0] || `recipe_${i}`,
                name: values[1] || '',
                country: values[2] || '',
                region: values[3] || '',
                cuisine: values[4] || '',
                complexity: parseInt(values[5]) || 3,
                price: parseInt(values[6]) || 3,
                ingredients: values[7] ? values[7].split(';') : [],
                prepTime: values[8] || '15 mins',
                cookTime: values[9] || '20 mins',
                servings: parseInt(values[10]) || 4,
                image: values[11] || ''
            });
        }
    }
    
    return recipes;
}

// Local fallback recipes (when Excel not connected)
function loadLocalRecipes() {
    allRecipes = [
        {
            id: "butter_chicken",
            name: "Butter Chicken",
            country: "India",
            region: "south-asia",
            cuisine: "North Indian",
            complexity: 1,
            price: 1,
            ingredients: ["Chicken 500g", "Butter 50g", "Fresh Cream 100ml", "Tomato Puree 200g", "Garam Masala 1 tbsp", "Kasuri Methi 1 tsp"],
            prepTime: "20 mins",
            cookTime: "30 mins",
            servings: 4,
            image: "https://image2url.com/r2/default/images/1774632989667-795b95e2-47d5-46d1-bbe0-db37a1c9a354.png"
        },
        {
            id: "biryani",
            name: "Hyderabadi Biryani",
            country: "India",
            region: "south-asia",
            cuisine: "Hyderabadi",
            complexity: 1,
            price: 1,
            ingredients: ["Basmati Rice 500g", "Chicken 600g", "Fried Onions 1 cup", "Saffron 1 pinch", "ryani Masala 2 tbsp", "Yogurt 1 cup", "Mint Leaves", "Ghee"],
            prepTime: "40 mins",
            cookTime: "45 mins",
            servings: 6,
            image: "https://image2url.com/r2/default/images/1774633045562-2b99e0c6-1f00-4106-9774-22bc377f33b4.png"
        },

         {id: "gulab_jamun", 
        name: "Gulab Jamun", 
        country: "India", 
        region: "south-asia", 
        cuisine: "North Indian", 
        complexity: 1, 
        price: 1, 
        ingredients: ["Milk solids 200g", "Sugar 250g", "Rose water 1 tsp", "Cardamom 2 pcs"], 
        prepTime: "15 mins", 
        cookTime: "25 mins", 
        servings: 4, 
        image:"https://image2url.com/r2/default/images/1774700129906-3f5fb231-cb65-43d2-b7ed-58100187bd7e.png"},

         {id: "ras_malai", name: "Ras Malai", country: "India", region: "south-asia", cuisine: "North Indian", complexity: 3, price: 2, ingredients: ["Paneer 200g", "Sugar 150g", "Milk 1L", "Saffron strands", "Pistachios"], prepTime: "30 mins", cookTime: "40 mins", servings: 4, image:"https://image2url.com/r2/default/images/1774703011065-06293a7c-e2a5-43a2-9ca4-aad0aee7fcf6.png"},

                {id: "jalebi", name: "Jalebi", country: "India", region: "south-asia", cuisine: "North Indian", complexity: 2, price: 1, ingredients: ["Maida 200g", "Yogurt 2 tbsp", "Sugar 200g", "Saffron", "Ghee for frying"], prepTime: "12 hours", cookTime: "30 mins", servings: 4, image:"https://image2url.com/r2/default/images/1774703128216-5f3b77e0-2549-458f-a4d2-99d6a980d760.png"},
                {id: "samosa", name: "Samosa", country: "India", region: "south-asia", cuisine: "North Indian", complexity: 2, price: 1, ingredients: ["Maida 200g", "Potatoes 300g", "Peas 100g", "Cumin seeds", "Oil for frying"], prepTime: "30 mins", cookTime: "25 mins", servings: 6, image:"https://image2url.com/r2/default/images/1774703254768-b34d7cc5-e61d-4761-a2b7-16dcd86f948b.png"},
                {id: "idli", name: "Idli", country: "India", region: "south-asia", cuisine: "South Indian", complexity: 2, price: 1, ingredients: ["Rice 200g", "Urad dal 100g", "Fenugreek seeds", "Salt", "Water"], prepTime: "8 hours", cookTime: "10 mins", servings: 4, image:" https://image2url.com/r2/default/images/1774703352141-d03221ad-dbc1-4093-8a6f-b9a58a3209bb.png"},
                {id: "dosa", name: "Dosa", country: "India", region: "south-asia", cuisine: "South Indian", complexity: 2, price: 1, ingredients: ["Rice 250g", "Urad dal 75g", "Fenugreek", "Salt", "Oil"], prepTime: "8 hours", cookTime: "5 mins", servings: 6, image:"https://image2url.com/r2/default/images/1774703436407-06d7996a-a691-4ece-bfa7-3519d7aa493f.png"},
                {id: "dhokla", name: "Dhokla", country: "India", region: "south-asia", cuisine: "Gujarati", complexity: 2, price: 1, ingredients: ["Besan 200g", "Yogurt 100g", "Turmeric", "Eno fruit salt", "Mustard seeds"], prepTime: "10 mins", cookTime: "15 mins", servings: 4, image:"https://image2url.com/r2/default/images/1774703511906-0eb0da61-a533-432b-a3d2-19dafec5fd65.png"},
                {id: "vada_pav", name: "Vada Pav", country: "India", region: "south-asia", cuisine: "Maharashtrian", complexity: 2, price: 1, ingredients: ["Potatoes 300g", "Besan 100g", "Pav buns 4", "Garlic chutney", "Green chili"], prepTime: "20 mins", cookTime: "20 mins", servings: 4, image:"https://image2url.com/r2/default/images/1774703578660-bbd804a8-0841-409e-a641-3baea7931fcf.png"},
                {id: "misal_pav", name: "Misal Pav", country: "India", region: "south-asia", cuisine: "Maharashtrian", complexity: 3, price: 1, ingredients: ["Sprouts 200g", "Pav 4", "Farsan", "Onion", "Spicy gravy"], prepTime: "20 mins", cookTime: "30 mins", servings: 4, image:"https://image2url.com/r2/default/images/1774703662585-5ef1cf8b-28b2-4e48-9864-a6c1e61e21a9.png"},
                {id: "pithla_bhakri", name: "Pithla Bhakri", country: "India", region: "south-asia", cuisine: "Maharashtrian", complexity: 1, price: 1, ingredients: ["Besan 100g", "Jowar flour 200g", "Onion", "Green chili", "Turmeric"], prepTime: "15 mins", cookTime: "25 mins", servings: 4, image:"https://image2url.com/r2/default/images/1774703788010-f70a4127-a5a7-45cb-a8da-0c173e272733.png"},
                {id: "sabudana_khichadi", name: "Sabudana Khichadi", country: "India", region: "south-asia", cuisine: "Maharashtrian", complexity: 1, price: 1, ingredients: ["Sabudana 200g", "Peanuts 50g", "Potato 1", "Green chili", "Lemon"], prepTime: "4 hours", cookTime: "15 mins", servings: 3, image:"https://image2url.com/r2/default/images/1774703869400-7af996e5-9f96-4068-ac21-e98c8bb8dfea.png"},
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
            ];
}

// ==================== REGIONS DATA ====================
function loadRegions() {
    regions = [
        { id: "south-asia", name: "South Asia", countries: ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal"] },
        { id: "east-asia", name: "East Asia", countries: ["China", "Japan", "Korea", "Mongolia"] },
        { id: "southeast-asia", name: "Southeast Asia", countries: ["Thailand", "Vietnam", "Indonesia", "Malaysia", "Singapore", "Philippines"] },
        { id: "middle-east", name: "Middle East", countries: ["Turkey", "Iran", "Saudi Arabia", "Israel", "Lebanon", "Egypt"] },
        { id: "europe", name: "Europe", countries: ["Italy", "France", "Spain", "Germany", "UK", "Greece", "Portugal"] },
        { id: "latin-america", name: "Latin America", countries: ["Mexico", "Brazil", "Argentina", "Peru", "Colombia"] },
        { id: "north-america", name: "North America", countries: ["USA", "Canada"] },
        { id: "africa", name: "Africa", countries: ["Morocco", "Nigeria", "South Africa", "Ethiopia", "Kenya"] },
        { id: "oceania", name: "Oceania", countries: ["Australia", "New Zealand", "Fiji"] }
    ];
    renderRegions();
}

function renderRegions() {
    const grid = document.getElementById('regionsGrid');
    if (!grid) return;
    
    grid.innerHTML = regions.map(region => `
        <div class="region-card" onclick="filterByRegion('${region.id}')">
            <div class="region-header">
                <h3>${region.name}</h3>
                <p>${region.countries.length} Countries</p>
            </div>
            <div class="region-body">
                <p class="region-countries">${region.countries.slice(0, 5).join(', ')}${region.countries.length > 5 ? '...' : ''}</p>
            </div>
        </div>
    `).join('');
}

// ==================== RENDER RECIPES ====================
function renderRecipes(recipesToShow = allRecipes) {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;
    
    const t = translations[currentLanguage] || translations.en;
    
    grid.innerHTML = recipesToShow.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-image" style="background-image: url('${recipe.image || getDefaultImage(recipe.cuisine)}'); background-size: cover;">
                ${!recipe.image ? `<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0e5d8; font-size: 3rem;">🍳</div>` : ''}
            </div>
            <div class="recipe-header">
                <h3>${recipe.name}</h3>
                <p>${recipe.country} • ${recipe.cuisine}</p>
            </div>
            <div class="recipe-body">
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${t.prepTime}: ${recipe.prepTime}</span>
                    <span><i class="fas fa-fire"></i> ${t.cookTime}: ${recipe.cookTime}</span>
                </div>
                <div class="recipe-price">₹${recipe.price}</div>
                <div class="servings-selector">
                    <label><i class="fas fa-users"></i> ${t.servings}: </label>
                    <input type="number" id="servings_${recipe.id}" value="${recipe.servings}" min="1" max="20">
                </div>
                ${purchasedRecipes.includes(recipe.id) ? 
                    `<button class="buy-btn purchased" onclick="openRecipeManual('${recipe.id}')"><i class="fas fa-book-open"></i> ${t.readManual}</button>` :
                    `<button class="buy-btn" onclick="purchaseRecipe('${recipe.id}')"><i class="fas fa-shopping-cart"></i> ${t.buyNow} ₹${recipe.price}</button>`
                }
            </div>
        </div>
    `).join('');
    
    document.getElementById('recipeCount').innerText = recipesToShow.length;
}

function getDefaultImage(cuisine) {
    return '';
}

// ==================== SEARCH FUNCTION ====================
function searchRecipes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allRecipes.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.country.toLowerCase().includes(query) || 
        r.cuisine.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.toLowerCase().includes(query))
    );
    
    renderRecipes(filtered);
    document.getElementById('regionsGrid').innerHTML = '';
}

// ==================== FILTER BY REGION ====================
function filterByRegion(regionId) {
    const filtered = allRecipes.filter(r => r.region === regionId);
    renderRecipes(filtered);
    document.getElementById('regionsGrid').innerHTML = '';
}

// ==================== RAZORPAY PAYMENT ====================
function purchaseRecipe(recipeId) {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const servingsInput = document.getElementById(`servings_${recipeId}`);
    const servings = servingsInput ? servingsInput.value : recipe.servings;
    
    const options = {
        key: CONFIG.RAZORPAY_KEY,
        amount: recipe.price * 100,
        currency: "INR",
        name: "Vijji Recipes",
        description: `${recipe.name} - ${servings} servings`,
        image: "https://image2url.com/r2/default/images/1774633147539-223cc2b4-4f12-49e1-a4b6-b78461dde15e.png",
        handler: function(response) {
            if (response.razorpay_payment_id) {
                purchasedRecipes.push(recipeId);
                localStorage.setItem('vijji_purchased', JSON.stringify(purchasedRecipes));
                alert(`✅ Payment Successful!\n\nYou now own ${recipe.name}\nPayment ID: ${response.razorpay_payment_id}`);
                renderRecipes();
            }
        },
        prefill: {
            name: currentUser.name,
            email: currentUser.email,
            contact: currentUser.phone
        },
        theme: {
            color: "#e67e22"
        },
        modal: {
            ondismiss: function() {
                console.log("Payment modal closed");
            }
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

// ==================== RECIPE MANUAL (3 Pages) ====================
function openRecipeManual(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe || !purchasedRecipes.includes(recipeId)) {
        alert("Please purchase this recipe first!");
        return;
    }
    
    const servingsInput = document.getElementById(`servings_${recipeId}`);
    const servings = servingsInput ? servingsInput.value : recipe.servings;
    
    const manual = generateManualPages(recipe, servings);
    
    document.getElementById('modalTitle').innerHTML = `${recipe.name} - 3-Page Manual`;
    document.getElementById('manualPages').innerHTML = manual;
    document.getElementById('recipeModal').style.display = 'flex';
    
    // Disable right-click in modal
    document.getElementById('recipeModal').addEventListener('contextmenu', (e) => e.preventDefault());
}

function generateManualPages(recipe, servings) {
    const multiplier = servings / recipe.servings;
    
    return `
        <div class="page">
            <div class="page-number">📖 Page 1 of 3</div>
            <h2>${recipe.name}</h2>
            <p><strong>Origin:</strong> ${recipe.country} | <strong>Cuisine:</strong> ${recipe.cuisine}</p>
            <p><strong>Difficulty:</strong> ${'⭐'.repeat(recipe.complexity)} | <strong>Prep Time:</strong> ${recipe.prepTime} | <strong>Cook Time:</strong> ${recipe.cookTime}</p>
            <p><strong>Servings:</strong> ${servings} people</p>
            <hr>
            <h3>📝 About this Dish</h3>
            <p>${recipe.name} is a beloved traditional dish from ${recipe.country}. This authentic recipe has been passed down through generations, capturing the essence of ${recipe.cuisine} cuisine. Perfect for family gatherings and special occasions.</p>
            <p>The rich aroma and perfect blend of spices make this dish a favorite among food lovers worldwide.</p>
        </div>
        
        <div class="page">
            <div class="page-number">📖 Page 2 of 3</div>
            <h3>🥘 Ingredients (for ${servings} people)</h3>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing} (adjust quantity for ${servings} servings)</li>`).join('')}
            </ul>
            
            <h3>🔪 Equipment Needed</h3>
            <ul>
                <li>Large heavy-bottomed pot / kadai</li>
                <li>Mixing bowls (medium and large)</li>
                <li>Measuring cups and spoons</li>
                <li>Sharp chef's knife and cutting board</li>
                <li>Wooden spoon or spatula</li>
                <li>Blender (for pureeing)</li>
            </ul>
        </div>
        
        <div class="page">
            <div class="page-number">📖 Page 3 of 3</div>
            <h3>👨‍🍳 Step-by-Step Instructions</h3>
            <ol>
                <li><strong>Preparation:</strong> Gather all ingredients. Wash and chop vegetables/meat as needed. For ${servings} servings, use ${Math.round(multiplier * 100)}% of base quantity.</li>
                <li><strong>Marination:</strong> Marinate the main ingredient with spices and yogurt for 30-60 minutes (if applicable).</li>
                <li><strong>Tempering:</strong> Heat oil/ghee in a pan over medium heat. Add whole spices (cumin, cardamom, cloves) and sauté until aromatic.</li>
                <li><strong>Base:</strong> Add finely chopped onions and cook until golden brown (8-10 minutes).</li>
                <li><strong>Masala:</strong> Add ginger-garlic paste and cook for 1 minute. Add tomato puree and cook until oil separates.</li>
                <li><strong>Spices:</strong> Add powdered spices (turmeric, coriander, cumin, garam masala) and cook for 2 minutes.</li>
                <li><strong>Main Cooking:</strong> Add the marinated main ingredient and cook until browned.</li>
                <li><strong>Simmer:</strong> Add water/broth, cover, and simmer for the required time.</li>
                <li><strong>Final Touch:</strong> Garnish with fresh coriander, cream, or fried onions.</li>
                <li><strong>Serve:</strong> Serve hot with rice, bread, or as suggested in the recipe.</li>
            </ol>
            
            <h3>💡 Pro Tips</h3>
            <ul>
                <li>Use fresh, high-quality ingredients for best results</li>
                <li>Adjust spice levels according to your preference</li>
                <li>Let the dish rest for 5-10 minutes before serving to allow flavors to meld</li>
                <li>Leftovers taste even better the next day!</li>
            </ul>
            
            <p style="margin-top: 1.5rem; text-align: center; color: #e67e22; font-size: 0.9rem;">
                © Vijji - Worldwide All in one recipes manual<br>
                Thank you for your purchase! 🙏
            </p>
        </div>
    `;
}

// ==================== USER MANAGEMENT ====================
function loginUser() {
    const name = document.getElementById('loginName').value;
    const email = document.getElementById('loginEmail').value;
    const phone = document.getElementById('loginPhone').value;
    
    if (!name || !email || !phone) {
        alert('Please fill all details');
        return;
    }
    
    currentUser = { 
        name, 
        email, 
        phone, 
        userId: Date.now(),
        joinDate: new Date().toISOString()
    };
    localStorage.setItem('vijji_user', JSON.stringify(currentUser));
    closeLoginModal();
    updateAuthUI();
    alert(`Welcome ${name}! You can now purchase recipes.`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('vijji_user');
    updateAuthUI();
    alert('Logged out successfully');
    location.reload();
}

function viewMyLibrary() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    const purchased = allRecipes.filter(r => purchasedRecipes.includes(r.id));
    if (purchased.length === 0) {
        alert("You haven't purchased any recipes yet.\nBrowse and buy your favorite recipes!");
        return;
    }
    
    renderRecipes(purchased);
    document.getElementById('regionsGrid').innerHTML = '';
    document.getElementById('searchInput').value = '';
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const t = translations[currentLanguage] || translations.en;
    
    if (currentUser) {
        authSection.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                <span style="font-size: 0.9rem;">${currentUser.name}</span>
                <button class="login-btn" onclick="viewMyLibrary()" style="background: #27ae60;">📚 ${t.myLibrary}</button>
                <button class="login-btn" onclick="logout()" style="background: #7f8c8d;">🚪 ${t.logout}</button>
            </div>
        `;
    } else {
        authSection.innerHTML = `<button class="login-btn" onclick="openLoginModal()"><i class="fas fa-user"></i> ${t.login}</button>`;
    }
}

// ==================== MODAL FUNCTIONS ====================
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function closeRecipeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// ==================== LANGUAGE SUPPORT ====================
function changeLanguage() {
    const selector = document.getElementById('languageSelect');
    currentLanguage = selector.value;
    
    const t = translations[currentLanguage] || translations.en;
    document.getElementById('heroTitle').innerText = t.heroTitle;
    document.getElementById('heroSubtitle').innerText = t.heroSubtitle;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    
    updateAuthUI();
    renderRecipes();
}

// ==================== STATS UPDATE ====================
function updateStats() {
    const allCountries = [...new Set(allRecipes.map(r => r.country))];
    const allRegions = [...new Set(allRecipes.map(r => r.region))];
    
    document.getElementById('countryCount').innerText = allCountries.length;
    document.getElementById('regionCount').innerText = allRegions.length;
    document.getElementById('recipeCount').innerText = allRecipes.length;
}

// ==================== HELPER FUNCTIONS ====================
function showLoader() {
    const grid = document.getElementById('recipesGrid');
    if (grid) {
        grid.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-pulse"></i> Loading recipes...</div>';
    }
}

function hideLoader() {
    // Loader removed when recipes render
}

function setupEventListeners() {
    // Enter key search
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchRecipes();
    });
}

function showHome() {
    renderRegions();
    renderRecipes(allRecipes);
    document.getElementById('searchInput').value = '';
}

function disableScreenshotProtection() {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Disable print screen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            alert('Screenshots are disabled to protect recipe content.');
            return false;
        }
        if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault();
            alert('Printing is disabled to protect recipe content.');
            return false;
        }
    });
}

// Export for global use
window.searchRecipes = searchRecipes;
window.filterByRegion = filterByRegion;
window.purchaseRecipe = purchaseRecipe;
window.openRecipeManual = openRecipeManual;
window.closeRecipeModal = closeRecipeModal;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.loginUser = loginUser;
window.logout = logout;
window.viewMyLibrary = viewMyLibrary;
window.changeLanguage = changeLanguage;
window.showHome = showHome;