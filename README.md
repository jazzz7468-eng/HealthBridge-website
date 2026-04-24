# Health Bridge 🏥

Health Bridge is a comprehensive, modern React-based application designed to bridge the gap in healthcare access. It delivers an intuitive, dynamic dashboard that centralizes essential health tools, connecting users with nearby hospitals, medical directories, AI-driven guidance, and administrative resources.

## 🌟 Key Features

- 🚑 **Emergency Bar**: Immediate access to critical, time-sensitive emergency contacts and utilities.
- 🩺 **Health Risk Assessment**: Interactive tool for preliminary self-evaluation and health tracking.
- 🤖 **AI Health Assistant**: Smart interface intended for guided, personalized health inquiries.
- 🏥 **Hospital Locator**: Interactive map (powered by Leaflet) to effortlessly locate nearby medical facilities based on your current location.
- 💊 **Medicine Directory**: Comprehensive search and access to information regarding essential medicines.
- 📜 **Government Schemes**: Easy-to-use directory for navigating relevant public healthcare subsidies and schemes.
- 📅 **Quick Scheduling**: Simplified interface to streamline the booking of medical appointments.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Maps / Location**: [Leaflet](https://leafletjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (LTS recommended)
- **npm** or **yarn**

### Installation

1. Navigate to the frontend application folder:
   ```bash
   cd health-bridge
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

### ⚠️ Backend Dependency Note
To fully unlock certain dynamic functionalities (such as fetching live nearby hospitals via the `/api/nearby-hospitals` endpoint), the application expects a supportive backend server running on `http://localhost:5000`. In the absence of the backend API, the application will provide a tailored UI but some specific data-fetching features may not resolve.

## 📁 Project Structure highlights
- **`/src/components/dashboard`**: Houses all the micro-components visible on the main dashboard (Hospital Locator, AI Assistant, etc).
- **`/src/pages`**: Contains full-page layouts including Dashboard, Hospitals, Medicines, Schemes, Profiles, and Appointments.
- **`/src/layout`**: Core shell configurations like Sidebars, Headers, and the Main App Layout wrapper.
