# My Health Buddy

A mobile-first web application for tracking your health and wellness activities. Built with vanilla HTML, CSS, and JavaScript, this app works completely offline using localStorage for data persistence.

## Features

### 🔐 User Authentication
- User registration and login system
- Secure password storage using localStorage
- Session management with automatic logout
- Access control to protect user data

### 📝 Health Diary
- Create, read, update, and delete health notes
- Date-stamped entries for easy tracking
- Search and filter functionality
- Persistent storage of all diary entries

### 💧 Water Intake Coach
- Set personalized daily water intake goals
- Track glasses of water consumed throughout the day
- Visual progress indicator with percentage completion
- Daily reset functionality
- Goal adjustment capabilities

### 🍽️ Healthy Meal Planner
- Weekly meal planning interface
- Add, edit, and delete meal plans for each day
- Organized by breakfast, lunch, and dinner
- Persistent meal data across sessions

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage API
- **Design**: Mobile-first responsive design
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## File Structure

\`\`\`
My Health Buddy/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and responsive design
├── script.js           # JavaScript functionality and localStorage management
└── README.md           # Project documentation
\`\`\`

## Setup Instructions

1. **Download the files**: Clone or download all files to a local folder
2. **Open in browser**: Simply open `index.html` in any modern web browser
3. **Local server (optional)**: For best experience, serve via local server:
   \`\`\`bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   \`\`\`
4. **Access the app**: Navigate to `http://localhost:8000` (or just open index.html directly)

## Usage Guide

### First Time Setup
1. Open the app in your browser
2. Click "Register" to create a new account
3. Fill in your details and set a secure password
4. Login with your credentials

### Health Diary
- Click "Health Diary" from the main navigation
- Use "Add New Entry" to create health notes
- Click on any entry to edit or delete it
- All entries are automatically saved

### Water Intake Tracker
- Navigate to "Water Coach"
- Set your daily water goal (default: 8 glasses)
- Click "Add Glass" each time you drink water
- Monitor your progress with the visual indicator
- Goal resets automatically each day

### Meal Planner
- Go to "Meal Planner"
- Select a day of the week
- Add meals for breakfast, lunch, and dinner
- Edit or delete existing meal plans as needed

## Data Storage

All user data is stored locally in your browser using the localStorage API:

- **User accounts**: Encrypted and stored locally
- **Health diary entries**: Persistent across browser sessions
- **Water intake data**: Daily tracking with automatic reset
- **Meal plans**: Weekly meal data storage

**Note**: Data is tied to the specific browser and device. Clearing browser data will remove all stored information.

## Browser Compatibility

- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge 12+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Features in Detail

### Responsive Design
- Mobile-first approach
- Optimized for touch interactions
- Adaptive layout for tablets and desktops
- Smooth animations and transitions

### Offline Functionality
- Works completely without internet connection
- All data stored locally
- No server dependencies
- Instant loading and responses

### Security Features
- Client-side password hashing
- Session management
- Protected routes requiring authentication
- Secure data storage practices

## Development

The app is built with vanilla web technologies:

- **HTML5**: Semantic markup and modern form elements
- **CSS3**: Flexbox layouts, CSS Grid, and custom properties
- **JavaScript**: ES6+ features, localStorage API, and DOM manipulation

## Contributing

This is a standalone project built for educational and personal use. Feel free to fork and modify according to your needs.

## License

This project is open source and available under the MIT License.
