
The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```bash
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/cbimpomg/Medisync

# Step 2: Navigate to the project directory.
cd syncra-health-portal

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
## Project Structure

The project follows a typical React application structure, with the following key directories:

- `src/`: Contains the source code of the application.
  - `components/`: Contains reusable React components.
  - `pages/`: Contains the individual pages of the application.
  - `styles/`: Contains the CSS files for styling.
  - `utils/`: Contains utility functions and helpers.
  - `App.tsx`: The main entry point of the application.

## Backend Architecture and Technology Stack

A. Core Services:
1. Auth Service
   - Technology: Node.js + Express
   - Responsibility: Authentication, authorization, user management

2. Patient Service
   - Technology: Node.js + Express
   - Responsibility: Patient management, medical records

3. Doctor Service
   - Technology: Node.js + Express
   - Responsibility: Doctor management, schedules

4. Appointment Service
   - Technology: Node.js + Express
   - Responsibility: Appointment scheduling, management

5. Prescription Service
   - Technology: Node.js + Express
   - Responsibility: Prescription management

6. Billing Service
   - Technology: Node.js + Express
   - Responsibility: Billing, payments, insurance

B. Supporting Services:
1. Notification Service
   - Technology: Node.js + Bull for queue management
   - Responsibility: Email, SMS, in-app notifications

2. File Service
   - Technology: Node.js + Express
   - Responsibility: File upload, storage management

3. Report Service
   - Technology: Node.js + Express
   - Responsibility: Generate and manage reports

C. Infrastructure:
1. API Gateway
   - Technology: Kong or Netflix Zuul
   - Responsibility: Route management, rate limiting

2. Service Discovery
   - Technology: Consul
   - Responsibility: Service registration and discovery

3. Message Broker
   - Technology: RabbitMQ
   - Responsibility: Inter-service communication

4. Monitoring
   - Technology: Prometheus + Grafana
   - Responsibility: System monitoring and alerts