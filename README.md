# Skill Swap Platform

A web application for users to exchange skills by offering and requesting lessons from each other. The platform supports user and admin roles, skill management, swap requests, and messaging.

## Features
- User registration and authentication (user/admin)
- Profile management (bio, avatar, skills offered/wanted)
- Add, edit, and remove skills (with admin approval)
- Browse users and their skills
- Send and receive swap requests
- Accept or reject swap requests
- Platform messaging system
- Admin dashboard for managing users, skills, swaps, and reports

## Tech Stack
- **Frontend:** React (Vite, React Router, React Query, Tailwind CSS)
- **Backend:** Django, Django REST Framework
- **Database:** SQLite (default, can be changed)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Python 3.10+
- pip (Python package manager)

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```sh
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```sh
   python manage.py migrate
   ```
5. Create a superuser (for admin access):
   ```sh
   python manage.py createsuperuser
   ```
6. Start the backend server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   pnpm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   # or
   pnpm dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
- Register as a user or admin.
- Complete your profile and add skills you can offer and want to learn.
- Browse other users and send swap requests.
- Manage incoming/outgoing requests and messages.
- Admins can approve/reject skills and manage users.

## Contribution
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
MIT
