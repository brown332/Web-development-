// Global variables
let currentUser = null
let editingDiaryId = null
let editingMealId = null

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
})

// Authentication functions
function checkAuth() {
  const user = localStorage.getItem("currentUser")
  if (user) {
    currentUser = JSON.parse(user)
    showApp()
  } else {
    showAuth()
  }
}

function showAuth() {
  document.getElementById("auth-section").classList.remove("hidden")
  document.getElementById("app-section").classList.add("hidden")
}

function showApp() {
  document.getElementById("auth-section").classList.add("hidden")
  document.getElementById("app-section").classList.remove("hidden")
  document.getElementById("user-name").textContent = currentUser.name
  loadDashboard()
  loadDiaryEntries()
  loadWaterData()
  loadMealPlan()
}

function showLogin() {
  document.getElementById("login-form").classList.remove("hidden")
  document.getElementById("register-form").classList.add("hidden")
  clearErrors()
}

function showRegister() {
  document.getElementById("login-form").classList.add("hidden")
  document.getElementById("register-form").classList.remove("hidden")
  clearErrors()
}

function register() {
  const name = document.getElementById("register-name").value.trim()
  const email = document.getElementById("register-email").value.trim()
  const password = document.getElementById("register-password").value

  if (!name || !email || !password) {
    showError("register-error", "Please fill in all fields")
    return
  }

  if (password.length < 6) {
    showError("register-error", "Password must be at least 6 characters")
    return
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  if (users.find((u) => u.email === email)) {
    showError("register-error", "User with this email already exists")
    return
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  // Auto login
  currentUser = newUser
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  showApp()
}

function login() {
  const email = document.getElementById("login-email").value.trim()
  const password = document.getElementById("login-password").value

  if (!email || !password) {
    showError("login-error", "Please fill in all fields")
    return
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    showError("login-error", "Invalid email or password")
    return
  }

  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  showApp()
}

function logout() {
  localStorage.removeItem("currentUser")
  currentUser = null
  showAuth()
  clearForms()
}

function showError(elementId, message) {
  document.getElementById(elementId).textContent = message
}

function clearErrors() {
  document.getElementById("login-error").textContent = ""
  document.getElementById("register-error").textContent = ""
}

function clearForms() {
  document.getElementById("login-email").value = ""
  document.getElementById("login-password").value = ""
  document.getElementById("register-name").value = ""
  document.getElementById("register-email").value = ""
  document.getElementById("register-password").value = ""
}

// Navigation
function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"))
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"))

  // Show selected section
  document.getElementById(section + "-section").classList.add("active")
  event.target.classList.add("active")

  // Load section data
  if (section === "dashboard") loadDashboard()
  else if (section === "diary") loadDiaryEntries()
  else if (section === "water") loadWaterData()
  else if (section === "meals") loadMealPlan()
}

// Dashboard functions
function loadDashboard() {
  const diaryEntries = JSON.parse(localStorage.getItem(`diary_${currentUser.id}`) || "[]")
  const waterData = JSON.parse(localStorage.getItem(`water_${currentUser.id}`) || "{}")
  const today = new Date().toDateString()

  document.getElementById("diary-count").textContent = diaryEntries.length
  document.getElementById("water-today").textContent = waterData[today] || 0

  // Update water progress
  const goal = Number.parseInt(localStorage.getItem(`waterGoal_${currentUser.id}`) || "8")
  const todayWater = waterData[today] || 0
  const progress = Math.min((todayWater / goal) * 100, 100)
  document.getElementById("dashboard-water-progress").style.width = progress + "%"
  document.getElementById("dashboard-water-text").textContent = `${todayWater} / ${goal} glasses`

  // Show recent notes
  const recentNotes = diaryEntries.slice(-3).reverse()
  const recentNotesHtml =
    recentNotes.length > 0
      ? recentNotes
          .map(
            (entry) => `
            <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: #f9f9f9; border-radius: 5px;">
                <strong>${entry.title}</strong><br>
                <small>${new Date(entry.date).toLocaleDateString()}</small>
            </div>
        `,
          )
          .join("")
      : "No notes yet. Start tracking your health!"

  document.getElementById("recent-notes").innerHTML = recentNotesHtml
}

// Health Diary functions
function loadDiaryEntries() {
  const entries = JSON.parse(localStorage.getItem(`diary_${currentUser.id}`) || "[]")
  const container = document.getElementById("diary-entries")

  if (entries.length === 0) {
    container.innerHTML = '<div class="card">No health entries yet. Start by adding your first entry!</div>'
    return
  }

  const entriesHtml = entries
    .map(
      (entry) => `
        <div class="card diary-entry">
            <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div style="flex: 1;">
                    <h3>${entry.title}</h3>
                    <small style="color: #666;">${new Date(entry.date).toLocaleString()}</small>
                </div>
                <div>
                    <button class="btn btn-small btn-secondary" onclick="editDiaryEntry('${entry.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteDiaryEntry('${entry.id}')">Delete</button>
                </div>
            </div>
            <p style="white-space: pre-wrap;">${entry.content}</p>
        </div>
    `,
    )
    .reverse()
    .join("")

  container.innerHTML = entriesHtml
}

function saveDiaryEntry() {
  const title = document.getElementById("diary-title").value.trim()
  const content = document.getElementById("diary-content").value.trim()

  if (!title || !content) {
    alert("Please fill in both title and content")
    return
  }

  const entries = JSON.parse(localStorage.getItem(`diary_${currentUser.id}`) || "[]")

  if (editingDiaryId) {
    // Update existing entry
    const index = entries.findIndex((e) => e.id === editingDiaryId)
    if (index !== -1) {
      entries[index] = {
        ...entries[index],
        title,
        content,
        updatedAt: new Date().toISOString(),
      }
    }
    editingDiaryId = null
    document.getElementById("diary-form-title").textContent = "Add New Entry"
    document.getElementById("cancel-edit-btn").classList.add("hidden")
  } else {
    // Add new entry
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
    }
    entries.push(newEntry)
  }

  localStorage.setItem(`diary_${currentUser.id}`, JSON.stringify(entries))

  // Clear form
  document.getElementById("diary-title").value = ""
  document.getElementById("diary-content").value = ""

  loadDiaryEntries()
}

function editDiaryEntry(id) {
  const entries = JSON.parse(localStorage.getItem(`diary_${currentUser.id}`) || "[]")
  const entry = entries.find((e) => e.id === id)

  if (entry) {
    document.getElementById("diary-title").value = entry.title
    document.getElementById("diary-content").value = entry.content
    editingDiaryId = id
    document.getElementById("diary-form-title").textContent = "Edit Entry"
    document.getElementById("cancel-edit-btn").classList.remove("hidden")
  }
}

function cancelDiaryEdit() {
  editingDiaryId = null
  document.getElementById("diary-title").value = ""
  document.getElementById("diary-content").value = ""
  document.getElementById("diary-form-title").textContent = "Add New Entry"
  document.getElementById("cancel-edit-btn").classList.add("hidden")
}

function deleteDiaryEntry(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    const entries = JSON.parse(localStorage.getItem(`diary_${currentUser.id}`) || "[]")
    const filteredEntries = entries.filter((e) => e.id !== id)
    localStorage.setItem(`diary_${currentUser.id}`, JSON.stringify(filteredEntries))
    loadDiaryEntries()
  }
}

// Water Tracker functions
function loadWaterData() {
  const goal = Number.parseInt(localStorage.getItem(`waterGoal_${currentUser.id}`) || "8")
  const waterData = JSON.parse(localStorage.getItem(`water_${currentUser.id}`) || "{}")
  const today = new Date().toDateString()
  const todayWater = waterData[today] || 0

  document.getElementById("water-goal").value = goal
  document.getElementById("water-count").textContent = todayWater

  updateWaterProgress()
}

function updateWaterProgress() {
  const goal = Number.parseInt(localStorage.getItem(`waterGoal_${currentUser.id}`) || "8")
  const waterData = JSON.parse(localStorage.getItem(`water_${currentUser.id}`) || "{}")
  const today = new Date().toDateString()
  const todayWater = waterData[today] || 0

  const progress = Math.min((todayWater / goal) * 100, 100)
  document.getElementById("water-progress").style.width = progress + "%"
  document.getElementById("water-progress-text").textContent = `${todayWater} / ${goal} glasses`
  document.getElementById("water-count").textContent = todayWater
}

function updateWaterGoal() {
  const newGoal = Number.parseInt(document.getElementById("water-goal").value)
  if (newGoal >= 1 && newGoal <= 20) {
    localStorage.setItem(`waterGoal_${currentUser.id}`, newGoal.toString())
    updateWaterProgress()
  }
}

function addWater() {
  const waterData = JSON.parse(localStorage.getItem(`water_${currentUser.id}`) || "{}")
  const today = new Date().toDateString()
  waterData[today] = (waterData[today] || 0) + 1
  localStorage.setItem(`water_${currentUser.id}`, JSON.stringify(waterData))
  updateWaterProgress()
}

function removeWater() {
  const waterData = JSON.parse(localStorage.getItem(`water_${currentUser.id}`) || "{}")
  const today = new Date().toDateString()
  if (waterData[today] > 0) {
    waterData[today]--
    localStorage.setItem(`water_${currentUser.id}`, JSON.stringify(waterData))
    updateWaterProgress()
  }
}

function resetWaterToday() {
  if (confirm("Reset today's water intake to 0?")) {
    const waterData = JSON.parse(localStorage.getItem(`water_${currentUser.id}`) || "{}")
    const today = new Date().toDateString()
    waterData[today] = 0
    localStorage.setItem(`water_${currentUser.id}`, JSON.stringify(waterData))
    updateWaterProgress()
  }
}

// Meal Planner functions
function loadMealPlan() {
  const meals = JSON.parse(localStorage.getItem(`meals_${currentUser.id}`) || "[]")
  const container = document.getElementById("meal-plan")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"]

  const mealPlanHtml = days
    .map((day) => {
      const dayMeals = meals.filter((meal) => meal.day === day)
      const mealsByType = mealTypes
        .map((type) => {
          const typeMeals = dayMeals.filter((meal) => meal.type === type)
          return typeMeals.length > 0
            ? `
                <div>
                    <strong>${type}:</strong>
                    ${typeMeals
                      .map(
                        (meal) => `
                        <div class="meal-item">
                            <span>${meal.name}</span>
                            <div>
                                <button class="btn btn-small btn-secondary" onclick="editMeal('${meal.id}')">Edit</button>
                                <button class="btn btn-small btn-danger" onclick="deleteMeal('${meal.id}')">Delete</button>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `
            : ""
        })
        .filter((html) => html)
        .join("")

      return `
            <div class="meal-day">
                <h3>${day}</h3>
                ${mealsByType || '<p style="color: #666; font-style: italic;">No meals planned</p>'}
            </div>
        `
    })
    .join("")

  container.innerHTML = mealPlanHtml
}

function saveMeal() {
  const day = document.getElementById("meal-day").value
  const type = document.getElementById("meal-type").value
  const name = document.getElementById("meal-name").value.trim()

  if (!name) {
    alert("Please enter a meal name")
    return
  }

  const meals = JSON.parse(localStorage.getItem(`meals_${currentUser.id}`) || "[]")

  if (editingMealId) {
    // Update existing meal
    const index = meals.findIndex((m) => m.id === editingMealId)
    if (index !== -1) {
      meals[index] = {
        ...meals[index],
        day,
        type,
        name,
        updatedAt: new Date().toISOString(),
      }
    }
    editingMealId = null
    document.getElementById("meal-form-title").textContent = "Add New Meal"
    document.getElementById("cancel-meal-edit-btn").classList.add("hidden")
  } else {
    // Add new meal
    const newMeal = {
      id: Date.now().toString(),
      day,
      type,
      name,
      createdAt: new Date().toISOString(),
    }
    meals.push(newMeal)
  }

  localStorage.setItem(`meals_${currentUser.id}`, JSON.stringify(meals))

  // Clear form
  document.getElementById("meal-name").value = ""

  loadMealPlan()
}

function editMeal(id) {
  const meals = JSON.parse(localStorage.getItem(`meals_${currentUser.id}`) || "[]")
  const meal = meals.find((m) => m.id === id)

  if (meal) {
    document.getElementById("meal-day").value = meal.day
    document.getElementById("meal-type").value = meal.type
    document.getElementById("meal-name").value = meal.name
    editingMealId = id
    document.getElementById("meal-form-title").textContent = "Edit Meal"
    document.getElementById("cancel-meal-edit-btn").classList.remove("hidden")
  }
}

function cancelMealEdit() {
  editingMealId = null
  document.getElementById("meal-name").value = ""
  document.getElementById("meal-form-title").textContent = "Add New Meal"
  document.getElementById("cancel-meal-edit-btn").classList.add("hidden")
}

function deleteMeal(id) {
  if (confirm("Are you sure you want to delete this meal?")) {
    const meals = JSON.parse(localStorage.getItem(`meals_${currentUser.id}`) || "[]")
    const filteredMeals = meals.filter((m) => m.id !== id)
    localStorage.setItem(`meals_${currentUser.id}`, JSON.stringify(filteredMeals))
    loadMealPlan()
  }
}
